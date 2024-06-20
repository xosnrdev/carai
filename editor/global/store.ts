import { combineReducers, configureStore } from '@reduxjs/toolkit'
import type { PersistConfig } from 'redux-persist'
import { persistReducer, persistStore } from 'redux-persist'
import createWebStorage from 'redux-persist/lib/storage/createWebStorage'
import appSlice from './app/slice'
import tabSlice from './tab/slice'

const createNoopStorage = () => {
	return {
		getItem(_key: string) {
			return Promise.resolve(null)
		},
		setItem(_key: string, _value: string) {
			return Promise.resolve()
		},
		removeItem(_key: string) {
			return Promise.resolve()
		},
	}
}

const storage =
	typeof window !== 'undefined'
		? createWebStorage('local')
		: createNoopStorage()

const rootReducer = combineReducers({
	tabs: tabSlice.reducer,
	app: appSlice.reducer,
})

export type RootState = {
	tabs: ReturnType<typeof tabSlice.reducer>
	app: ReturnType<typeof appSlice.reducer>
}

const persistConfig: PersistConfig<RootState> = {
	key: 'root',
	storage,
	whitelist: ['tabs'],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: ['persist/PERSIST'],
			},
		}),
	devTools: process.env.NODE_ENV !== 'production',
})

export default store

export const persistor = persistStore(store)
export type AppDispatch = typeof store.dispatch
