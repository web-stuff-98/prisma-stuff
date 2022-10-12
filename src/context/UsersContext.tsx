import { useContext, createContext, useState, useCallback } from "react"
import type { ReactNode } from "react"
import axios, { AxiosError } from "axios"

export interface IUser {
    name: string,
    image: string,
    id: string
}

const UsersContext = createContext<
    {
        findUserData: (uid: string) => IUser,
        cacheProfileDataForUser: (uid: string, force?: boolean) => void,
    } | any
>(undefined)

export default function UsersProvider({ children }: { children: ReactNode }) {
    const [users, setUsers] = useState<IUser[]>([])

    const findUserData = useCallback((uid: string) => users.find((u: IUser) => u.id === uid), [users])

    const cacheProfileDataForUser = async (uid: string, force?: boolean) => {
        try {
            if (users.find((u: IUser) => u.id === uid) && !force) return
            const axres = await axios({
                method: "GET",
                url: `/api/user?uid=${uid}`,
            })
            console.log(`USER DATA : ` + JSON.stringify(axres.data))
            setUsers([...users, axres.data])
        } catch (e: AxiosError | any) {
            console.error(e)
        }
    }

    return (
        <UsersContext.Provider value={{ findUserData, cacheProfileDataForUser }}>
            {children}
        </UsersContext.Provider>
    )
}

export const useUsers = () => useContext(UsersContext)