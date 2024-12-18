import {
    type AddTabPayload,
    type CodeResponsePayload,
    type ResizeLayoutPayload,
    type TabId,
    type UpdateTabPayload,
    type ViewStatePayload,
    addTab,
    closeAllTabs,
    defaultViewState,
    removeTab,
    selectAllTabs,
    selectTabById,
    setActiveTab,
    setCodeResponse,
    setResizeLayout,
    setViewState,
    switchTab,
    updateTab,
} from "@/src/redux/tab_slice";

import { createSelector } from "@reduxjs/toolkit";
import { useMemo } from "react";
import { useDispatch } from "react-redux";

import { type AppDispatch, type RootState, useGlobalSelector } from "@/src/redux/store";

const useTabContext = () => {
    const dispatch = useDispatch<AppDispatch>();

    const tabs = useGlobalSelector(selectAllTabs);

    const tabIndexMap = useMemo(() => {
        const map = new Map<TabId, number>();

        tabs.forEach((tab, index) => {
            map.set(tab.id, index);
        });

        return map;
    }, [tabs]);

    const activeTabId = useGlobalSelector((state) => state.tabs.activeTabId as TabId);

    const activeTab = useGlobalSelector((state) => selectTabById(state, activeTabId));

    const selectViewState = createSelector(
        (state: RootState) => state.tabs.entities[activeTabId]?.viewState,
        (viewState) => (viewState ? { ...viewState } : defaultViewState),
    );

    const selectCodeResponse = createSelector(
        selectViewState,
        (viewState) => viewState.stateFields?.codeResponse,
    );
    const selectResizeLayout = createSelector(
        selectViewState,
        (viewState) => viewState.stateFields.resizeLayout,
    );

    const selectIsMounted = createSelector(selectViewState, (viewState) => viewState.isMounted);

    const viewState = useGlobalSelector(selectViewState);
    const codeResponse = useGlobalSelector(selectCodeResponse);
    const resizeLayout = useGlobalSelector(selectResizeLayout);
    const isMounted = useGlobalSelector(selectIsMounted);

    const boundActions = useMemo(
        () => ({
            addTab: (payload: AddTabPayload) => dispatch(addTab(payload)),
            removeTab: (tabId: TabId) => dispatch(removeTab(tabId)),
            updateTab: (payload: UpdateTabPayload) => dispatch(updateTab(payload)),
            setActiveTab: (tabId: TabId) => dispatch(setActiveTab(tabId)),
            switchTab: (direction: "next" | "previous") => dispatch(switchTab(direction)),
            closeAllTabs: () => dispatch(closeAllTabs()),
            setCodeResponse: (payload: CodeResponsePayload) => dispatch(setCodeResponse(payload)),
            setResizeLayout: (payload: ResizeLayoutPayload) => dispatch(setResizeLayout(payload)),
            setViewState: (payload: ViewStatePayload) => dispatch(setViewState(payload)),
        }),
        [dispatch],
    );

    return {
        tabs,
        tabIndexMap,
        resizeLayout,
        activeTab,
        viewState,
        activeTabId,
        codeResponse,
        isMounted,
        ...boundActions,
    };
};

export default useTabContext;
