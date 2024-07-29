import type {
    AddTabPayload,
    CodeResponsePayload,
    ICodeMirrorViewState,
    IMonacoViewState,
    ResizePanePayload,
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
    setResizePane,
    switchTab,
    updateTab,
} from '@/redux/tab/slice'

const useTabContext = () => {
    const dispatch = useDispatch<AppDispatch>(),
        tabs = useGlobalSelector(selectAllTabs),
        getActiveTabId = useGlobalSelector(
            (state) => state.tabs.activeTabId as TabId
        ),
        getActiveTab = useGlobalSelector((state) =>
            selectTabById(state, getActiveTabId)
        ),
        getViewState = getActiveTab?.viewState,
        getDeserializedViewState = <
            T extends IMonacoViewState | ICodeMirrorViewState,
        >() => {
            return SafeJson.parse<T>(getViewState.value)
        },
        getSerializedViewState = <
            T extends IMonacoViewState | ICodeMirrorViewState,
        >(
            value: T
        ) => {
            return SafeJson.stringify<T>(value)
        },
        deserializedViewState = SafeJson.parse<
            IMonacoViewState | ICodeMirrorViewState
        >(getViewState?.value),
        codeResponse =
            deserializedViewState?.stateFields.codeResponse ?? undefined,
        resizePane = deserializedViewState?.stateFields.resizePane ?? false,
        isMobileView = window.matchMedia('(max-width: 600px)').matches,
        boundActions = useMemo(
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
                setResizePane: (payload: ResizePanePayload) => {
                    dispatch(setResizePane(payload))
                },
            }),
            [dispatch]
        )

    return {
        tabs,
        resizePane,
        getActiveTab,
        getDeserializedViewState,
        getSerializedViewState,
        getViewState,
        getActiveTabId,
        isMobileView,
        codeResponse,
        ...boundActions,
    }
}

export default useTabContext
