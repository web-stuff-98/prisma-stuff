import { CommentOnPost, CommentOnPostComment, User } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "../../../lib/prisma";
import pusher from "../../../utils/pusher";

import { nanoid } from "nanoid/async"

/*
    was going to do comments on comments on comments,
    but the schema was too confusing. you can reply to comments though.
*/

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    if(req.method !== "POST" && req.method !== "PATCH" && req.method !== "GET") return res.status(405).end()

    const session = await getSession({req})

    if(!session) return res.status(403).end()
    try {
        const {comment, postId, commentId} = req.body
        if(req.method === "GET") {
            if(!req.query.commentThreadId) return res.status(400).end()
            //get comment replies thread
            const q = await prisma.commentOnPostComment.findMany({ where: { commentedOnId: String(req.query.commentThreadId) } })
            let uids:string[] = []
            q.forEach((comment:CommentOnPostComment) => {
                if(!uids.includes(comment.userId))
                    uids.push(comment.userId)
            })
            const users = await Promise.all(uids.map((uid:string) => {
                return new Promise((resolve, reject) => {
                    prisma.user.findUniqueOrThrow({ where: { id:uid }, select: { id:true, name:true, image:true } })
                    .then((u:Partial<User>) => resolve(u))
                    .catch((e) => reject(e))
                })
            }))
            return res.status(200).json(q.map((comment:CommentOnPostComment) => ({...comment, user: users.find((u:any) => u.id === comment.userId)})))
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
        if(q?.comments.find((comment:CommentOnPost) => (comment.userId === session.uid && comment.comment === req.body.comment))) {
            return res.status(400).json({msg:"You have already made that comment"})
        }
        if(req.method === "POST") {
            const id = await nanoid()
            if(!commentId) {
                //add comment (no comment id, meaning adding a comment to a post, not adding a comment to a comment on a post)
                await prisma.post.update({
                    where: { id: postId },
                    data: { comments: { create: { comment, userId: session.uid, id } } },
                })
                await pusher.trigger(`post=${postId}`, 'comment-added', { comment, userId: session.uid })
            } else {
                //comment on post comment
                await prisma.commentOnPost.update({
                    where: { id: commentId },
                    data: {
                        CommentOnPostComment: {
                            create: {
                                id,
                                userId: session.uid,
                                comment,
                            }
                        }
                    }
                })
                await pusher.trigger(`post=${postId}`, 'comment-on-comment-added', { comment, userId: session.uid, id:commentId })
            }
        }
        if(req.method === "PATCH") {
            if(!req.body.commentId) {
                const id = await nanoid()
                await prisma.commentOnPost.update({
                    where: { id: commentId },
                    data: { comment }
                })
                await pusher.trigger(`post=${postId}`, 'comment-updated', { comment, userId: session.uid, id })
            } else {
                await prisma.commentOnPostComment.update({
                    where: { id: commentId },
                    data: { comment }
                })
                await pusher.trigger(`post=${postId}`, 'comment-on-comment-updated', { comment, userId: session.uid, id:commentId })
            } 
        }
        return res.status(200).end()
    }
    } catch(e) {
        console.error(e)
        return res.status(500).end()
    }
}