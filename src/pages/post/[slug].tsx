import { GetServerSidePropsContext } from "next";
import prisma from "../../lib/prisma";

import Image from "next/image";

import { IoMdSend } from "react-icons/io"
import { ChangeEvent, useState } from "react";
import type { FormEvent } from "react";
import axios, { AxiosError } from "axios";
import IResponseMessage from "../../interfaces/IResponseMessage";

import has from "lodash/has"
import { User } from "@prisma/client";

export default function Post({ post }: { post: any }) {
  const [resMsg, setResMsg] = useState<IResponseMessage>({ msg: '', err: false, pen: false })

  const comment = async () => {
    try {
      setResMsg({ msg: "", err: false, pen: true })
      await axios({
        method: "POST",
        url: "/api/post/comment",
        data: { comment: commentInput, postId: post.id }
      })
      setResMsg({ msg: "", err: false, pen: false })
    } catch (e: AxiosError | any) {
      if (axios.isAxiosError(e)) {
        e.response ?
          //@ts-ignore-error
          (has(e.response, "data") ? setResMsg({ msg: e.response.data.msg, err: true, pen: false }) : setResMsg({ msg: `${e}`, pen: false, err: true }))
          : setResMsg({ msg: `${e}`, pen: false, err: true })
      }
    }
  }

  const [commentInput, setCommentInput] = useState('')

  return (
    <div className="flex flex-col justify-center p-3">
      <div className="relative h-60 w-full p-3 rounded overflow-hidden">
        <Image layout="fill" objectPosition="absolute" objectFit="cover" src={`https://res.cloudinary.com/dzpzb3uzn/image/upload/v1663407669/prisma-stuff/posts${process.env.NODE_ENV === "development" ? "/dev" : ""}/${post.id}`} />
      </div>
      <h1 className="text-3xl mx-auto">{post.title}</h1>
      <h3 className="text-xl mx-auto">{post.description}</h3>
      <p className="mx-auto text-center">{post.content}</p>
      {post.comments.map((comment: any) => <div className="w-full p-1 flex gap-2 items-center">
        <div className="relative w-6 h-6 overflow-hidden rounded-full">
          <Image src={comment.user.image} layout="fill" objectFit="cover" objectPosition="absolute" />
        </div>
        <div className="text-sm">{comment.comment}</div>
      </div>)}
      {/* comment input */}
      <div className="w-full flex h-20 items-center">
        <input value={commentInput} onChange={(e: ChangeEvent<HTMLInputElement>) => setCommentInput(e.target.value)} type="text" className="w-full border-b border-black h-8" />
        <button onClick={() => comment()} className="cursor-pointer"><IoMdSend className="w-8 h-8" /></button>
      </div>
    </div>
  )
}

export const getServerSideProps = async ({ params }: GetServerSidePropsContext) => {
  const post = await prisma.post.findUnique({
    where: {
      slug: String(params?.slug),
    },
    include: {
      author: {
        select: { name: true },
      },
      comments: true
    },
  });
  let out = JSON.parse(JSON.stringify(post))
  let uids: string[] = []
  out.comments.forEach((comment:any) => { if(!uids.includes(comment.userId)) { uids.push(comment.userId) }})
  const users = await Promise.all(uids.map((uid:string) => {
    return new Promise((resolve, reject) => {
      prisma.user.findUnique({where: {id: uid}})
      .then((user:any) => resolve(user))
      .catch((e:any) => reject(e))
    })
  }))
  out.comments = post?.comments.map((comment: any) => {
    const matchingUser = users.find((user: any) => user.id === comment.userId)
    return { ...comment, user: matchingUser }
  })
  return {
    props: { post: out },
  };
};