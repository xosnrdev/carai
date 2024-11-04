"use client";

import type { FC, ReactNode } from "react";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import store, { persistor } from "@/redux/store";

import { Logo } from "../ui/icons";

export interface ReduxProviderProps {
    children: ReactNode;
}

const ReduxProvider: FC<ReduxProviderProps> = ({ children }) => {
    return (
        <Provider store={store}>
            <PersistGate loading={<Logo size={50} />} persistor={persistor}>
                {children}
            </PersistGate>
        </Provider>
    );
};

export default ReduxProvider;
