import { useSession } from "next-auth/react"

export default function Header() {
    const { data: session } = useSession()

    return (
        <div className="w-full relative sm:bg-slate-900 sm:text-white font-bold text-3xl shadow flex items-center justify-center h-20 bg-white">
            Prisma-stuff
            {session && <div className="absolute w-full h-full text-xs py-1 flex items-end justify-end container">
                {session?.user.email}
            </div>}
        </div>
    )
}