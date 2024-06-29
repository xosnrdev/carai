import useKeyPress from '@/hooks/useKeyPress'
import useTabContext from '@/hooks/useTabContext'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import { memo, useCallback, type FC, type MouseEvent } from 'react'
import CustomTooltip from './customTooltip'

const Tab: FC<TabProps> = memo(
	({ id, title, activeTabId, setActiveTab, closeTab }) => {
		const pathname = usePathname()
		const { isMobileView } = useTabContext()
		const handleCloseTab = useCallback(
			(e: MouseEvent<HTMLButtonElement> | KeyboardEvent) => {
				closeTab(e, id)
			},
			[closeTab, id]
		)

		useKeyPress({
			targetKey: 'W',
			callback: (e) => {
				if (id && pathname === '/') {
					handleCloseTab(e)
				}
			},
			modifier: ['ctrlKey', 'shiftKey'],
		})

		return (
			<div
				className={cn(
					'flex h-11 cursor-pointer flex-row items-center gap-x-0.5 px-1 text-sm transition-all delay-300 duration-150 ease-linear hover:border-b hover:border-primary hover:dark:border-[#FFFFFF] lg:text-base xl:text-base',
					{
						'border-b border-primary dark:border-[#FFFFFF]': activeTabId === id,
					}
				)}
			>
				<CustomTooltip
					content={
						isMobileView ? (
							<p className="text-xs">Switch</p>
						) : (
							<p className="text-xs">
								Switch &#40;ctrl&#43;shift&#43;arrowkey&#41;
							</p>
						)
					}
				>
					<div
						id="tab-container"
						tabIndex={0}
						role="tab"
						key={id}
						onClick={() => setActiveTab(id)}
						aria-label={`tab ${id}`}
					>
						<span className="whitespace-nowrap">{title}</span>
					</div>
				</CustomTooltip>

				<CustomTooltip
					content={
						isMobileView ? (
							<p className="text-xs">Close</p>
						) : (
							<p className="text-xs">Close &#40;ctrl&#43;shift&#43;w&#41;</p>
						)
					}
				>
					<button
						onClick={handleCloseTab}
						className="inline-flex size-0 items-center justify-center rounded p-2.5 hover:bg-slate-500/25"
					>
						x
					</button>
				</CustomTooltip>
			</div>
		)
	}
)

Tab.displayName = 'Tab'

export default Tab
