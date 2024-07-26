import type { EditorProps, OnChange, OnMount } from '@monaco-editor/react'
import type { editor } from 'monaco-editor'

import { useTheme } from 'next-themes'
import dynamic from 'next/dynamic'
import { useCallback, useState, type FC } from 'react'

import useTabContext from '@/hooks/useTabContext'
import { EditorViewState, IParsedMonacoVS } from '@/types'

import LoadingSpinner from './loading-spinner'

const _Editor = dynamic(() => import('@monaco-editor/react'), {
        loading: () => <LoadingSpinner />,
        ssr: false,
    }),
    MonacoEditor: FC<EditorProps> = ({ className, ...props }) => {
        const {
                updateTab,
                getActiveTab,
                codeResponse,
                resizePane,
                getStringifiedVS,
                getViewState,
                getParsedVS,
            } = useTabContext(),
            { resolvedTheme } = useTheme(),
            [editorView, setEditorView] =
                useState<editor.IStandaloneCodeEditor | null>(null),
            handleEditorChange: OnChange = useCallback(
                (value) => {
                    if (getActiveTab && editorView) {
                        const originVS = editorView.saveViewState()

                        if (originVS) {
                            const parsedVS = {
                                ...originVS,
                                codeResponse,
                                resizePane,
                            }
                            const val =
                                getStringifiedVS<IParsedMonacoVS>(parsedVS)

                            updateTab({
                                id: getActiveTab.id,
                                value,
                                viewState: {
                                    type: EditorViewState.Monaco,
                                    value: val,
                                },
                            })
                        }
                    }
                },
                [updateTab, editorView, codeResponse, resizePane, getActiveTab]
            ),
            handleEditorOnMount: OnMount = useCallback(
                (editor) => {
                    const vs = getViewState.value

                    if (vs) {
                        const parsedVS = getParsedVS<IParsedMonacoVS>()

                        editor.restoreViewState(parsedVS)
                    }

                    editor.focus()

                    setEditorView(editor)

                    return () => {
                        editor.dispose()
                    }
                },
                [getActiveTab]
            ),
            editorConfigOptions: editor.IStandaloneEditorConstructionOptions = {
                wordWrap: 'on',
                minimap: {
                    enabled: false,
                },
                fontSize: 14,
                tabSize: 2,
                lineHeight: 19,
                showDeprecated: true,
                fixedOverflowWidgets: true,
                automaticLayout: true,
            }

        return (
            <_Editor
                className={className}
                language={getActiveTab.metadata._runtime.toLowerCase()}
                loading={<LoadingSpinner />}
                options={editorConfigOptions}
                theme={resolvedTheme === 'dark' ? 'vs-dark' : 'vs-light'}
                value={getActiveTab.value}
                onChange={handleEditorChange}
                onMount={handleEditorOnMount}
                {...props}
            />
        )
    }

export default MonacoEditor
