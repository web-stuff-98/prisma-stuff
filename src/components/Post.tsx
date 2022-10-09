import axios from "axios"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { useRouter } from "next/router"
import { useState } from "react"
import { AiOutlineShareAlt, AiOutlineLike } from "react-icons/ai"

export type IPost = {
    id: string
    title: string
    description: string
    slug: string
    tags: string[]
    author: { name: string, image: string, id: string }
    shares: string[]
    likes: string[]
}

export default function Post({ post }: { post: IPost }) {
    const { push } = useRouter()

    const [clickedShared, setClickedShared] = useState(false)
    const [clickedLiked, setClickedLiked] = useState(false)

    const { data: session } = useSession()

    const share = async () => {
        setClickedShared(!clickedShared)
        try {
            await axios({
                method: "POST",
                data: { postId: post.id },
                url: "/api/post/share"
            })
        } catch (e) {
            console.error(e)
        }
    }
    const like = async () => {
        setClickedLiked(!clickedLiked)
        try {
            await axios({
                method: "POST",
                data: { postId: post.id },
                url: "/api/post/like"
            })
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <article onClick={() => push(`/post/${post.slug}`)} className="p-2 flex text-center gap-1 flex h-full justify-evenly w-full">
            {/*Image*/}
            <div className="relative grow w-1/2 h-48 bg-gray-200 rounded overflow-hidden shadow">
                <Image layout="fill" objectFit="cover" objectPosition="absolute" src={`https://res.cloudinary.com/dzpzb3uzn/image/upload/v1663407669/prisma-stuff/posts${process.env.NODE_ENV === "development" ? "/dev" : ""}/${post.id}`} />
            </div>
            <div className="flex flex-col justify-center items-start w-full mx-auto p-1">
                <h3 className="text-3xl text-left">{post.title}</h3>
                <p className="text-lg text-left">{post.description}</p>
                <div className="flex gap-1 items-center">
                    <div className="flex flex-col text-xs items-center justify-center">
                        <div className="flex items-center">
                            <AiOutlineShareAlt onClick={() => share()} style={{ strokeWidth: "2px" }} className="text-black w-4 h-4 drop-shadow cursor-pointer" />
                            {post.shares.length + ((clickedShared && session) ? (post.shares.includes(String(session?.uid)) ? -1 : 1) : 0)}
                        </div>
                        <div className="flex items-center">
                            <AiOutlineLike onClick={() => like()} style={{ strokeWidth: "2px" }} className="text-black w-4 h-4 drop-shadow cursor-pointer" />
                            {post.likes.length + ((clickedLiked && session) ? (post.shares.includes(String(session?.uid)) ? -1 : 1) : 0)}
                        </div>
                    </div>
                    <div onClick={() => push(`/profile/${post.author.id}`)} className="bg-stone-500 cursor-pointer overflow-hidden shadow h-7 w-7 rounded-full relative">
                        <Image layout="fill" src={post.author.image} />
                    </div>
                    <span className="text-xs text-gray-500">by {post.author.name}</span>
                </div>
                <div className="flex py-2 justify-start items-start w-full gap-1">
                    {post.tags.map((tag: string) => <div className="text-xs rounded-sm cursor-pointer bg-slate-300 text-white drop-shadow hover:bg-sky-600 py-0.5 px-2">{tag}</div>)}
                </div>
            </div>
        </article>
    )
}