import { useSession } from 'next-auth/react'
import { AiOutlineShareAlt, AiOutlineLike } from 'react-icons/ai'
import { IPost } from './post/Post'

import { useState } from 'react'

import Image from 'next/image'

import axios from 'axios'
import { IUser, useUsers } from '../context/UsersContext'
import { useUserDropdown } from '../context/UserDropdownContext'
import { useMouse } from '../context/MouseContext'
import { useRouter } from 'next/router'

export default function User({
  post,
  userData,
  includeLikesAndShares = true,
  reverse = false,
  large = false,
  date = undefined,
}: {
  post?: IPost
  userData: IUser
  includeLikesAndShares?: boolean
  reverse?: boolean
  large?: boolean
  date?: Date
}) {
  const [clickedShared, setClickedShared] = useState(false)
  const [clickedLiked, setClickedLiked] = useState(false)

  const { dispatch: userDropdownDispatch } = useUserDropdown()
  const { push } = useRouter()
  const mousePos = useMouse()

  const share = async () => {
    setClickedShared(!clickedShared)
    try {
      await axios({
        method: 'POST',
        data: { postId: post?.id },
        url: '/api/post/share',
      })
    } catch (e) {
      console.error(e)
    }
  }
  const like = async () => {
    setClickedLiked(!clickedLiked)
    try {
      await axios({
        method: 'POST',
        data: { postId: post?.id },
        url: '/api/post/like',
      })
    } catch (e) {
      console.error(e)
    }
  }

  const { data: session } = useSession()

  return (
    <div
      className={`${
        reverse ? 'flex flex-row-reverse' : 'flex'
      } gap-1 items-center min-w-max`}
    >
      {userData && (
        <>
          {includeLikesAndShares && post && (
            <div className="flex flex-col text-xs items-center justify-center">
              <div className="flex items-center">
                <AiOutlineShareAlt
                  onClick={() => share()}
                  style={{ strokeWidth: '2px' }}
                  className="text-black dark:text-white w-4 h-4 drop-shadow cursor-pointer"
                />
                {post?.shares.length +
                  (clickedShared && session
                    ? post?.shares.find(
                        (share: any) => share.userId === String(session?.uid),
                      )
                      ? -1
                      : 1
                    : 0)}
              </div>
              <div className="flex items-center">
                <AiOutlineLike
                  onClick={() => like()}
                  style={{ strokeWidth: '2px' }}
                  className="text-black dark:text-white w-4 h-4 drop-shadow cursor-pointer"
                />
                {post?.likes.length +
                  (clickedLiked && session
                    ? post?.likes.find(
                        (like: any) => like.userId === String(session?.uid),
                      )
                      ? -1
                      : 1
                    : 0)}
              </div>
            </div>
          )}
          <div
            onClick={() => {
              if (!session || userData.id === session.uid) {
                push(`/profile/${userData.id}`)
                return
              }
              userDropdownDispatch({
                showDropdown: true,
                subjectUserId: userData.id,
                dropdownPos: mousePos,
              })
            }}
            className={`bg-stone-500 ${
              large ? 'h-10 w-10' : 'h-7 w-7'
            } cursor-pointer overflow-hidden shadow rounded-full relative`}
          >
            <Image layout="fill" src={userData.image} />
          </div>
          <span style={{lineHeight:"1"}} className={`${large ? 'text-lg font-bold pl-1' : 'text-xs'}`}>
            {post ? `by ${userData.name}` : userData.name}
            {<div style={{lineHeight:"1"}} className='text-xs font-normal'>
            {date && `created ${date?.toDateString()}`}
            </div>}
          </span>
        </>
      )}
    </div>
  )
}
