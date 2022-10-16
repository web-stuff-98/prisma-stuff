import { GetServerSidePropsContext } from 'next'
import prisma from '../../../lib/prisma'

import Image from 'next/image'

import User from '../../../components/User'

import { useState, useEffect } from 'react'
import IResponseMessage from '../../../interfaces/IResponseMessage'

import Comments from '../../../components/comments/Comments'
import { CommentOnPost, CommentOnPostComment } from '@prisma/client'
import { useUsers } from '../../../context/UsersContext'
import { has } from 'lodash'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import axios, { AxiosError } from 'axios'

import ReactMarkdown from 'react-markdown'

export default function Post({ post }: { post: any }) {
  const [resMsg, setResMsg] = useState<IResponseMessage>({
    msg: '',
    err: false,
    pen: false,
  })

  const { findUserData, cacheProfileDataForUser } = useUsers()
  const { push } = useRouter()
  const { data: session } = useSession()

  const deletePost = async () => {
    try {
      setResMsg({msg:"", err:false, pen:true})
      await axios({
        method: 'DELETE',
        url: `/api/post?id=${post.id}`,
      })
      setResMsg({msg:"Post deleted", err:false, pen:false})
    } catch (e:AxiosError | any) {
      e.response
        ? //@ts-ignore-error
          has(e.response, 'data')
          ? setResMsg({ msg: e.response.data.msg, err: true, pen: false })
          : setResMsg({ msg: `${e}`, pen: false, err: true })
        : setResMsg({ msg: `${e}`, pen: false, err: true })
    }
  }

  useEffect(() => {
    if (post) cacheProfileDataForUser(post.author.id)
  }, [])

  return (
    <>
      {post && (
        <div className="flex flex-col justify-center my-1 p-3 w-full">
          <div className="relative w-full rounded overflow-hidden border border-black dark:border-zinc-600 h-60">
            <Image
              objectFit="cover"
              objectPosition="absolute"
              src={`https://res.cloudinary.com/dzpzb3uzn/image/upload/v1663407669/prisma-stuff/posts${
                process.env.NODE_ENV === 'development' ? '/dev' : ''
              }/${post.id}`}
              layout="fill"
            />
          </div>
          {session && session?.uid === post.author.id && (
            <div className="flex gap-2 items-center justify-center">
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => push(`/editor?postId=${post.id}`)}
                  className="border-2 font-black border-black px-2 rounded flex dark:border-white items-center"
                >
                  Edit
                </button>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => deletePost()}
                  className="border-2 font-black border-black px-2 rounded flex dark:border-white items-center"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
          <div className='text-3xl mx-auto font-ArchivoBlack'>
              {resMsg.msg}
          </div>
          <div className="flex items-end justify-start py-6 px-4 gap-2">
            <div>
              <h1
                style={{ lineHeight: '1' }}
                className="text-lg text-left my-1 font-ArchivoBlack"
              >
                {post.title}
              </h1>
              <p
                style={{ lineHeight: '1' }}
                className="text-sm text-left"
              >
                {post.description}
              </p>
            </div>
              <User date={new Date(String(post.createdAt))} userData={findUserData(post.author.id)} post={post} />
          </div>
          <hr className="border-zinc-100 dark:border-zinc-800" />
          <div
            style={{ lineHeight: '1.166' }}
            className="
            mt-3
            p-4
            prose
            prose-sm
            prose-h1:font-ArchivoBlack
            prose-h2:font-ArchivoBlack
            dark:prose-headings:text-white
            dark:prose-headings:font-bold
            dark:prose-lead:text-white
            dark:prose-p:text-white
            dark:prose-blockquote:text-white
            dark:prose-li:text-white
            dark:prose-strong:text-white
            dark:prose-figure:text-white
            dark:prose-figcaption:text-white
            dark:prose-table:text-white
            dark:prose-tr:text-white
            dark:prose-th:text-white
            dark:prose-td:text-white
            prose-a:text-indigo-500
            prose-a:font-bold
            max-w-none"
          >
            <ReactMarkdown children={post.content} />
          </div>
          <Comments inComments={post.comments} postId={post.id} />
        </div>
      )}
    </>
  )
}

export const getServerSideProps = async ({
  params,
}: GetServerSidePropsContext) => {
  const post = await prisma.post.findUnique({
    where: {
      slug: String(params?.slug),
    },
    include: {
      author: {
        select: { name: true, image: true, id: true },
      },
      comments: true,
      shares: true,
      likes: true,
    },
  })
  let out = JSON.parse(JSON.stringify(post))
  if (has(out, 'comments'))
    out.comments = await Promise.all(
      out.comments.map((comment: CommentOnPost) => {
        return new Promise((resolve, reject) => {
          prisma.commentOnPostComment
            .findMany({ where: { commentedOnId: comment.id } })
            .then((res: CommentOnPostComment[]) => {
              resolve({ ...comment, replies: res.length })
            })
            .catch((e) => reject(e))
        })
      }),
    )
  return {
    props: { post: out },
  }
}
