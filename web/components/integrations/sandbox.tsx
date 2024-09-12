'use client'

import type { PanelGroupOnLayout } from 'react-resizable-panels'

import { Button } from '@nextui-org/button'
import { CogIcon, CopyCheckIcon, CopyIcon, PlayIcon } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useCallback, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useTheme } from 'next-themes'

import handleCodeExecution from '@/app/(rce)/action'
import CodeResponse from '@/components/ui/code-response/ui'
import useIdleTracker from '@/components/ui/docs/useIdleTracker'
import { Logo } from '@/components/ui/icons'
import Onboarding from '@/components/ui/onboarding/ui'
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from '@/components/ui/resizable'
import Tabs from '@/components/ui/tabs/ui'
import useAppContext from '@/hooks/useAppContext'
import useTabContext from '@/hooks/useTabContext'
import { cn } from '@/lib/utils'
import useCopyToClipboard from '@/hooks/useCopyToClipboard'

import getContentLengthByLine from '../ui/code-response/utils'
import CustomTooltip from '../ui/custom-tooltip'

const EditorLayout = dynamic(
    () => import('@/components/layouts/EditorLayout'),
    {
        loading: () => <Logo size={50} />,
        ssr: false,
    }
)

export default function Sandbox() {
    const {
        activeTab,
        codeResponse,
        resizeLayout,
        setResizeLayout,
        setCodeResponse,
    } = useTabContext()

    const { setIsOpen } = useAppContext()

    const isIdle = useIdleTracker(15000)

    const { handleCopyToClipboard, isCopied } = useCopyToClipboard()
    const { resolvedTheme } = useTheme()

    useEffect(() => {
        if (activeTab || typeof window === 'undefined') {
            return
        }
        const isUserFirstVisit = sessionStorage.getItem('isUserFirstVisit')

        if (!isUserFirstVisit) {
            sessionStorage.setItem('isUserFirstVisit', 'true')
        }

        if (
            isIdle &&
            !sessionStorage.getItem('isUserFirstVisit')?.includes('completed')
        ) {
            setIsOpen({ userGuide: true })
            sessionStorage.setItem('isUserFirstVisit', 'completed')
        }
    }, [isIdle, setIsOpen, activeTab])

    const handleVerticalResize: PanelGroupOnLayout = useCallback(
        (sizes) => {
            if (activeTab) {
                setResizeLayout({
                    id: activeTab.id,
                    vertical: sizes,
                    snapshot: sizes,
                })
            }
        },
        [activeTab, setResizeLayout]
    )

    const handleCodeRunner = async () => {
        if (codeResponse?.isRunning) {
            return
        }

        const {
            id,
            metadata: { languageName },
            content,
            filename,
        } = activeTab

        let codeResponseState = {
            id,
            isRunning: true,
            codeResponse: {
                stdout: '',
                stderr: '',
                error: '',
            },
            time: '',
        }

        setCodeResponse(codeResponseState)

        try {
            const codeResponse = await handleCodeExecution({
                languageName,
                content,
                filename,
            })

            codeResponseState = {
                ...codeResponseState,
                codeResponse: {
                    stdout: codeResponse.stdout,
                    stderr: codeResponse.stderr,
                    error: codeResponse.error,
                },
                time: codeResponse.time?.toFixed(2) ?? '',
            }
        } catch (error) {
            codeResponseState = {
                ...codeResponseState,
                codeResponse: {
                    stdout: '',
                    stderr: '',
                    error: 'Something went wrong, please try again',
                },
            }
        } finally {
            codeResponseState = {
                ...codeResponseState,
                isRunning: false,
            }
            setCodeResponse(codeResponseState)
        }
    }

    const handleCopy = async () => {
        const copyResponse = await handleCopyToClipboard(
            codeResponse?.stdout! ||
                codeResponse?.stderr! ||
                codeResponse?.error!
        )

        const { success, error } = copyResponse

        if (success) {
            toast.success('Copied')
        } else if (error) {
            toast.error(error.message)
        }
    }

    const Copy = isCopied ? CopyCheckIcon : CopyIcon

    return (
        <EditorLayout>
            <main className="relative h-full">
                <ResizablePanelGroup
                    className="absolute inset-0"
                    direction="vertical"
                    onLayout={handleVerticalResize}
                >
                    <ResizablePanel
                        defaultSize={resizeLayout.vertical[0]}
                        id="top-panel"
                        minSize={30}
                        order={0}
                    >
                        <div className="flex h-full flex-col overflow-hidden">
                            {activeTab ? (
                                <Tabs />
                            ) : (
                                <div className="overflow-auto">
                                    <Onboarding />
                                </div>
                            )}
                        </div>
                    </ResizablePanel>
                    {activeTab && (
                        <>
                            <ResizableHandle className="border border-default" />
                            <ResizablePanel
                                defaultSize={resizeLayout.vertical[1]}
                                id="bottom-panel"
                                minSize={20}
                                order={1}
                            >
                                <div className="flex h-full flex-col space-y-6 p-3">
                                    <div className="inline-flex flex-row items-center space-x-4">
                                        <Button
                                            className="text-lg"
                                            color={'success'}
                                            endContent={
                                                <PlayIcon
                                                    className={cn({
                                                        hidden: codeResponse?.isRunning,
                                                    })}
                                                    fill="currentColor"
                                                    size={18}
                                                />
                                            }
                                            isDisabled={codeResponse?.isRunning}
                                            isLoading={codeResponse?.isRunning}
                                            radius="sm"
                                            spinner={
                                                <CogIcon
                                                    className={cn({
                                                        'animate-spin':
                                                            codeResponse?.isRunning,
                                                    })}
                                                    size={18}
                                                />
                                            }
                                            spinnerPlacement="end"
                                            startContent={
                                                <span>
                                                    {codeResponse?.isRunning
                                                        ? 'Running'
                                                        : 'Run'}
                                                </span>
                                            }
                                            onPress={handleCodeRunner}
                                        />

                                        <Button
                                            className="text-lg"
                                            color="default"
                                            isDisabled={codeResponse?.isRunning}
                                            radius="sm"
                                            startContent={<span>Clear</span>}
                                            onPress={() => {
                                                setCodeResponse({
                                                    id: activeTab.id,
                                                    isRunning:
                                                        codeResponse?.isRunning!,
                                                    time: '',
                                                    codeResponse: {
                                                        stdout: '',
                                                        stderr: '',
                                                        error: '',
                                                    },
                                                })
                                            }}
                                        />

                                        <CustomTooltip
                                            content={
                                                <span className="text-xs">
                                                    Copy Output
                                                </span>
                                            }
                                        >
                                            <Button
                                                isIconOnly
                                                aria-label={
                                                    isCopied
                                                        ? 'Copied'
                                                        : 'Copy to clipboard'
                                                }
                                                className="float-end"
                                                color={
                                                    resolvedTheme === 'dark'
                                                        ? 'default'
                                                        : 'primary'
                                                }
                                                size="sm"
                                                startContent={
                                                    <Copy size={30} />
                                                }
                                                variant="light"
                                                onClick={handleCopy}
                                            />
                                        </CustomTooltip>
                                    </div>

                                    <div
                                        className={cn(
                                            'flex-1 overflow-auto transition-opacity duration-500',
                                            {
                                                'opacity-0':
                                                    codeResponse?.isRunning,
                                                'opacity-100':
                                                    !codeResponse?.isRunning,
                                            }
                                        )}
                                    >
                                        <div key={activeTab.id} role="tabpanel">
                                            {codeResponse && (
                                                <>
                                                    <small className="prose prose-base text-default-500">
                                                        {codeResponse?.isRunning
                                                            ? `Running ${activeTab.filename}...`
                                                            : codeResponse.time
                                                              ? `Guest ran ${getContentLengthByLine(activeTab.content)} lines of 
                    ${activeTab.metadata.languageName} (finished in ${codeResponse?.time}ms):`
                                                              : ''}
                                                    </small>
                                                    {codeResponse.stdout && (
                                                        <CodeResponse
                                                            response={
                                                                codeResponse.stdout
                                                            }
                                                            time={
                                                                codeResponse.time!
                                                            }
                                                        />
                                                    )}
                                                    {codeResponse.stderr && (
                                                        <CodeResponse
                                                            response={
                                                                codeResponse.stderr
                                                            }
                                                            time={
                                                                codeResponse.time!
                                                            }
                                                        />
                                                    )}
                                                    {codeResponse.error && (
                                                        <CodeResponse
                                                            response={
                                                                codeResponse.error
                                                            }
                                                        />
                                                    )}
                                                </>
                                            )}
                                        </div>
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
