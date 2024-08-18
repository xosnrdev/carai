import type { EditorProps, OnChange, OnMount } from '@monaco-editor/react'
import type { editor } from 'monaco-editor'

import { useTheme } from 'next-themes'
import dynamic from 'next/dynamic'
import { useCallback, useState, type FC } from 'react'

import useTabContext from '@/hooks/useTabContext'
import { EditorViewType, IMonacoViewState } from '@/types'

import { LoadingSpinner } from './icons'

const _Editor = dynamic(() => import('@monaco-editor/react'), {
    loading: () => <LoadingSpinner />,
    ssr: false,
})

const MonacoEditor: FC<EditorProps> = ({ className, ...props }) => {
    const {
        updateTab,
        activeTab,
        codeResponse,
        resizePanel,
        getSerializedViewState,
        getDeserializedViewState,
    } = useTabContext()

    const { resolvedTheme } = useTheme()
    const [editorView, setEditorView] =
        useState<editor.IStandaloneCodeEditor | null>(null)

    const handleEditorChange: OnChange = useCallback(
        (value) => {
            if (editorView) {
                const editorState = editorView.saveViewState()

                if (editorState) {
                    const deserializedViewState: IMonacoViewState = {
                        state: editorState,
                        stateFields: {
                            codeResponse,
                            resizePanel,
                        },
                    }

                    const serializedViewState =
                        getSerializedViewState<IMonacoViewState>(
                            deserializedViewState
                        )

                    updateTab({
                        id: activeTab.id,
                        value,
                        viewState: {
                            type: EditorViewType.Monaco,
                            value: serializedViewState,
                        },
                    })
                }
            }
        },
        [
            updateTab,
            editorView,
            codeResponse,
            resizePanel,
            activeTab.id,
            getSerializedViewState,
        ]
    )

    const handleEditorOnMount: OnMount = useCallback(
        (editor) => {
            const state = getDeserializedViewState<IMonacoViewState>().state

            if (editor && state) {
                editor.restoreViewState(state)
            }

            editor.focus()

            setEditorView(editor)

            return () => {
                editor.dispose()
            }
        },
        [getDeserializedViewState]
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
            language={activeTab.metadata.monacoEditorLanguageSupportName}
            loading={<LoadingSpinner />}
            options={editorConfigOptions}
            theme={resolvedTheme === 'dark' ? 'vs-dark' : 'vs-light'}
            value={activeTab.value}
            onChange={handleEditorChange}
            onMount={handleEditorOnMount}
            {...props}
        />
    )
}

export default MonacoEditor
