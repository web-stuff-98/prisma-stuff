import { CommentOnPost, SharesOnPost } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "../../../lib/prisma";
import pusher from "../../../utils/pusher";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    if(req.method !== "POST" && req.method !== "PATCH") return res.status(405).end()

    const session = await getSession({req})

    if(!session) return res.status(401).end()
    try {
        const {comment, postId, commentId} = req.body
        const q = await prisma.post.findUnique({
            where: {
                id: postId
            },
            select: {
                comments: true
            }
        })
        if(q?.comments.find((comment:CommentOnPost) => (comment.userId === session.uid && comment.comment === req.body.comment))) {
            return res.status(400).json({msg:"You have already made that comment"})
        }
        if(req.method === "POST") {
            //add comment
            await prisma.post.update({
                where: { id: postId },
                data: {
                    comments: {
                        create: { comment, userId: session.uid }
                    }
                },
            })
            await pusher.trigger(`post=${postId}`, 'comment-added', { comment, userId: session.uid })
        }
        if(req.method === "PATCH") {
            await prisma.commentOnPost.update({
                where: { id: commentId },
                data: { comment }
            })
            await pusher.trigger(`post=${postId}`, 'comment-updated', { comment, userId: session.uid })
        }
        return res.status(200).end()
    } catch(e) {
        console.error(e)
        return res.status(500).end()
    }
}