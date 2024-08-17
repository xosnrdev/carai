import type { TabId } from '@/types'
import type { CodeResponse } from '@/types/response'

import { Button } from '@nextui-org/button'
import { usePathname } from 'next/navigation'
import { useCallback, useState, type FC, type MouseEvent } from 'react'
import toast from 'react-hot-toast'

import useAppContext from '@/hooks/useAppContext'
import useKeyPress from '@/hooks/useKeyPress'
import useTabContext from '@/hooks/useTabContext'
import { CustomError } from '@/lib/error'
import { cn } from '@/lib/utils'
import { RCEHandler } from '@/network/rce-handler'

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
    } = useTabContext()

    const { isOpen } = useAppContext()

    const handleCloseTab = (
        e: MouseEvent<HTMLButtonElement> | KeyboardEvent,
        id: TabId
    ) => {
        e.stopPropagation()
        removeTab(id)
    }

    const handleResizePanelState = useCallback(() => {
        if (!resizePanel.visible) {
            setResizePanel({
                id: activeTab.id,
                resizePanel: {
                    visible: true,
                },
            })
        } else {
            setResizePanel({
                id: activeTab.id,
                resizePanel: {
                    visible: false,
                },
            })
        }
    }, [resizePanel, setResizePanel, activeTab])

    const handleCodeExecution = useCallback(() => {
        return new Promise<CodeResponse>((resolve, reject) => {
            const { id, metadata, value, title } = activeTab

            if (value.trim().length === 0) {
                reject(new Error('no payload'))

                return
            }

            if (metadata.name && value) {
                setIsLoading(true)
                rceHandler
                    .execute({
                        image: `ghcr.io/toolkithub/rce-images-${metadata.language}:edge`,
                        payload: {
                            language: metadata.name,
                            files: [
                                {
                                    name: title,
                                    content: value,
                                },
                            ],
                        },
                    })
                    .then((codeResponse) => {
                        setCodeResponse({ id, codeResponse })
                        resolve(codeResponse)
                    })
                    .catch((error) => {
                        reject(new CustomError(error.message))
                        throw error
                    })
                    .finally(() => {
                        setIsLoading(false)
                    })
            }
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
            }
        },
        modifier: ['ctrlKey', 'shiftKey'],
    })
    useKeyPress({
        targetKey: 'ArrowLeft',
        callback: () => {
            if (activeTab && pathname === '/') {
                switchTab('previous')
            }
        },
        modifier: ['ctrlKey', 'shiftKey'],
    })

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
                <div className="flex flex-row">
                    {tabs.map(({ id, title }) => (
                        <Tab
                            key={id}
                            activeTabId={activeTab.id}
                            closeTab={handleCloseTab}
                            id={id}
                            setActiveTab={setActiveTab}
                            title={title}
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
                            toast.promise(handleCodeExecution(), {
                                loading: 'processing...',
                                success: 'success',
                                error: (err) => <span>{err.message}</span>,
                            })
                            if (activeTab && !resizePanel.visible) {
                                setResizePanel({
                                    id: activeTab.id,
                                    resizePanel: {
                                        visible: true,
                                    },
                                })
                            }
                        }}
                    />
                    {
                        <CustomTooltip
                            content={
                                <span>
                                    {resizePanel.visible
                                        ? 'Close Panel'
                                        : 'Open Panel'}
                                </span>
                            }
                        >
                            <Button
                                isIconOnly
                                className={cn('h-8 text-2xl', {
                                    'bg-default': resizePanel.visible === false,
                                })}
                                radius="none"
                                size={'sm'}
                                variant={'light'}
                                onClick={handleResizePanelState}
                            >
                                {resizePanel.visible ? '⇥' : '⇤'}
                            </Button>
                        </CustomTooltip>
                    }
                </div>
            </div>
            <CodeMirror
                key={activeTab.id}
                aria-label={`playground for ${activeTab.metadata.name || 'unknown language'}`}
                className="flex-1 overflow-hidden"
            />
        </div>
    )
}

export default Tabs
