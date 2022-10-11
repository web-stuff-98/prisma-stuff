import axios from "axios"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { useRouter } from "next/router"
import { useState } from "react"
import { AiOutlineShareAlt, AiOutlineLike } from "react-icons/ai"
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

export default function Post({ post }: { post: IPost }) {
    const { push } = useRouter()

    const { findUserData } = useUsers()

    return (
        <article onClick={() => push(`/post/${post.slug}`)} className="p-2 flex text-center gap-1 flex h-full justify-evenly w-full">
            {/*Image*/}
            <div className="relative grow w-1/2 h-48 bg-gray-200 shadow rounded overflow-hidden shadow">
                <Image layout="fill" objectFit="cover" objectPosition="absolute" src={`https://res.cloudinary.com/dzpzb3uzn/image/upload/v1663407669/prisma-stuff/posts${process.env.NODE_ENV === "development" ? "/dev" : ""}/${post.id}`} />
            </div>
            <div className="flex flex-col justify-center items-start w-full mx-auto p-1">
                <h3 className="text-3xl text-left">{post.title}</h3>
                <p className="text-lg text-left">{post.description}</p>
                <PostAuthor authorData={findUserData(post.author.id)} post={post} />
                <div className="flex py-2 justify-start items-start w-full gap-1">
                    {post.tags.map((tag: string) => <div className="text-xs rounded-sm cursor-pointer bg-slate-300 text-white drop-shadow hover:bg-sky-600 py-0.5 px-2">{tag}</div>)}
                </div>
            </div>
        </article>
    )
}