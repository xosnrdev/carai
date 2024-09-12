import type { ViewState } from '@/redux/tab/index.types'
import type { BeforeMount, OnChange, OnMount } from '@monaco-editor/react'
import type { editor } from 'monaco-editor'
import type { EditorProp } from './index.types'

import { useTheme } from 'next-themes'
import dynamic from 'next/dynamic'
import { useCallback, useState } from 'react'

import useTabContext from '@/hooks/useTabContext'
import { languageSupportTransformMap, transformString } from '@/lib/utils'

import { Logo } from '../icons'

import serializeViewState from './utils'

import { darkThemeData, lightThemeData } from '.'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
    loading: () => <Logo />,
    ssr: false,
})

export default function Editor({ className, ...props }: EditorProp) {
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
        [updateTab, editorView, codeResponse, resizeLayout, activeTab.id]
    )

    const handleEditorOnMount: OnMount = useCallback(
        (editorInstance) => {
            const serializedState = serializeViewState(viewState.state)

            if (editorInstance && viewState) {
                editorInstance.restoreViewState(serializedState)
                editorInstance.focus()
            }

            setEditorView(editorInstance)
            setViewState({
                id: activeTab.id,
                isMounted: !!editorInstance,
            })

            return () => editorInstance.dispose()
        },
        [viewState, setViewState, activeTab]
    )

    const handleBeforeMount: BeforeMount = useCallback((monaco) => {
        monaco.editor.defineTheme('carai-dark', darkThemeData)

        monaco.editor.defineTheme('carai-light', lightThemeData)
    }, [])

    const editorConfigOptions: editor.IStandaloneEditorConstructionOptions = {
        wordWrap: 'on',
        minimap: {
            enabled: false,
        },
        fontSize: 16,
        tabSize: 2,
        fixedOverflowWidgets: true,
        fontFamily: 'Jetbrains Mono, monospace',
        bracketPairColorization: {
            enabled: true,
        },
        cursorStyle: 'block',
    }

    return (
        <MonacoEditor
            beforeMount={handleBeforeMount}
            className={className}
            language={transformString({
                str: activeTab.metadata.languageName,
                map: languageSupportTransformMap,
                lowerCase: true,
            })}
            loading={<Logo />}
            options={editorConfigOptions}
            theme={resolvedTheme === 'dark' ? 'carai-dark' : 'carai-light'}
            value={activeTab.content}
            onChange={handleEditorChange}
            onMount={handleEditorOnMount}
            {...props}
        />
    )
}
