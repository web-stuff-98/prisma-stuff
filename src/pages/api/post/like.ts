import { LikesOnPost } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "../../../lib/prisma";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    if(req.method !== "POST") return res.status(405).end()

    const session = await getSession({req})

    if(!session) return res.status(401).end()
    try {
        const q = await prisma.post.findUnique({
            where: {
                id: req.body.postId
            },
            select: {
                likes: true
            }
        })
        if(!q?.likes.find((like:LikesOnPost) => like.userId === session.uid))
            //add like
            await prisma.post.update({
                where: { id: req.body.postId },
                data: {
                    likes: {
                        create: { userId: session.uid }
                    }
                }
            }) 
        else
            //remove like
            await prisma.post.update({
                where: {id :req.body.postId},
                data: {
                    likes: {
                        delete:{ userId: session.uid }
                    }
                }
            })
    } catch(e) {
        console.error(e)
        return res.status(500).end()
    }
    return res.status(201).end()
}