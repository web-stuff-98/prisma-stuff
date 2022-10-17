import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "../../../utils/prisma";

import cloudinary from "cloudinary";

import { nanoid } from "nanoid/async";
import imageProcessing from "../../../utils/imageProcessing";
import { customRateLimit } from "../../../utils/redisRateLimit";
import PostValidateSchema from "../../../utils/yup/PostValidateSchema";

cloudinary.v2.config({
  cloud_name: "dzpzb3uzn",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    await PostValidateSchema.validate(req.body)
  } catch (e:any) {
    return res.status(400).json({msg:`${e}`.replace("ValidationError : ", "")})
  }

  const {
    title,
    content,
    description,
    tags: rawTags,
    base64coverImage,
  } = req.body;

  let tags;
  if (req.method !== "DELETE")
    tags = rawTags
      .split("#")
      .filter((tag: string) => tag.trim() !== "")
      .map((inTag: string) => {
        const tag = inTag.trim().toLowerCase();
        return {
          where: { name: tag },
          create: { name: tag },
        };
      });

  const session = await getSession({ req });
  if (!session) return res.status(401).end();
  if (
    req.method !== "POST" &&
    req.method !== "PATCH" &&
    req.method !== "DELETE"
  )
    return res.status(405).end();

  if (req.method === "POST") {
    try {
      const slug = String(title)
        .toLowerCase()
        .replaceAll(" ", "-")
        .replace(/[^\w-]+/g, "");
      const created = await prisma.post.create({
        data: {
          title: title.trim(),
          content,
          description: description.trim(),
          slug: slug + "-" + (await nanoid(8)),
          author: { connect: { id: String(session?.uid) } },
          published: true,
          blur: await imageProcessing(base64coverImage, {
            width: 32,
            height: 20,
          }),
          tags: {
            connectOrCreate: tags,
          },
        },
      });
      return res.status(201).json({ id: created.id });
    } catch (e) {
      console.error(e);
      return res.status(500).end();
    }
  }
  if (req.method === "PATCH") {
    const { id: _id } = req.query;
    const id = String(_id);
    let post;
    try {
      post = await prisma.post.findUniqueOrThrow({
        where: { id },
        select: { authorId: true },
      });
    } catch (e) {
      return res.status(404).json({ msg: "Could not find post to update" });
    }
    if (post.authorId !== session.uid) return res.status(403).end();
    try {
      await prisma.post.update({
        where: {
          id: String(id),
        },
        data: {
          title: title.trim(),
          content,
          description: description.trim(),
          published: true,
          ...(req.body.withImage ? { imagePending: true } : {}),
          tags: {
            connectOrCreate: tags,
          },
        },
      });
      return res.status(200).end();
    } catch (e) {
      return res.status(500).json({ msg: "Internal error" });
    }
  }
  if (req.method === "DELETE") {
    const { id: _id } = req.query;
    const id = String(_id);
    try {
      const q = await prisma.post.findUniqueOrThrow({
        where: { id },
        select: { id: true, authorId: true },
      });
      if (q.authorId !== session.uid)
        return res.status(403).json({ msg: "Unauthorized" });
      await prisma.post.delete({ where: { id } });
      try {
        await new Promise((resolve, reject) => {
          cloudinary.v2.uploader
            .destroy(
              `prisma-stuff/posts${
                process.env.NODE_ENV === "development" ? "/dev" : ""
              }/${id}`
            )
            .then((res) => resolve(res))
            .catch((e) => reject(e));
        });
        return res.status(200).end();
      } catch (e) {
        console.error(`Failed to delete post image : ${e}`);
        return res.status(200).end();
      }
    } catch (e) {
      console.error(e);
      return res.status(400).json({ msg: "Post does not exist" });
    }
  }
}

export default customRateLimit(handler, {
  numReqs: 12,
  exp: 21600,
  key: 'editor-requests'
})