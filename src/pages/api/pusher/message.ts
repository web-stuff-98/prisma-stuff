import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import pusher from "../../../utils/pusher";

import { customRateLimit } from "../../../utils/redisRateLimit";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST" && req.method !== "GET")
    return res.status(405).end();

  const session = await getSession({ req });
  if (!session) return res.status(403).json({ msg: "Unauthorized" });

  const { message, uid } = req.body;
  const { readByUserId } = req.query;
  if (req.method === "POST" && !readByUserId)
    if (!message || message.trim() === "")
      return res.status(400).json({ msg: "Cannot submit an empty message" });

  try {
    if (req.method === "POST") {
      if (typeof readByUserId === "string") {
        await prisma.message.updateMany({
          where: { senderId: String(readByUserId) },
          data: { receiverRead: true },
        });
        const msgs: any[] = await prisma.message.findMany({
          where: { receiverId: session.uid },
        });
        let newNotifications = 0;
        msgs.forEach((msg: any) => {
          if (
            msg.senderId !== readByUserId &&
            msg.senderId !== session.uid &&
            !msg.receiverRead
          )
            newNotifications++;
        });
        return res
          .status(200)
          .json({ msgs: JSON.stringify(msgs), newNotifications });
      }
      try {
        await prisma.user.findUniqueOrThrow({ where: { id: uid } });
      } catch (e) {
        return res.status(400).json({ msg: "User does not exist" });
      }
      await pusher.trigger(`private-inbox=${uid}`, "message-added", {
        message,
        senderId: session.uid,
        createdAt: new Date().toISOString(),
      });
      await prisma.user.update({
        where: { id: uid },
        data: {
          receivedMessages: {
            create: {
              message,
              senderId: session.uid,
            },
          },
        },
      });
      return res.status(200).end();
    }
    if (req.method === "GET") {
      const q = await prisma.user.findUnique({
        where: { id: session.uid },
        select: {
          receivedMessages: true,
          sentMessages: true,
        },
      });
      return res
        .status(200)
        .json([
          ...(q?.receivedMessages ? q?.receivedMessages : []),
          ...(q?.sentMessages ? q?.sentMessages : []),
        ]);
    }
  } catch (e) {
    return res.status(400).json({ msg: `${e}` });
  }
}

export default customRateLimit(handler, {
  numReqs: 12,
  exp: 12,
  key: "message-requests",
});
