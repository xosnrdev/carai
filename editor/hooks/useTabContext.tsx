import type { AppDispatch } from '@/global/store'
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
	useTabSelector,
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
	const tabs = useTabSelector(selectAllTabs)
	const activeTabId = useTabSelector((state) => state.tabs.activeTabId)
	const activeTab = useTabSelector((state) =>
		activeTabId ? selectTabById(state, activeTabId) : null
	)
	const codeResponse = useTabSelector((state) =>
		activeTabId
			? state.tabs.entities[activeTabId].editorViewState?.codeResponse
			: null
	)
	const onResize = useTabSelector((state) =>
		activeTabId
			? state.tabs.entities[activeTabId].editorViewState?.onResize
			: null
	)

	const isTabViewOnboarding = activeTab && activeTab.id === 'welcome_tabview'
	const isTabViewEditor = activeTab && activeTab.id !== 'welcome_tabview'

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
		activeTab,
		activeTabId,
		codeResponse,
		...boundActions,
		isTabViewEditor,
		isTabViewOnboarding,
		onResize,
	}
}

export default useTabContext
