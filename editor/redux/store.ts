import type { PersistConfig, WebStorage } from 'redux-persist'

import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import { persistReducer, persistStore } from 'redux-persist'
import createWebStorage from 'redux-persist/lib/storage/createWebStorage'

import apps_slice from './app/slice'
import tabs_slice from './tab/slice'

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
    },
    storage =
        typeof window !== 'undefined'
            ? createWebStorage('session')
            : createNoopStorage(),
    rootReducer = combineReducers({
        tabs: tabs_slice.reducer,
        app: apps_slice.reducer,
    })

type RootState = {
    tabs: ReturnType<typeof tabs_slice.reducer>
    app: ReturnType<typeof apps_slice.reducer>
}

const persistConfig: PersistConfig<RootState> = {
        key: 'root',
        storage,
        whitelist: ['tabs', 'app'],
    },
    persistedReducer = persistReducer(persistConfig, rootReducer),
    store = configureStore({
        reducer: persistedReducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                serializableCheck: {
                    ignoredActions: ['persist/PERSIST'],
                },
            }),
        devTools: process.env.NODE_ENV !== 'production',
    })

const persistor = persistStore(store),
    useGlobalSelector = <T>(selector: (state: RootState) => T) =>
        useSelector<RootState, T>(selector)
type AppDispatch = typeof store.dispatch

export {
    persistor,
    useGlobalSelector,
    type AppDispatch,
    type RootState,
    store as default,
}
