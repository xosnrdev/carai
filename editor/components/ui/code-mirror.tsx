import { langs, type LanguageName } from '@uiw/codemirror-extensions-langs'
import { vscodeDark, vscodeLight } from '@uiw/codemirror-theme-vscode'
import {
    EditorSelection,
    EditorState,
    EditorView,
    StateEffect,
    type ReactCodeMirrorProps,
    type ReactCodeMirrorRef,
    type ViewUpdate,
} from '@uiw/react-codemirror'
import { useTheme } from 'next-themes'
import dynamic from 'next/dynamic'
import { useCallback, useState, type FC, type RefAttributes } from 'react'

import useTabContext from '@/hooks/useTabContext'
import { EditorViewType, type ICodeMirrorViewState } from '@/types'

import { LoadingSpinner } from './icons'

interface IEditorProps
    extends ReactCodeMirrorProps,
        RefAttributes<ReactCodeMirrorRef> {}

const Editor = dynamic(() => import('@uiw/react-codemirror'), {
    ssr: false,
    loading: () => <LoadingSpinner size={75} />,
})

const CodeMirror: FC<IEditorProps> = ({ ...props }) => {
    const {
        activeTab,
        codeResponse,
        resizePanel,
        getSerializedViewState,
        updateTab,
        getDeserializedViewState,
    } = useTabContext()

    const languageName = activeTab.metadata.alias as LanguageName
    const [editorView, setEditorView] = useState<EditorView | null>(null)
    const { resolvedTheme } = useTheme()

    const handleOnChange = useCallback(
        (value: string, viewUpdate: ViewUpdate) => {
            if (editorView && viewUpdate.state) {
                const deserializedViewState: ICodeMirrorViewState = {
                        state: viewUpdate.state,
                        stateFields: {
                            codeResponse,
                            resizePanel,
                        },
                    },
                    serializedViewState =
                        getSerializedViewState<ICodeMirrorViewState>(
                            deserializedViewState
                        )

                updateTab({
                    id: activeTab.id,
                    value,
                    viewState: {
                        type: EditorViewType.CodeMirror,
                        value: serializedViewState,
                    },
                })
            }
        },
        [
            updateTab,
            editorView,
            activeTab.id,
            getSerializedViewState,
            codeResponse,
            resizePanel,
        ]
    )

    const handleCreateEditor = useCallback(
        (view: EditorView, state: EditorState) => {
            const transactionSpec =
                getDeserializedViewState<ICodeMirrorViewState>().state

            if (view && transactionSpec) {
                const transaction = state.update({
                    changes: {
                        from: 0,
                        to: view.state.doc.length,
                        insert: transactionSpec.doc,
                    },
                    selection: EditorSelection.fromJSON(
                        transactionSpec.selection
                    ),
                    effects: transactionSpec.extensions
                        ? [
                              StateEffect.reconfigure.of(
                                  transactionSpec.extensions
                              ),
                          ]
                        : [],
                })

                view.dispatch(transaction)
            }

            view.focus()
            setEditorView(view)

            return () => {
                view.destroy()
            }
        },
        [getDeserializedViewState]
    )

    return (
        <Editor
            extensions={[langs[languageName](), EditorView.lineWrapping]}
            height="100%"
            theme={resolvedTheme === 'dark' ? vscodeDark : vscodeLight}
            value={activeTab.value}
            width="100%"
            onChange={handleOnChange}
            onCreateEditor={handleCreateEditor}
            {...props}
        />
    )
}

export default CodeMirror
