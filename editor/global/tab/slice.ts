import type { CodeResponse } from '@/lib/types/response'
import type { PayloadAction } from '@reduxjs/toolkit'
import { createEntityAdapter, createSlice, nanoid } from '@reduxjs/toolkit'
import type { editor } from 'monaco-editor'
import type { RootState } from '../store'

export class TabError extends Error {
	constructor(public readonly message: string) {
		super(message)
	}
}

type TabConfigOptions = Readonly<{
	closable: boolean

	maxTabs: number

	maxContentSize: number
}>

type TabConfig = Partial<TabConfigOptions>

type Tab = Readonly<{
	id: string

	title: string

	content: string

	isDirty: boolean

	meta?: string

	editorViewState?:
		| (editor.ICodeEditorViewState & {
				codeResponse: CodeResponse | null
				onResize: Partial<{
					visible: Boolean
				}>
		  })
		| null

	config: TabConfig
}>

export type TabId = Tab['id']

export type CodeResponsePayload = {
	id: TabId
	codeResponse: NonNullable<Tab['editorViewState']>['codeResponse']
}

export type OnResizePayload = {
	id: TabId
	onResize: NonNullable<Tab['editorViewState']>['onResize']
}

export type AddTabPayload = Omit<Tab, 'id' | 'isDirty'>

export type UpdateTabPayload = Partial<Tab> & {
	id: TabId
}

const defaultConfig: TabConfig = {
	closable: true,
	maxTabs: 10,
	maxContentSize: 1000,
}

export const tabAdapter = createEntityAdapter<Tab>()

const defaultTab: Tab = {
	id: 'welcome_tabview',
	title: 'welcome',
	content: '',
	isDirty: false,
	config: { closable: true },
}

const defaultEditorViewState: Tab['editorViewState'] = {
	...(null as any),
	codeResponse: null,
	onResize: {
		visible: true,
	},
}

const initialState = tabAdapter.getInitialState({
	ids: [defaultTab.id],
	entities: {
		[defaultTab.id]: defaultTab,
	},
	activeTabId: defaultTab.id as TabId | null,
})

function validatePayload(
	payload: AddTabPayload,
	config: TabConfig,
	state: RootState['tabs']
) {
	const maxTabs = config.maxTabs ?? defaultConfig.maxTabs
	const maxContentSize = config.maxContentSize ?? defaultConfig.maxContentSize
	const { title, content, meta } = payload

	const errors: string[] = []

	if (maxTabs && state.ids.length >= maxTabs) {
		errors.push(`Max tab
		 (${maxTabs})`)
	}

	if (!title || typeof title !== 'string') {
		errors.push('Title payload is required and must of type string!')
	}

	if (typeof content !== 'string') {
		errors.push('Content payload must be of type string!')
	}

	if (typeof meta !== 'string') {
		errors.push('Meta payload must be of type string!')
	}

	if (maxContentSize && content.length > maxContentSize) {
		errors.push(
			`Content length exceeds the limit of ${maxContentSize} characters!`
		)
	}

	if (errors.length > 0) {
		throw new TabError(errors.join('\n'))
	}
}

const tabSlice = createSlice({
	name: 'tabs',
	initialState,
	reducers: {
		addTab: (state, { payload }: PayloadAction<AddTabPayload>) => {
			const { config } = payload

			validatePayload(payload, config, state)

			const newTab: Tab = {
				id: nanoid(16),
				title: payload.title,
				content: payload.content.slice(
					0,
					config.maxContentSize ?? defaultConfig.maxContentSize
				),
				isDirty: !!payload.content,
				meta: payload.meta,
				editorViewState: defaultEditorViewState,
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
			if (
				state.activeTabId === tabId &&
				state.entities[tabId].config.closable
			) {
				const { ids } = state
				const removedTabIndex = ids.indexOf(tabId)
				tabAdapter.removeOne(state, tabId)

				state.activeTabId = null

				const idsLength = ids.length
				let nextIndex: number | null = null

				for (let i = removedTabIndex + 1; i < idsLength; i++) {
					const id = ids[i]
					if (state.entities[id]) {
						nextIndex = i
						break
					}
				}

				if (nextIndex === null) {
					for (let i = removedTabIndex - 1; i >= 0; i--) {
						const id = ids[i]
						if (state.entities[id]) {
							nextIndex = i
							break
						}
					}
				}

				state.activeTabId = nextIndex !== null ? ids[nextIndex] : null
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
				const length = ids.length
				const increment = direction === 'next' ? 1 : -1

				// Calculate newIndex using modulo for cycling through tabs
				const newIndex = (currentIndex + increment + length) % length

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
				payload: { id, content, config, editorViewState },
			}: PayloadAction<UpdateTabPayload>
		) => {
			const tab = state.entities[id]

			if (tab) {
				const maxContentSize =
					config?.maxContentSize ??
					tab.config.maxContentSize ??
					defaultConfig.maxContentSize
				const updatedContent = content ?? tab.content
				const isDirty =
					content !== undefined
						? content.length <= maxContentSize!
							? content !== tab.content
							: tab.content.slice(0, maxContentSize) !==
								content.slice(0, maxContentSize)
						: tab.isDirty

				tabAdapter.updateOne(state, {
					id,
					changes: {
						content: updatedContent.slice(0, maxContentSize),
						isDirty,
						editorViewState: editorViewState ?? tab.editorViewState,
					},
				})
			}
		},
		setCodeResponse: (
			state,
			{ payload: { id, codeResponse } }: PayloadAction<CodeResponsePayload>
		) => {
			const tab = state.entities[id]
			if (tab && tab.editorViewState) {
				tab.editorViewState.codeResponse = codeResponse
			}
		},
		setOnResize: (
			state,
			{
				payload: {
					id,
					onResize: { visible },
				},
			}: PayloadAction<OnResizePayload>
		) => {
			const tab = state.entities[id]
			if (tab && tab.editorViewState) {
				tab.editorViewState.onResize.visible = visible
			}
		},
	},
})
export default tabSlice

export const { selectAll: selectAllTabs, selectById: selectTabById } =
	tabAdapter.getSelectors<RootState>((state) => state.tabs)

export const {
	addTab,
	setActiveTab,
	removeTab,
	switchTab,
	closeAllTabs,
	updateTab,
	setCodeResponse,
	setOnResize,
} = tabSlice.actions
