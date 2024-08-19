'use client'

import type { PanelOnResize } from 'react-resizable-panels'

import dynamic from 'next/dynamic'
import { useCallback, type FC } from 'react'

import CodeResponse from '@/components/ui/code-response'
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
    const {
        activeTab,
        codeResponse,
        resizePanel,
        setResizePanel,
        isResizePanelVisible,
    } = useTabContext()

    let minSize = 30

    const handlePanelOnResize: PanelOnResize = useCallback(
        (newSize) => {
            if (newSize <= 100 && newSize >= minSize) {
                setResizePanel({
                    id: activeTab.id,
                    viewSize: newSize,
                    viewSizeState: newSize,
                })
            } else if (newSize > 100) {
                setResizePanel({
                    id: activeTab.id,
                    viewSize: 100,
                    viewSizeState: 100,
                })
            } else if (newSize < minSize) {
                setResizePanel({
                    id: activeTab.id,
                    viewSize: minSize,
                    viewSizeState: minSize,
                })
            }
        },
        [minSize, activeTab, setResizePanel]
    )

    const totalDefaultSize = resizePanel?.viewSize || 100

    const resolvedDefaultSize = Math.max(0, 100 - resizePanel?.viewSize) || 0

    const handleLeftPanel = (): JSX.Element => {
        if (!activeTab && !isResizePanelVisible) return <></>

        return (
            <>
                {isResizePanelVisible && (
                    <>
                        <ResizableHandle className="border-s border-primary active:!bg-default active:!ps-2 dark:border-default-foreground" />
                        <ResizablePanel
                            defaultSize={resolvedDefaultSize}
                            id="right-panel"
                            minSize={20}
                            order={2}
                            onResize={handlePanelOnResize}
                        >
                            <div className="flex h-full flex-col bg-background transition delay-150 duration-300 ease-in-out">
                                <div
                                    key={activeTab.id}
                                    className="prose prose-lg flex-1 overflow-auto p-3 font-mono scrollbar-hide dark:prose-invert"
                                    role="tabpanel"
                                >
                                    {codeResponse && (
                                        <>
                                            {codeResponse.stdout && (
                                                <CodeResponse
                                                    flag="STDOUT:"
                                                    flagClassname="text-success-500"
                                                    response={
                                                        codeResponse.stdout
                                                    }
                                                />
                                            )}
                                            {codeResponse.stderr && (
                                                <CodeResponse
                                                    flag="STDERR:"
                                                    flagClassname="text-warning-500"
                                                    response={
                                                        codeResponse.stderr
                                                    }
                                                />
                                            )}
                                            {codeResponse.error && (
                                                <CodeResponse
                                                    flag="ERROR:"
                                                    flagClassname="text-danger-500"
                                                    response={
                                                        codeResponse.error
                                                    }
                                                />
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </ResizablePanel>
                    </>
                )}
            </>
        )
    }

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
                                    hidden: activeTab && isResizePanelVisible,
                                })}
                            >
                                <Footer />
                            </div>
                        </div>
                    </ResizablePanel>
                    {handleLeftPanel()}
                </ResizablePanelGroup>
            </main>
        </EditorLayout>
    )
}

export default Home
