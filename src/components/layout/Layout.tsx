
import { ReactNode } from "react"
import Header from "./header"
import Nav from "./nav/Nav"

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <div className='w-full h-screen'>
            <Header/>
            <Nav />
            <main className="container mx-auto flex flex-col pt-20">
                {children}
            </main>
        </div>
    )
}