
import { ReactNode } from "react"
import Header from "./header/Header"
import Nav from "./nav/Nav"

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <div className='w-full h-screen'>
            <div className="fixed top z-50 w-full">
            <Header/>
            <Nav />
            </div>
            <main className="container mx-auto flex flex-col pt-20">
                {children}
            </main>
        </div>
    )
}