import { GetServerSidePropsContext } from "next";
import prisma from "../../lib/prisma";

import Image from "next/image";

import { useState, useEffect } from "react";
import IResponseMessage from "../../interfaces/IResponseMessage";

import Comments from "../../components/comments/Comments";
import PostAuthor from "../../components/post/PostAuthor";
import { CommentOnPost, CommentOnPostComment } from "@prisma/client";
import { useUsers } from "../../context/UsersContext";

export default function Post({ post }: { post: any }) {
  const [resMsg, setResMsg] = useState<IResponseMessage>({ msg: '', err: false, pen: false })

  const { findUserData, cacheProfileDataForUser } = useUsers()

  useEffect(() => {
    cacheProfileDataForUser(post.author.id)
  }, [])

  return (
    <div className="flex flex-col justify-center p-3">
      <div className="relative shadow-md h-60 w-full p-3 rounded overflow-hidden">
        <Image layout="fill" objectPosition="absolute" objectFit="cover" src={`https://res.cloudinary.com/dzpzb3uzn/image/upload/v1663407669/prisma-stuff/posts${process.env.NODE_ENV === "development" ? "/dev" : ""}/${post.id}`} />
      </div>
      <h1 className="text-4xl mx-auto mt-3">{post.title}</h1>
      <h3 className="text-2xl mx-auto">{post.description}</h3>
      <div className="py-2 mx-auto">
        <PostAuthor authorData={findUserData(post.author.id)} post={post} />
      </div>
      <p className="mx-auto text-center">{post.content}</p>
      <Comments inComments={post.comments} postId={post.id} />
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
      shares: true,
      likes: true
    },
  });
  let out = JSON.parse(JSON.stringify(post))
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