import { cn } from '@/lib/utils'
import { FC, MouseEvent, memo, useCallback } from 'react'

const Tab: FC<TabProps> = memo(
	({ id, title, activeTabId, setActiveTab, closeTab }) => {
		const handleCloseTab = useCallback(
			function (e: MouseEvent<HTMLButtonElement> | KeyboardEvent) {
				e.preventDefault()
				closeTab(e, id)
			},
			[closeTab, id]
		)

		// useKeyPress({
		// 	targetKey: 'w',
		// 	callback: function (event) {
		// 		handleCloseTab(event);
		// 	},
		// 	modifier: 'ctrlKey',
		// });
		return (
			<div
				id="tab-container"
				tabIndex={0}
				role="tab"
				aria-label="tab"
				key={id}
				className={cn(
					'm-auto flex h-12 items-center border-t-2 border-solid border-[#FFFFFF] bg-[#FFFFFF] px-2 transition-all delay-300 duration-150 ease-linear hover:border-primary dark:border-[#1E1E2A] dark:bg-[#1E1E2A] dark:hover:border-secondary-foreground',
					{
						'border-primary dark:border-secondary-foreground':
							activeTabId === id,
					}
				)}
			>
				<span
					role="button"
					onClick={() => setActiveTab(id)}
					className="cursor-pointer whitespace-nowrap"
					aria-label="switch active tab"
				>
					{title}
				</span>

				<button
					role="button"
					onClick={handleCloseTab}
					className={cn('ml-2 rounded-full bg-primary p-1 dark:bg-[#E0E0F5]', {
						'animate-pulse': activeTabId === id,
					})}
					aria-label="close tab"
				></button>
			</div>
		)
	}
)

Tab.displayName = 'Tab'

export default Tab
