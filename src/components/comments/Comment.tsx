import Image from "next/image";
import Link from "next/link";
import { RiReplyAllFill } from "react-icons/ri";
import { IUser } from "../../context/UsersContext";
import User from "../User";
import { IComment } from "./Comments";

export default function Comment(
    {
        comment,
        authorData,
        commentThreadId,
        setCommentThreadId = () => { },
        setCommentThreadAuthorId = () => { },
    }: {
        comment: IComment,
        authorData: IUser,
        commentThreadId?: string,
        setCommentThreadId: (to: string) => void
        setCommentThreadAuthorId: (to: string) => void
    }) {
    return (
        <div className="w-full p-1 flex gap-2 items-center">
            <User smallDate={true} date={new Date(comment.createdAt)} userData={authorData}/>
            <div className="text-sm grow">{comment.comment}</div>
            {!commentThreadId &&
                <>
                    <div className="text-xs">{comment.replies} replies</div>
                    <RiReplyAllFill onClick={() => { setCommentThreadId(comment.id); setCommentThreadAuthorId(comment.userId) }} className="cursor-pointer text-2xl mx-1" />
                </>
            }
        </div>
    )
}