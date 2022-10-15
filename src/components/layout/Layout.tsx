import { useRouter } from 'next/router'
import { useRef, useEffect } from 'react'
import type { ReactNode } from 'react'
import { useFilter } from '../../context/FilterContext'
import Header from './Header'
import Nav from './Nav'

import { BsChevronLeft, BsChevronRight } from 'react-icons/bs'
import { AiOutlineClose } from 'react-icons/ai'

import Messenger from '../modal/Messenger'
import { EModalType, useModal } from '../../context/ModalContext'
import UserDropdown from '../userDropdown/UserDropdown'
import { useUserDropdown } from '../../context/UserDropdownContext'
import Settings from '../modal/Settings'
import { useMessenger } from '../../context/MessengerContext'
import { IUser, useUsers } from '../../context/UsersContext'
import { useDarkMode } from '../../pages/_app'

export default function Layout({ children }: { children: ReactNode }) {
  const {
    searchTags,
    autoAddRemoveSearchTag,
    maxPage,
    pageCount,
    fullCount,
  } = useFilter()
  const { state: mState, dispatch: mDispatch } = useModal()
  const { pathname, query, push } = useRouter()
  const { state: userDropdownState } = useUserDropdown()
  const { subject } = useMessenger()
  const { findUserData } = useUsers()
  const { darkMode } = useDarkMode()

  useEffect(() => {
    if (document.documentElement) {
      document.documentElement.classList.toggle('dark')
    }
  }, [darkMode])

  const prevPage = () => {
    const { term, tags } = query
    const preserveQuery = `${term ? `?term=${term}` : ''}${
      tags ? `${term ? '&' : '?'}tags=${tags}` : ''
    }`
    push(`/blog/page/${Math.max(Number(query.page) - 1, 1)}${preserveQuery}`)
  }
  const nextPage = () => {
    const { term, tags } = query
    const preserveQuery = `${term ? `?term=${term}` : ''}${
      tags ? `${term ? '&' : '?'}tags=${tags}` : ''
    }`
    push(
      `/blog/page/${Math.min(Number(query.page) + 1, maxPage)}${preserveQuery}`,
    )
  }

  const getConverseeName = (u: IUser) => (u ? u.name : '')

  return (
    <div className="w-full h-screen font-Archivo">
      <div className="w-full h-full">
        <div className="fixed top z-50 w-full shadow dark:shadow-none">
          <Header />
          <Nav />
        </div>
        <main
          className={
            'md:container mx-auto relative flex flex-col pt-20 ' +
            (pathname.includes('/blog/page/') ? ' pb-12' : '')
          }
        >
          {searchTags.length > 0 && pathname.includes('/blog/page/') && (
            <div className="flex gap-3 p-6 pb-0 mx-auto">
              {searchTags.map((tag: string) => (
                <div
                  onClick={() => autoAddRemoveSearchTag(tag)}
                  className="border text-xs font-bold cursor-pointer bg-indigo-800 px-2 rounded border-black dark:border-zinc-500 flex-wrap dark:hover:bg-indigo-600 text-white shadow flex items-center shadow-md"
                >
                  {tag}
                </div>
              ))}
            </div>
          )}
          {children}
        </main>
        {userDropdownState.showDropdown && <UserDropdown />}
        {/* Modal */}
        {mState.showModal && (
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.5)',
              left: '0',
              top: '0',
              backdropFilter: 'blur(1px)',
            }}
            className="z-50 flex justify-center items-center w-screen h-screen fixed"
          >
            {/* Modal container */}
            <div className="container flex flex-col h-80 w-60 rounded shadow-xl bg-white overflow-hidden dark:bg-neutral-900 border border-black dark:border-zinc-700 absolute">
              <div className="w-full bg-zinc-100 dark:bg-neutral-800 dark:outline-zinc-700 outline items-center outline-1 flex justify-end">
                <div className="grow px-1 font-bold text-xs">
                  {subject ? (
                    <>
                      Conversation with{' '}
                      {getConverseeName(findUserData(subject))}
                    </>
                  ) : (
                    <>
                      {mState.modalType === EModalType.Settings
                        ? 'Settings'
                        : 'Conversations'}
                    </>
                  )}
                </div>
                <div
                  onClick={() => mDispatch({ showModal: false })}
                  className="cursor-pointer w-4 h-4 flex justify-center items-center"
                >
                  <AiOutlineClose className="w-6 h-6 text-black dark:text-white" />
                </div>
              </div>
              {
                {
                  [EModalType.Messages]: <Messenger />,
                  [EModalType.Settings]: <Settings />,
                }[mState.modalType]
              }
            </div>
          </div>
        )}
        {pathname.includes('/blog/page') && (
          <div
            style={{ bottom: '0' }}
            className="fixed flex items-center justify-center bg-neutral-900 dark:bg-neutral-900 border-t border-black dark:border-zinc-800 w-screen h-14"
          >
            <BsChevronLeft
              onClick={() => prevPage()}
              className="text-white cursor-pointer text-3xl"
            />
            <div className="flex text-white flex-col items-center justify-center">
              <div style={{ lineHeight: '1' }} className="text-2xl">
                {query.page}/{Math.ceil(fullCount / 20)}
              </div>
              <div style={{ lineHeight: '1' }}>
                {pageCount}/{fullCount}
              </div>
            </div>
            <BsChevronRight
              onClick={() => nextPage()}
              className="text-white cursor-pointer text-3xl"
            />
          </div>
        )}
      </div>
    </div>
  )
}
