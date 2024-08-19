import type {
    AddTabPayload,
    CodeResponsePayload,
    ICodeMirrorViewState,
    IMonacoViewState,
    ResizePanel,
    ResizePanelPayload,
    TabId,
    UpdateTabPayload,
} from '@/types'

import { useMemo } from 'react'
import { useDispatch } from 'react-redux'

import { SafeJson } from '@/lib/utils'
import { useGlobalSelector, type AppDispatch } from '@/redux/store'
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
} from '@/redux/tab/slice'
import { CodeResponse } from '@/types/response'

const useTabContext = () => {
    const dispatch = useDispatch<AppDispatch>()

    const tabs = useGlobalSelector(selectAllTabs)

    const activeTabId = useGlobalSelector(
        (state) => state.tabs.activeTabId as TabId
    )

    const activeTab = useGlobalSelector((state) =>
        selectTabById(state, activeTabId)
    )

    const viewState = activeTab?.viewState

    const getDeserializedViewState = <
        T extends IMonacoViewState | ICodeMirrorViewState,
    >() => {
        return SafeJson.parse<T>(viewState?.value)
    }

    const getSerializedViewState = <
        T extends IMonacoViewState | ICodeMirrorViewState,
    >(
        value: T
    ) => {
        return SafeJson.stringify<T>(value)
    }

    const deserializedStateFields = SafeJson.parse<
        IMonacoViewState | ICodeMirrorViewState
    >(viewState?.value)?.stateFields

    const codeResponse = deserializedStateFields?.codeResponse as CodeResponse
    const resizePanel = deserializedStateFields?.resizePanel as ResizePanel

    const isResizePanelVisible = !!resizePanel?.viewSize === true

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
            setResizePanel: (payload: ResizePanelPayload) => {
                dispatch(setResizePanel(payload))
            },
        }),
        [dispatch]
    )

    return {
        tabs,
        resizePanel,
        activeTab,
        getDeserializedViewState,
        getSerializedViewState,
        isResizePanelVisible,
        viewState,
        activeTabId,
        codeResponse,
        ...boundActions,
    }
}

export default useTabContext
