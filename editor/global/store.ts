import { combineReducers, configureStore } from '@reduxjs/toolkit'
import type { PersistConfig, WebStorage } from 'redux-persist'
import { persistReducer, persistStore } from 'redux-persist'
import createWebStorage from 'redux-persist/lib/storage/createWebStorage'
import tabSlice from './tab/slice'

const createNoopStorage = (): WebStorage => {
	return {
		getItem(_key) {
			return Promise.resolve(null)
		},
		setItem(_key, _value) {
			return Promise.resolve()
		},
		removeItem(_key) {
			return Promise.resolve()
		},
	}
}

const storage =
	typeof window !== 'undefined'
		? createWebStorage('session')
		: createNoopStorage()

const rootReducer = combineReducers({
	tabs: tabSlice.reducer,
})

export type RootState = {
	tabs: ReturnType<typeof tabSlice.reducer>
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
