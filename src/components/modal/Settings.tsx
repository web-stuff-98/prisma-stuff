import Image from 'next/image'

import { useState, useEffect } from 'react'
import IResponseMessage from '../../interfaces/IResponseMessage'

import { IUser, useUsers } from '../../context/UsersContext'
import { signOut, useSession } from 'next-auth/react'
import axios, { AxiosError } from 'axios'

export default function Settings() {
  const { cacheProfileDataForUser, findUserData } = useUsers()
  const { data: session } = useSession()

  const [resMsg, setResMsg] = useState<IResponseMessage>({
    msg: '',
    err: false,
    pen: false,
  })

  useEffect(() => {
    cacheProfileDataForUser(session?.uid)
  }, [])

  const deleteAccount = async () => {
    try {
      setResMsg({msg:"Deleting account", err:false, pen:true})
      const axres = await axios({
        method: 'DELETE',
        url: '/api/user',
      })
      setResMsg({msg:axres.data.msg, err:false, pen:false})
      signOut()
    } catch (e:AxiosError | any) {
      e.response
        ? //@ts-ignore-error
          has(e.response, 'data')
          ? setResMsg({ msg: e.response.data.msg, err: true, pen: false })
          : setResMsg({ msg: `${e}`, pen: false, err: true })
        : setResMsg({ msg: `${e}`, pen: false, err: true })
    }
  }

  const renderProfile = (userData: IUser) => {
    return (
      <>
        {userData && (
          <>
            <div className="overflow-hidden mx-auto relative w-12 h-12 rounded-full">
              <Image
                src={userData.image}
                objectFit="cover"
                objectPosition="absolute"
                layout="fill"
              />
            </div>
            <div
              style={{ lineHeight: '1' }}
              className="mx-auto font-ArchivoBlack"
            >
              {userData.name}
            </div>
            <div style={{ lineHeight: '1' }} className="mx-auto text-xs pb-1">
              {userData.createdAt.toDateString()}
            </div>
          </>
        )}
      </>
    )
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex p-2 h-full flex-col gap-1 justify-center mt-1 items-center">
        {renderProfile(findUserData(session?.uid))}
          <button
            type="button"
            onClick={() => deleteAccount()}
            className="text-xs w-full text-white bg-rose-900 dark:border-zinc-300 shadow rounded-sm mt-1 py-1 border"
          >
            DELETE ACCOUNT
          </button>
        {resMsg.msg && <div className='text-md'>{resMsg.msg}</div>}
      </div>
    </div>
  )
}
