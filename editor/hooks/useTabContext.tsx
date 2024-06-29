import { useGlobalSelector, type AppDispatch } from '@/global/store'
import {
	addTab,
	closeAllTabs,
	removeTab,
	selectAllTabs,
	selectTabById,
	setActiveTab,
	setCodeResponse,
	setOnResize,
	switchTab,
	updateTab,
	type AddTabPayload,
	type CodeResponsePayload,
	type OnResizePayload,
	type TabId,
	type UpdateTabPayload,
} from '@/global/tab/slice'
import { useMemo } from 'react'
import { useDispatch } from 'react-redux'

const useTabContext = () => {
	const dispatch = useDispatch<AppDispatch>()
	const tabs = useGlobalSelector(selectAllTabs)
	const activeTabId = useGlobalSelector((state) => state.tabs.activeTabId)
	const activeTab = useGlobalSelector((state) =>
		activeTabId ? selectTabById(state, activeTabId) : null
	)
	const codeResponse = useGlobalSelector((state) =>
		activeTabId
			? state.tabs.entities[activeTabId].editorViewState?.codeResponse
			: null
	)

	const onResize = useGlobalSelector((state) =>
		activeTabId
			? state.tabs.entities[activeTabId].editorViewState?.onResize
			: null
	)

	const isMobileView = window.matchMedia('(max-width: 600px)').matches

	const boundActions = useMemo(
		() => ({
			addTab: (payload: AddTabPayload) => dispatch(addTab(payload)),
			removeTab: (tabId: TabId) => dispatch(removeTab(tabId)),
			updateTab: (payload: UpdateTabPayload) => dispatch(updateTab(payload)),
			setActiveTab: (tabId: TabId) => dispatch(setActiveTab(tabId)),
			switchTab: (direction: 'next' | 'previous') =>
				dispatch(switchTab(direction)),
			closeAllTabs: () => dispatch(closeAllTabs()),
			setCodeResponse: (payload: CodeResponsePayload) =>
				dispatch(setCodeResponse(payload)),
			setOnResize: (payload: OnResizePayload) => {
				dispatch(setOnResize(payload))
			},
		}),
		[dispatch]
	)

	return {
		tabs,
		onResize,
		activeTab,
		activeTabId,
		isMobileView,
		codeResponse,
		...boundActions,
	}
}

export default useTabContext
