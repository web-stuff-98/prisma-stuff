import cloudinary from "cloudinary"
import busboy from "busboy"
import { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/react"
import prisma from "../../../lib/prisma";

cloudinary.v2.config({
    cloud_name: "dzpzb3uzn",
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

export const config = {
    api: { bodyParser: false }
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "POST" && req.method !== "PUT") return res.status(405).end()

    const session = await getSession({req})
    if(!session) return res.status(403).end()

    const { postId } = req.query
    if (!postId) return res.status(400).end()

    try {
        await prisma.post.findUniqueOrThrow({ where: { id:String(postId) } } )
    } catch (e) {
        return res.status(400).json({msg:"Could not find post to upload image for"})
    }

    uploadCoverImageStream(req, res)
}

const uploadCoverImageStream = (req: NextApiRequest, res: NextApiResponse): void => {
    const bb = busboy({
        headers: req.headers
    })
    const postId = String(req.query.postId)
    bb.on('file', (_, file, info) => {
        const stream = cloudinary.v2.uploader.upload_stream({
            folder: `prisma-stuff/posts${process.env.NODE_ENV === "development" ? "/dev" : ""}`,
            public_id: postId,
            overwrite:true,
            unique_filename:false
        })
        file.pipe(stream)
    })
    bb.on('close', async () => {
        await prisma.post.update({
            where: {id: postId},
            data: {
                imagePending:false
            }
        })
        return res.status(201).end()
    })
    bb.on('error', (e) => {
        console.error(e)
        return res.status(500).json({ message: "Error uploading cover image" })
    })
    req.pipe(bb)
    return
}