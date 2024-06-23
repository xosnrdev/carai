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

const Home: FC = () => {
	const pathname = usePathname()
	const {
		isTabViewEditor,
		activeTab,
		tabs,
		isTabViewOnboarding,
		codeResponse,
		onResize,
		setOnResize,
	} = useTabContext()
	const [minSize, setMinSize] = useState(30)
	const [defaultSize, setDefaultSize] = useState(70)

	useEffect(() => {
		if (activeTab) {
			const tabLength = tabs.length
			const newMinSize = Math.max(30, tabLength * 12)
			setMinSize(newMinSize)
		}
	}, [activeTab, tabs, setMinSize])

	const playgroundTabview = () => {
		switch (true) {
			case isTabViewOnboarding:
				return <Onboarding />

			case isTabViewEditor:
				return <Editor />

			default:
				return <Onboarding />
		}
	}

	const rceFormatter = new RCEFormatter(codeResponse as CodeResponse)
	const formattedResponse = rceFormatter.format()!

	let combinedError: string | undefined
	let displayOutput: string | undefined

	if (formattedResponse) {
		;({ combinedError, displayOutput } = formattedResponse)
	}

	// useEffect(() => {
	// 	if (activeTab) {
	// 		setOnResize({
	// 			id,
	// 			onResize: {
	// 				panelOnResize: (newSize) => {
	// 					setDefaultSize(newSize)
	// 				},
	// 			},
	// 		})
	// 	}
	// }, [id, setOnResize, activeTab])

	const x = 100 - defaultSize

	return (
		<main className="relative h-dvh">
			<ResizablePanelGroup
				direction="horizontal"
				role="tabpanel"
				id="editor-playground-container"
				className="absolute"
			>
				<ResizablePanel defaultSize={defaultSize} minSize={minSize}>
					<div className="flex h-[94dvh] flex-col">
						{pathname === '/' && <TabBar />}
						<div
							className={cn('custom-scrollbar flex-1 overflow-auto', {
								'overflow-hidden': isTabViewEditor,
							})}
						>
							{playgroundTabview()}
						</div>
						<Footer />
					</div>
				</ResizablePanel>

				{isTabViewEditor && onResize?.visible && (
					<>
						<ResizableHandle className="border-x border-solid border-primary dark:border-secondary-foreground" />
						<ResizablePanel
							minSize={20}
							defaultSize={x}
							//onResize={handlePanelOnResize}
						>
							<div className="flex h-[94dvh] flex-col bg-secondary p-4">
								<div
									tabIndex={0}
									id="playground-right-container"
									className="custom-scrollbar flex-1 overflow-auto font-mono"
									role="tabpanel"
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
