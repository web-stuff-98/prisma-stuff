import type {
  GetServerSideProps,
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
} from 'next'
import Head from 'next/head'
import { useRef, forwardRef, ForwardedRef, useLayoutEffect } from 'react'
import type { RefObject } from 'react'
import Post, { IPost } from '../../../components/post/Post'

import prisma from '../../../utils/prisma'

import { useEffect, useState } from 'react'
import { useUsers } from '../../../context/UsersContext'
import { useFilter } from '../../../context/FilterContext'
import Link from 'next/link'
import { useRouter } from 'next/router'

const Page = ({
  feed,
  popular,
  pageCount,
  fullCount,
  maxPage,
}: {
  feed: any[]
  popular: any[]
  pageCount: number
  fullCount: number
  maxPage: number
}) => {
  const { cacheProfileDataForUser } = useUsers()
  const { setPageCount, setFullCount, setMaxPage } = useFilter()

  useEffect(() => {
    if (!feed) return
    feed.forEach((post: any) => cacheProfileDataForUser(post.author.id))
  }, [feed])

  useEffect(() => {
    setFullCount(fullCount)
    setPageCount(pageCount)
    setMaxPage(maxPage)
  }, [feed])

  const asideRootRef = useRef<HTMLDivElement>(null)
  const [asideClientWidth, setAsideClientWidth] = useState(126)

  useEffect(() => {
    if (!asideRootRef.current) return
    const resized = () => {
      if (asideRootRef.current)
        setAsideClientWidth(asideRootRef.current?.clientWidth)
    }
    resized()
    window.addEventListener('resize', resized)
    return () => {
      window.removeEventListener('resize', resized)
    }
  }, [asideRootRef.current])

  return (
    <div className="flex relative justify-between w-full mx-auto pr-2 py-2">
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="w-4/6 h-full">
        {feed.map((post: any, i: number) => (
          <Post reverse={Boolean(i % 2)} key={post.id} post={post} />
        ))}
      </div>
      <div ref={asideRootRef} className="w-2/6">
        <aside
          style={{ width: `${asideClientWidth}px` }}
          className="fixed py-2 h-full"
        >
          <div className="flex flex-col shadow-sm rounded border gap-2 dark:border-zinc-800 pb-1">
            <h2
              style={{ lineHeight: '1' }}
              className="font-sm font-ArchivoBlack py-2 mx-auto"
            >
              Popular
            </h2>
            {popular &&
              popular.map((post: IPost) => (
                <Link key={post.id} href={`/blog/post/${post.slug}`}>
                  <article
                    style={{ lineHeight: '1' }}
                    className="text-xs p-1 dark:hover:bg-zinc-800 hover:bg-gray-100 mx-1 rounded cursor-pointer flex flex-col"
                  >
                    <p>
                      <b>{post.title}</b> - by {post.author.name}
                    </p>
                  </article>
                </Link>
              ))}
          </div>
        </aside>
      </div>
    </div>
  )
}

import redisClient from '../../../utils/redis'

export const getServerSideProps: GetServerSideProps = async ({
  params,
  query,
}) => {
  try {
    await redisClient?.connect()
  } catch (e) {
    console.error(`Could not connect to redis : ${e}`)
  }

  // popular posts
  let popular
  const cachedPopularPosts = await redisClient?.get('popular')
  if (cachedPopularPosts) {
    popular = JSON.parse(cachedPopularPosts)
  } else {
    popular = JSON.parse(JSON.stringify({
      popular: await prisma.post.findMany({
        where: {
          published: true,
          imagePending: false,
        },
        select: {
          title: true,
          description: true,
          likes: true,
          shares: true,
          id: true,
          author: {
            select: {
              id: true,
              name: true,
            },
          },
          slug: true,
        },
        orderBy: {
          likes: {
            _count: 'desc',
          },
        },
      }),
    }))
    const expiration: number = process.env.NODE_ENV === 'development' ? 5 : 120
    await redisClient?.setEx('popular', expiration, JSON.stringify(popular))
  }

  /* The users parsed query parameters. Stored as keyname on redis so cached props can be looked up */
  const { tags: rawTags } = query
  const { term: rawTerm } = query
  const clientQueryInput = rawTags
    ? {
        tags: rawTags
          ? String(rawTags)
              .toLowerCase()
              .split(' ')
              .filter((tag: string) => tag.trim() !== '')
              .map((tag: string) => tag.replace(/[^\w-]+/g, ''))
          : [],
        pageOffset: Number(Math.max(Number(params?.page) - 1, 0) * 20),
      }
    : rawTerm
    ? {
        term: String(rawTerm)
          .toLowerCase()
          .trim()
          .replaceAll('+', ' ')
          .replace(/[^\w-]+/g, ''),
      }
    : {}
  const cachedProps = await redisClient?.get(JSON.stringify(clientQueryInput))
  if (cachedProps) {
    await redisClient?.disconnect()
    return {
      props: {...JSON.parse(cachedProps), ...popular},
    }
  }

  //:any because using mode:'sensitive' causes a typescript error for some reason
  const where: any = rawTags
    ? { tags: { some: { name: { in: clientQueryInput.tags } } } }
    : {
        ...(clientQueryInput.term
          ? {
              title: {
                contains: clientQueryInput.term,
                mode: 'insensitive',
              },
            }
          : {}),
      }

  const feedQ = await prisma.post.findMany({
    where: {
      published: true,
      imagePending: false,
      ...where,
    },
    include: {
      author: { select: { id: true } },
      tags: true,
      shares: true,
      likes: true,
    },
    orderBy: { createdAt: 'desc' },
    skip: clientQueryInput.pageOffset,
    take: 20,
  })
  //add in the comment count.
  let outFeed: any[] = await Promise.all(
    feedQ.map(
      (p: any) =>
        new Promise((resolve, reject) => {
          let cmtCount = 0
          prisma.commentOnPost
            .findMany({
              where: { postId: p.id },
              select: { CommentOnPostComment: true },
            })
            .then((cmts) => {
              cmts.forEach((cmt) => {
                cmtCount += cmt.CommentOnPostComment.length + 1
              })
              resolve({
                ...p,
                comments: cmtCount,
              })
            })
            .catch((e) => reject(e))
        }),
    ),
  )

  // doing 2 queries, to count the total number of posts without page slice.....
  const feedQ_count = await prisma.post.findMany({
    where: {
      published: true,
      imagePending: false,
      ...where,
    },
    select: { id: true },
  })
  const feed = outFeed.map((data: any) => ({
    ...data,
    tags: data.tags.map((tag: any) => tag.name),
  }))

  const props = {
    feed: JSON.parse(JSON.stringify(feed)),
    pageCount: feedQ.length,
    fullCount: feedQ_count.length,
    maxPage: Math.ceil(feedQ_count.length / 20),
    ...popular
  }

  const key = JSON.stringify(clientQueryInput)
  const expiration: number = process.env.NODE_ENV === 'development' ? 5 : 120
  await redisClient?.setEx(
    key,
    expiration,
    JSON.stringify({ ...props, ...popular }),
  )

  await redisClient?.disconnect()

  return { props }
}

export default Page
