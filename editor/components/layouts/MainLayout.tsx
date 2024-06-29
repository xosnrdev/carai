'use client'

import useAppContext from '@/hooks/useAppContext'
import { cn } from '@/lib/utils'
import { type FC, type ReactNode } from 'react'
import { Toaster } from 'react-hot-toast'
import Header from '../ui/header'
import Sidebar from '../ui/sidebar'
import ThemeLayout from './ThemeLayout'

export interface MainLayoutProps {
	children: ReactNode
}

const MainLayout: FC<MainLayoutProps> = ({ children }) => {
	const { isOpen } = useAppContext()

	return (
		<ThemeLayout>
			<div className="custom-scrollbar flex h-dvh flex-col overflow-hidden">
				<Header />
				<Toaster position="top-center" reverseOrder={true} />
				<div
					className={cn('flex h-dvh flex-col overflow-hidden', {
						'flex-row': isOpen.sidebar,
					})}
				>
					<Sidebar />
					<div
						className={cn('h-full bg-[#FFFFFF] dark:bg-[#1E1E2A]', {
							'flex-1': isOpen.sidebar,
						})}
					>
						{children}
					</div>
				</div>
			</div>
		</ThemeLayout>
	)
}

export default MainLayout
