import { useSession } from "next-auth/react"
import { AiOutlineShareAlt, AiOutlineLike } from "react-icons/ai"
import { IPost } from "./Post"

import { useState } from "react"

import Image from "next/image"

import axios from "axios"
import { useRouter } from "next/router"
import { IUser, useUsers } from "../../context/UsersContext"

export default function PostAuthor({ post, authorData }: { post: IPost, authorData: IUser }) {
    const [clickedShared, setClickedShared] = useState(false)
    const [clickedLiked, setClickedLiked] = useState(false)

    const { push } = useRouter()

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

    const { data: session } = useSession()

    return (
        <div className="flex gap-1 items-center">
            {authorData && <>
            <div className="flex flex-col text-xs items-center justify-center">
                <div className="flex items-center">
                    <AiOutlineShareAlt onClick={() => share()} style={{ strokeWidth: "2px" }} className="text-black w-4 h-4 drop-shadow cursor-pointer" />
                    {post.shares.length + ((clickedShared && session) ? (post.shares.find((share: any) => share.userId === String(session?.uid)) ? -1 : 1) : 0)}
                </div>
                <div className="flex items-center">
                    <AiOutlineLike onClick={() => like()} style={{ strokeWidth: "2px" }} className="text-black w-4 h-4 drop-shadow cursor-pointer" />
                    {post.likes.length + ((clickedLiked && session) ? (post.likes.find((like: any) => like.userId === String(session?.uid)) ? -1 : 1) : 0)}
                </div>
            </div>
            <div onClick={() => push(`/profile/${post.author.id}`)} className="bg-stone-500 cursor-pointer overflow-hidden shadow h-7 w-7 rounded-full relative">
                <Image layout="fill" src={authorData.image} />
            </div>
            <span className="text-xs text-gray-500">by {authorData.name}</span>
            </>}
        </div>
    )
}