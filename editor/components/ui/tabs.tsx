import type { TabId } from '@/types'
import type { CodeResponse, ErrorResponse } from '@/types/response'

import { Button } from '@nextui-org/button'
import { usePathname } from 'next/navigation'
import { useCallback, useState, type FC, type MouseEvent } from 'react'
import toast from 'react-hot-toast'

import useAppContext from '@/hooks/useAppContext'
import useKeyPress from '@/hooks/useKeyPress'
import useTabContext from '@/hooks/useTabContext'
import { cn } from '@/lib/utils'
import { RCEHandler } from '@/network/rce-client'

import AceEditor from './ace-editor'
import CustomTooltip from './custom-tooltip'
import { ComputerFilledIcon } from './icons'
import MonacoEditor from './monaco-editor'
import Tab from './tab'

const rceHandler = new RCEHandler()

const Tabs: FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const pathname = usePathname()
    const {
        tabs,
        resizePane,
        getActiveTab,
        removeTab,
        switchTab,
        setResizePane,
        closeAllTabs,
        setActiveTab,
        setCodeResponse,
        isMobileView,
    } = useTabContext()

    const { isOpen } = useAppContext()

    const handleCloseTab = (
        e: MouseEvent<HTMLButtonElement> | KeyboardEvent,
        id: TabId
    ) => {
        e.stopPropagation()
        removeTab(id)
    }

    const handleOnResizeVisible = useCallback(() => {
        if (!getActiveTab) return
        const { id } = getActiveTab

        if (!resizePane) {
            setResizePane({
                id,
                resizePane: true,
            })
        } else {
            setResizePane({
                id,
                resizePane: false,
            })
        }
    }, [resizePane, setResizePane, getActiveTab])

    const handleCodeExecution = useCallback(() => {
        return new Promise<CodeResponse>((resolve, reject) => {
            if (!getActiveTab) return
            const { id, metadata, value } = getActiveTab

            if (value.trim().length === 0) {
                reject(new Error('no payload'))

                return
            }

            if (metadata._runtime && value) {
                setIsLoading(true)
                rceHandler
                    .execute({
                        language: metadata._runtime,
                        version: 'latest',
                        code: value,
                    })
                    .then((codeResponse) => {
                        setCodeResponse({ id, codeResponse })
                        resolve(codeResponse)
                    })
                    .catch((error: ErrorResponse) => {
                        reject(error)
                        throw error
                    })
                    .finally(() => {
                        setIsLoading(false)
                    })
            }
        })
    }, [setCodeResponse, getActiveTab])

    useKeyPress({
        targetKey: 'D',
        callback: () => {
            if (getActiveTab && pathname === '/') {
                closeAllTabs()
            }
        },
        modifier: ['ctrlKey', 'shiftKey'],
    })
    useKeyPress({
        targetKey: 'ArrowRight',
        callback: () => {
            if (getActiveTab && pathname === '/') {
                switchTab('next')
            }
        },
        modifier: ['ctrlKey', 'shiftKey'],
    })
    useKeyPress({
        targetKey: 'ArrowLeft',
        callback: () => {
            if (getActiveTab && pathname === '/') {
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
                        '!pl-10': isOpen.sidebar === false,
                    }
                )}
                role="tablist"
            >
                <div className="flex flex-wrap">
                    {tabs.map(({ id, title }) => (
                        <Tab
                            key={id}
                            activeTabId={getActiveTab.id}
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
                                error: (err: ErrorResponse) => (
                                    <>{err.message}</>
                                ),
                            })
                            if (getActiveTab && !resizePane) {
                                const { id } = getActiveTab

                                setResizePane({
                                    id,
                                    resizePane: true,
                                })
                            }
                        }}
                    />
                    {
                        <CustomTooltip
                            content={
                                <span>
                                    {resizePane ? 'Close Panel' : 'Open Panel'}
                                </span>
                            }
                        >
                            <Button
                                isIconOnly
                                className="h-8 lg:text-2xl xl:text-2xl text-3xl"
                                radius="none"
                                size={'sm'}
                                startContent={
                                    <span>{resizePane ? '⇥' : '⇤'}</span>
                                }
                                variant={'light'}
                                onClick={handleOnResizeVisible}
                            />
                        </CustomTooltip>
                    }
                </div>
            </div>
            {isMobileView ? (
                <AceEditor
                    key={getActiveTab.id}
                    aria-label={`playground for ${getActiveTab.metadata._runtime || 'unknown language'}`}
                    className="flex-1 overflow-hidden"
                />
            ) : (
                <MonacoEditor
                    key={getActiveTab.id}
                    aria-label={`playground for ${getActiveTab.metadata._runtime || 'unknown language'}`}
                    className="flex-1 overflow-hidden"
                />
            )}
        </div>
    )
}

export default Tabs
