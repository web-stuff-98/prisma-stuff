import { MdSend } from 'react-icons/md'

import { useEffect, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import IResponseMessage from '../../interfaces/IResponseMessage'
import axios, { AxiosError } from 'axios'
import { IMessage, useMessenger } from '../../context/MessengerContext'

import has from 'lodash/has'
import Image from 'next/image'
import { IUser, useUsers } from '../../context/UsersContext'
import { useSession } from 'next-auth/react'

import { GiHamburgerMenu } from 'react-icons/gi'

export default function Messenger() {
  const { subject, setSubject, messages, addMessage } = useMessenger()
  const { findUserData } = useUsers()
  const { data: session } = useSession()

  const [subjectUsers, setSubjectUsers] = useState<string[]>([])
  useEffect(() => {
    if (!messages) return
    setSubjectUsers((old) => {
      let newSubjectUsers: string[] = []
      messages.forEach((msg: IMessage) => {
        if (
          !newSubjectUsers.includes(msg.senderId) &&
          msg.senderId !== session?.uid
        ) {
          newSubjectUsers.push(msg.senderId)
        }
      })
      return newSubjectUsers
    })
  }, [messages])
  const renderSubjectUser = (userData: IUser) => {
    return (
      <div
        onClick={() => setSubject(userData.id)}
        className="w-full cursor-pointer flex items-center gap-1 text-xs h-8 py-1 my-0.5 pl-1"
      >
        <div className="relative w-6 h-6 bg-stone-200 overflow-hidden border border-stone-300 justify-start rounded overflow-hidden">
          <Image
            src={userData.image}
            objectFit="cover"
            objectPosition="absolute"
            layout="fill"
          />
        </div>
        {userData.name}
      </div>
    )
  }

  const [resMsg, setResMsg] = useState<IResponseMessage>({
    msg: '',
    err: false,
    pen: false,
  })

  const [message, setMessage] = useState('')
  const handleMessageInput = (e: ChangeEvent<HTMLInputElement>) =>
    setMessage(e.target.value)
  const handleSubmitMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      await axios({
        method: 'POST',
        url: '/api/pusher/message',
        data: { message, uid: subject },
      })
      addMessage(message)
    } catch (e:AxiosError | any) {
      e.response
        ? //@ts-ignore-error
          has(e.response, 'data')
          ? setResMsg({ msg: e.response.data.msg, err: true, pen: false })
          : setResMsg({ msg: `${e}`, pen: false, err: true })
        : setResMsg({ msg: `${e}`, pen: false, err: true })
    }
  }

  return (
    <div className="w-full h-full flex flex-col">
      {subject ? (
        <>
          <div className="flex h-40 py-0.5 mt-0.5 flex-col grow w-full overflow-y-auto">
            {messages &&
              messages
                .filter(
                  (msg: IMessage) =>
                    msg.senderId === subject || msg.senderId === session?.uid,
                )
                .map((msg: IMessage) => (
                  <div
                    key={msg.id}
                    style={{ lineHeight: '1' }}
                    className="pl-1 py-1 gap-2 min-h-fit text-xs border-stone-300 flex justify-start items-center"
                  >
                    <div className="flex items-center justify-start gap-0.5">
                      <div
                        style={{ minWidth: '1.5rem', minHeight: '1.5rem' }}
                        className="relative bg-stone-200 border overflow-hidden border-stone-300 rounded"
                      >
                        {findUserData(msg.senderId) && (
                          <Image
                            layout="fill"
                            objectFit="cover"
                            objectPosition="absolute"
                            src={findUserData(msg.senderId).image}
                          />
                        )}
                      </div>
                      <div className="flex flex-col items-start text-xs justify-center">
                        <div
                          style={{ lineHeight: '0.866', fontSize: '0.7rem' }}
                        >
                          {msg.createdAt.getDay()}/{msg.createdAt.getMonth()}/
                          {`${msg.createdAt.getFullYear()}`.slice(2, 4)}
                        </div>
                        <div
                          style={{ lineHeight: '0.866', fontSize: '0.66rem' }}
                        >
                          {('0' + msg.createdAt.getHours()).slice(-2)}:
                          {('0' + msg.createdAt.getMinutes()).slice(-2)}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs">{msg.message}</div>
                  </div>
                ))}
          </div>
          <form
            onSubmit={handleSubmitMessage}
            className="flex border-t border-stone-100 dark:border-zinc-800 items-center p-1 pl-1.5 py-1.5 h-10 justify-center"
          >
            <input
              autoFocus
              type="text"
              value={message}
              onChange={handleMessageInput}
              className="w-full bg-transparent dark:border-zinc-100 text-xs h-full focus:outline-none border-b border-black grow"
            />
            <MdSend className="text-xl mx-1 cursor-pointer" />
            <GiHamburgerMenu
              onClick={() => setSubject('')}
              className="text-xl mx-1 cursor-pointer"
            />
          </form>
        </>
      ) : (
        <div className="w-full h-full flex flex-col">
          <div className="grow w-full">
            {subjectUsers.length > 0 ? (
              subjectUsers.map((uid: string) =>
                renderSubjectUser(findUserData(uid)),
              )
            ) : (
              <div className="p-4 text-center my-auto text-md font-bold">
                You either haven&apos;t started any conversations or received
                any messages, or the user you were in a conversation with
                deleted their account. Click on a user to send a message.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
