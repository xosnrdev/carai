import { usePathname } from 'next/navigation'
import { useCallback, useRef } from 'react'

import useKeyPress from '@/hooks/useKeyPress'
import useTabContext from '@/hooks/useTabContext'

import { scrollActiveTabIntoView } from './utils'
import Tab from './tab'

export default function Tabs() {
    const pathname = usePathname()
    const {
        tabs,
        activeTab,
        removeTab,
        switchTab,
        closeAllTabs,
        setActiveTab,
        tabIndexMap,
        codeResponse,
    } = useTabContext()

    const activeTabRef = useRef<HTMLDivElement | null>(null)

    const handleScrollActiveTabIntoView = useCallback(() => {
        scrollActiveTabIntoView(activeTabRef, tabIndexMap)
    }, [activeTabRef, tabIndexMap])

    const handleCloseTab = (id: string) => {
        removeTab(id)
        handleScrollActiveTabIntoView()
    }

    const isAnimatingRef = useRef(false)

    const handleSwitchTab = useCallback(
        (direction: 'next' | 'previous') => {
            if (!isAnimatingRef.current) {
                isAnimatingRef.current = true
                requestAnimationFrame(() => {
                    switchTab(direction)
                    handleScrollActiveTabIntoView()
                    isAnimatingRef.current = false
                })
            }
        },
        [isAnimatingRef, switchTab, handleScrollActiveTabIntoView]
    )

    useKeyPress({
        targetKey: 'Q',
        callback: () => {
            if (
                activeTab &&
                pathname === '/sandbox' &&
                !codeResponse?.isRunning
            ) {
                closeAllTabs()
            }
        },
        modifier: ['ctrlKey', 'shiftKey'],
    })

    useKeyPress({
        targetKey: 'ArrowRight',
        callback: () => {
            if (activeTab && pathname === '/sandbox') {
                handleSwitchTab('next')
            }
        },
        modifier: ['ctrlKey', 'shiftKey'],
    })

    useKeyPress({
        targetKey: 'ArrowLeft',
        callback: () => {
            if (activeTab && pathname === '/sandbox') {
                handleSwitchTab('previous')
            }
        },
        modifier: ['ctrlKey', 'shiftKey'],
    })

    return (
        <aside className="sticky top-0 z-50 bg-background">
            <div
                aria-label="tabs"
                className={'flex flex-row overflow-x-auto'}
                role="tablist"
            >
                {tabs.map(({ id, filename }) => (
                    <Tab
                        key={id}
                        ref={activeTab.id === id ? activeTabRef : null}
                        activeTabId={activeTab.id}
                        closeTab={handleCloseTab}
                        filename={filename}
                        id={id}
                        setActiveTab={setActiveTab}
                    />
                ))}
            </div>
        </aside>
    )
}
