import type { TabId } from '@/global/tab/slice'
import useKeyPress from '@/hooks/useKeyPress'
import useTabContext from '@/hooks/useTabContext'
import { tabBarProps } from '@/lib/constants/ui'
import { type CodeResponse, type ErrorResponse } from '@/lib/types/response'
import { cn } from '@/lib/utils'
import { RCEHandler } from '@/network/rce-client'
import { usePathname } from 'next/navigation'
import { useCallback, useState, type FC, type MouseEvent } from 'react'
import toast from 'react-hot-toast'
import { Button } from './button'
import Tab from './tab'

const rceHandler = new RCEHandler()

const TabBar: FC = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const pathname = usePathname()
	const {
		tabs,
		onResize,
		activeTab,
		removeTab,
		switchTab,
		setOnResize,
		activeTabId,
		isMobileView,
		closeAllTabs,
		codeResponse,
		setActiveTab,
		isTabViewEditor,
		setCodeResponse,
	} = useTabContext()

	const handleCloseTab = (
		e: MouseEvent<HTMLButtonElement> | KeyboardEvent,
		id: TabId
	) => {
		e.stopPropagation()
		removeTab(id)
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

	const handleCodeExecution = useCallback(() => {
		return new Promise<CodeResponse>((resolve, reject) => {
			if (!activeTab) return
			const { id, meta: language, content: code } = activeTab

			if (!code.trim()) {
				reject(new Error('No payload exit 1'))
				return
			}

			if (language && code) {
				setIsLoading(true)
				rceHandler
					.execute({
						language: language,
						version: 'latest',
						code,
					})
					.then((codeResponse) => {
						if (!codeResponse.runtime.output.trim()) {
							reject(
								new Error('No response exit ' + codeResponse.runtime.exitCode)
							)
						}

						setCodeResponse({ id, codeResponse })
						resolve(codeResponse)
					})
					.catch((error: ErrorResponse) => {
						reject(error)
						throw error
					})
					.finally(() => {
						setIsLoading(false)
					})
			}
		})
	}, [setCodeResponse, activeTab])

	useKeyPress({
		targetKey: 'D',
		callback: () => {
			if (activeTab && pathname === '/') {
				closeAllTabs()
			}
		},
		modifier: ['ctrlKey', 'shiftKey'],
	})
	useKeyPress({
		targetKey: 'ArrowRight',
		callback: () => {
			if (activeTab && pathname === '/') {
				switchTab('next')
			}
		},
		modifier: ['ctrlKey', 'shiftKey'],
	})
	useKeyPress({
		targetKey: 'ArrowLeft',
		callback: () => {
			if (activeTab && pathname === '/') {
				switchTab('previous')
			}
		},
		modifier: ['ctrlKey', 'shiftKey'],
	})

	return (
		<div className="sticky top-0 z-10 flex w-full flex-row items-center justify-between bg-secondary lg:px-8 xl:px-8">
			<div className="flex flex-row items-center">
				{activeTab &&
					tabs.length > 1 &&
					tabBarProps.map((prop, index) => {
						const isDisabled =
							(index === 0 &&
								tabs.findIndex((tab) => tab.id === activeTabId) === 0) ||
							(index === 1 &&
								tabs.findIndex((tab) => tab.id === activeTabId) ===
									tabs.length - 1)

						return (
							<div
								key={index}
								className={cn(
									'mx-auto flex flex-row items-center px-2 text-muted-foreground dark:text-[#FFFFFF66]',
									{
										'text-primary dark:text-white': !isDisabled,
									}
								)}
							>
								<button
									id="tab-navigation-button"
									tabIndex={0}
									role="button"
									onClick={() => switchTab(index === 0 ? 'previous' : 'next')}
									aria-label={`Switch to ${index === 0 ? 'previous' : 'next'} tab`}
									aria-disabled={
										index === 0
											? activeTabId === tabs[0]?.id
											: activeTabId === tabs[tabs.length - 1]?.id
									}
									disabled={isDisabled}
								>
									<prop.icon size={22} />
								</button>
							</div>
						)
					})}
				<div
					className="flex flex-row"
					role="tablist"
					tabIndex={0}
					aria-label="tab bar area"
					id="tab-bar-container"
				>
					{tabs.map(({ id, title }) => (
						<Tab
							key={id}
							id={id}
							title={title}
							activeTabId={activeTabId}
							setActiveTab={setActiveTab}
							closeTab={handleCloseTab}
						/>
					))}
				</div>
			</div>

			{isTabViewEditor && (
				<div className="inline-flex flex-row items-center justify-center space-x-3">
					<Button
						className="inline-flex items-center gap-x-2 bg-[#1B501D] p-2 text-base text-white"
						variant={null}
						onClick={(e) => {
							e.preventDefault()
							toast.promise(handleCodeExecution(), {
								loading: 'Processing...',
								success: 'Process exit 0',
								error: (err: Error) => <>{err.message}</>,
							})
							if (!codeResponse) return
							if (activeTab && !onResize?.visible) {
								const { id } = activeTab
								setOnResize({
									id,
									onResize: {
										visible: true,
									},
								})
							}
						}}
						disabled={isLoading}
					>
						<svg
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<g clipPath="url(#clip0_2982_19306)">
								<path
									d="M2 1.92188C0.89543 1.92188 0 2.81731 0 3.92188V12.1559C0 13.2605 0.895431 14.1559 2 14.1559H22C23.1046 14.1559 24 13.2605 24 12.1559V3.92188C24 2.81731 23.1046 1.92188 22 1.92188H2ZM9.45313 10.438C9.69324 10.7432 9.64052 11.1852 9.33538 11.4253C9.03022 11.6654 8.58818 11.6127 8.34805 11.3076L6.74922 9.27564C6.17823 8.54999 6.17823 7.52777 6.74922 6.80212L8.34805 4.7702C8.58818 4.46504 9.03022 4.41232 9.33538 4.65245C9.64052 4.89257 9.69324 5.33459 9.45313 5.63974L8.5385 6.80213C7.96753 7.52778 7.96753 8.54998 8.5385 9.27562L9.45313 10.438ZM12.7031 11.1297C12.7031 11.518 12.3883 11.8328 12 11.8328C11.6117 11.8328 11.2969 11.518 11.2969 11.1297V4.94806C11.2969 4.55973 11.6117 4.24493 12 4.24493C12.3883 4.24493 12.7031 4.55973 12.7031 4.94806V11.1297ZM15.6519 11.3076C15.4118 11.6127 14.9698 11.6654 14.6646 11.4253C14.3595 11.1852 14.3068 10.7432 14.5469 10.438L15.4615 9.27562C16.0325 8.54998 16.0325 7.52778 15.4615 6.80213L14.5469 5.63974C14.3068 5.33459 14.3595 4.89257 14.6646 4.65245C14.9698 4.41232 15.4118 4.46504 15.6519 4.7702L17.2508 6.80212C17.8218 7.52777 17.8218 8.54999 17.2508 9.27564L15.6519 11.3076Z"
									fill="white"
								/>
								<path
									d="M0 17.439C0 18.4753 0.840122 19.3154 1.87646 19.3154H6.83963C7.22861 19.3154 7.54395 19.6309 7.54395 20.0199C7.54395 20.4087 7.22828 20.7241 6.83945 20.7241C6.45112 20.7241 6.13586 21.0389 6.13586 21.4272C6.13586 21.8155 6.45066 22.1303 6.83899 22.1303H17.161C17.5493 22.1303 17.8641 21.8155 17.8641 21.4272C17.8641 21.0389 17.5489 20.7241 17.1606 20.7241C16.7717 20.7241 16.4561 20.4087 16.4561 20.0199C16.4561 19.6309 16.7714 19.3154 17.1604 19.3154H22.1235C23.1599 19.3154 24 18.4753 24 17.439C24 16.4026 23.1599 15.5625 22.1235 15.5625H1.87646C0.840122 15.5625 0 16.4026 0 17.439Z"
									fill="white"
								/>
							</g>
							<defs>
								<clipPath id="clip0_2982_19306">
									<rect width="24" height="24" fill="white" />
								</clipPath>
							</defs>
						</svg>
						{isLoading ? 'Running' : 'Run'}
					</Button>
					{!isMobileView && (
						<Button
							variant={null}
							size={'icon'}
							role="button"
							className="rounded-none text-2xl hover:bg-[#FFFFFF] hover:dark:bg-[#1E1E2A]"
							onClick={handleOnResizeVisible}
						>
							{onResize?.visible ? '⇥' : '⇤'}
						</Button>
					)}
				</div>
			)}
		</div>
	)
}

export default TabBar
