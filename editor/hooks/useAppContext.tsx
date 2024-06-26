import { onIsOpen } from '@/global/app/slice'
import {
	useGlobalSelector,
	type AppDispatch,
	type RootState,
} from '@/global/store'

import { useDispatch } from 'react-redux'

const useAppContext = () => {
	const dispatch = useDispatch<AppDispatch>()
	const isOpen = useGlobalSelector((state: RootState) => state.app.isOpen)
	const setIsOpen = (payload: boolean) => dispatch(onIsOpen(payload))

	return { isOpen, setIsOpen }
}

export default useAppContext
