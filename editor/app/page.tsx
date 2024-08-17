'use client'

import type { PanelOnResize } from 'react-resizable-panels'

import dynamic from 'next/dynamic'
import { type FC, useEffect, useState } from 'react'

import Footer from '@/components/ui/footer'
import { LoadingSpinner } from '@/components/ui/icons'
import Onboarding from '@/components/ui/onboarding'
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from '@/components/ui/resizable'
import Tabs from '@/components/ui/tabs'
import useTabContext from '@/hooks/useTabContext'
import { cn } from '@/lib/utils'

const EditorLayout = dynamic(
    () => import('@/components/layouts/EditorLayout'),
    {
        loading: () => <LoadingSpinner size={75} />,
        ssr: false,
    }
)

const Home: FC = () => {
    const { tabs, activeTab, codeResponse, resizePanel } = useTabContext()

    const [minSize, setMinSize] = useState(50)
    const [defaultSize, setDefaultSize] = useState(50)

    useEffect(() => {
        if (!activeTab && !resizePanel?.visible) return

        const tabLength = tabs.length
        const newMinSize = Math.max(30, tabLength * 15)

        if (newMinSize < defaultSize && minSize !== newMinSize) {
            setMinSize(newMinSize)
        }
    }, [activeTab, tabs, minSize, defaultSize, resizePanel])

    const handlePanelOnResize: PanelOnResize = (newSize) => {
        if (newSize <= 100 && newSize >= minSize) {
            setDefaultSize(newSize)
        } else if (newSize > 100) {
            setDefaultSize(100)
        } else if (newSize < minSize) {
            setDefaultSize(minSize)
        }
    }

    const resolvedDefaultSize = resizePanel?.visible
        ? Math.max(0, 100 - defaultSize)
        : 0
    const totalDefaultSize = resizePanel?.visible ? defaultSize : 100
    const resolvedMinSize = resizePanel?.visible ? 20 : 0

    return (
        <EditorLayout>
            <main className="relative h-full">
                <ResizablePanelGroup
                    className="absolute inset-0"
                    direction="horizontal"
                >
                    <ResizablePanel
                        defaultSize={totalDefaultSize}
                        id="left-panel"
                        minSize={minSize}
                        order={1}
                    >
                        <div className="flex h-full flex-col justify-between overflow-hidden">
                            <div
                                className={cn('flex-1 overflow-auto', {
                                    'overflow-hidden': activeTab,
                                })}
                            >
                                {activeTab ? <Tabs /> : <Onboarding />}
                            </div>
                            <div
                                className={cn('block', {
                                    hidden: activeTab && resizePanel.visible,
                                })}
                            >
                                <Footer />
                            </div>
                        </div>
                    </ResizablePanel>

                    {activeTab && resizePanel.visible && (
                        <>
                            <ResizableHandle className="border-y border-primary dark:border-default-foreground lg:border-x xl:border-x" />
                            <ResizablePanel
                                defaultSize={resolvedDefaultSize}
                                id="right-panel"
                                minSize={resolvedMinSize}
                                order={2}
                                onResize={handlePanelOnResize}
                            >
                                <div className="flex h-full flex-col bg-background">
                                    <div
                                        key={activeTab.id}
                                        className="prose prose-lg flex-1 overflow-auto p-2 font-mono dark:prose-invert"
                                        role="tabpanel"
                                    >
                                        {codeResponse && (
                                            <pre
                                                className={cn(
                                                    'whitespace-pre-wrap',
                                                    {
                                                        'text-warning-500':
                                                            codeResponse.error ||
                                                            codeResponse.stderr,
                                                    }
                                                )}
                                            >
                                                {codeResponse.stdout ||
                                                    codeResponse.stderr ||
                                                    codeResponse.error}
                                            </pre>
                                        )}
                                    </div>
                                </div>
                            </ResizablePanel>
                        </>
                    )}
                </ResizablePanelGroup>
            </main>
        </EditorLayout>
    )
}

export default Home
