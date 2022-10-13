import { useState, useEffect, useContext, createContext } from "react";
import type { ReactNode } from "react"

import { usePusher } from "./PusherContext";
import { useSession } from "next-auth/react";
import axios, { AxiosError } from "axios";
import { useUsers } from "./UsersContext";

export interface IMessage {
    message: string,
    createdAt: Date,
    senderId: string,
    id: string
}

const MessengerContext = createContext<
    {
        messages: IMessage[],
        subject: string,
        setSubject: (to: string) => void
    } | any
>(undefined)

export const MessengerProvider = ({ children }: { children: ReactNode }) => {
    const [messages, setMessages] = useState<IMessage[]>([])
    const [subject, setSubject] = useState('')

    const { pusher } = usePusher()
    const { data: session } = useSession()
    const { cacheProfileDataForUser } = useUsers()

    const getInboxMessages = async () => {
        try {
            const axres = await axios({
                method: "GET",
                url: "/api/pusher/message",
            })
            const data = axres.data.map((msg:any) => ({
                ...msg,
                createdAt: new Date(msg.createdAt)
            }))
            setMessages(data)
            let uids: string[] = []
            axres.data.forEach((msg: any) => {
                if (!uids.includes(msg.senderId))
                    uids.push(msg.senderId)
            })
            uids.forEach((uid: string) => cacheProfileDataForUser(uid))
        } catch (e: AxiosError | any) {
            console.error(e)
        }
    }

    useEffect(() => {
        if (!pusher) return
        if (session) {
            getInboxMessages()
            const channel = pusher.subscribe(`inbox=${session.uid}`)
            channel.bind('message-added', (data: any) => {
                setMessages(old => {
                    return [...old, {
                        ...data,
                        createdAt: new Date(data.createdAt)
                    }]
                })
                cacheProfileDataForUser(data.senderId)
            })
        }
    }, [pusher, session])

    return (
        <MessengerContext.Provider value={{ messages, subject, setSubject }}>
            {children}
        </MessengerContext.Provider>
    )
}

export const useMessenger = () => useContext(MessengerContext)