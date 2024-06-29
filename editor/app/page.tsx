'use client'

import { Button } from '@/components/ui/button'
import CustomTooltip from '@/components/ui/customTooltip'
import Editor from '@/components/ui/editor'
import Footer from '@/components/ui/footer'
import Onboarding from '@/components/ui/onboarding'
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from '@/components/ui/resizable'
import TabBar from '@/components/ui/tab-bar'
import useAppContext from '@/hooks/useAppContext'
import useTabContext from '@/hooks/useTabContext'
import type { CodeResponse } from '@/lib/types/response'
import { cn } from '@/lib/utils'
import { RCEFormatter } from '@/network/rce-client'
import { useCallback, useEffect, useState, type FC } from 'react'
import type { PanelOnResize } from 'react-resizable-panels'

const Home: FC = () => {
	const {
		tabs,
		onResize,
		activeTab,
		activeTabId,
		codeResponse,
		isMobileView,
		setOnResize,
	} = useTabContext()
	const [minSize, setMinSize] = useState(30)
	const [defaultSize, setDefaultSize] = useState(70)
	const { isOpen } = useAppContext()

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

	const handleOnResizeVisible = useCallback(() => {
		if (!activeTab) return
		const { id } = activeTab

		if (onResize?.visible) {
			setOnResize({
				id,
				onResize: {
					visible: false,
				},
			})
		} else {
			setOnResize({
				id,
				onResize: {
					visible: true,
				},
			})
		}
	}, [onResize?.visible, setOnResize, activeTab])

	const adjustedDefaultSize = onResize?.visible
		? Math.max(0, 100 - defaultSize)
		: 0
	const totalDefaultSize = onResize?.visible ? defaultSize : 100
	const adjustedMinSize = onResize?.visible ? 20 : 0
	const rceFormatter = new RCEFormatter(codeResponse as CodeResponse)
	const formattedResponse = rceFormatter.format()

	let combinedError: string | undefined
	let displayOutput: string | undefined

	if (formattedResponse) ({ combinedError, displayOutput } = formattedResponse)

	return (
		<main className="relative size-full">
			<ResizablePanelGroup
				direction={isMobileView ? 'vertical' : 'horizontal'}
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
						<TabBar />
						<div
							className={cn('custom-scrollbar flex-1 overflow-y-auto', {
								'overflow-hidden': activeTab,
							})}
						>
							{activeTab ? (
								<Editor
									className="z-20 size-full"
									id="playground-left-container"
									role="tabpanel"
									tabIndex={0}
									aria-label={`playground for ${activeTab ? activeTab.meta : 'unknown language'}`}
									key={activeTabId}
								/>
							) : (
								<Onboarding />
							)}
						</div>
						<div
							className={cn('block', {
								hidden: activeTab && isMobileView && onResize?.visible,
							})}
						>
							<Footer />
						</div>
					</div>
				</ResizablePanel>

				{activeTab && onResize?.visible && (
					<>
						<ResizableHandle
							className="border-x border-primary dark:border-secondary-foreground"
							withHandle={isMobileView}
						/>
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
									className="custom-scrollbar flex-1 overflow-auto font-mono"
									role="tabpanel"
									key={activeTabId}
								>
									{codeResponse && (
										<pre
											className={cn('whitespace-pre-wrap', {
												'text-yellow-500': combinedError,
												'text-sm': isMobileView,
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

			{isMobileView && activeTab && !isOpen.modal && (
				<CustomTooltip
					content={
						onResize?.visible ? (
							<p className="text-xs">Close Panel</p>
						) : (
							<p className="text-xs">Open Panel</p>
						)
					}
				>
					<Button
						variant={null}
						size={'icon'}
						role="button"
						className="fixed right-0 top-[50%] z-50 translate-x-[-50%] translate-y-[-50%] rounded-none text-xl hover:bg-[#FFFFFF] hover:dark:bg-[#1E1E2A]"
						onClick={handleOnResizeVisible}
					>
						{onResize?.visible ? '↓' : '↑'}
					</Button>
				</CustomTooltip>
			)}
		</main>
	)
}

export default Home
