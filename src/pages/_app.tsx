import '../../styles/globals.css'
import { SessionProvider } from 'next-auth/react'
import { AppProps } from 'next/app'
import Layout from '../components/layout/Layout'

import 'tailwindcss/tailwind.css'

import { Session } from 'next-auth'
import PusherProvider from '../context/PusherContext'
import UsersProvider from '../context/UsersContext'
import { ModalProvider } from '../context/ModalContext'
import { FilterProvider } from '../context/FilterContext'
import { UserDropdownProvider } from '../context/UserDropdownContext'
import { MouseProvider } from '../context/MouseContext'
import { MessengerProvider } from '../context/MessengerContext'

import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import { AuthGuard } from '../utils/authGuard'

interface IDarkModeCtx {
  darkMode: boolean
  setDarkMode: (to: boolean) => void
}

const darkModeCtxDefaultValue: IDarkModeCtx = {
  darkMode: false,
  setDarkMode: () => {},
}

const DarkModeCtx = createContext<IDarkModeCtx>(darkModeCtxDefaultValue)

export const useDarkMode = () => useContext(DarkModeCtx)

function DarkModeProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useState(false)

  return (
    <DarkModeCtx.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </DarkModeCtx.Provider>
  )
}

const App = ({
  Component,
  pageProps,
}: AppProps<{
  session: Session
}>) => {
  return (
    <SessionProvider session={pageProps.session}>
      <MouseProvider>
        <UsersProvider>
          <PusherProvider>
            <ModalProvider>
              <MessengerProvider>
                <UserDropdownProvider>
                  <FilterProvider>
                    <DarkModeProvider>
                      <Layout>
                        {
                          //@ts-expect-error
                          Component.requiresAuth ? (
                            <AuthGuard>
                              <Component {...pageProps} />
                            </AuthGuard>
                          ) : (
                            <Component {...pageProps} />
                          )
                        }
                      </Layout>
                    </DarkModeProvider>
                  </FilterProvider>
                </UserDropdownProvider>
              </MessengerProvider>
            </ModalProvider>
          </PusherProvider>
        </UsersProvider>
      </MouseProvider>
    </SessionProvider>
  )
}

export default App
