import {
	PayloadAction,
	combineReducers,
	configureStore,
	createEntityAdapter,
	createSlice,
	nanoid,
} from '@reduxjs/toolkit'
import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { PersistConfig, persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

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

	config: TabConfig
}>

export type TabId = Tab['id']

type AddTabPayload = Omit<Tab, 'id' | 'isDirty'>

type UpdateTabPayload = Partial<Tab> & {
	id: TabId
}

const defaultConfig: TabConfig = {
	closable: true,
	maxTabs: 10,
	maxContentSize: 1000,
}

const tabAdapter = createEntityAdapter<Tab>()

const defaultTab: Tab = {
	id: '_welcome_tab_id',
	title: 'welcome',
	content: '',
	isDirty: false,
	config: { closable: true },
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
		 (${maxTabs}) reached!`)
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
				id: nanoid(32),
				title: payload.title,
				content: payload.content.slice(
					0,
					config.maxContentSize ?? defaultConfig.maxContentSize
				),
				isDirty: !!payload.content,
				meta: payload.meta,
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
			if (state.entities[tabId].config.closable) {
				const { ids } = state
				const removedTabIndex = ids.indexOf(tabId)
				tabAdapter.removeOne(state, tabId)

				if (state.activeTabId === tabId) {
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
				const newIndex = currentIndex + increment

				// Check if the new index is valid
				// Update the activeTabId if a valid tab was found
				// If switching next and already at the last tab, do nothing
				// If switching previous and already at the first tab, do nothing
				if (
					newIndex >= 0 &&
					newIndex < length &&
					state.entities[ids[newIndex]]
				) {
					state.activeTabId = ids[newIndex]
				} else if (direction === 'next' && currentIndex === length - 1) {
					return
				} else if (direction === 'previous' && currentIndex === 0) {
					return
				}
			}
		},

		closeAllTabs: (state) => {
			tabAdapter.removeAll(state)
			state.activeTabId = null
		},

		updateTab: (state, { payload }: PayloadAction<UpdateTabPayload>) => {
			const { id, content, config } = payload
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
					},
				})
			}
		},
	},
})

type RootState = {
	tabs: ReturnType<typeof tabSlice.reducer>
}

const { selectAll: selectAllTabs, selectById: selectTabById } =
	tabAdapter.getSelectors<RootState>((state) => state.tabs)

const { addTab, setActiveTab, removeTab, switchTab, closeAllTabs, updateTab } =
	tabSlice.actions

const rootReducer = combineReducers({
	tabs: tabSlice.reducer,
})

const persistConfig: PersistConfig<RootState> = {
	key: 'root',
	storage,
	whitelist: ['tabs'],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: ['persist/PERSIST'],
			},
		}),
	devTools: process.env.NODE_ENV !== 'production',
})

type AppDispatch = typeof store.dispatch

const useAppSelector = <T>(selector: (state: RootState) => T) =>
	useSelector<RootState, T>(selector)

export const useTabContext = () => {
	const dispatch = useDispatch<AppDispatch>()
	const tabs = useAppSelector(selectAllTabs)
	const activeTabId = useAppSelector((state) => state.tabs.activeTabId)
	const activeTab = useAppSelector((state) =>
		activeTabId ? selectTabById(state, activeTabId) : null
	)
	const isTabOnboarding = activeTab && activeTab.id === '_welcome_tab_id'
	const isTabEditor = activeTab && activeTab.id !== '_welcome_tab_id'

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
		isTabOnboarding,
		isTabEditor,
		...boundActions,
	}
}
export const persistor = persistStore(store)
