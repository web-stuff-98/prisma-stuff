
import { ReactNode } from "react"
import Nav from "./header/nav/Nav"

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <div className='bg-gray-100 w-full h-screen'>
            <Nav />
            <main className="container flex flex-col">
            </main>
            {children}
        </div>
    )
}