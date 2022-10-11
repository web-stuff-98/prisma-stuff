import type { GetStaticProps } from 'next'
import Head from 'next/head'
import Post from '../components/post/Post';

import prisma from '../lib/prisma'

import { useEffect } from "react"
import { useUsers } from '../context/UsersContext';

export const getStaticProps: GetStaticProps = async () => {
  const q = await prisma.post.findMany({
    where: { published: true, imagePending: false },
    include: {
      author: {
        select: { id: true },
      },
      tags: true,
      shares: true,
      likes: true
    },
  });
  const feed = q.map((data: any) => ({
    ...data,
    tags: data.tags.map((tag: any) => tag.name),
  }))
  return {
    props: { feed: JSON.parse(JSON.stringify(feed)) },
    revalidate: 10,
  };
};

const Home = ({ feed }: { feed: any[] }) => {
  const { cacheProfileDataForUser } = useUsers()

  useEffect(() => {
    if (!feed) return
    feed.forEach((post: any) => cacheProfileDataForUser(post.author.id))
  }, [feed])

  return (
    <div className='flex justify-between w-full mx-auto p-2'>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='w-full h-full gap-2'>
        {feed.map((post: any) => <Post key={post.id} post={post}/>)}
      </div>
    </div>
  )
}

export default Home
