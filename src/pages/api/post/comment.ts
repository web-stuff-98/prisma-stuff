import { CommentOnPost, CommentOnPostComment, User } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "../../../utils/prisma";
import pusher from "../../../utils/pusher";

import { nanoid } from "nanoid/async"
import { customRateLimit } from "../../../utils/redisRateLimit";

async function handler(req:NextApiRequest, res:NextApiResponse) {
    if(req.method !== "POST" && req.method !== "PATCH" && req.method !== "GET") return res.status(405).end()

    const session = await getSession({req})

    if(!session && req.method !== "GET") return res.status(403).end()
    try {
        const {comment, postId, commentId} = req.body
        if(req.method === "GET") {
            if(!req.query.commentThreadId) return res.status(400).end()
            //get comment replies thread
            const q = await prisma.commentOnPostComment.findMany({ where: { commentedOnId: String(req.query.commentThreadId) } })
            return res.status(200).json(q)
        }
        if(req.method === "PATCH" || req.method === "POST") {
        if(!comment || comment.trim() === "") return res.status(400).json({msg:"Cannot submit an empty comment"})
        const q = await prisma.post.findUnique({
            where: {
                id: postId
            },
            select: {
                comments: true
            }
        })
        if(q?.comments.find((comment:CommentOnPost) => (comment.userId === session?.uid && comment.comment === req.body.comment))) {
            return res.status(400).json({msg:"You have already made that comment"})
        }
        if(req.method === "POST") {
            const id = await nanoid()
            if(!commentId) {
                //add comment (no comment id, meaning adding a comment to a post, not adding a comment to a comment on a post)
                await prisma.post.update({
                    where: { id: postId },
                    data: { comments: { create: { comment, userId: String(session?.uid), id } } },
                })
                await pusher.trigger(`post=${postId}`, 'comment-added', { comment, userId: session?.uid, id })
            } else {
                //comment on post comment
                await prisma.commentOnPost.update({
                    where: { id: commentId },
                    data: {
                        CommentOnPostComment: {
                            create: {
                                id,
                                userId: String(session?.uid),
                                comment,
                            }
                        }
                    }
                })
                await pusher.trigger(`post=${postId}`, 'comment-on-comment-added', { comment, userId: session?.uid, commentThreadId:commentId, id })
            }
        }
        if(req.method === "PATCH") {
            if(commentId) {
                await prisma.commentOnPost.update({
                    where: { id: commentId },
                    data: { comment }
                })
                await pusher.trigger(`post=${postId}`, 'comment-updated', { comment, userId: session?.uid, commentId })
            } else {
                await prisma.commentOnPostComment.update({
                    where: { id: commentId },
                    data: { comment }
                })
                await pusher.trigger(`post=${postId}`, 'comment-on-comment-updated', { comment, userId: session?.uid, commentThreadId:commentId, id:commentId })
            } 
        }
        return res.status(200).end()
    }
    } catch(e) {
        console.error(e)
        return res.status(500).end()
    }
}

export default customRateLimit(handler, {
    numReqs: 15,
    exp: 30,
    key: 'comment-requests',
})