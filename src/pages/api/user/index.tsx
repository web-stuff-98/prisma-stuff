import { NextApiRequest, NextApiResponse } from "next";

export default async function User(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") return res.status(405).end()

    try {
        const { uid } = req.query
        try {
            const q = await prisma.user.findUniqueOrThrow({
                where: { id: String(uid) },
                select: {
                    id: true,
                    name: true,
                    image: true
                }
            })
            return res.status(200).json(q)
        } catch (e) {
            return res.status(400).json({ msg: "Could not find data for user" })
        }
    } catch (e) {
        return res.status(500).json({ msg: "Internal error" })
    }
}