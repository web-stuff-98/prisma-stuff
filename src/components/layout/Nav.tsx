import Link from "next/link"
import { signIn, signOut, useSession } from "next-auth/react"

import { useRef, useState } from "react"

import { BiSearch } from "react-icons/bi"
import { IoChatboxSharp } from "react-icons/io5"
import { CgDarkMode, CgProfile } from "react-icons/cg"
import { AiOutlineMenu } from "react-icons/ai"
import { FiSettings } from "react-icons/fi"

import { useModal } from "../../context/ModalContext"

import { EModalType } from "../../context/ModalContext"
import { useDarkMode } from "../../pages/_app"

export default function Nav() {
    const { data: session, status } = useSession()
    const { dispatch: mDispatch } = useModal()
    const { darkMode, setDarkMode } = useDarkMode()

    const [searchOpen, setSearchOpen] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const navlinksRef = useRef<HTMLDivElement>(null)
    const navRef = useRef<HTMLDivElement>(null)
    const navInnerRef = useRef<HTMLDivElement>(null)
    const menuIconRef = useRef<HTMLDivElement>(null)
    const searchRef = useRef<HTMLDivElement>(null)
    const darkModeRef = useRef<HTMLDivElement>(null)
    const profileRef = useRef<HTMLDivElement>(null)
    const chatRef = useRef<HTMLDivElement>(null)
    const settingsRef = useRef<HTMLDivElement>(null)
    return (
        <nav ref={navRef} style={{ transition: "height 100ms linear, padding 100ms linear" }} className="font-black px-1 h-6 md:px-2 flex sm:w-full sm:pl-0.5 sm:pr-0.5 sm:bg-neutral-900 dark:sm:bg-neutral-900 md:bg-white dark:md:bg-neutral-800 dark:md:border-b dark:sm:border-b dark:border-zinc-800 h-full">
            <div ref={navInnerRef} className="flex justify-between items-center h-full w-full md:container mx-auto my-auto ">
                <div className={mobileMenuOpen ? "flex flex-col gap-6 items-start" : "flex items-center"}>
                    {/* Navlinks / Hamburger Icon */}
                    <div ref={navlinksRef} className="gap-6 flex my-auto sm:hidden sm:flex-col md:flex md:flex-row md:text-md md:text-black sm:text-white dark:md:text-white">
                        <Link href="/about">About</Link>
                        <Link href="/blog/page/1">Blog</Link>
                        <Link href="/editor">Editor</Link>
                        {status === "unauthenticated" && <Link href="/api/auth/signin">Login</Link>}
                        {status === "authenticated" && <div onClick={() => signOut()} className="cursor-pointer">Logout</div>}
                    </div>
                    <div ref={menuIconRef}>
                        <AiOutlineMenu onClick={() => {
                            navlinksRef.current?.classList.toggle('sm:hidden')
                            navRef.current?.classList.toggle('sm:h-64')
                            navRef.current?.classList.toggle('sm:pl-0.5')
                            navRef.current?.classList.toggle('sm:pl-4')
                            navInnerRef.current?.classList.toggle('items-center')
                            navInnerRef.current?.classList.toggle('items-end')
                            menuIconRef.current?.classList.toggle('mb-4')
                            searchRef.current?.classList.toggle('sm:hidden')
                            darkModeRef.current?.classList.toggle('sm:hidden')
                            settingsRef.current?.classList.toggle('sm:hidden')
                            chatRef.current?.classList.toggle('sm:hidden')
                            if (profileRef.current)
                                profileRef.current?.classList.toggle('sm:hidden')
                            setMobileMenuOpen(!mobileMenuOpen)
                        }} style={{ transition: "margin 100ms linear" }} className="text-white cursor-pointer sm:block md:hidden h-4 w-4" />
                    </div>
                </div>
                <div className="my-auto drop-shadow-lg flex items-center gap-0.5 justify-center">
                    <div onClick={() => setDarkMode(!darkMode)} ref={darkModeRef} className="flex justify-center items-center bg-zinc-700 rounded cursor-pointer">
                        <CgDarkMode className="text-white w-5 h-full p-0.5 drop-shadow-md" />
                    </div>
                    {session && <Link href={`/profile/${session?.uid}`}>
                        <div ref={profileRef} className="flex justify-center items-center bg-zinc-700 rounded cursor-pointer">
                            <CgProfile className="text-white w-5 h-full p-0.5 drop-shadow-md" />
                        </div>
                    </Link>}
                    {session &&
                        <div onClick={() => mDispatch({showModal:true, modalType:EModalType.Settings})} ref={settingsRef} className="flex justify-center items-center bg-zinc-700 rounded cursor-pointer">
                            <FiSettings className="text-white w-5 h-full p-0.5 drop-shadow-md" />
                        </div>}
                    <div ref={chatRef} onClick={() => mDispatch({ showModal: true, modalType: EModalType.Messages })} className="flex justify-center items-center bg-amber-700 rounded cursor-pointer">
                        <IoChatboxSharp className="text-white w-5 h-full p-0.5 drop-shadow-md" />
                    </div>
                    <div ref={searchRef} onClick={() => { if (!searchOpen) { setSearchOpen(true) } }} className={"bg-amber-700 sm:flex flex items-center cursor-pointer rounded " + (searchOpen && " pr-2")}>
                        <BiSearch onClick={() => { if (searchOpen) { setSearchOpen(false) } }} className="text-white drop-shadow-md w-5 cursor-pointer h-full p-0.5" />
                        {searchOpen && <input autoFocus type="text" className="bg-transparent focus:outline-none text-xs border-b drop-shadow-md h-full text-white border-white" />}
                    </div>
                </div>
            </div>
        </nav>
    )
}