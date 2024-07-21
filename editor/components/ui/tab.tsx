import { usePathname } from 'next/navigation'
import { memo, useCallback, type FC, type MouseEvent } from 'react'
import { MdClose } from 'react-icons/md'

import useKeyPress from '@/hooks/useKeyPress'
import { cn } from '@/lib/utils'
import { TabProps } from '@/types'

const Tab: FC<TabProps> = memo(
    ({ id, title, activeTabId, setActiveTab, closeTab }) => {
        const pathname = usePathname()
        const handleCloseTab = useCallback(
            (e: MouseEvent<HTMLButtonElement> | KeyboardEvent) => {
                closeTab(e, id)
            },
            [closeTab, id]
        )

        useKeyPress({
            targetKey: 'W',
            callback: (e) => {
                if (id === activeTabId && pathname === '/') {
                    handleCloseTab(e)
                }
            },
            modifier: ['ctrlKey', 'shiftKey'],
        })

        return (
            <div
                key={id}
                aria-label="tab"
                className={cn(
                    'inline-flex cursor-pointer items-center border-r border-default pl-2 transition-all delay-300 duration-150 ease-linear hover:border-b hover:border-b-primary hover:dark:border-b-default-foreground',
                    {
                        'border-b border-b-primary dark:border-b-default-foreground':
                            activeTabId === id,
                    }
                )}
                role="tab"
            >
                <span
                    aria-label="tab title"
                    role="button"
                    tabIndex={0}
                    onMouseDown={(e) => {
                        setActiveTab(id)
                        e.preventDefault()
                    }}
                >
                    {title}
                </span>
                <button
                    className="rounded-full p-1 text-sm hover:bg-default"
                    onClick={handleCloseTab}
                >
                    <MdClose />
                </button>
            </div>
        )
    }
)

Tab.displayName = 'Tab'

export default Tab
