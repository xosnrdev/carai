import type { EditorProps, OnChange, OnMount } from '@monaco-editor/react'

import { editor } from 'monaco-editor'
import { useTheme } from 'next-themes'
import dynamic from 'next/dynamic'
import { useCallback, useState, type FC } from 'react'

import useTabContext from '@/hooks/useTabContext'
import { ViewState } from '@/types'
import {
    languageSupportTransformMap,
    serializeViewState,
    transformString,
} from '@/lib/utils'

import { LoadingSpinner } from './icons'

const _Editor = dynamic(() => import('@monaco-editor/react'), {
    loading: () => <LoadingSpinner />,
    ssr: false,
})

const MonacoEditor: FC<EditorProps> = ({ className, ...props }) => {
    const { updateTab, activeTab, codeResponse, resizePanel, viewState } =
        useTabContext()

    const { resolvedTheme } = useTheme()
    const [editorView, setEditorView] =
        useState<editor.IStandaloneCodeEditor | null>(null)

    const handleEditorChange: OnChange = useCallback(
        (content) => {
            if (editorView) {
                const editorState = editorView.saveViewState()

                if (editorState) {
                    const extendedEditorState = {
                        state: serializeViewState(editorState),
                        stateFields: {
                            codeResponse,
                            resizePanel,
                        },
                    } satisfies ViewState

                    updateTab({
                        id: activeTab.id,
                        content,
                        viewState: extendedEditorState,
                    })
                }
            }
        },
        [updateTab, editorView, codeResponse, resizePanel, activeTab]
    )

    const handleEditorOnMount: OnMount = useCallback(
        (editorInstance) => {
            // const contentLength = activeTab.content.trim().length

            // if (editorInstance && contentLength > 0) {
            //     const model = editorInstance.getModel()

            //     if (model) {
            //         const lineCount = model.getLineCount()
            //         const lastLineContent = model.getLineContent(lineCount)

            //         // Find the last word position
            //         const words = model.getWordAtPosition({
            //             lineNumber: lineCount,
            //             column: lastLineContent.length + 1,
            //         })

            //         let column: number

            //         if (words) {
            //             // If a word is found, set position to its end
            //             column = words.endColumn
            //         } else {
            //             // If no word is found, find the last non-whitespace character
            //             const lastNonWhitespaceColumn =
            //                 model.getLineLastNonWhitespaceColumn(lineCount)

            //             column =
            //                 lastNonWhitespaceColumn > 0
            //                     ? lastNonWhitespaceColumn
            //                     : 1
            //         }

            //         // Set the cursor position
            //         editorInstance.setPosition({
            //             lineNumber: lineCount,
            //             column: column,
            //         })

            //         // Reveal the cursor position
            //         // editorInstance.revealPosition({
            //         //     lineNumber: lineCount,
            //         //     column: column,
            //         // })

            //         // const serializedState = serializeViewState(
            //         //     editorInstance.saveViewState()
            //         // )
            //         // const extendedEditorState: ViewState = {
            //         //     state: serializedState,
            //         //     stateFields: {
            //         //         codeResponse,
            //         //         resizePanel,
            //         //     },
            //         // }

            //         // updateTab({
            //         //     id: activeTab.id,
            //         //     viewState: {
            //         //         ...viewState,
            //         //         ...extendedEditorState,
            //         //     },
            //         // })

            //         editorInstance.focus()
            //     }
            // } else if (editorView && viewState) {
            //     editorView.restoreViewState(serializeViewState(viewState.state))

            //     updateTab({
            //         id: activeTab.id,
            //         viewState: {
            //             ...viewState,
            //             stateFields: {
            //                 codeResponse,
            //                 resizePanel,
            //             },
            //         },
            //     })

            //     editorInstance.focus()
            // }

            const serializedState = serializeViewState(viewState.state)

            if (editorInstance && viewState) {
                editorInstance.restoreViewState(serializedState)
                editorInstance.focus()
            }

            setEditorView(editorInstance)

            return (): void => editorInstance.dispose()
        },
        [viewState]
    )

    const editorConfigOptions: editor.IStandaloneEditorConstructionOptions = {
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
            language={transformString(
                activeTab.metadata.languageName,
                languageSupportTransformMap,
                { lowerCase: true }
            )}
            loading={<LoadingSpinner />}
            options={editorConfigOptions}
            theme={resolvedTheme === 'dark' ? 'vs-dark' : 'vs-light'}
            value={activeTab.content}
            onChange={handleEditorChange}
            onMount={handleEditorOnMount}
            {...props}
        />
    )
}

export default MonacoEditor
