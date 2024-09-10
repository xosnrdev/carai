import type { TogglePayload } from '@/redux/app/index.types'

import { useDispatch } from 'react-redux'

import { onIsOpen } from '@/redux/app/slice'
import {
    type AppDispatch,
    type RootState,
    useGlobalSelector,
} from '@/redux/store'

const useAppContext = () => {
    const dispatch = useDispatch<AppDispatch>()
    const isOpen = useGlobalSelector((state: RootState) => state.app.isOpen)
    const setIsOpen = (payload: TogglePayload) => dispatch(onIsOpen(payload))

    return { isOpen, setIsOpen }
}

export default useAppContext
