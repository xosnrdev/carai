import type { ViewState } from '@/redux/tab/index.types'
import type { OnChange, OnMount } from '@monaco-editor/react'
import type { editor } from 'monaco-editor'

import { useTheme } from 'next-themes'
import { type HTMLAttributes, useCallback, useState } from 'react'

import MonacoEditor from '@/components/monaco-editor'
import { Logo } from '@/components/ui/icons'
import useTabContext from '@/hooks/useTabContext'
import { languageSupportTransformMap, transformString } from '@/lib/utils'

import { serializeViewState } from './utils'

export default function Editor({
    className,
}: {
    className?: HTMLAttributes<HTMLDivElement>['className']
}) {
    const {
        updateTab,
        activeTab,
        codeResponse,
        resizeLayout,
        viewState,
        setViewState,
    } = useTabContext()

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
                            resizeLayout,
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
        [updateTab, editorView, codeResponse, resizeLayout, activeTab]
    )

    const handleEditorOnMount: OnMount = useCallback(
        (editor) => {
            const serializedState = serializeViewState(viewState.state)

            if (editor && viewState) {
                editor.restoreViewState(serializedState)
                editor.focus()
            }

            setEditorView(editor)

            return () => editor.dispose()
        },
        [viewState]
    )

    if (editorView) {
        setViewState({
            id: activeTab.id,
            isMounted: true,
        })
    }

    return (
        <MonacoEditor
            className={className}
            language={transformString({
                str: activeTab.metadata.languageName,
                map: languageSupportTransformMap,
                lowerCase: true,
            })}
            loading={<Logo />}
            options={{
                wordWrap: 'on',
                minimap: {
                    enabled: false,
                },
                fontSize: 16,
                tabSize: 2,
                fixedOverflowWidgets: true,
                fontFamily: 'var(--font-jetbrains-mono)',
                bracketPairColorization: {
                    enabled: true,
                },
                cursorStyle: 'block',
                lineDecorationsWidth: 0,
                lineNumbersMinChars: 3,
                lineHeight: 24,
                padding: {
                    top: 12,
                },
            }}
            theme={resolvedTheme === 'dark' ? 'carai-dark' : 'carai-light'}
            value={activeTab.content}
            onChange={handleEditorChange}
            onMount={handleEditorOnMount}
        />
    )
}
