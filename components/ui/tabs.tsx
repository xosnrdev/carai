import type { TabId } from '@/types'

import { Button } from '@nextui-org/button'
import * as Sentry from '@sentry/nextjs'
import { usePathname } from 'next/navigation'
import { useCallback, useRef, useState, type FC, type MouseEvent } from 'react'
import toast from 'react-hot-toast'

import useAppContext from '@/hooks/useAppContext'
import useKeyPress from '@/hooks/useKeyPress'
import useTabContext from '@/hooks/useTabContext'
import { CustomError } from '@/lib/error'
import {
    cn,
    imageNameTransformMap,
    scrollActiveTabIntoView,
    transformString,
} from '@/lib/utils'
import { RCEHandler } from '@/network/rce-handler'
import { CodeResponse } from '@/types/response'

import CustomTooltip from './custom-tooltip'
import { ComputerFilledIcon } from './icons'
import MonacoEditor from './monaco-editor'
import Tab from './tab'

const rceHandler = new RCEHandler()

const Tabs: FC = () => {
    const [isLoading, setIsLoading] = useState(false)
    const pathname = usePathname()
    const {
        tabs,
        activeTab,
        removeTab,
        switchTab,
        setResizePanel,
        closeAllTabs,
        setActiveTab,
        setCodeResponse,
        resizePanel,
        isResizePanelVisible,
        tabIndexMap,
    } = useTabContext()

    const { isOpen } = useAppContext()
    const activeTabRef = useRef<HTMLDivElement | null>(null)

    const handleScrollActiveTabIntoView = useCallback(() => {
        scrollActiveTabIntoView(activeTabRef, tabIndexMap)
    }, [activeTabRef, tabIndexMap])

    const handleCloseTab = (
        e: MouseEvent<HTMLButtonElement> | KeyboardEvent,
        id: TabId
    ) => {
        e.stopPropagation()
        removeTab(id)

        handleScrollActiveTabIntoView()
    }

    const handleSwitchTab = useCallback(
        (direction: 'next' | 'previous') => {
            switchTab(direction)
            handleScrollActiveTabIntoView()
        },
        [switchTab, handleScrollActiveTabIntoView]
    )

    const handleResizePanelState = useCallback(() => {
        const currentViewSize = resizePanel.viewSizeState

        const viewSize = isResizePanelVisible ? 0 : currentViewSize

        setResizePanel({
            id: activeTab.id,
            viewSize,
            viewSizeState: currentViewSize,
        })
    }, [isResizePanelVisible, setResizePanel, activeTab, resizePanel])

    const handleCodeExecution = useCallback((): Promise<CodeResponse> => {
        const { id, metadata, content, filename } = activeTab
        const start = Date.now()
        const lowerCaseLanguageName = metadata.languageName.toLowerCase()
        const toImageName = transformString(
            lowerCaseLanguageName,
            imageNameTransformMap,
            { lowerCase: true }
        )
        const image = `toolkithub/${toImageName}:edge`

        return new Promise<CodeResponse>((resolve, reject) => {
            if (content.trim().length === 0) {
                reject(new CustomError('No payload found'))

                return
            }

            if (!image) {
                Sentry.captureMessage(`${image} not found`)

                reject(new CustomError('Something went wrong'))

                return
            }

            setIsLoading(true)

            rceHandler
                .execute({
                    image,
                    payload: {
                        language: metadata.languageName.toLowerCase(),
                        files: [
                            {
                                name: filename,
                                content,
                            },
                        ],
                    },
                })
                .then((codeResponse) => {
                    const latency = (Date.now() - start).toFixed(2)

                    resolve(codeResponse)
                    setCodeResponse({
                        id,
                        codeResponse,
                        latency,
                    })
                })
                .catch((error) => {
                    Sentry.captureException(error)
                    reject(new CustomError('Something went wrong'))
                })
                .finally(() => {
                    setIsLoading(false)
                })
        })
    }, [activeTab, setCodeResponse])

    useKeyPress({
        targetKey: 'D',
        callback: () => {
            if (activeTab && pathname === '/') {
                closeAllTabs()
            }
        },
        modifier: ['ctrlKey', 'shiftKey'],
    })

    useKeyPress({
        targetKey: 'ArrowRight',
        callback: () => {
            if (activeTab && pathname === '/') {
                handleSwitchTab('next')
            }
        },
        modifier: ['ctrlKey', 'shiftKey'],
    })

    useKeyPress({
        targetKey: 'ArrowLeft',
        callback: () => {
            if (activeTab && pathname === '/') {
                handleSwitchTab('previous')
            }
        },
        modifier: ['ctrlKey', 'shiftKey'],
    })

    const handleRunCode = () => {
        toast.promise(handleCodeExecution(), {
            loading: 'Processing...',
            success: 'Success',
            error: (err) => <span>{err.message}</span>,
        })

        if (!isResizePanelVisible) {
            setResizePanel({
                id: activeTab.id,
                viewSize: resizePanel.viewSizeState,
                viewSizeState: resizePanel.viewSizeState,
            })
        }
    }

    return (
        <div
            aria-label="tabs container"
            className="relative flex h-full flex-col"
            role="tabpanel"
        >
            <div
                aria-label="tabs"
                className={cn(
                    'sticky top-0 z-10 flex flex-row justify-between bg-background',
                    {
                        '!pl-8': !isOpen.sidebar,
                    }
                )}
                role="tablist"
            >
                <div className="flex flex-row overflow-x-auto scrollbar-hide">
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

                <div className="flex flex-row gap-x-4">
                    <Button
                        className="h-8 bg-[#1B501D] text-base text-white"
                        disabled={isLoading}
                        endContent={<span>{isLoading || 'Run'}</span>}
                        isLoading={isLoading}
                        radius="none"
                        size="sm"
                        startContent={<ComputerFilledIcon size={24} />}
                        variant={'shadow'}
                        onClick={(e) => {
                            e.preventDefault()
                            handleRunCode()
                        }}
                    />
                    {
                        <CustomTooltip
                            content={
                                <span>
                                    {isResizePanelVisible
                                        ? 'Close Panel'
                                        : 'Open Panel'}
                                </span>
                            }
                        >
                            <Button
                                isIconOnly
                                className={cn('h-8 text-2xl', {
                                    'bg-default': !isResizePanelVisible,
                                })}
                                radius="none"
                                size={'sm'}
                                variant={'light'}
                                onClick={handleResizePanelState}
                            >
                                {isResizePanelVisible ? '⇥' : '⇤'}
                            </Button>
                        </CustomTooltip>
                    }
                </div>
            </div>
            <MonacoEditor
                key={activeTab.id}
                aria-label={`playground for ${activeTab.metadata.languageName || 'unknown language'}`}
                className="flex-1 overflow-hidden"
            />
        </div>
    )
}

export default Tabs
