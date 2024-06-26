'use client'

import { type FC, type ReactNode } from 'react'
import { Toaster } from 'react-hot-toast'
import GlobalProvider from '../providers/GlobalProvider'
import Header from '../ui/header'
import Sidebar from '../ui/sidebar'
import ThemeLayout from './ThemeLayout'

export interface MainLayoutProps {
	children: ReactNode
}

const MainLayout: FC<MainLayoutProps> = ({ children }) => {
	return (
		<ThemeLayout>
			<GlobalProvider>
				<div className="flex h-dvh flex-col">
					<Header />
					<Toaster position="top-center" reverseOrder={true} />
					<div className="flex flex-row overflow-hidden">
						<Sidebar />
						<div className="flex-1 bg-[#FFFFFF] dark:bg-[#1E1E2A]">
							{children}
						</div>
					</div>
				</div>
			</GlobalProvider>
		</ThemeLayout>
	)
}

export default MainLayout
