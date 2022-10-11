import { GetServerSidePropsContext } from "next";
import prisma from "../../lib/prisma";

import Image from "next/image";

import { useState } from "react";
import IResponseMessage from "../../interfaces/IResponseMessage";

import Comments from "../../components/comments/Comments";
import { has } from "lodash";
import Link from "next/link";
import PostAuthor from "../../components/post/PostAuthor";

export default function Post({ post }: { post: any }) {
  const [resMsg, setResMsg] = useState<IResponseMessage>({ msg: '', err: false, pen: false })

  return (
    <div className="flex flex-col justify-center p-3">
      <div className="relative shadow-md h-60 w-full p-3 rounded overflow-hidden">
        <Image layout="fill" objectPosition="absolute" objectFit="cover" src={`https://res.cloudinary.com/dzpzb3uzn/image/upload/v1663407669/prisma-stuff/posts${process.env.NODE_ENV === "development" ? "/dev" : ""}/${post.id}`} />
      </div>
      <h1 className="text-4xl mx-auto mt-3">{post.title}</h1>
      <h3 className="text-2xl mx-auto">{post.description}</h3>
      <div className="py-2 mx-auto">
      <PostAuthor post={post} />
      </div>
      <p className="mx-auto text-center">{post.content}</p>
      <Comments comments={post.comments} postId={post.id} />
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
        select: { name: true, image: true, id: true },
      },
      comments: true,
      shares:true,
      likes:true
    },
  });
  let out = JSON.parse(JSON.stringify(post))
  let uids: string[] = []
  if (has(out, "comments")) {
    out.comments.forEach((comment: any) => { if (!uids.includes(comment.userId)) { uids.push(comment.userId) } })
    const users = await Promise.all(uids.map((uid: string) => {
      return new Promise((resolve, reject) => {
        prisma.user.findUnique({ where: { id: uid } })
          .then((user: any) => resolve(user))
          .catch((e: any) => reject(e))
      })
    }))
    out.comments = post?.comments.map((comment: any) => {
      const matchingUser = users.find((user: any) => user.id === comment.userId)
      return { ...comment, user: matchingUser }
    })
  }
  return {
    props: { post: JSON.parse(JSON.stringify(out)) },
  };
};