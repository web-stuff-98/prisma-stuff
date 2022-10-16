import { useRouter } from 'next/router'
import { useMessenger } from '../../context/MessengerContext'
import { EModalType, useModal } from '../../context/ModalContext'
import { useUserDropdown } from '../../context/UserDropdownContext'

export default function UserDropdown() {
  const { state, dispatch } = useUserDropdown()
  const { state: mState, dispatch: mDispatch } = useModal()
  const { push } = useRouter()
  const { subject, setSubject } = useMessenger()

  return (
    <>
      <div
        style={{
          top: '0',
          left: '0',
          pointerEvents: state.showDropdown ? 'auto' : 'none',
          background: state.showDropdown ? 'black' : 'transparent',
          backdropFilter: state.showDropdown ? 'blur(4px)' : 'transparent',
          filter: state.showDropdown ? 'opacity(0.5)' : 'transparent',
        }}
        onClick={() => dispatch({ showDropdown: false })}
        className="z-50 fixed w-screen h-screen"
      />
      <div
        style={{
          left: `${state.dropdownPos.left}px`,
          top: `${state.dropdownPos.top}px`,
          position: 'fixed',
        }}
        className="fixed z-50 flex gap-2 rounded outline outline-1 dark:outline-zinc-600 flex-col p-2 bg-white dark:bg-zinc-800"
      >
        <button
          onClick={() => {
            setSubject(state.subjectUserId)
            mDispatch({ showModal: true, modalType: EModalType.Messages })
            dispatch({ showDropdown: false })
          }}
          type="button"
          className="text-xs cursor-pointer"
        >
          Direct message
        </button>
        <button
          onClick={() => {
            push(`/profile/${state.subjectUserId}`)
            dispatch({ showDropdown: false })
          }}
          type="button"
          className="text-xs cursor-pointer"
        >
          View profile
        </button>
      </div>
    </>
  )
}
