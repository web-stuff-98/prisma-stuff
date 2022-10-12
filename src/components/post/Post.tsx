import axios from "axios"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
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
        <article className="p-2 flex text-center gap-1 flex h-full justify-evenly w-full">
            {/*Image*/}
            <Link href={`/blog/post/${post.slug}`}>
                <div className="relative cursor-pointer grow w-1/2 h-48 bg-gray-200 shadow rounded overflow-hidden shadow">
                    <Image layout="fill" objectFit="cover" objectPosition="absolute" src={`https://res.cloudinary.com/dzpzb3uzn/image/upload/v1663407669/prisma-stuff/posts${process.env.NODE_ENV === "development" ? "/dev" : ""}/${post.id}`} />
                </div>
            </Link>
            <div className="flex flex-col justify-center items-start w-full mx-auto p-1">
                <h3 style={{lineHeight:"1"}} className="text-2xl text-left">{post.title}</h3>
                <p style={{lineHeight:"1"}} className="text-md py-1 text-left">{post.description}</p>
                <div className="flex pb-1 justify-start items-start w-full gap-1">
                    {post.tags.map((tag: string) => <div className="text-xs rounded cursor-pointer bg-gray-900 text-white hover:bg-gray-600 py-0.5 px-1">{tag}</div>)}
                </div>
                <PostAuthor authorData={findUserData(post.author.id)} post={post} />
            </div>
        </article>
    )
}