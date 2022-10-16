import { useSession } from 'next-auth/react'
import { useDarkMode } from '../../pages/_app'

export default function Header() {
  const { data: session } = useSession()
  const { darkMode } = useDarkMode()

  return (
    <header className="w-full relative sm:text-white md:text-black md:bg-white text-black md:border-b border-dashed sm:bg-neutral-900 dark:sm:bg-neutral-900 dark:sm:border-b dark:sm:border-zinc-800 dark:sm:border-dashed dark:text-white font-bold sm:pl-3 text-3xl flex items-center dark:md:bg-zinc-900 sm:justify-start sm:text-left md:text-center md:justify-center h-16">
      <div
        style={{ lineHeight: '0.866' }}
        className="relative md:text-2xl sm:text-xl font-ArchivoBlack"
      >
        Prisma-stuff
        <br />
        <div style={{lineHeight:"1"}} className="text-xs font-Archivo">
          Blog & chat using Next, Prisma, Tailwind & Redis
        </div>
        <img
          style={{
            width: '6rem',
            height: '6rem',
            position: 'absolute',
            left: 'calc(50% - 3rem)',
            top: 'calc(50% - 3rem)',
            ...(darkMode ? {filter:"invert(1) opacity(0.35)"} : {})
          }}
          className="sm:hidden md:block headerImage"
          src="/prisma.png"
        />
      </div>
      {session && (
        <div style={{filter:"opacity(0.5)"}} className="absolute w-full sm:text-white md:text-black dark:text-white text-black h-full text-xs py-1 px-4 md:px-2 flex items-start justify-end md:container">
          {session?.user.email}
        </div>
      )}
    </header>
  )
}
