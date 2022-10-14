import { useContext, createContext, useReducer, ReactNode } from "react";

export enum EModalType {
    "Messages",
    "Settings"
}

const initialState = {
    modalType: EModalType.Messages,
    showModal:false
}

type State = {
    modalType: EModalType
    showModal: boolean
}

type Dispatch = (action: Partial<State>) => void

const modalReducer = (state:State, action:Partial<State>) => ({ ...state, ...action })

const ModalContext = createContext<
    {
        state: State,
        dispatch: Dispatch
    }
>({state: initialState, dispatch: () => {}})

export const ModalProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(modalReducer, initialState)

    return (
        <ModalContext.Provider value={{ state, dispatch }}>
            {children}
        </ModalContext.Provider>
    )
}

export const useModal = () => useContext(ModalContext)