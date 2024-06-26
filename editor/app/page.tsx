'use client'

import Editor from '@/components/ui/editor'
import Footer from '@/components/ui/footer'
import Onboarding from '@/components/ui/onboarding'
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from '@/components/ui/resizable'
import TabBar from '@/components/ui/tab-bar'
import useTabContext from '@/hooks/useTabContext'
import type { CodeResponse } from '@/lib/types/response'
import { cn } from '@/lib/utils'
import { RCEFormatter } from '@/network/rce-client'
import { usePathname } from 'next/navigation'
import { useEffect, useState, type FC } from 'react'
import type { PanelOnResize } from 'react-resizable-panels'

const Home: FC = () => {
	const pathname = usePathname()
	const { isTabViewEditor, activeTab, tabs, codeResponse, onResize } =
		useTabContext()
	const [minSize, setMinSize] = useState(30)
	const [defaultSize, setDefaultSize] = useState(70)

	useEffect(() => {
		if (activeTab) {
			const tabLength = tabs.length
			const newMinSize = Math.max(30, tabLength * 12)

			if (newMinSize < defaultSize && minSize !== newMinSize) {
				setMinSize(newMinSize)
			}
		}
	}, [activeTab, tabs, minSize, defaultSize])

	const handlePanelOnResize: PanelOnResize = (newSize) => {
		if (newSize <= 100 && newSize >= minSize) {
			setDefaultSize(newSize)
		} else if (newSize > 100) {
			setDefaultSize(100)
		} else if (newSize < minSize) {
			setDefaultSize(minSize)
		}
	}

	const adjustedDefaultSize = onResize?.visible
		? Math.max(0, 100 - defaultSize)
		: 0
	const totalDefaultSize = onResize?.visible ? defaultSize : 100
	const adjustedMinSize = onResize?.visible ? 20 : 0
	const rceFormatter = new RCEFormatter(codeResponse as CodeResponse)
	const formattedResponse = rceFormatter.format()

	let combinedError: string | undefined
	let displayOutput: string | undefined

	if (formattedResponse) {
		;({ combinedError, displayOutput } = formattedResponse)
	}

	return (
		<main className="relative size-full">
			<ResizablePanelGroup
				direction="horizontal"
				role="tabpanel"
				id="editor-playground-container"
				className="absolute"
			>
				<ResizablePanel
					defaultSize={totalDefaultSize}
					minSize={minSize}
					id="panel1"
					order={1}
				>
					<div className="flex size-full flex-col">
						{pathname === '/' && <TabBar />}
						<div
							className={cn('custom-scrollbar flex-1 overflow-y-scroll', {
								'overflow-hidden': isTabViewEditor,
							})}
						>
							{isTabViewEditor ? (
								<Editor
									className="z-50 size-full"
									id="playground-left-container"
									role="tabpanel"
									tabIndex={0}
									aria-label={`playground for ${activeTab ? activeTab.meta : 'unknown language'}`}
									key={activeTab?.id}
								/>
							) : (
								<Onboarding />
							)}
						</div>
						<Footer />
					</div>
				</ResizablePanel>

				{isTabViewEditor && onResize?.visible && (
					<>
						<ResizableHandle className="border-x border-solid border-primary dark:border-secondary-foreground" />
						<ResizablePanel
							minSize={adjustedMinSize}
							defaultSize={adjustedDefaultSize}
							onResize={handlePanelOnResize}
							id="panel2"
							order={2}
						>
							<div className="flex size-full flex-col bg-secondary p-4">
								<div
									tabIndex={0}
									id="playground-right-container"
									className="custom-scrollbar flex-1 overflow-x-scroll font-mono"
									role="tabpanel"
									key={activeTab?.id}
								>
									{codeResponse && (
										<pre
											className={cn('whitespace-pre-wrap', {
												'text-yellow-500': combinedError,
											})}
										>
											{combinedError || displayOutput}
										</pre>
									)}
								</div>
							</div>
						</ResizablePanel>
					</>
				)}
			</ResizablePanelGroup>
		</main>
	)
}

export default Home
