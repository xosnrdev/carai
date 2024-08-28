/*
 * Copyright (c) 2024 Carai - Code Playground
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type {
    AddTabPayload,
    CodeResponsePayload,
    ViewState,
    ITab,
    ITabConfig,
    Limit,
    MaxContentDelimiter,
    ResizePanelPayload,
    Units,
    UpdateTabPayload,
    TabId,
} from '@/types'
import type { RootState } from '../store'

import {
    createEntityAdapter,
    createSlice,
    nanoid,
    PayloadAction,
} from '@reduxjs/toolkit'

import { CustomError } from '@/lib/error'

const DEFAULT_CONFIG: ITabConfig = {
    isClosable: true,
    maxTabs: 2,
    maxContentDelimiter: {
        limit: 1000,
        units: 'characters',
    },
} as const

const DEFAULT_VIEW_STATE: ViewState = {
    state: {
        cursorState: [],
        viewState: {
            scrollLeft: 0,
            firstPosition: {
                lineNumber: 1,
                column: 1,
            },
            firstPositionDeltaTop: 0,
        },
        contributionsState: {},
    },
    stateFields: {
        codeResponse: undefined,
        resizePanel: {
            viewSize: 0,
            viewSizeState: 30,
        },
    },
} as const

const getByteLength = (content: string): number => {
    return new TextEncoder().encode(content).byteLength
}

const sliceBytes = (content: string, limit: number): string => {
    return new TextDecoder().decode(
        new TextEncoder().encode(content).slice(0, limit)
    )
}

const isContentLimited = (
    content: string,
    maxContentDelimiter: MaxContentDelimiter
): boolean => {
    const { limit, units } = maxContentDelimiter

    switch (units) {
        case 'characters':
            return content.length > limit
        case 'bytes':
            return getByteLength(content) > limit
        case 'lines':
            return content.split('\n').length > limit
        default:
            throw new CustomError(`Unsupported unit: ${units}`)
    }
}

const sliceContent = (content: string, limit: Limit, units: Units): string => {
    switch (units) {
        case 'characters':
            return content.slice(0, limit)
        case 'bytes':
            return sliceBytes(content, limit)
        case 'lines':
            return content.split('\n').slice(0, limit).join('\n')
        default:
            throw new CustomError(`Unsupported unit: ${units}`)
    }
}

const isNonEmptyString = (value: string): boolean => {
    return value.trim().length > 0
}

const tabAdapter = createEntityAdapter<ITab>()

const initialState = tabAdapter.getInitialState({
    activeTabId: null as TabId | null,
    recentlyUsedTabs: new Array<TabId>(),
})

const tabs_slice = createSlice({
    name: 'tabs',
    initialState,
    reducers: {
        addTab: (state, action: PayloadAction<AddTabPayload>): void => {
            const { filename, content, config, metadata } = action.payload
            const maxTabs = config.maxTabs || DEFAULT_CONFIG.maxTabs

            if (state.ids.length >= maxTabs) {
                throw new CustomError(`Only ${maxTabs} tabs allowed`)
            }

            if (!filename || filename.trim().length === 0) {
                throw new CustomError('Filename must be a non-empty string')
            }

            const newTab: ITab = {
                id: nanoid(),
                filename,
                content,
                isDirty: isNonEmptyString(content),
                metadata,
                viewState: DEFAULT_VIEW_STATE,
                config: { ...DEFAULT_CONFIG, ...config },
            }

            tabAdapter.addOne(state, newTab)
            state.activeTabId = newTab.id
            if (isNonEmptyString(content)) {
                state.recentlyUsedTabs.push(newTab.id)
            }
        },

        setActiveTab: (state, action: PayloadAction<TabId>): void => {
            const tabId = action.payload

            if (!state.entities[tabId]) {
                return
            }
            state.activeTabId = tabId
        },

        removeTab: (state, action: PayloadAction<TabId>): void => {
            const tabId = action.payload
            const tab = state.entities[tabId]

            if (!tab || !tab.config.isClosable) return

            const { ids, recentlyUsedTabs } = state
            const removedTabIndex = ids.indexOf(tabId)

            tabAdapter.removeOne(state, tabId)

            state.recentlyUsedTabs = recentlyUsedTabs.filter(
                (id) => id !== tabId
            )

            state.ids = ids.filter((id) => id !== tabId)

            if (state.activeTabId === tabId) {
                let newActiveTabId: TabId | null = null

                for (const recentTabId of [...recentlyUsedTabs].reverse()) {
                    if (state.entities[recentTabId] && recentTabId !== tabId) {
                        newActiveTabId = recentTabId
                        break
                    }
                }

                if (!newActiveTabId) {
                    if (removedTabIndex > 0) {
                        newActiveTabId = state.ids[removedTabIndex - 1]
                    } else if (state.ids.length > 0) {
                        newActiveTabId = state.ids[0]
                    }
                }

                if (newActiveTabId) {
                    tabs_slice.caseReducers.setActiveTab(state, {
                        payload: newActiveTabId,
                        type: 'setActiveTab',
                    })
                } else {
                    state.activeTabId = null
                }
            }
        },

        switchTab: (state, action: PayloadAction<'next' | 'previous'>) => {
            const direction = action.payload

            const { activeTabId, ids } = state

            if (!activeTabId) return

            const currentIndex = ids.indexOf(activeTabId)

            if (currentIndex !== -1) {
                const length = ids.length,
                    increment = direction === 'next' ? 1 : -1,
                    newIndex = (currentIndex + increment + length) % length

                if (state.entities[ids[newIndex]]) {
                    state.activeTabId = ids[newIndex]
                }
            }
        },

        closeAllTabs: (state) => {
            tabAdapter.removeAll(state)
            state.activeTabId = null
        },

        updateTab: (state, action: PayloadAction<UpdateTabPayload>) => {
            const { id, filename, content, viewState, config } = action.payload
            const tab = state.entities[id]

            if (!tab) return

            const maxContentDelimiter = config
                ? config.maxContentDelimiter || tab.config.maxContentDelimiter
                : DEFAULT_CONFIG.maxContentDelimiter

            if (content && isContentLimited(content, maxContentDelimiter)) {
                throw new CustomError(
                    `Content exceeds ${maxContentDelimiter.limit} ${maxContentDelimiter.units}`
                )
            }

            const updatedContent = content
                ? sliceContent(
                      content,
                      maxContentDelimiter.limit,
                      maxContentDelimiter.units
                  )
                : tab.content

            const isDirty = content
                ? updatedContent !== tab.content
                : tab.isDirty

            tabAdapter.updateOne(state, {
                id,
                changes: {
                    filename: filename ?? tab.filename,
                    content: updatedContent,
                    isDirty,
                    viewState: viewState ?? tab.viewState,
                    config: config ? { ...tab.config, ...config } : tab.config,
                },
            })

            if (isDirty) {
                const recentIndex = state.recentlyUsedTabs.indexOf(id)

                if (recentIndex > -1) {
                    state.recentlyUsedTabs.splice(recentIndex, 1)
                }
                state.recentlyUsedTabs.push(id)
            }
        },

        setCodeResponse: (
            state,
            action: PayloadAction<CodeResponsePayload>
        ) => {
            const { id, codeResponse, latency } = action.payload
            const tab = state.entities[id]

            if (!tab || !tab.viewState) return
            tab.viewState.stateFields.codeResponse = {
                ...codeResponse,
                latency,
            }
        },

        setResizePanel: (state, action: PayloadAction<ResizePanelPayload>) => {
            const { id, viewSize, viewSizeState } = action.payload
            const tab = state.entities[id]

            if (!tab || !tab.viewState) return

            tab.viewState.stateFields.resizePanel = {
                viewSize,
                viewSizeState,
            }
        },
    },
})

const { selectAll: selectAllTabs, selectById: selectTabById } =
    tabAdapter.getSelectors<RootState>((state) => state.tabs)

const {
    addTab,
    setActiveTab,
    removeTab,
    switchTab,
    closeAllTabs,
    updateTab,
    setCodeResponse,
    setResizePanel,
} = tabs_slice.actions

export {
    addTab,
    closeAllTabs,
    tabs_slice as default,
    DEFAULT_VIEW_STATE,
    removeTab,
    selectAllTabs,
    selectTabById,
    setActiveTab,
    setCodeResponse,
    setResizePanel,
    switchTab,
    tabAdapter,
    updateTab,
}
