import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "../../../lib/prisma";

import cloudinary from "cloudinary"

import {nanoid} from "nanoid/async"

cloudinary.v2.config({
    cloud_name: "dzpzb3uzn",
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    const { title, content, description, tags:rawTags } = req.body
    const tags = rawTags.split("#").filter((tag:string) => tag !== "").map((tag:string) => ({name: tag.trim().toLocaleLowerCase()}))

    const session = await getSession({req})
    if(!session) return res.status(401).end()
    if(req.method !== "POST" && req.method !== "PATCH") return res.status(405)

    if(req.method === "POST") {
        try {
            const slug = String(title).toLowerCase().replaceAll(" ", "-").replace(/[^\w-]+/g, '')

            const created = await prisma.post.create({
            data: {
                    title,
                    content,
                    description,
                    slug: slug + "-" + await nanoid(8),
                    author: { connect: { id: String(session?.uid) } },
                    published:true,
                    tags: {
                        create: tags
                    }
                },
            })
            return res.status(201).json({id: created.id})
        } catch(e) {
            console.error(e)
            return res.status(500).end()
        }
    }
    if(req.method === "PATCH") {
        const { id:_id } = req.query
        const id = String(_id)
        let post
        try {
            post = await prisma.post.findUniqueOrThrow({ where: {id}, select:{authorId:true} })
        } catch(e) {
            return res.status(404).json({msg:"Could not find post to update"})
        }
        if(post.authorId !== session.uid) return res.status(403).end()
        try {
            await prisma.post.update({
            where: {
                id: String(id),
            },
            data: {
                    title,
                    content,
                    description,
                    published:true,
                    ...(req.body.withImage ? {imagePending:true} : {})
                }
            })
            return res.status(200).end()
        } catch(e) {
            return res.status(500).json({msg: "Internal error"})
        }
    }
}