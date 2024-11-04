import type { PersistConfig, WebStorage } from "redux-persist";

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { persistReducer, persistStore } from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

import app_slice from "./app/slice";
import tab_slice from "./tab/slice";

export { persistor, useGlobalSelector, type AppDispatch, type RootState, store as default };

const createNoopStorage = (): WebStorage => {
    return {
        getItem(_key) {
            return Promise.resolve(null);
        },
        setItem(_key, _value) {
            return Promise.resolve();
        },
        removeItem(_key) {
            return Promise.resolve();
        },
    };
};

const storage = typeof window !== "undefined" ? createWebStorage("session") : createNoopStorage();

const rootReducer = combineReducers({
    tabs: tab_slice.reducer,
    app: app_slice.reducer,
});

type RootState = {
    tabs: ReturnType<typeof tab_slice.reducer>;
    app: ReturnType<typeof app_slice.reducer>;
};

const persistConfig: PersistConfig<RootState> = {
    key: "root",
    storage,
    whitelist: ["tabs", "app"],
};
const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ["persist/PERSIST"],
            },
        }),
    devTools: process.env.NODE_ENV !== "production",
});

const persistor = persistStore(store);
const useGlobalSelector = <T>(selector: (state: RootState) => T) =>
    useSelector<RootState, T>(selector);

type AppDispatch = typeof store.dispatch;
