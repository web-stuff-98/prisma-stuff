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
    <div
      style={{
        left: `${state.dropdownPos.left}px`,
        top: `${state.dropdownPos.top}px`,
        position: 'fixed',
      }}
      className="fixed z-50 flex gap-2 rounded shadow outline outline-1 dark:outline-zinc-800 flex-col p-2 bg-white dark:bg-neutral-900"
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
  )
}
