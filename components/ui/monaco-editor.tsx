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

import { SplashScreen } from './icons'

const _Editor = dynamic(() => import('@monaco-editor/react'), {
    loading: () => <SplashScreen />,
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
            const serializedState = serializeViewState(viewState.state)

            if (editorInstance && viewState) {
                editorInstance.restoreViewState(serializedState)
                editorInstance.focus()
            }

            setEditorView(editorInstance)

            return () => editorInstance.dispose()
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
            language={transformString({
                str: activeTab.metadata.languageName,
                map: languageSupportTransformMap,
                lowerCase: true,
            })}
            loading={<SplashScreen />}
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
