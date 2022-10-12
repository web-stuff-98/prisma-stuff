
import { ReactNode } from "react"
import { useModal } from "../../context/ModalContext"
import Chat from "../modal/Chat"
import Header from "./header/Header"
import Nav from "./nav/Nav"

export default function Layout({ children }: { children: ReactNode }) {
    const { state, dispatch } = useModal()

    return (
        <div className='w-full h-screen font-serif'>
            <div className="fixed top z-50 w-full">
                <Header />
                <Nav />
            </div>
            <main className="container mx-auto flex flex-col pt-28">
                {children}
            </main>
            {/* Modal */}
            {<div style={{ background: "rgba(0, 0, 0, 0.5)", left:"0", top:"0" }} className="z-50 flex justify-center items-center w-screen h-screen fixed">
                <Chat />
            </div>}
        </div>
    )
}