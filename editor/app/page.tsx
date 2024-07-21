'use client'

import type { CodeResponse } from '@/types/response'
import type { PanelOnResize } from 'react-resizable-panels'

import { useEffect, useState, type FC } from 'react'

import Footer from '@/components/ui/footer'
import Onboarding from '@/components/ui/onboarding'
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from '@/components/ui/resizable'
import Tabs from '@/components/ui/tabs'
import useTabContext from '@/hooks/useTabContext'
import { cn } from '@/lib/utils'
import { RCEFormatter } from '@/network/rce-client'

const Home: FC = () => {
    const {
            tabs,
            resizePane,
            getActiveTab,
            getActiveTabId,
            codeResponse,
            isMobileView,
        } = useTabContext(),
        [minSize, setMinSize] = useState(30),
        [defaultSize, setDefaultSize] = useState(70)

    useEffect(() => {
        if (getActiveTab && !isMobileView) {
            const tabLength = tabs.length
            const newMinSize = Math.max(30, tabLength * 12)

            if (newMinSize < defaultSize && minSize !== newMinSize) {
                setMinSize(newMinSize)
            }
        }
    }, [getActiveTab, tabs, minSize, defaultSize, isMobileView])

    const handlePanelOnResize: PanelOnResize = (newSize) => {
            if (newSize <= 100 && newSize >= minSize) {
                setDefaultSize(newSize)
            } else if (newSize > 100) {
                setDefaultSize(100)
            } else if (newSize < minSize) {
                setDefaultSize(minSize)
            }
        },
        adjustedDefaultSize = resizePane ? Math.max(0, 100 - defaultSize) : 0,
        totalDefaultSize = resizePane ? defaultSize : 100,
        adjustedMinSize = resizePane ? 20 : 0,
        rceFormatter = new RCEFormatter(codeResponse as CodeResponse),
        formattedResponse = rceFormatter.format(),
        { displayOutput, combinedError } = formattedResponse

    return (
        <main className="relative h-full">
            <ResizablePanelGroup
                className="absolute inset-0"
                direction={isMobileView ? 'vertical' : 'horizontal'}
            >
                <ResizablePanel
                    defaultSize={totalDefaultSize}
                    id="panel1"
                    minSize={minSize}
                    order={1}
                >
                    <div className="flex h-full flex-col justify-between overflow-hidden">
                        <div
                            className={cn('flex-1 overflow-auto', {
                                'overflow-hidden': getActiveTab,
                            })}
                        >
                            {getActiveTab ? <Tabs /> : <Onboarding />}
                        </div>
                        <div
                            className={cn('block', {
                                hidden: getActiveTab && resizePane,
                            })}
                        >
                            <Footer />
                        </div>
                    </div>
                </ResizablePanel>

                {getActiveTab && resizePane && (
                    <>
                        <ResizableHandle
                            className="border-y border-primary dark:border-default-foreground lg:border-x xl:border-x"
                            withHandle={isMobileView}
                        />
                        <ResizablePanel
                            defaultSize={adjustedDefaultSize}
                            id="panel2"
                            minSize={adjustedMinSize}
                            order={2}
                            onResize={handlePanelOnResize}
                        >
                            <div className="flex h-full flex-col bg-background">
                                <div
                                    key={getActiveTabId}
                                    className="prose prose-lg flex-1 overflow-auto p-2 font-mono dark:prose-invert"
                                    role="tabpanel"
                                >
                                    {codeResponse && (
                                        <pre
                                            className={cn(
                                                'whitespace-pre-wrap',
                                                {
                                                    'text-warning-500':
                                                        combinedError,
                                                    'text-sm': isMobileView,
                                                }
                                            )}
                                        >
                                            {combinedError || displayOutput}
                                        </pre>
                                    )}
                                </div>
                            </div>
                        </ResizablePanel>
                    </>
                )}
            </ResizablePanelGroup>
        </main>
    )
}

export default Home
