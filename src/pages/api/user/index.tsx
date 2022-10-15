import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'

export default async function User(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET' && req.method !== 'DELETE')
    return res.status(405).end()

  if (req.method === 'GET') {
    try {
      const { uid } = req.query
      try {
        const q = await prisma.user.findUniqueOrThrow({
          where: { id: String(uid) },
          select: {
            id: true,
            name: true,
            image: true,
            createdAt: true,
          },
        })
        return res.status(200).json(q)
      } catch (e) {
        return res.status(400).json({ msg: 'Could not find data for user' })
      }
    } catch (e) {
      console.error(e)
      return res.status(500).json({ msg: 'Internal error' })
    }
  }
  if (req.method === 'DELETE') {
    const session = await getSession({ req })
    if(!session) return res.status(403).json({msg:"Unauthorized"})
    try {
      await prisma.user.delete({
        where: { id: session?.uid },
      })
      return res.status(200).json({msg:"Your account has been deleted"})
    } catch (e) {
      console.error(e)
      return res.status(400).json({ msg: 'Internal error' })
    }
  }
}
