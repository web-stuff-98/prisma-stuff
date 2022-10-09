import Link from "next/link"
import { signIn, signOut, useSession } from "next-auth/react"

import { BiSearch } from "react-icons/bi"
import { useRef, useState } from "react"

import { AiOutlineMenu } from "react-icons/ai"

export default function Nav() {
    const { data: session, status } = useSession()

    const [searchOpen, setSearchOpen] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const navlinksRef = useRef<HTMLDivElement>(null)
    const navRef = useRef<HTMLDivElement>(null)
    const navInnerRef = useRef<HTMLDivElement>(null)
    const menuIconRef = useRef<HTMLDivElement>(null)
    const searchRef = useRef<HTMLDivElement>(null)
    return (
        <nav ref={navRef} style={{ transition: "height 100ms linear, padding 100ms linear", }} className="font-bold shadow md:h-6 flex sm:w-full sm:pl-1 md:bg-sky-900 h-full fixed top z-50 top-14">
            <div ref={navInnerRef} className="flex justify-between items-center h-full w-full md:container mx-auto my-auto ">
                <div className={mobileMenuOpen ? "flex flex-col gap-6 items-start" : "flex items-center"}>
                    {/* Navlinks / Hamburger Icon */}
                    <div ref={navlinksRef} className="gap-6 flex my-auto sm:hidden sm:flex-col md:flex md:flex-row md:text-md text-white">
                        <Link href="/about">About</Link>
                        <Link href="/">Blog</Link>
                        <Link href="/editor">Editor</Link>
                        {status === "unauthenticated" && <Link href="/api/auth/signin">Login</Link>}
                    </div>
                    <div ref={menuIconRef}>
                        <AiOutlineMenu onClick={() => {
                            navlinksRef.current?.classList.toggle('sm:hidden')
                            navRef.current?.classList.toggle('sm:h-96')
                            navRef.current?.classList.toggle('sm:pl-4')
                            navInnerRef.current?.classList.toggle('items-center')
                            navInnerRef.current?.classList.toggle('items-end')
                            menuIconRef.current?.classList.toggle('mb-4')
                            searchRef.current?.classList.toggle('sm:hidden')
                            setMobileMenuOpen(!mobileMenuOpen)
                        }} style={{ transition: "margin 100ms linear" }} className="text-white cursor-pointer sm:block md:hidden h-8 w-8" />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="text-xs text-white">{session && session?.user.email}</div>
                    <div ref={searchRef} onClick={() => { if (!searchOpen) { setSearchOpen(true) } }} className={"bg-amber-700 sm:flex flex items-center cursor-pointer" + (searchOpen && " pr-2")}>
                        <BiSearch onClick={() => { if (searchOpen) { setSearchOpen(false) } }} className="text-white sm:w-6 md:w-6 cursor-pointer h-full p-1" />
                        {searchOpen && <input autoFocus type="text" className="bg-transparent focus:outline-none text-xs border-b h-full text-white border-white" />}
                    </div>
                </div>
            </div>
        </nav>
    )
}