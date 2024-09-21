'use client'

import type { PanelGroupOnLayout } from 'react-resizable-panels'

import { Button } from '@nextui-org/button'
import { CogIcon, CopyCheckIcon, CopyIcon, PlayCircleIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import dynamic from 'next/dynamic'
import { useCallback, useEffect } from 'react'

import Tabs from '@/app/(sandbox)/tabs/tabs'
import useIdleTracker from '@/components/ui/docs/useIdleTracker'
import { Logo } from '@/components/ui/icons'
import Onboarding from '@/components/ui/onboarding/ui'
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from '@/components/ui/resizable'
import CodeResponse from '@/config/editor/code-response'
import getContentLengthByLine from '@/config/editor/utils'
import useAppContext from '@/hooks/useAppContext'
import useCopyToClipboard from '@/hooks/useCopyToClipboard'
import useTabContext from '@/hooks/useTabContext'
import { cn } from '@/lib/utils'

import CustomTooltip from '../../components/ui/custom-tooltip'

import handleCodeExecution from './action'
import Editor from './tabs/editor'

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
        isMounted,
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

    const Copy = isCopied ? CopyCheckIcon : CopyIcon

    return (
        <EditorLayout>
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
                    {activeTab ? (
                        <>
                            <Tabs />
                            <Editor
                                key={activeTab.id}
                                aria-label={`playground for ${activeTab.metadata.languageName || 'unknown language'}`}
                                className="h-[calc(100%-3rem)]"
                            />
                        </>
                    ) : (
                        <div className="h-full overflow-auto">
                            <Onboarding />
                        </div>
                    )}
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
                                <div className="flex flex-row items-center space-x-4">
                                    <Button
                                        className={cn(
                                            'animate-pulse text-lg hover:animate-none',
                                            {
                                                'animate-none':
                                                    codeResponse?.isRunning,
                                            }
                                        )}
                                        color={'success'}
                                        endContent={
                                            <span>
                                                {codeResponse?.isRunning
                                                    ? 'Running'
                                                    : 'Run'}
                                            </span>
                                        }
                                        isDisabled={
                                            codeResponse?.isRunning ||
                                            !isMounted
                                        }
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
                                            <PlayCircleIcon
                                                className={cn({
                                                    hidden: codeResponse?.isRunning,
                                                })}
                                                size={18}
                                            />
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
                                            startContent={<Copy size={30} />}
                                            variant="light"
                                            onClick={() => {
                                                handleCopyToClipboard(
                                                    codeResponse?.stdout! ||
                                                        codeResponse?.stderr! ||
                                                        codeResponse?.error!
                                                )
                                            }}
                                        />
                                    </CustomTooltip>
                                </div>

                                <div
                                    className={cn('flex-1 overflow-auto', {
                                        'animate-pulse':
                                            codeResponse?.isRunning,
                                        'animate-none':
                                            !codeResponse?.isRunning,
                                    })}
                                >
                                    <div
                                        key={activeTab.id}
                                        className="text-sm selection:bg-background"
                                        role="tabpanel"
                                    >
                                        {codeResponse && (
                                            <>
                                                <CodeResponse
                                                    response={
                                                        codeResponse?.isRunning
                                                            ? `Running ${activeTab.filename}...`
                                                            : codeResponse?.time
                                                              ? `Guest ran ${getContentLengthByLine(activeTab.content)} lines of ${activeTab.metadata.languageName} (finished in ${codeResponse.time}ms):`
                                                              : ''
                                                    }
                                                />

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
        </EditorLayout>
    )
}
