import { IoMdSend } from 'react-icons/io'

import IResponseMessage from '../../interfaces/IResponseMessage'

import { useState, useEffect } from 'react'
import type { FormEvent, ChangeEvent } from 'react'

import axios, { AxiosError } from 'axios'
import { MdOutlineCancel } from 'react-icons/md'

import has from 'lodash/has'
import { useSession } from 'next-auth/react'
import { usePusher } from '../../context/PusherContext'
import Comment from './Comment'
import { useUsers } from '../../context/UsersContext'

export interface IComment {
  comment: string
  id: string
  userId: string
  replies?: number
  createdAt: string
}

export default function Comments({
  inComments,
  postId,
}: {
  inComments: IComment[]
  postId: string
}) {
  const [resMsg, setResMsg] = useState<IResponseMessage>({
    msg: '',
    err: false,
    pen: false,
  })

  const { data: session } = useSession()
  const { pusher } = usePusher()
  const { findUserData, cacheProfileDataForUser } = useUsers()

  const [comments, setComments] = useState<IComment[]>([])

  useEffect(() => {
    if (inComments) setComments(inComments)
  }, [inComments])

  useEffect(() => {
    if (!pusher) return
    const channel = pusher.subscribe(`post=${postId}`)
    channel.bind('comment-added', (data: any) => {
      setComments((old) => {
        let newCmts = old
        newCmts.push({ ...data, replies: 0 })
        return newCmts
      })
      cacheProfileDataForUser(data.userId)
    })
    channel.bind('comment-on-comment-added', (data: any) => {
      if (data.commentThreadId === commentThreadId && commentThreadId) {
        cacheProfileDataForUser(data.userId)
        setCommentThread((old) => [
          ...old,
          {
            comment: data.comment,
            userId: data.userId,
            id: data.id,
            createdAt: data.createdAt,
          },
        ])
      }
      setComments((old: any) => {
        const matchingComment = old.find(
          (comment: IComment) => comment.id === data.commentThreadId,
        )
        return [
          ...old.filter(
            (comment: IComment) => comment.id !== data.commentThreadId,
          ),
          { ...matchingComment, replies: Number(matchingComment?.replies) + 1 },
        ].sort(
          (a: IComment, b: IComment) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        )
      })
    })
    /*channel.bind('comment-updated', (data: any) => {
      setComments((old: IComment[]) => {
        let newComments = old
        const i = old.findIndex((comment: IComment) => comment.id === data.id)
        if (i !== -1) newComments[i] = { ...old[i], ...data }
        return newComments
      })
    })
    channel.bind('comment-on-comment-updated', (data: any) => {
      if (data.commentThreadId === commentThreadId && commentThreadId)
        setCommentThread((old: IComment[]) => {
          let newComments = old
          const i = old.findIndex(
            (comment: IComment) => comment.id === data.commentThreadId,
          )
          if (i !== -1)
            newComments[i] = {
              comment: data.comment,
              userId: data.userId,
              id: data.id,
              createdAt: data.createdAt,
            }
          return newComments
        })
    })*/
    return () => pusher.unsubscribe(`post=${postId}`)
  }, [pusher])

  const handleCommentForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    comment()
  }
  const comment = async () => {
    try {
      setResMsg({ msg: '', err: false, pen: true })
      await axios({
        method: 'POST',
        url: '/api/post/comment',
        data: {
          comment: commentInput,
          postId,
          ...(commentThreadId ? { commentId: commentThreadId } : {}),
        },
      })
      setResMsg({ msg: '', err: false, pen: false })
    } catch (e: AxiosError | any) {
      e.response
        ? //@ts-ignore-error
          has(e.response, 'data')
          ? setResMsg({ msg: e.response.data.msg, err: true, pen: false })
          : setResMsg({ msg: `${e}`, pen: false, err: true })
        : setResMsg({ msg: `${e}`, pen: false, err: true })
    }
  }

  /* Comment replies thread */
  const [commentThreadId, setCommentThreadId] = useState('')
  const [commentThreadAuthorId, setCommentThreadAuthorId] = useState('')
  const [commentThread, setCommentThread] = useState<IComment[]>([])
  const getCommentThread = async () => {
    try {
      const axres = await axios({
        method: 'GET',
        url: `/api/post/comment?commentThreadId=${commentThreadId}`,
      })
      setCommentThread(axres.data)
    } catch (e: AxiosError | any) {
      e.response
        ? //@ts-ignore-error
          has(e.response, 'data')
          ? setResMsg({ msg: e.response.data.msg, err: true, pen: false })
          : setResMsg({ msg: `${e}`, pen: false, err: true })
        : setResMsg({ msg: `${e}`, pen: false, err: true })
    }
  }
  useEffect(() => {
    if (commentThreadId) getCommentThread()
  }, [commentThreadId])

  const [commentInput, setCommentInput] = useState('')
  return (
    <div className="w-full py-6">
      {commentThreadId && (
        <h4 className="mx-auto mt-6 text-center justify-center flex items-center gap-2">
          <MdOutlineCancel
            onClick={() => setCommentThreadId('')}
            className="text-2xl cursor-pointer"
          />
          Viewing replies to {findUserData(commentThreadAuthorId).name}&apos;s
          comment
        </h4>
      )}
      {(commentThreadId ? commentThread : comments).map((comment: any) => (
        <Comment
          key={comment.id}
          comment={comment}
          commentThreadId={commentThreadId}
          setCommentThreadId={setCommentThreadId}
          setCommentThreadAuthorId={setCommentThreadAuthorId}
          authorData={findUserData(comment.userId)}
        />
      ))}
      {/* comment input */}
      {session && (
        <form
          onSubmit={handleCommentForm}
          className="w-full flex h-20 items-center"
        >
          <input
            placeholder={commentThreadId ? 'Reply to comment' : 'Add comment'}
            value={commentInput}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setCommentInput(e.target.value)
            }
            type="text"
            className="w-full border-b border-black h-8 focus:outline-none bg-transparent dark:border-zinc-300"
          />
          <button type="submit" className="cursor-pointer">
            <IoMdSend className="w-6 h-6" />
          </button>
        </form>
      )}
    </div>
  )
}
