'use client'

import store, { persistor } from '@/global/store'
import type { FC, ReactNode } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import LoadingSpinner from '../ui/loading-spinner'

export interface GlobalProviderProps {
	children: ReactNode
}

const GlobalProvider: FC<GlobalProviderProps> = ({ children }) => {
	return (
		<Provider store={store}>
			<PersistGate loading={<LoadingSpinner />} persistor={persistor}>
				{children}
			</PersistGate>
		</Provider>
	)
}

export default GlobalProvider
