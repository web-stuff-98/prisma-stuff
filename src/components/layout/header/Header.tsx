import { useSession } from "next-auth/react"

export default function Header() {
    const { data: session } = useSession()

    return (
        <div className="w-full relative sm:bg-neutral-900 dark:sm:bg-zinc-900 dark:sm:border-b dark:sm:border-zinc-800 dark:sm:border-dashed sm:text-white font-bold sm:pl-3 text-3xl flex items-center justify-center sm:justify-start sm:text-left md:text-center md:justify-center h-16 bg-white">
            <div style={{ lineHeight: "1", filter: "drop-shadow(0px 2px 2px black)" }} className="relative text-3xl">
                Prisma-stuff
                <br />
                <div className="text-xs font-normal">
                    Static blog and chat using Prisma & Tailwind
                </div>
                <img style={{ width: "6rem", height: "6rem", position: "absolute", left: "calc(50% - 3rem)", top: "calc(50% - 3rem)", filter: "opacity(0.333)" }} className="sm:hidden md:block" src="/prisma.png" />
            </div>
            {session && <div className="absolute w-full font-normal sm:text-zinc-500 h-full text-xs py-1 flex items-start justify-end container">
                {session?.user.email}
            </div>}
        </div>
    )
}