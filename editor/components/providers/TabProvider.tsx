import { FC, ReactNode } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor, store } from '@/sdk/tabkit/store'

export interface TabProviderProps {
	children: ReactNode
}

const TabProvider: FC<TabProviderProps> = ({ children }) => {
	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				{children}
			</PersistGate>
		</Provider>
	)
}

export default TabProvider
