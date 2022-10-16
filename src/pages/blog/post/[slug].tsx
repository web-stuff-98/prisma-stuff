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
      await axios({
        method: 'DELETE',
        url: `/api/post?id=${post.id}`,
      })
    } catch (e: AxiosError | any) {
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
          <h1 className="text-3xl mx-auto text-center mt-3">{post.title}</h1>
          <div className="py-2 mx-auto">
            <User userData={findUserData(post.author.id)} post={post} />
          </div>
          <div className='prose-sm prose-a:text-indigo-500 prose-a:font-bold max-w-none'>
          <ReactMarkdown children={post.content}/>
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
