import type { AppDispatch } from '@/global/store'
import {
	addTab,
	closeAllTabs,
	removeTab,
	selectAllTabs,
	selectTabById,
	setActiveTab,
	switchTab,
	updateTab,
	useAppSelector,
	type AddTabPayload,
	type TabId,
	type UpdateTabPayload,
} from '@/global/tab/slice'
import { useMemo } from 'react'
import { useDispatch } from 'react-redux'

const useTabContext = () => {
	const dispatch = useDispatch<AppDispatch>()
	const tabs = useAppSelector(selectAllTabs)
	const activeTabId = useAppSelector((state) => state.tabs.activeTabId)
	const activeTab = useAppSelector((state) =>
		activeTabId ? selectTabById(state, activeTabId) : null
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
		}),
		[dispatch]
	)

	return {
		tabs,
		activeTabId,
		activeTab,
		isTabViewOnboarding,
		isTabViewEditor,
		...boundActions,
	}
}

export default useTabContext
