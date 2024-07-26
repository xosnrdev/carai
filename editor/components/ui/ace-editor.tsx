import type { IAceEditorProps } from 'react-ace'
import type { IAceEditor } from 'react-ace/lib/types'

import * as Sentry from '@sentry/nextjs'
import { Range } from 'ace-builds'
import { useTheme } from 'next-themes'
import dynamic from 'next/dynamic'
import { useCallback, useMemo, useState, type FC } from 'react'

import useTabContext from '@/hooks/useTabContext'
import { TabError } from '@/lib/error'
import { ACE_MODES, loadAceModules } from '@/lib/utils'
import { EditorViewState, type IParsedAceVS } from '@/types'

import { LoadingSpinner } from './icons'

const Editor = dynamic(loadAceModules, {
        loading: () => <LoadingSpinner size={75} />,
        ssr: false,
    }),
    AceEditor: FC<IAceEditorProps> = ({ className, ...props }) => {
        const {
                updateTab,
                getActiveTab,
                codeResponse,
                resizePane,
                getViewState,
                getParsedVS,
                getStringifiedVS,
            } = useTabContext(),
            { resolvedTheme } = useTheme(),
            [editorView, setEditorView] = useState<IAceEditor | null>(null),
            mode = useMemo(() => getActiveTab.metadata.mode, [getActiveTab]),
            handleOnChange = useCallback(
                (value: string) => {
                    const id = getActiveTab.id

                    if (id && editorView) {
                        const originVS = editorView.getSession()

                        if (originVS) {
                            const parsedVS: IParsedAceVS = {
                                cursorPosition: originVS.selection.getCursor(),
                                scrollTop: originVS.getScrollTop(),
                                scrollLeft: originVS.getScrollLeft(),
                                selection: {
                                    start: originVS.selection.getRange().start,
                                    end: originVS.selection.getRange().end,
                                },
                                folds: originVS.getAllFolds().map((fold) => ({
                                    ...fold,
                                })),
                                codeResponse,
                                resizePane,
                            }
                            const val = getStringifiedVS<IParsedAceVS>(parsedVS)

                            updateTab({
                                id,
                                value,
                                viewState: {
                                    type: EditorViewState.Ace,
                                    value: val,
                                },
                            })
                        }
                    }
                },
                [
                    getActiveTab,
                    updateTab,
                    editorView,
                    codeResponse,
                    resizePane,
                    getStringifiedVS,
                ]
            ),
            handleOnLoad = useCallback(
                (editor: IAceEditor) => {
                    Sentry.startSpan(
                        {
                            op: 'ace.handleOnLoad',
                            name: 'Onload',
                        },
                        (span) => {
                            try {
                                const vs = getViewState.value,
                                    parsedVS = getParsedVS<IParsedAceVS>(),
                                    session = editor.getSession()

                                if (vs) {
                                    for (const key in parsedVS) {
                                        if (parsedVS.hasOwnProperty(key)) {
                                            switch (key) {
                                                case 'cursorPosition':
                                                    editor.moveCursorToPosition(
                                                        parsedVS.cursorPosition!
                                                    )
                                                    break
                                                case 'scrollTop':
                                                    session.setScrollTop(
                                                        parsedVS.scrollTop!
                                                    )
                                                    break
                                                case 'scrollLeft':
                                                    session.setScrollLeft(
                                                        parsedVS.scrollLeft!
                                                    )
                                                    break
                                                case 'selection':
                                                    session.selection.setSelectionRange(
                                                        {
                                                            start: parsedVS
                                                                .selection
                                                                ?.start,
                                                            end: parsedVS
                                                                .selection?.end,
                                                        }
                                                    )
                                                    break
                                                case 'folds':
                                                    parsedVS.folds!.forEach(
                                                        (fold) => {
                                                            session.addFold(
                                                                fold,
                                                                new Range(
                                                                    fold.start.row,
                                                                    fold.start.column,
                                                                    fold.end.row,
                                                                    fold.end.column
                                                                )
                                                            )
                                                        }
                                                    )
                                                    break
                                                case 'codeResponse':
                                                case 'resizePane':
                                                    break
                                                default:
                                                    throw new TabError(
                                                        `Unknown key: ${key}`
                                                    )
                                            }
                                        }
                                    }
                                }

                                if (mode && ACE_MODES.has(mode)) {
                                    editor.session.setMode(`ace/mode/${mode}`)
                                }
                                editor.focus()
                                setEditorView(editor)
                            } catch (error) {
                                Sentry.captureException(error)
                            } finally {
                                span.end()
                            }
                        }
                    )

                    return () => {
                        editor.destroy()
                        editor.container.remove()
                    }
                },
                [mode, getViewState, getParsedVS]
            )

        return (
            <Editor
                className={className}
                editorProps={{ $blockScrolling: Infinity }}
                height="100%"
                mode={mode}
                name="ace-editor"
                setOptions={{
                    tabSize: 2,
                    scrollPastEnd: true,
                    showPrintMargin: false,
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    enableEmmet: true,
                    fontSize: 14,
                    highlightActiveLine: true,
                    highlightSelectedWord: true,
                    vScrollBarAlwaysVisible: true,
                    showGutter: true,
                    useWorker: false,
                    wrap: true,
                    useSoftTabs: true,
                }}
                theme={resolvedTheme === 'dark' ? 'tomorrow_night' : 'tomorrow'}
                value={getActiveTab.value}
                width="100%"
                onChange={handleOnChange}
                onLoad={handleOnLoad}
                {...props}
            />
        )
    }

export default AceEditor
