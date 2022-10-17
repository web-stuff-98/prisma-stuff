import { useState, useEffect, useContext, createContext } from 'react'
import type { ReactNode } from 'react'

import { usePusher } from './PusherContext'
import { useSession } from 'next-auth/react'
import axios, { AxiosError } from 'axios'
import { useUsers } from './UsersContext'
import { EModalType, useModal } from './ModalContext'

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
      notifications: number
      setNotifications: (to: number) => void
      addMessage: (msg: string) => void
      getUserUnreadMsgCount: (uid: string) => void
    }
  | any
>({
  messages: [],
  subject: '',
  setSubject: (to: string) => {},
  notifications: 0,
  setNotifications: (to: number) => {},
  addMessage: (msg: string) => {},
  getUserUnreadMsgCount: (uid: string) => {},
})

export const MessengerProvider = ({ children }: { children: ReactNode }) => {
  const { state: mState } = useModal()
  const [messages, setMessages] = useState<IMessage[]>([])
  const [notifications, setNotifications] = useState(0)
  const [subject, setSubjectState] = useState('')

  const setSubject = (to: string) => {
    setSubjectState(to)
    if (to)
      axios({
        method: 'POST',
        url: `/api/pusher/message?readByUserId=${to}`,
      })
        .catch((e) => {
          console.error(e)
        })
        .then((res: any) => {
          setNotifications(res.data.newNotifications)
          setMessages(
            JSON.parse(res.data.msgs).map((msg: any) => ({
              ...msg,
              createdAt: new Date(msg.createdAt),
            })),
          )
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
      const data = axres.data
        .sort((a: any, b: any) => {
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          )
        })
        .map((msg: any) => ({
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
    if (!mState.showModal) setSubject('')
  }, [mState.showModal])

  const addMessage = (msg: string) => {
    setMessages((old) => [
      ...old,
      {
        senderId: String(session?.uid),
        message: msg,
        createdAt: new Date(),
        receiverRead: true,
        id: msg + `${Date.now()}`,
      },
    ])
  }
  const getUserUnreadMsgCount = (uid: string) => {
    let count = 0
    for (let message of messages) {
      if (uid === message.senderId && !message.receiverRead) count++
    }
    return count
  }

  useEffect(() => {
    if (!pusher) return
    if (session) {
      getInboxMessages()
      const channel = pusher.subscribe(`private-inbox=${session.uid}`)
      channel.bind('message-added', (data: any) => {
        setMessages((old) => [
          ...old,
          { ...data, createdAt: new Date(data.createdAt) },
        ])
        if (
          !mState.showModal ||
          mState.modalType !== EModalType.Messages ||
          !subject ||
          subject !== data.senderId
        ) {
          setNotifications((old: number) => old + 1)
        }
        cacheProfileDataForUser(data.senderId)
      })
      return () => pusher.unsubscribe(`private-inbox=${session.uid}`)
    }
  }, [pusher, session])

  return (
    <MessengerContext.Provider
      value={{
        messages,
        subject,
        setSubject,
        notifications,
        setNotifications,
        addMessage,
        getUserUnreadMsgCount,
      }}
    >
      {children}
    </MessengerContext.Provider>
  )
}

export const useMessenger = () => useContext(MessengerContext)
