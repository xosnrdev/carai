import { cn } from '@/lib/utils';
import { FC, MouseEvent, memo, useCallback } from 'react';

const Tab: FC<TabProps> = memo(
	({ id, title, activeTabId, setActiveTab, closeTab }) => {
		const handleCloseTab = useCallback(
			function (e: MouseEvent<HTMLButtonElement> | KeyboardEvent) {
				e.preventDefault();
				closeTab(e, id);
			},
			[closeTab, id]
		);

		// useKeyPress({
		// 	targetKey: 'w',
		// 	callback: function (event) {
		// 		handleCloseTab(event);
		// 	},
		// 	modifier: 'ctrlKey',
		// });
		return (
			<div
				key={id}
				className={cn(
					'flex items-center border-t-2 border-solid border-[#FFFFFF] dark:border-[#1E1E2A] dark:bg-[#1E1E2A] bg-[#FFFFFF] px-4 py-3 transition-all duration-150 hover:border-primary dark:hover:border-secondary-foreground delay-300 ease-linear',
					{
						'border-primary dark:border-secondary-foreground':
							activeTabId === id,
					}
				)}
			>
				<span
					role="button"
					onClick={() => setActiveTab(id)}
					className="cursor-pointer select-none whitespace-nowrap"
					aria-label="switch active tab"
				>
					{title}
				</span>

				<button
					role="button"
					onClick={handleCloseTab}
					className={cn('ml-2 p-1 rounded-full dark:bg-[#E0E0F5] bg-primary', {
						'animate-pulse': activeTabId === id,
					})}
					aria-label="close tab"
				></button>
			</div>
		);
	}
);

Tab.displayName = 'Tab';

export default Tab;
