import { FC, ReactNode } from 'react'
import Footer from '../ui/footer'
import TabBar from '../ui/tab-bar'
import { usePathname } from 'next/navigation'

interface IEditorLayoutProps {
	children: ReactNode
}

const EditorLayout: FC<IEditorLayoutProps> = ({ children }) => {
	const pathname = usePathname()
	return (
		<div className="flex flex-col items-center">
			{pathname === '/' && <TabBar />}
			<main className="w-full bg-[#FFFFFF] dark:bg-[#1E1E2A]">{children}</main>
			<Footer />
		</div>
	)
}

export default EditorLayout
