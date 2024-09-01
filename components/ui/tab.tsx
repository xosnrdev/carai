import { usePathname } from 'next/navigation'
import { memo, useCallback, forwardRef, type FC, type MouseEvent } from 'react'
import { MdClose } from 'react-icons/md'

import useKeyPress from '@/hooks/useKeyPress'
import { cn } from '@/lib/utils'
import { TabProps } from '@/types'
import useTabContext from '@/hooks/useTabContext'

const Tab: FC<TabProps> = memo(
    forwardRef<HTMLDivElement, TabProps>(
        ({ id, filename, activeTabId, setActiveTab, closeTab }, ref) => {
            const { updateTab } = useTabContext()
            const pathname = usePathname()

            const handleCloseTab = useCallback(
                (e: MouseEvent<HTMLButtonElement> | KeyboardEvent) => {
                    closeTab(e, id)
                },
                [closeTab, id]
            )

            const handleFilenameChange = useCallback(() => {
                const newFilename = prompt(
                    'Enter new filename',
                    filename
                )?.trim()

                if (!newFilename) return

                updateTab({
                    id,
                    filename: newFilename,
                })
            }, [id, filename, updateTab])

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
                <section
                    key={id}
                    ref={ref}
                    aria-label="tab"
                    className={cn(
                        'inline-flex h-8 cursor-pointer items-center border-b border-r border-default pl-2 transition-all delay-300 duration-150 ease-linear hover:border-b hover:border-b-primary hover:dark:border-b-default-foreground',
                        {
                            'border-b border-b-primary dark:border-b-default-foreground':
                                activeTabId === id,
                        }
                    )}
                    id={id}
                    role="tab"
                    onContextMenu={(e) => {
                        handleFilenameChange()
                        e.preventDefault()
                    }}
                >
                    <span
                        aria-label="tab filename"
                        role="button"
                        tabIndex={0}
                        onMouseDown={(e) => {
                            setActiveTab(id)
                            e.preventDefault()
                        }}
                    >
                        {filename}
                    </span>
                    <button
                        className="rounded-full p-1 text-sm hover:bg-default"
                        onClick={handleCloseTab}
                    >
                        <MdClose />
                    </button>
                </section>
            )
        }
    )
)

Tab.displayName = 'Tab'

export default Tab
