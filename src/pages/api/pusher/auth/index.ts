import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import pusher from '../../../../utils/pusher'

/**
 * You need to enable private channels in your pusher app dashboard...
 * its not very clear you need to do that in the documentation.
 * 
 * Pusher channels using the private- or presence- prefix
 * will use this route to authenticate subscriptions
 */

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "POST") return res.status(405).end()

    const session = await getSession({req})
    if(!session) return res.status(403).json({msg:"Unauthorized"})

    try {
        const { socket_id: socketId, channel_name: channel } = req.body
        const authRes = pusher.authorizeChannel(socketId, channel)
        if (channel.includes("inbox=")) {
            const id = channel.split("inbox=")[1]
            if (id !== session.uid) return res.status(403).json({msg:"Unauthorized"})
        }
        res.send(authRes)
    } catch (e) {
        return res.status(400).json({ message: `${e}` })
    }
}
