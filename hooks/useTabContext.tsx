import type {
    AddTabPayload,
    CodeResponsePayload,
    ResizePanelPayload,
    TabId,
    UpdateTabPayload,
} from '@/types'

import { createSelector } from '@reduxjs/toolkit'
import { useMemo } from 'react'
import { useDispatch } from 'react-redux'

import {
    useGlobalSelector,
    type AppDispatch,
    type RootState,
} from '@/redux/store'
import {
    addTab,
    closeAllTabs,
    removeTab,
    selectAllTabs,
    selectTabById,
    setActiveTab,
    setCodeResponse,
    setResizePanel,
    switchTab,
    updateTab,
    DEFAULT_VIEW_STATE,
} from '@/redux/tab/slice'

const useTabContext = () => {
    const dispatch = useDispatch<AppDispatch>()

    const tabs = useGlobalSelector(selectAllTabs)
    const activeTabId = useGlobalSelector(
        (state) => state.tabs.activeTabId as TabId
    )

    const activeTab = useGlobalSelector((state) =>
        selectTabById(state, activeTabId)
    )

    const selectViewState = createSelector(
        (state: RootState) => state.tabs.entities[activeTabId]?.viewState,
        (viewState) => (viewState ? { ...viewState } : DEFAULT_VIEW_STATE)
    )

    const selectCodeResponse = createSelector(
        selectViewState,
        (viewState) => viewState.stateFields?.codeResponse
    )
    const selectResizePanel = createSelector(
        selectViewState,
        (viewState) => viewState.stateFields.resizePanel
    )

    const selectIsResizePanelVisible = createSelector(
        selectResizePanel,
        (resizePanel) => !!resizePanel.viewSize
    )

    const viewState = useGlobalSelector(selectViewState)
    const codeResponse = useGlobalSelector(selectCodeResponse)
    const resizePanel = useGlobalSelector(selectResizePanel)
    const isResizePanelVisible = useGlobalSelector(selectIsResizePanelVisible)

    const boundActions = useMemo(
        () => ({
            addTab: (payload: AddTabPayload) => dispatch(addTab(payload)),
            removeTab: (tabId: TabId) => dispatch(removeTab(tabId)),
            updateTab: (payload: UpdateTabPayload) =>
                dispatch(updateTab(payload)),
            setActiveTab: (tabId: TabId) => dispatch(setActiveTab(tabId)),
            switchTab: (direction: 'next' | 'previous') =>
                dispatch(switchTab(direction)),
            closeAllTabs: () => dispatch(closeAllTabs()),
            setCodeResponse: (payload: CodeResponsePayload) =>
                dispatch(setCodeResponse(payload)),
            setResizePanel: (payload: ResizePanelPayload) =>
                dispatch(setResizePanel(payload)),
        }),
        [dispatch]
    )

    return {
        tabs,
        resizePanel,
        activeTab,
        isResizePanelVisible,
        viewState,
        activeTabId,
        codeResponse,
        ...boundActions,
    }
}

export default useTabContext
