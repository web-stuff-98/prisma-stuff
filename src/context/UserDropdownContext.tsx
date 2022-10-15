import { useContext, createContext, useReducer, ReactNode } from 'react'
import { IPosition } from '../interfaces/GeneralInterfaces'

const initialState = {
  subjectUserId: '',
  showDropdown: false,
  dropdownPos: { left: 0, top: 0 },
}

type State = {
  subjectUserId: string
  showDropdown: boolean
  dropdownPos: IPosition
}

type Dispatch = (action: Partial<State>) => void

const userDropdownReducer = (state: State, action: Partial<State>) => ({
  ...state,
  ...action,
})

const UserDropdownContext = createContext<
  | {
      state: State
      dispatch: Dispatch
    }
  | any
>(undefined)

export const UserDropdownProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(userDropdownReducer, initialState)

  return (
    <UserDropdownContext.Provider value={{ state, dispatch }}>
      {children}
    </UserDropdownContext.Provider>
  )
}

export const useUserDropdown = () => useContext(UserDropdownContext)
