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

export default function Post({ post, small }: { post: IPost, small?: boolean }) {
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
        <article onClick={() => push(`/post/${post.slug}`)} className={small ? "p-1 flex text-center w-full" : "p-2 flex text-center gap-1 flex-col h-60 justify-evenly w-full"}>
            {/*Image*/}
            {!small && <div className={small ? "relative w-1/3 h-full bg-gray-200 rounded overflow-hidden" : "relative grow w-full h-36 bg-gray-200 rounded overflow-hidden"}>
                <Image layout="fill" objectFit="cover" objectPosition="absolute" src={`https://res.cloudinary.com/dzpzb3uzn/image/upload/v1663407669/prisma-stuff/posts${process.env.NODE_ENV === "development" ? "/dev" : ""}/${post.id}`} />
            </div>}
            <div className="flex flex-col mx-auto">
                {!small && <div className="flex p-1 justify-center items-center w-full gap-1">
                    {post.tags.map((tag: string) => <div className="border text-xs rounded-sm cursor-pointer border-gray-400 bg-gray-200 text-shadow shadow px-2">{tag}</div>)}
                </div>}
                <h3 className="text-xl mx-auto">{post.title}</h3>
                {!small && <p className="mx-auto">{post.description}</p>}
                <div className="flex mx-auto gap-1 items-center">
                    <span className="text-xs text-gray-500">by {post.author.name}</span>
                    <div onClick={() => push(`/profile/${post.author.id}`)} className="bg-stone-500 cursor-pointer overflow-hidden shadow h-7 w-7 rounded-full relative">
                        <Image layout="fill" src={post.author.image} />
                    </div>
                    {!small &&
                        <div className="flex flex-col text-xs items-center justify-center">
                            <div className="flex items-center">
                                <AiOutlineShareAlt onClick={() => share()} style={{ strokeWidth: "2px" }} className="text-black w-6 h-6 drop-shadow cursor-pointer" />
                                {post.shares.length + ((clickedShared && session) ? (post.shares.includes(String(session?.uid)) ? -1 : 1) : 0)}
                            </div>
                            <div className="flex items-center">
                                <AiOutlineLike onClick={() => like()} style={{ strokeWidth: "2px" }} className="text-black w-6 h-6 p-1 drop-shadow cursor-pointer" />
                                {post.likes.length + ((clickedLiked && session) ? (post.shares.includes(String(session?.uid)) ? -1 : 1) : 0)}
                            </div>
                        </div>}
                </div>
            </div>
        </article>
    )
}