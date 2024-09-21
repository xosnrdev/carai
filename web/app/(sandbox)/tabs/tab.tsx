import type { TabProp } from './types'

import { usePathname } from 'next/navigation'
import { forwardRef, memo, useCallback, useRef, type FC } from 'react'
import { X } from 'lucide-react'

import useKeyPress from '@/hooks/useKeyPress'
import useTabContext from '@/hooks/useTabContext'
import { cn } from '@/lib/utils'

const Tab: FC<TabProp> = memo(
    forwardRef<HTMLDivElement, TabProp>(
        ({ id, filename, activeTabId, setActiveTab, closeTab }, ref) => {
            const { updateTab, codeResponse } = useTabContext()
            const pathname = usePathname()

            const isAnimatingRef = useRef(false)

            const handleCloseTab = useCallback(() => {
                if (!isAnimatingRef.current) {
                    isAnimatingRef.current = true
                    requestAnimationFrame(() => {
                        closeTab(id)

                        isAnimatingRef.current = false
                    })
                }
            }, [closeTab, id, isAnimatingRef])

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
                callback: () => {
                    if (
                        id === activeTabId &&
                        pathname === '/sandbox' &&
                        !codeResponse?.isRunning
                    ) {
                        handleCloseTab()
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
                        'flex h-10 cursor-pointer items-center border-b border-r border-default pl-2 text-center transition-colors duration-500 hover:border-b hover:border-b-primary hover:dark:border-b-white',
                        {
                            'border-b border-b-primary dark:border-b-white':
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
                        onMouseDown={() => {
                            setActiveTab(id)
                        }}
                    >
                        {filename}
                    </span>
                    <button
                        className="ml-1 rounded-full p-1 hover:bg-default"
                        disabled={codeResponse?.isRunning}
                        onClick={(e) => {
                            handleCloseTab()
                            e.stopPropagation()
                        }}
                    >
                        <X size={16} />
                    </button>
                </section>
            )
        }
    )
)

Tab.displayName = 'Tab'

export default Tab
