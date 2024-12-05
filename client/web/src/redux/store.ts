import type { PersistConfig, WebStorage } from "redux-persist";

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { persistReducer, persistStore } from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import { appSlice } from "./app_slice";
import { tabSlice } from "./tab_slice";

export { persistor, useGlobalSelector, type AppDispatch, type RootState, store };

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
    tabs: tabSlice.reducer,
    app: appSlice.reducer,
});

type RootState = {
    tabs: ReturnType<typeof tabSlice.reducer>;
    app: ReturnType<typeof appSlice.reducer>;
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
