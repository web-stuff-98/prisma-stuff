
import { ReactNode } from "react"
import Nav from "./nav/Nav"

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <div className='w-full h-screen'>
            <Nav />
            <main className="container mx-auto flex flex-col pt-6">
                {children}
            </main>
        </div>
    )
}