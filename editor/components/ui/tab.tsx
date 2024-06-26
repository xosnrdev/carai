import useKeyPress from '@/hooks/useKeyPress'
import useTabContext from '@/hooks/useTabContext'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import { FC, MouseEvent, memo, useCallback } from 'react'

const Tab: FC<TabProps> = memo(
	({ id, title, activeTabId, setActiveTab, closeTab }) => {
		const pathname = usePathname()
		const { tabs } = useTabContext()
		const handleCloseTab = useCallback(
			(e: MouseEvent<HTMLButtonElement> | KeyboardEvent) => {
				closeTab(e, id)
			},
			[closeTab, id]
		)

		useKeyPress({
			targetKey: 'w',
			callback: (e) => {
				if (pathname === '/') {
					tabs.forEach((tab, idx) => {
						if (tab.id === id) {
							handleCloseTab(e)
						}
					})
				}
			},
			modifier: 'ctrlKey',
		})
		return (
			<div
				id="tab-container"
				tabIndex={0}
				role="tab"
				key={id}
				onClick={() => setActiveTab(id)}
				aria-label={`tab ${id}`}
				className={cn(
					'flex h-10 cursor-pointer flex-row items-center border-t-2 border-solid border-[#FFFFFF] bg-[#FFFFFF] px-1 transition-all delay-300 duration-150 ease-linear hover:border-primary dark:border-[#1E1E2A] dark:bg-[#1E1E2A] dark:hover:border-secondary-foreground lg:h-12 lg:px-2 xl:h-12 xl:px-2',
					{
						'border-primary dark:border-secondary-foreground':
							activeTabId === id,
					}
				)}
			>
				<span className="whitespace-nowrap">{title}</span>

				<button
					role="button"
					onClick={handleCloseTab}
					className={cn('ml-2 rounded-full bg-primary p-1 dark:bg-[#E0E0F5]', {
						'animate-pulse': activeTabId === id,
					})}
				></button>
			</div>
		)
	}
)

Tab.displayName = 'Tab'

export default Tab
