import Image from 'next/image'
import Link from 'next/link'
import { useFilter } from '../../context/FilterContext'
import { useUsers } from '../../context/UsersContext'
import PostAuthor from './PostAuthor'

export type IPost = {
  id: string
  title: string
  description: string
  slug: string
  tags: string[]
  author: { name: string; image: string; id: string }
  shares: string[]
  likes: string[]
  createdAt: string
}

export default function Post({
  post,
  reverse,
}: {
  post: IPost
  reverse: boolean
}) {
  const { findUserData } = useUsers()
  const { autoAddRemoveSearchTag } = useFilter()

  return (
    <article
      className={`p-2 text-center gap-1 sm:flex-col md:flex ${
        reverse ? 'md:flex-row-reverse' : 'md:flex-row'
      } h-full w-full justify-evenly`}
    >
      <Link href={`/blog/post/${post.slug}`}>
        <div className="relative border border-zinc-700 shadow-md cursor-pointer sm:w-full sm:h-28 md:w-64 md:min-w-postWidth md:h-postHeight bg-gray-200 shadow rounded overflow-hidden shadow">
          <Image
            layout="fill"
            objectFit="cover"
            objectPosition="absolute"
            src={`https://res.cloudinary.com/dzpzb3uzn/image/upload/v1663407669/prisma-stuff/posts${
              process.env.NODE_ENV === 'development' ? '/dev' : ''
            }/${post.id}`}
          />
        </div>
      </Link>
      <div
        className={`flex flex-col justify-center items-${
          reverse ? 'end' : 'start'
        } mx-auto grow p-1`}
      >
        <h3
          style={{ lineHeight: '1' }}
          className={`font-Archivo sm:text-sm md:text-xl sm:mx-auto sm:text-center ${
            reverse ? 'md:text-right' : 'md:text-left'
          } font-black md:pb-1`}
        >
          {post.title}
        </h3>
        <p
          style={{ lineHeight: '1' }}
          className={`sm:text-center sm:text-xs md: text-sm ${
            reverse ? 'md:text-right' : 'md:text-left'
          }`}
        >
          {post.description}
        </p>
        <div
          style={{ filter: 'drop-shadow(0px 1.5px 1px rgba(0,0,0,0.5))' }}
          className={`flex py-1 flex-wrap sm:justify-center ${
            reverse ? 'md:justify-end' : 'md:justify-start'
          } items-start w-full gap-0.5`}
        >
          {post.tags.map((tag: string) => (
            <div
              onClick={() => autoAddRemoveSearchTag(tag)}
              className="text-xs rounded cursor-pointer bg-gray-900 hover:bg-gray-800 text-white hover:bg-gray-600 py-0.5 px-1 sm:py-0 dark:bg-amber-700 dark:hover:bg-amber-600 dark:border-zinc-200 dark:border"
            >
              {tag}
            </div>
          ))}
        </div>
        <div className="sm:mx-auto mt-1 md:mx-0">
          <PostAuthor
            key={post.id}
            reverse={reverse}
            authorData={findUserData(post.author.id)}
            post={post}
          />
        </div>
      </div>
    </article>
  )
}
