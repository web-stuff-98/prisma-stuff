import Image from "next/image";

import { useState, useEffect } from "react"
import IResponseMessage from "../../interfaces/IResponseMessage";

import { IUser, useUsers } from "../../context/UsersContext";
import { useSession } from "next-auth/react";

export default function Settings() {
    const { cacheProfileDataForUser, findUserData } = useUsers()
    const { data:session } = useSession()

    const [resMsg, setResMsg] = useState<IResponseMessage>({ msg: "", err: false, pen: false })

    useEffect(() => {
        cacheProfileDataForUser(session?.uid)
    }, [])

    const renderProfile = (userData:IUser) => {
        return(
            <>
            {userData &&
                <div className="flex p-2 flex-col gap-1 justify-center m2-4 items-center">
                    <div className="overflow-hidden mx-auto relative w-12 h-12 rounded-full">
                        <Image src={userData.image} objectFit="cover" objectPosition="absolute" layout="fill"/>    
                    </div>
                    <div style={{lineHeight:"1"}} className="mx-auto font-ArchivoBlack">
                        {userData.name}
                    </div>
                    <div style={{lineHeight:"1"}} className="mx-auto text-xs pb-1">
                        {userData.createdAt.toDateString()}
                    </div>
                    <div className="flex flex-col items-center gap-0.5 w-full">
                        <label htmlFor="username" className="font-ArchivoBlack">Update username</label>
                        <div className="flex gap-1">
                            <input
                                name="username"
                                id="username"
                                className='p-1 dark:bg-transparent dark:border-zinc-700 focus:outline-none border w-full rounded-sm shadow-sm text-sm'
                            />
                            <button 
                                type="button"
                                className='bg-white w-16 text-xs w-full dark:bg-zinc-800 dark:border-zinc-700 shadow rounded-sm border'>
                                Update
                            </button>
                        </div>
                    </div>
                </div>}
            </>
        )
    }

    return (
        <div className="w-full h-full flex flex-col">
            {renderProfile(findUserData(session?.uid))}
        </div>
    )
}