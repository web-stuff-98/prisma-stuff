import { GetServerSidePropsContext } from "next";
import prisma from "../../lib/prisma";

import Image from "next/image";

export default function Post({ post }: { post: any }) {
  return (
    <div className="flex flex-col justify-center p-3">
      <div className="relative h-60 w-full p-3 rounded overflow-hidden">
        <Image layout="fill" objectPosition="absolute" objectFit="cover" src={`https://res.cloudinary.com/dzpzb3uzn/image/upload/v1663407669/prisma-stuff/posts${process.env.NODE_ENV === "development" ? "/dev" : ""}/${post.id}`}/>
      </div>
      <h1 className="text-3xl mx-auto">{post.title}</h1>
      <h3 className="text-xl mx-auto">{post.description}</h3>
      <p className="mx-auto text-center">{post.content}</p>
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
    },
  });
  return {
    props: { post: JSON.parse(JSON.stringify(post)) },
  };
};