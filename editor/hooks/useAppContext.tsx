import { onCodeResponse, onResizePanelVisible } from '@/global/app/slice'
import type { AppDispatch, RootState } from '@/global/store'
import type { CodeResponse } from '@/lib/types/response'
import { useDispatch, useSelector } from 'react-redux'

const useAppContext = () => {
	const dispatch = useDispatch<AppDispatch>()
	const { resizePanelVisible, codeResponse } = useSelector(
		(state: RootState) => state.app
	)

	const setResizePanelVisible = (visible: boolean) => {
		dispatch(onResizePanelVisible(visible))
	}

	const setCodeResponse = (newcodeResponse: CodeResponse | null) => {
		dispatch(onCodeResponse(newcodeResponse))
	}

	return {
		resizePanelVisible,
		setResizePanelVisible,
		codeResponse,
		setCodeResponse,
	}
}

export default useAppContext
