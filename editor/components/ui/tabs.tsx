import type { TabId } from '@/types'

import { Button } from '@nextui-org/button'
import { usePathname } from 'next/navigation'
import { useCallback, useRef, useState, type FC, type MouseEvent } from 'react'
import toast from 'react-hot-toast'
import * as Sentry from '@sentry/nextjs'

import useAppContext from '@/hooks/useAppContext'
import useKeyPress from '@/hooks/useKeyPress'
import useTabContext from '@/hooks/useTabContext'
import { CustomError } from '@/lib/error'
import { cn } from '@/lib/utils'
import { RCEHandler } from '@/network/rce-handler'
import { CodeResponse } from '@/types/response'

import CodeMirror from './code-mirror'
import CustomTooltip from './custom-tooltip'
import { ComputerFilledIcon } from './icons'
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
    } = useTabContext()

    const { isOpen } = useAppContext()
    const activeTabRef = useRef<HTMLDivElement | null>(null)

    const scrollActiveTabIntoView = () => {
        if (!activeTabRef.current) return
        const activeTab = activeTabRef.current

        activeTab.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center',
        })
    }

    const handleCloseTab = (
        e: MouseEvent<HTMLButtonElement> | KeyboardEvent,
        id: TabId
    ) => {
        e.stopPropagation()
        removeTab(id)
    }

    const handleResizePanelState = useCallback(() => {
        if (!isResizePanelVisible) {
            setResizePanel({
                id: activeTab.id,
                viewSize: resizePanel?.viewSizeState || 30,
            })
        } else {
            setResizePanel({
                id: activeTab.id,
                viewSize: 0,
                viewSizeState: resizePanel?.viewSizeState,
            })
        }
    }, [isResizePanelVisible, setResizePanel, activeTab, resizePanel])

    const handleCodeExecution = useCallback((): Promise<CodeResponse> => {
        const { id, metadata, value, filename } = activeTab

        return new Promise<CodeResponse>((resolve, reject) => {
            if (value.trim().length === 0) {
                reject(new CustomError('No payload found'))

                return
            }

            if (!metadata.imageName) {
                Sentry.captureMessage(`${metadata.imageName} not found`)

                reject(new CustomError('Something went wrong'))

                return
            }

            setIsLoading(true)

            rceHandler
                .execute({
                    image: `ghcr.io/toolkithub/rce-images-${metadata.imageName}:edge`,
                    payload: {
                        language: metadata.imageName,
                        files: [
                            {
                                name: filename,
                                content: value,
                            },
                        ],
                    },
                })
                .then((codeResponse) => {
                    resolve(codeResponse)
                    setCodeResponse({ id, codeResponse })
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
                switchTab('next')
                scrollActiveTabIntoView()
            }
        },
        modifier: ['ctrlKey', 'shiftKey'],
    })

    useKeyPress({
        targetKey: 'ArrowLeft',
        callback: () => {
            if (activeTab && pathname === '/') {
                switchTab('previous')
                scrollActiveTabIntoView()
            }
        },
        modifier: ['ctrlKey', 'shiftKey'],
    })

    const handleRunCode = async () => {
        toast.promise(handleCodeExecution(), {
            loading: 'Processing...',
            success: 'Success',
            error: (err) => <span>{err.message}</span>,
        })

        if (isResizePanelVisible) return

        setResizePanel({
            id: activeTab.id,
            viewSize: resizePanel?.viewSizeState || 30,
        })
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
                            ref={activeTabRef}
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
            <CodeMirror
                key={activeTab.id}
                aria-label={`playground for ${activeTab.metadata.imageName || 'unknown language'}`}
                className="flex-1 overflow-hidden"
            />
        </div>
    )
}

export default Tabs
