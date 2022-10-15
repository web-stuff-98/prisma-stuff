import { useSession } from 'next-auth/react'

export default function Header() {
  const { data: session } = useSession()

  return (
    <div className="w-full relative sm:text-white md:text-black md:bg-white text-black md:border-b border-dashed sm:bg-neutral-900 dark:sm:bg-neutral-900 dark:sm:border-b dark:sm:border-zinc-800 dark:sm:border-dashed dark:text-white font-bold sm:pl-3 text-3xl flex items-center dark:md:bg-neutral-900 sm:justify-start sm:text-left md:text-center md:justify-center h-16 bg-white">
      <div
        style={{ lineHeight: '1' }}
        className="relative md:text-3xl sm:text-2xl font-ArchivoBlack"
      >
        Prisma-stuff
        <br />
        <div className="text-xs font-Archivo">
          Blog & chat using Prisma, Tailwind and Redis
        </div>
        <img
          style={{
            width: '6rem',
            height: '6rem',
            position: 'absolute',
            left: 'calc(50% - 3rem)',
            top: 'calc(50% - 3rem)',
          }}
          className="sm:hidden md:block headerImage dark:headerImageDarkMode"
          src="/prisma.png"
        />
      </div>
      {session && (
        <div className="absolute w-full sm:text-white md:text-black dark:text-white text-black h-full text-xs py-1 flex items-start justify-end md:container">
          {session?.user.email}
        </div>
      )}
    </div>
  )
}
