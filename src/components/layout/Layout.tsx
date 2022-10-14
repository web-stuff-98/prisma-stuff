
import { useRouter } from "next/router"
import { ReactNode } from "react"
import { useFilter } from "../../context/FilterContext"
import Header from "./header/Header"
import Nav from "./nav/Nav"

import { BsChevronLeft, BsChevronRight } from "react-icons/bs"
import { AiOutlineClose } from "react-icons/ai"

import Messenger from "../modal/Messenger"
import { EModalType, useModal } from "../../context/ModalContext"
import UserDropdown from "../userDropdown/UserDropdown"
import { useUserDropdown } from "../../context/UserDropdownContext"
import Settings from "../modal/Settings"

export default function Layout({ children }: { children: ReactNode }) {
    const { searchTags, autoAddRemoveSearchTag, maxPage, pageCount, fullCount } = useFilter()
    const { state: mState, dispatch: mDispatch } = useModal()
    const { pathname, query, push } = useRouter()
    const { state: userDropdownState } = useUserDropdown()

    const prevPage = () => {
        const { term, tags } = query
        const preserveQuery = `${term ? `?term=${term}` : ""}${tags ? `${term ? "&" : "?"}tags=${tags}` : ""}`
        push(`/blog/page/${Math.max(Number(query.page) - 1, 1)}${preserveQuery}`)
    }
    const nextPage = () => {
        const { term, tags } = query
        const preserveQuery = `${term ? `?term=${term}` : ""}${tags ? `${term ? "&" : "?"}tags=${tags}` : ""}`
        push(`/blog/page/${Math.min(Number(query.page) + 1, maxPage)}${preserveQuery}`)
    }

    return (
        <div className='w-full h-screen font-Archivo'>
            <div className="fixed top z-50 w-full shadow-lg">
                <Header />
                <Nav />
            </div>
            <main className={"md:container mx-auto relative flex flex-col pt-20 " + (pathname.includes("/blog/page/") ? " pb-12" : "")}>
                {searchTags.length > 0 && pathname.includes("/blog/page/") && <div className="flex gap-3 p-6 pb-0 mx-auto">
                    {searchTags.map((tag: string) => <div onClick={() => autoAddRemoveSearchTag(tag)} className="border cursor-pointer bg-stone-800 px-2 rounded border-black dark:bg-zinc-800 dark:border-zinc-500 dark:hover:bg-zinc-700 text-white shadow flex items-center shadow-md">{tag}</div>)}
                </div>}
                {children}
            </main>
            {userDropdownState.showDropdown && <UserDropdown />}
            {/* Modal */}
            {mState.showModal && <div style={{ background: "rgba(0, 0, 0, 0.5)", left: "0", top: "0", backdropFilter: "blur(1px)" }} className="z-50 flex justify-center items-center w-screen h-screen fixed">
                {/* Modal container */}
                <div className="container flex flex-col h-80 w-60 rounded shadow-xl bg-white overflow-hidden dark:bg-zinc-900 border border-black dark:border-zinc-700 absolute">
                    <div className="w-full bg-zinc-100 dark:bg-zinc-800 dark:outline-zinc-700 outline items-center outline-1 flex justify-end">
                        <div onClick={() => mDispatch({ showModal: false })} className="cursor-pointer w-4 h-4 flex justify-center items-center">
                            <AiOutlineClose className="w-6 h-6 text-black dark:text-white" />
                        </div>
                    </div>
                    {{
                        [EModalType.Messages]:<Messenger/>,
                        [EModalType.Settings]:<Settings/>
                    }[mState.modalType]}
                </div>
            </div>}
            {pathname.includes("/blog/page") && <div style={{ bottom: "0" }} className="fixed flex items-center justify-center bg-neutral-900 dark:sm:bg-zinc-900 border-t border-black dark:border-zinc-800 w-screen h-14">
                <BsChevronLeft onClick={() => prevPage()} className="text-white cursor-pointer text-3xl" />
                <div className="flex text-white flex-col items-center justify-center">
                    <div style={{ lineHeight: "1" }} className="text-2xl">{query.page}/{Math.ceil(fullCount / 20)}</div>
                    <div style={{ lineHeight: "1" }}>{pageCount}/{fullCount}</div>
                </div>
                <BsChevronRight onClick={() => nextPage()} className="text-white cursor-pointer text-3xl" />
            </div>}
        </div>
    )
}