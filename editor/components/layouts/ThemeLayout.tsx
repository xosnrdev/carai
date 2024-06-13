import { FC, ReactNode } from 'react'
import { ThemeProvider } from '../providers/ThemeProvider'

interface IThemeLayoutProp {
	children: ReactNode
}

const ThemeLayout: FC<IThemeLayoutProp> = ({ children }) => {
	return (
		<>
			<ThemeProvider
				attribute="class"
				defaultTheme="dark"
				enableSystem
				disableTransitionOnChange
				storageKey={process.env.NEXT_PUBLIC_STORAGE_KEY}
			>
				{children}
			</ThemeProvider>
		</>
	)
}

export default ThemeLayout
