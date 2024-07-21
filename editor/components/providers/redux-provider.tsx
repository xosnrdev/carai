'use client'

import type { FC, ReactNode } from 'react'

import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import store, { persistor } from '@/redux/store'

import LoadingSpinner from '../ui/loading-spinner'

export interface ReduxProviderProps {
    children: ReactNode
}

const ReduxProvider: FC<ReduxProviderProps> = ({ children }) => {
    return (
        <Provider store={store}>
            <PersistGate loading={<LoadingSpinner />} persistor={persistor}>
                {children}
            </PersistGate>
        </Provider>
    )
}

export default ReduxProvider
