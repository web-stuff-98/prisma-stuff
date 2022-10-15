import { useState, useEffect, useContext, createContext } from 'react'
import type { ReactNode } from 'react'

import { usePusher } from './PusherContext'
import { useSession } from 'next-auth/react'
import axios, { AxiosError } from 'axios'
import { useUsers } from './UsersContext'

export interface IMessage {
  message: string
  createdAt: Date
  senderId: string
  id: string
  receiverRead: boolean
}

const MessengerContext = createContext<
  | {
      messages: IMessage[]
      subject: string
      setSubject: (to: string) => void
      messengerHeading: string
      notifications: number
      setNotifications: (to: number) => void
    }
  | any
>(undefined)

export const MessengerProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<IMessage[]>([])
  const [notifications, setNotifications] = useState(0)
  const [subject, setSubjectState] = useState('')
  const [messengerHeading, setMessengerHeading] = useState('hello')

  const setSubject = (to: string) => {
    setSubjectState(to)
    axios({
      method: 'POST',
      url: `/api/pusher/message?readByUserId=${to}`,
    }).catch((e) => {
      console.error(e)
    }).then(() => {
      setNotifications(messages.length - messages.filter((msg:any) => msg.senderId === to).length)
    })
  }

  const { pusher } = usePusher()
  const { data: session } = useSession()
  const { cacheProfileDataForUser } = useUsers()

  const getInboxMessages = async () => {
    try {
      const axres = await axios({
        method: 'GET',
        url: '/api/pusher/message',
      })
      const data = axres.data.map((msg: any) => ({
        ...msg,
        createdAt: new Date(msg.createdAt),
      }))
      setMessages(data)
      let uids: string[] = []
      axres.data.forEach((msg: any) => {
        if (!uids.includes(msg.senderId)) uids.push(msg.senderId)
      })
      uids.forEach((uid: string) => cacheProfileDataForUser(uid))
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    if (!pusher) return
    if (session) {
      getInboxMessages()
      const channel = pusher.subscribe(`inbox=${session.uid}`)
      channel.bind('message-added', (data: any) => {
        setMessages((old) => {
          return [
            ...old,
            {
              ...data,
              createdAt: new Date(data.createdAt),
            },
          ]
        })
        if(subject && subject === data.senderId) {
          setNotifications(notifications+1)
        }
        cacheProfileDataForUser(data.senderId)
      })
      return () => pusher.unsubscribe(`inbox=${session.uid}`)
    }
  }, [pusher, session])

  return (
    <MessengerContext.Provider
      value={{
        messages,
        subject,
        setSubject,
        messengerHeading,
        notifications,
        setNotifications,
      }}
    >
      {children}
    </MessengerContext.Provider>
  )
}

export const useMessenger = () => useContext(MessengerContext)
