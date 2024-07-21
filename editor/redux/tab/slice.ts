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

import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

import { createEntityAdapter, createSlice, nanoid } from '@reduxjs/toolkit'

import { SafeJson } from '@/lib/utils'
import {
    AddTabPayload,
    CodeResponsePayload,
    EditorViewState,
    IParsedAceVS,
    IParsedMonacoVS,
    ITab,
    ITabConfig,
    IVSDefaults,
    ResizePanePayload,
    TabId,
    UpdateTabPayload,
} from '@/types'
import { TabError } from '@/lib/error'

const defaultConfig: ITabConfig = {
        isClosable: true,
        maxTabs: 2,
        maxValueSize: {
            value: 1000,
            units: 'characters',
        },
    },
    defaultMonacoVS = SafeJson.stringify<IParsedMonacoVS>({
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
        codeResponse: undefined,
        resizePane: true,
    }),
    defaultAceVS = SafeJson.stringify<IParsedAceVS>({
        codeResponse: undefined,
        resizePane: true,
    }),
    defaultViewState = EditorViewState.Monaco
        ? {
              type: EditorViewState.Monaco,
              value: defaultMonacoVS,
          }
        : {
              type: EditorViewState.Ace,
              value: defaultAceVS,
          },
    getByteLength = (str: string) => new TextEncoder().encode(str).length,
    validateValueSize = (
        value: string,
        maxValueSize: ITabConfig['maxValueSize']
    ) => {
        switch (maxValueSize.units) {
            case 'characters':
                return value.length > maxValueSize.value
            case 'bytes':
                return getByteLength(value) > maxValueSize.value
            case 'lines':
                return value.split('\n').length > maxValueSize.value
            default:
                throw new TabError(`Unsupported unit: ${maxValueSize.units}`)
        }
    },
    validatePayload = (
        payload: AddTabPayload,
        config: ITabConfig,
        state: typeof initialState
    ) => {
        const { title, value } = payload,
            maxTabs = config.maxTabs ?? defaultConfig.maxTabs,
            maxValueSize = config.maxValueSize ?? defaultConfig.maxValueSize,
            errors = new Array<string>()

        if (maxTabs && state.ids.length >= maxTabs) {
            errors.push(`Only ${maxTabs} tabs allowed!`)
        }

        if (!title || title.trim().length === 0) {
            errors.push('Title must be a non-empty string!')
        }

        if (maxValueSize) {
            if (validateValueSize(value, maxValueSize)) {
                errors.push(
                    `Value exceeds ${maxValueSize.value} ${maxValueSize.units}!`
                )
            }
        }

        if (errors.length > 0) {
            throw new TabError(errors.join('. '))
        }
    },
    sliceValue = (value: string, maxValueSize: ITabConfig['maxValueSize']) => {
        switch (maxValueSize.units) {
            case 'characters':
                return value.slice(0, maxValueSize.value)
            case 'bytes':
                let slicedValue = '',
                    byteLength = 0

                for (const char of value) {
                    const charByteLength = getByteLength(char)

                    if (byteLength + charByteLength > maxValueSize.value) break
                    slicedValue += char
                    byteLength += charByteLength
                }

                return slicedValue
            case 'lines':
                return value.split('\n').slice(0, maxValueSize.value).join('\n')
            default:
                throw new TabError(`Unsupported unit: ${maxValueSize.units}`)
        }
    },
    resoleVS = (tab: ITab, payload: IVSDefaults) => {
        switch (tab && tab.viewState.type) {
            case EditorViewState.Monaco:
                tab.viewState.value = SafeJson.stringify<IParsedMonacoVS>({
                    ...SafeJson.parse<IParsedMonacoVS>(tab.viewState.value),
                    ...payload,
                })
                break
            case EditorViewState.Ace:
                tab.viewState.value = SafeJson.stringify<IParsedAceVS>({
                    ...SafeJson.parse<IParsedMonacoVS>(tab.viewState.value),
                    ...payload,
                })
                break
            default:
                throw new TabError(`Unsupported VS type ${tab.viewState.type}`)
        }
    }

export const tabAdapter = createEntityAdapter<ITab>()

const initialState = tabAdapter.getInitialState({
        activeTabId: null as TabId | null,
        recentlyUsedTabs: new Array<TabId>(),
    }),
    tabs_slice = createSlice({
        name: 'tabs',
        initialState,
        reducers: {
            addTab: (state, { payload }: PayloadAction<AddTabPayload>) => {
                const { config } = payload

                validatePayload(payload, config, state)

                const maxValueSize =
                        config.maxValueSize ?? defaultConfig.maxValueSize,
                    slicedValue = sliceValue(payload.value, maxValueSize),
                    newTab: ITab = {
                        id: nanoid(),
                        title: payload.title,
                        value: slicedValue,
                        isDirty: !!payload.value,
                        metadata: payload.metadata,
                        viewState: defaultViewState,
                        config: {
                            ...defaultConfig,
                            ...config,
                        },
                    }

                tabAdapter.addOne(state, newTab)
                state.activeTabId = newTab.id
            },

            setActiveTab: (state, { payload: tabId }: PayloadAction<TabId>) => {
                if (state.entities[tabId]) {
                    state.activeTabId = tabId
                }
            },

            removeTab: (state, { payload: tabId }: PayloadAction<TabId>) => {
                /**
                 * This function was carefully thought through to ensure that the following edge cases are handled:
                 * @summary Edge Cases:
                 * 1. Removing a tab that's isClosable
                 * 2. Removing a tab that is not isClosable
                 * 3. Ensuring the active tab is correctly updated after removal
                 * 4. Handling cases where the tab to be removed is the only tab
                 * 5. Handling cases with multiple tabs and ensuring the correct tab becomes active
                 */
                const tab = state.entities[tabId]

                if (tab && tab.config.isClosable) {
                    const { ids, recentlyUsedTabs } = state,
                        removedTabIndex = ids.indexOf(tabId)

                    tabAdapter.removeOne(state, tabId)

                    state.recentlyUsedTabs = recentlyUsedTabs.filter(
                        (id) => id !== tabId
                    )

                    state.ids = ids.filter((id) => id !== tabId)

                    if (state.activeTabId === tabId) {
                        let newActiveTabId = null

                        for (const recentTabId of [
                            ...recentlyUsedTabs,
                        ].reverse()) {
                            if (
                                state.entities[recentTabId] &&
                                recentTabId !== tabId
                            ) {
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
                }
            },

            switchTab: (
                state,
                { payload: direction }: PayloadAction<'next' | 'previous'>
            ) => {
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

            updateTab: (
                state,
                {
                    payload: { id, value, config, viewState },
                }: PayloadAction<UpdateTabPayload>
            ) => {
                const tab = state.entities[id]

                if (tab) {
                    const maxValueSize =
                        config?.maxValueSize ??
                        tab.config.maxValueSize ??
                        defaultConfig.maxValueSize

                    let updatedValue = value ?? tab.value,
                        isDirty = tab.isDirty

                    if (value) {
                        isDirty = value !== tab.value
                        updatedValue = sliceValue(value, maxValueSize)
                    }

                    tabAdapter.updateOne(state, {
                        id,
                        changes: {
                            value: updatedValue,
                            isDirty,
                            viewState: viewState ?? tab.viewState,
                        },
                    })

                    if (isDirty) {
                        const recentIndex = state.recentlyUsedTabs.indexOf(id)

                        if (recentIndex > -1) {
                            state.recentlyUsedTabs.splice(recentIndex, 1)
                        }
                        state.recentlyUsedTabs.push(id)
                    }
                }
            },

            setCodeResponse: (
                state,
                {
                    payload: { id, codeResponse },
                }: PayloadAction<CodeResponsePayload>
            ) => {
                const tab = state.entities[id]

                resoleVS(tab, { codeResponse })
            },
            setResizePane: (
                state,
                {
                    payload: { id, resizePane },
                }: PayloadAction<ResizePanePayload>
            ) => {
                const tab = state.entities[id]

                resoleVS(tab, { resizePane })
            },
        },
    })

export default tabs_slice

export const { selectAll: selectAllTabs, selectById: selectTabById } =
        tabAdapter.getSelectors<RootState>((state) => state.tabs),
    {
        addTab,
        setActiveTab,
        removeTab,
        switchTab,
        closeAllTabs,
        updateTab,
        setCodeResponse,
        setResizePane,
    } = tabs_slice.actions
