'use client'

import TabProvider from '@/components/providers/TabProvider'
import { FC, ReactNode } from 'react'
import { Toaster } from 'react-hot-toast'
import Header from '../ui/header'
import Sidebar from '../ui/sidebar'
import EditorLayout from './EditorLayout'

interface IMainLayoutProp {
	children: ReactNode
}

const MainLayout: FC<IMainLayoutProp> = ({ children }) => (
	<div className="flex h-screen flex-col">
		<TabProvider>
			<Header />
			<Toaster position="top-center" reverseOrder={true} />
			<div className="inline-flex flex-row overflow-hidden">
				<Sidebar />
				<main className="grow overflow-y-auto">
					<EditorLayout>{children}</EditorLayout>
				</main>
			</div>
		</TabProvider>
	</div>
)

export default MainLayout
