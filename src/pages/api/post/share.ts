import { SharesOnPost } from "@prisma/client";
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
                shares: true
            }
        })
        if(!q?.shares.find((share:SharesOnPost) => share.userId === session.uid)) {
            //add share
            await prisma.post.update({
                where: { id: req.body.postId },
                data: {
                    shares: {
                        create: { userId: session.uid }
                    }
                }
            }) 
        } else {
            //remove share
            await prisma.post.update({
                where: {id :req.body.postId},
                data: {
                    shares: {
                        delete:{ id: Number(q.shares.find((share:SharesOnPost) => share.userId === session.uid)?.id) }
                    }
                }
            })
        }
    } catch(e) {
        console.error(e)
        return res.status(500).end()
    }
    return res.status(200).end()
}