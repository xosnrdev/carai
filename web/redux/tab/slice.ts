// Copyright (c) 2024 Carai
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import type { RootState } from "../store";
import type {
    AddTabPayload,
    CodeResponsePayload,
    ResizeLayoutPayload,
    Tab,
    TabId,
    UpdateTabPayload,
    ViewStatePayload,
} from "./index.types";

import { type PayloadAction, createEntityAdapter, createSlice, nanoid } from "@reduxjs/toolkit";

import { CustomError } from "@/lib/error";
import { isNonEmptyString } from "@/lib/utils";

import { isContentLimited, sliceContent } from "./utils";

import { defaultConfig, defaultViewState } from ".";

const tabAdapter = createEntityAdapter<Tab>();

const initialState = tabAdapter.getInitialState({
    activeTabId: null as TabId | null,
    recentlyUsedTabs: new Array<TabId>(),
});

const tab_slice = createSlice({
    name: "tabs",
    initialState,
    reducers: {
        addTab: (state, action: PayloadAction<AddTabPayload>): void => {
            const { filename, content, config, metadata } = action.payload;
            const maxTabs = config.maxTabs || defaultConfig.maxTabs;

            if (state.ids.length >= maxTabs) {
                throw new CustomError(`Only ${maxTabs} tabs allowed`);
            }

            if (!filename || filename.trim().length === 0) {
                throw new CustomError("Filename must be a non-empty string");
            }

            const newTab: Tab = {
                id: nanoid(),
                filename,
                content,
                isDirty: isNonEmptyString(content),
                metadata,
                viewState: defaultViewState,
                config: { ...defaultConfig, ...config },
            };

            tabAdapter.addOne(state, newTab);
            state.activeTabId = newTab.id;
            if (isNonEmptyString(content)) {
                state.recentlyUsedTabs.push(newTab.id);
            }
        },

        setActiveTab: (state, action: PayloadAction<TabId>): void => {
            const tabId = action.payload;

            if (!state.entities[tabId]) {
                return;
            }
            state.activeTabId = tabId;
        },

        removeTab: (state, action: PayloadAction<TabId>): void => {
            const tabId = action.payload;
            const tab = state.entities[tabId];

            if (!tab || !tab.config.isClosable) {
                return;
            }

            const { ids, recentlyUsedTabs } = state;
            const removedTabIndex = ids.indexOf(tabId);

            tabAdapter.removeOne(state, tabId);

            state.recentlyUsedTabs = recentlyUsedTabs.filter((id) => id !== tabId);

            state.ids = ids.filter((id) => id !== tabId);

            if (state.activeTabId === tabId) {
                let newActiveTabId: TabId | null = null;

                for (const recentTabId of [...recentlyUsedTabs].reverse()) {
                    if (state.entities[recentTabId] && recentTabId !== tabId) {
                        newActiveTabId = recentTabId;
                        break;
                    }
                }

                if (!newActiveTabId) {
                    if (removedTabIndex > 0) {
                        newActiveTabId = state.ids[removedTabIndex - 1];
                    } else if (state.ids.length > 0) {
                        newActiveTabId = state.ids[0];
                    }
                }

                if (newActiveTabId) {
                    tab_slice.caseReducers.setActiveTab(state, {
                        payload: newActiveTabId,
                        type: "setActiveTab",
                    });
                } else {
                    state.activeTabId = null;
                }
            }
        },

        switchTab: (state, action: PayloadAction<"next" | "previous">) => {
            const direction = action.payload;

            const { activeTabId, ids } = state;

            if (!activeTabId) {
                return;
            }

            const currentIndex = ids.indexOf(activeTabId);

            if (currentIndex !== -1) {
                const length = ids.length;
                const increment = direction === "next" ? 1 : -1;
                const newIndex = (currentIndex + increment + length) % length;

                if (state.entities[ids[newIndex]]) {
                    state.activeTabId = ids[newIndex];
                }
            }
        },

        closeAllTabs: (state) => {
            tabAdapter.removeAll(state);
            state.activeTabId = null;
        },

        updateTab: (state, action: PayloadAction<UpdateTabPayload>) => {
            const { id, filename, content, viewState, config } = action.payload;
            const tab = state.entities[id];

            if (!tab) {
                return;
            }

            const maxContentDelimiter = config
                ? config.maxContentDelimiter || tab.config.maxContentDelimiter
                : defaultConfig.maxContentDelimiter;

            if (content && isContentLimited(content, maxContentDelimiter)) {
                throw new CustomError(
                    `Content exceeds ${maxContentDelimiter.limit} ${maxContentDelimiter.units}`,
                );
            }

            const updatedContent = content
                ? sliceContent({
                      content,
                      limit: maxContentDelimiter.limit,
                      units: maxContentDelimiter.units,
                  })
                : tab.content;

            const isDirty = content ? updatedContent !== tab.content : tab.isDirty;

            tabAdapter.updateOne(state, {
                id,
                changes: {
                    filename: filename ?? tab.filename,
                    content: updatedContent,
                    isDirty,
                    viewState: viewState ?? tab.viewState,
                    config: config ? { ...tab.config, ...config } : tab.config,
                },
            });

            if (isDirty) {
                const recentIndex = state.recentlyUsedTabs.indexOf(id);

                if (recentIndex > -1) {
                    state.recentlyUsedTabs.splice(recentIndex, 1);
                }
                state.recentlyUsedTabs.push(id);
            }
        },

        setCodeResponse: (state, action: PayloadAction<CodeResponsePayload>) => {
            const { id, codeResponse, time, isRunning } = action.payload;
            const tab = state.entities[id];

            if (!tab || !tab.viewState) {
                return;
            }
            tab.viewState.stateFields.codeResponse = {
                ...codeResponse,
                time,
                isRunning,
            };
        },

        setResizeLayout: (state, action: PayloadAction<ResizeLayoutPayload>) => {
            const { id, vertical, snapshot } = action.payload;
            const tab = state.entities[id];

            if (!tab || !tab.viewState) {
                return;
            }

            tab.viewState.stateFields.resizeLayout = {
                vertical: [...vertical],
                snapshot: [...snapshot],
            };
        },
        setViewState: (state, action: PayloadAction<ViewStatePayload>) => {
            const { id, isMounted } = action.payload;
            const tab = state.entities[id];

            if (!tab || !tab.viewState) {
                return;
            }

            tab.viewState.isMounted = isMounted;
        },
    },
});

const { selectAll: selectAllTabs, selectById: selectTabById } = tabAdapter.getSelectors<RootState>(
    (state) => state.tabs,
);

const {
    addTab,
    setActiveTab,
    removeTab,
    switchTab,
    closeAllTabs,
    updateTab,
    setCodeResponse,
    setResizeLayout,
    setViewState,
} = tab_slice.actions;

export {
    addTab,
    closeAllTabs,
    tab_slice as default,
    defaultViewState,
    removeTab,
    selectAllTabs,
    selectTabById,
    setActiveTab,
    setCodeResponse,
    setResizeLayout,
    switchTab,
    tabAdapter,
    updateTab,
    setViewState,
};
