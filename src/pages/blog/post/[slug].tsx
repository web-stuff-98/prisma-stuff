import { GetServerSidePropsContext } from "next";
import prisma from "../../../lib/prisma";

import Image from "next/image";

import { useState, useEffect } from "react";
import IResponseMessage from "../../../interfaces/IResponseMessage";

import Comments from "../../../components/comments/Comments";
import PostAuthor from "../../../components/post/PostAuthor";
import { CommentOnPost, CommentOnPostComment } from "@prisma/client";
import { useUsers } from "../../../context/UsersContext";
import { has } from "lodash";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import axios, { AxiosError } from "axios";

export default function Post({ post }: { post: any }) {
  const [resMsg, setResMsg] = useState<IResponseMessage>({ msg: '', err: false, pen: false })

  const { findUserData, cacheProfileDataForUser } = useUsers()
  const { push } = useRouter()
  const { data:session } = useSession()

  const deletePost = async () => {
    try {
      await axios({
        method:"DELETE",
        url:`/api/post?id=${post.id}`
      })  
    } catch (e: AxiosError | any) {
      e.response ?
          //@ts-ignore-error
          (has(e.response, "data") ? setResMsg({ msg: e.response.data.msg, err: true, pen: false }) : setResMsg({ msg: `${e}`, pen: false, err: true }))
          : setResMsg({ msg: `${e}`, pen: false, err: true })
    }
  }

  useEffect(() => {
    if (post)
      cacheProfileDataForUser(post.author.id)
  }, [])

  return (
    <>
      {post && <div className="flex flex-col justify-center p-3 w-full">
        <div className="relative shadow-md h-60 w-full p-3 rounded overflow-hidden">
          <Image layout="fill" blurDataURL={post.blur} placeholder="blur" alt={post.title} objectPosition="absolute" objectFit="cover" src={`https://res.cloudinary.com/dzpzb3uzn/image/upload/v1663407669/prisma-stuff/posts${process.env.NODE_ENV === "development" ? "/dev" : ""}/${post.id}`} />
        </div>
        {session && (session?.uid === post.author.id) &&
         <div className="flex gap-2 items-center justify-center">
        <div className="flex gap-2 pt-2">
          <button onClick={() => push(`/editor?postId=${post.id}`)} className="border-2 font-black border-black px-2 rounded flex dark:border-white items-center">Edit</button>
        </div>
        <div className="flex gap-2 pt-2">
          <button onClick={() => deletePost()} className="border-2 font-black border-black px-2 rounded flex dark:border-white items-center">Delete</button>
        </div>
        </div>}
        <h1 className="text-3xl mx-auto text-center mt-3">{post.title}</h1>
        <div className="py-2 mx-auto">
          <PostAuthor authorData={findUserData(post.author.id)} post={post} />
        </div>
        <p className="mx-auto text-center">{post.content}</p>
        <Comments inComments={post.comments} postId={post.id} />
      </div>}
    </>
  )
}

export const getServerSideProps = async ({ params }: GetServerSidePropsContext) => {
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
      likes: true
    },
  });
  let out = JSON.parse(JSON.stringify(post))
  if (has(out, "comments"))
    out.comments = await Promise.all(out.comments.map((comment: CommentOnPost) => {
      return new Promise((resolve, reject) => {
        prisma.commentOnPostComment.findMany({ where: { commentedOnId: comment.id } })
          .then((res: CommentOnPostComment[]) => {
            resolve({ ...comment, replies: res.length })
          })
          .catch((e) => reject(e))
      })
    }))
  return {
    props: { post: out },
  };
};