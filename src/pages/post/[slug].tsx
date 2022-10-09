import { GetServerSidePropsContext } from "next";
import prisma from "../../lib/prisma";

export default function Post({ post }: { post: any }) {
  return (
    <div className="container flex justify-center">
      <h1>{JSON.stringify(post)}</h1>
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