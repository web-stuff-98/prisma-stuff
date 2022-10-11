import Image from "next/image"

import { BsFillReplyFill } from "react-icons/bs"
import { IoMdSend } from "react-icons/io"

import IResponseMessage from "../../interfaces/IResponseMessage"

import { useState, useEffect } from "react"
import type { FormEvent, ChangeEvent } from "react"

import axios, { AxiosError } from "axios"
import { AiOutlineNodeExpand } from "react-icons/ai"
import { MdOutlineCancel } from "react-icons/md"

import has from "lodash/has"
import Link from "next/link"

interface IComment {
    comment: string
    id: string
    user: { image: string, username: string }
}

export default function Comments({ comments, postId }: { comments: IComment[], postId: string }) {
    const [resMsg, setResMsg] = useState<IResponseMessage>({ msg: '', err: false, pen: false })

    const handleCommentForm = (e: FormEvent<HTMLFormElement>) => { e.preventDefault(); comment() }
    const comment = async () => {
        try {
            setResMsg({ msg: "", err: false, pen: true })
            await axios({
                method: "POST",
                url: "/api/post/comment",
                data: {
                    comment: commentInput,
                    postId,
                    ...(commentThreadId ? { commentId: commentThreadId } : {})
                }
            })
            setResMsg({ msg: "", err: false, pen: false })
        } catch (e: AxiosError | any) {
            e.response ?
                //@ts-ignore-error
                (has(e.response, "data") ? setResMsg({ msg: e.response.data.msg, err: true, pen: false }) : setResMsg({ msg: `${e}`, pen: false, err: true }))
                : setResMsg({ msg: `${e}`, pen: false, err: true })
        }
    }

    /* Comment replies thread */
    const [commentThreadId, setCommentThreadId] = useState('')
    const [commentThreadAuthorName, setCommentThreadAuthorName] = useState('')
    const [commentThread, setCommentThread] = useState<any[]>([])
    const getCommentThread = async () => {
        try {
            const axres = await axios({
                method: "GET",
                url: `/api/post/comment?commentThreadId=${commentThreadId}`,
            })
            console.log(JSON.stringify(axres.data))
            setCommentThread(axres.data)
        } catch (e: AxiosError | any) {
            e.response ?
                //@ts-ignore-error
                (has(e.response, "data") ? setResMsg({ msg: e.response.data.msg, err: true, pen: false }) : setResMsg({ msg: `${e}`, pen: false, err: true }))
                : setResMsg({ msg: `${e}`, pen: false, err: true })
        }
    }
    useEffect(() => {
        if (commentThreadId)
            getCommentThread()
    }, [commentThreadId])

    const [commentInput, setCommentInput] = useState('')
    return (
        <div className="w-full py-6">
            {commentThreadId && <h4 className="mx-auto mt-6 flex items-center gap-3">
                Viewing replies to {commentThreadAuthorName}&apos;s comment
                <MdOutlineCancel onClick={() => setCommentThreadId('')} className="text-2xl cursor-pointer" />
            </h4>}
            {(commentThreadId ? commentThread : comments).map((comment: any) => <div className="w-full p-1 flex gap-2 items-center">
                {<Link href={`/profile/${comment.user.id}`}><div className="relative cursor-pointer w-8 h-8 overflow-hidden rounded-full">
                    <Image src={comment.user.image} layout="fill" objectFit="cover" objectPosition="absolute" />
                </div></Link>}
                <div className="text-sm grow">{comment.comment}</div>
                {!commentThreadId &&
                    <AiOutlineNodeExpand onClick={() => { setCommentThreadId(comment.id); setCommentThreadAuthorName(comment.user.name) }} className="cursor-pointer text-2xl" />
                }
            </div>)}
            {/* comment input */}
            <form onSubmit={handleCommentForm} className="w-full flex h-20 items-center">
                <input placeholder={commentThreadId ? "Reply to comment" : "Add comment"} value={commentInput} onChange={(e: ChangeEvent<HTMLInputElement>) => setCommentInput(e.target.value)} type="text" className="w-full border-b border-black h-8" />
                <button type="submit" className="cursor-pointer"><IoMdSend className="w-8 h-8" /></button>
            </form>
        </div>
    )
}