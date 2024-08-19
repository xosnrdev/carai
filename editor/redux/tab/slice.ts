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

import { CustomError } from '@/lib/error'
import { SafeJson } from '@/lib/utils'
import {
    type AddTabPayload,
    type CodeResponsePayload,
    EditorViewType,
    type ICodeMirrorViewState,
    type IMonacoViewState,
    type ITab,
    type ITabConfig,
    type ResizePanelPayload,
    type TabId,
    type UpdateTabPayload,
    type ViewStateField,
} from '@/types'

const defaultConfig: ITabConfig = {
    isClosable: true,
    maxTabs: 2,
    maxValueSize: {
        value: 1000,
        units: 'characters',
    },
}
// const defaultMonacoVS = SafeJson.stringify<IMonacoViewState>({
//     state: null,
//     stateFields: {
//         codeResponse: undefined,
//         resizePanel: {
//             visible: false,
//             defaultSize: 70,
//         },
//     },
// })

const defaultCodeMirrorVS = SafeJson.stringify<ICodeMirrorViewState>({
    // state: {
    //     doc: ''
    // },
    stateFields: {
        codeResponse: undefined,
        resizePanel: {
            viewSize: 0,
        },
    },
})

const defaultViewState = {
    type: EditorViewType.CodeMirror,
    value: defaultCodeMirrorVS,
}

const getByteLength = (str: string): number =>
    new TextEncoder().encode(str).byteLength

const validateValueSize = (
    value: string,
    maxValueSize: ITabConfig['maxValueSize']
): boolean => {
    switch (maxValueSize.units) {
        case 'characters':
            return value.length > maxValueSize.value
        case 'bytes':
            return getByteLength(value) > maxValueSize.value
        case 'lines':
            return value.split('\n').length > maxValueSize.value
        default:
            throw new CustomError(`Unsupported unit: ${maxValueSize.units}`)
    }
}

const validatePayload = (
    payload: AddTabPayload,
    config: ITabConfig,
    state: typeof initialState
): void => {
    const { filename, value } = payload
    const maxTabs = config.maxTabs ?? defaultConfig.maxTabs
    const maxValueSize = config.maxValueSize ?? defaultConfig.maxValueSize
    const errors: string[] = []

    if (maxTabs && state.ids.length >= maxTabs) {
        errors.push(`Only ${maxTabs} tabs allowed`)
    }

    if (!filename || filename.trim().length === 0) {
        errors.push('Filename must be a non-empty string')
    }

    if (maxValueSize && validateValueSize(value, maxValueSize)) {
        errors.push(
            `Value exceeds ${maxValueSize.value} ${maxValueSize.units}!`
        )
    }

    if (errors.length > 0) {
        throw new CustomError(errors.join('. '))
    }
}

const sliceValue = (
    value: string,
    maxValueSize: ITabConfig['maxValueSize']
): string => {
    switch (maxValueSize.units) {
        case 'characters':
            return value.slice(0, maxValueSize.value)
        case 'bytes':
            let slicedValue = ''
            let byteLength = 0

            for (const char of value) {
                const charByteLength = getByteLength(char)

                if (byteLength + charByteLength > maxValueSize.value) {
                    break
                }

                slicedValue += char
                byteLength += charByteLength
            }

            return slicedValue
        case 'lines':
            return value.split('\n').slice(0, maxValueSize.value).join('\n')
        default:
            throw new CustomError(`Unsupported unit: ${maxValueSize.units}`)
    }
}

const resolveViewState = (tab: ITab, payload: ViewStateField): void => {
    if (!tab || !tab.viewState) return

    const { type, value } = tab.viewState

    switch (type) {
        case EditorViewType.Monaco:
            tab.viewState.value = SafeJson.stringify<IMonacoViewState>({
                ...SafeJson.parse<IMonacoViewState>(value),
                stateFields: {
                    ...SafeJson.parse<IMonacoViewState>(value).stateFields,
                    ...payload,
                },
            })
            break
        case EditorViewType.CodeMirror:
            tab.viewState.value = SafeJson.stringify<ICodeMirrorViewState>({
                ...SafeJson.parse<ICodeMirrorViewState>(value),
                stateFields: {
                    ...SafeJson.parse<ICodeMirrorViewState>(value).stateFields,
                    ...payload,
                },
            })
            break
        default:
            throw new CustomError(`Unsupported VS type ${type}`)
    }
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
        addTab: (state, { payload }: PayloadAction<AddTabPayload>): void => {
            const { config } = payload

            validatePayload(payload, config, state)

            const maxValueSize =
                config.maxValueSize ?? defaultConfig.maxValueSize

            const slicedValue = sliceValue(payload.value, maxValueSize)

            const newTab: ITab = {
                id: nanoid(),
                filename: payload.filename,
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

        setActiveTab: (
            state,
            { payload: tabId }: PayloadAction<TabId>
        ): void => {
            if (!state.entities[tabId]) return
            state.activeTabId = tabId
        },

        removeTab: (state, { payload: tabId }: PayloadAction<TabId>): void => {
            const tab = state.entities[tabId]

            if (!tab || !tab.config.isClosable) return

            const { ids, recentlyUsedTabs } = state

            const removedTabIndex = ids.indexOf(tabId)

            tabAdapter.removeOne(state, tabId)

            state.recentlyUsedTabs = recentlyUsedTabs.filter(
                (id) => id !== tabId
            )

            state.ids = ids.filter((id) => id !== tabId)

            if (state.activeTabId !== tabId) return

            let newActiveTabId: TabId = ''

            for (const recentTabId of [...recentlyUsedTabs].reverse()) {
                if (!state.entities[recentTabId] && recentTabId === tabId)
                    return
                newActiveTabId = recentTabId
                break
            }

            if (!newActiveTabId) {
                if (removedTabIndex > 0) {
                    newActiveTabId = state.ids[removedTabIndex - 1]
                } else if (state.ids.length > 0) {
                    newActiveTabId = state.ids[0]
                } else {
                    state.activeTabId = null

                    return
                }
            }

            tabs_slice.caseReducers.setActiveTab(state, {
                payload: newActiveTabId,
                type: 'setActiveTab',
            })
        },

        switchTab: (
            state,
            { payload: direction }: PayloadAction<'next' | 'previous'>
        ): void => {
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

        closeAllTabs: (state): void => {
            tabAdapter.removeAll(state)
            state.activeTabId = null
        },

        updateTab: (
            state,
            {
                payload: { id, filename, value, config, viewState },
            }: PayloadAction<UpdateTabPayload>
        ): void => {
            const tab = state.entities[id]

            if (!tab) return
            const updatedFilename = filename ?? tab.filename
            const maxValueSize =
                config?.maxValueSize ??
                tab.config.maxValueSize ??
                defaultConfig.maxValueSize

            let updatedValue = value ?? tab.value
            let isDirty = tab.isDirty

            if (value) {
                isDirty = value !== tab.value
                updatedValue = sliceValue(value, maxValueSize)
            }

            tabAdapter.updateOne(state, {
                id,
                changes: {
                    filename: updatedFilename,
                    value: updatedValue,
                    isDirty,
                    viewState: viewState ?? tab.viewState,
                },
            })

            if (!isDirty) return
            const recentIndex = state.recentlyUsedTabs.indexOf(id)

            if (recentIndex > -1) {
                state.recentlyUsedTabs.splice(recentIndex, 1)
            }
            state.recentlyUsedTabs.push(id)
        },

        setCodeResponse: (
            state,
            {
                payload: { id, codeResponse },
            }: PayloadAction<CodeResponsePayload>
        ): void => {
            const tab = state.entities[id]

            resolveViewState(tab, {
                codeResponse: {
                    ...codeResponse,
                },
            })
        },
        setResizePanel: (
            state,
            {
                payload: { id, viewSize, viewSizeState },
            }: PayloadAction<ResizePanelPayload>
        ): void => {
            const tab = state.entities[id]

            resolveViewState(tab, {
                resizePanel: {
                    viewSize,
                    viewSizeState,
                },
            })
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
