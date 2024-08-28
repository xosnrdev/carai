import { useDispatch } from 'react-redux'

import { type IsOpenPayload, onIsOpen } from '@/redux/app/slice'
import {
    useGlobalSelector,
    type AppDispatch,
    type RootState,
} from '@/redux/store'

const useAppContext = () => {
    const dispatch = useDispatch<AppDispatch>()
    const isOpen = useGlobalSelector((state: RootState) => state.app.isOpen)
    const setIsOpen = (payload: IsOpenPayload) => dispatch(onIsOpen(payload))

    return { isOpen, setIsOpen }
}

export default useAppContext
