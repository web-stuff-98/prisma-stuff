import Image from "next/image"
import Link from "next/link"
import { useFilter } from "../../context/FilterContext"
import { useUsers } from "../../context/UsersContext"
import PostAuthor from "./PostAuthor"

export type IPost = {
    id: string
    title: string
    description: string
    slug: string
    tags: string[]
    author: { name: string, image: string, id: string }
    shares: string[]
    likes: string[]
    createdAt: string
}

export default function Post({ post, reverse }: { post: IPost, reverse:boolean }) {
    const { findUserData } = useUsers()
    const { autoAddRemoveSearchTag } = useFilter()

    return (
        <article className={`p-2 text-center gap-1 sm:flex-col md:flex md:flex-row${reverse ? "-reverse" : ""} h-full w-full justify-evenly`}>
            {/*Image*/}
            <Link href={`/blog/post/${post.slug}`}>
                <div className="relative border border-zinc-700 grow shadow-xl cursor-pointer sm:w-full md:w-64 h-56 bg-gray-200 shadow rounded overflow-hidden shadow">
                    <Image layout="fill" objectFit="cover" objectPosition="absolute" src={`https://res.cloudinary.com/dzpzb3uzn/image/upload/v1663407669/prisma-stuff/posts${process.env.NODE_ENV === "development" ? "/dev" : ""}/${post.id}`} />
                </div>
            </Link>
            <div style={{maxWidth:"66.66%"}} className={`flex flex-col justify-center items-${reverse ? "end" : "start"} mx-auto p-1`}>
                <h3 style={{ lineHeight: "1" }} className={`text-2xl sm:text-center md:text-${reverse ? "right" : "left"} font-black pb-1`}>{post.title}</h3>
                <p style={{ lineHeight: "1" }} className={`text-sm sm:text-center md:text-${reverse ? "right" : "left"}`}>{post.description}</p>
                <div style={{ filter: "drop-shadow(0px 1.5px 1px rgba(0,0,0,0.5))" }} className={`flex py-2 flex-wrap sm:justify-center md:justify-${reverse ? "end" : "start"} items-start w-full gap-1`}>
                    {post.tags.map((tag: string) => <div onClick={() => autoAddRemoveSearchTag(tag)} className="text-xs rounded cursor-pointer bg-gray-900 text-white hover:bg-gray-600 py-0.5 px-1 dark:bg-amber-700 dark:border-zinc-200 dark:border">{tag}</div>)}
                </div>
                <div className="sm:mx-auto md:mx-0">
                <PostAuthor key={post.id} reverse={reverse} authorData={findUserData(post.author.id)} post={post} />
                </div>
            </div>
        </article>
    )
}