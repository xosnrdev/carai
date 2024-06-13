import { EditorProps } from '@monaco-editor/react'
import { useTabContext } from '@/sdk/tabkit/store'
import { editor as MonacoEditorType } from 'monaco-editor'
import { useTheme } from 'next-themes'
import dynamic from 'next/dynamic'
import { FC, useCallback } from 'react'
import LoadingSpinner from './loading-spinner'

const MonacoEditor = dynamic<EditorProps>(
	() => import('@monaco-editor/react'),
	{
		loading: () => <LoadingSpinner />,
		ssr: false,
	}
)

const Editor: FC = () => {
	const { updateTab, activeTab } = useTabContext()
	const { theme } = useTheme()

	const handleEditorChange = useCallback(
		(content: string | undefined) => {
			if (activeTab) {
				updateTab({
					id: activeTab.id,
					content,
				})
			}
		},
		[updateTab, activeTab]
	)

	const handleEditorDidMount = useCallback(
		(editorInstance: MonacoEditorType.IStandaloneCodeEditor) => {
			if (activeTab) {
				editorInstance.focus()
			}
		},
		[activeTab]
	)

	const editorConfigOptions: MonacoEditorType.IStandaloneEditorConstructionOptions =
		{
			wordWrap: 'on',
			minimap: {
				enabled: false,
			},
			showUnused: false,
			folding: false,
			fontSize: 14,
			automaticLayout: true,
			scrollBeyondLastLine: false,
			mouseWheelZoom: true,
			smoothScrolling: true,
			glyphMargin: false,
			lineNumbers: 'on',
			lineNumbersMinChars: 3,
			lineHeight: 19,
			renderLineHighlight: 'none',
			overviewRulerBorder: false,
			overviewRulerLanes: 0,
			scrollbar: {
				vertical: 'auto',
				horizontal: 'auto',
				useShadows: false,
				verticalScrollbarSize: 8,
				horizontalScrollbarSize: 8,
				alwaysConsumeMouseWheel: false,
			},
			lightbulb: {
				enabled: false,
			},
			quickSuggestions: false,
			parameterHints: {
				enabled: false,
			},
			suggestOnTriggerCharacters: false,
			acceptSuggestionOnEnter: 'off',
			tabCompletion: 'off',
			wordBasedSuggestions: 'off',
			suggestSelection: 'first',
			formatOnType: false,
			formatOnPaste: false,
		}

	return (
		<div
			role="edit text"
			aria-label="code editor"
			className="flex h-screen flex-col"
		>
			{activeTab && (
				<MonacoEditor
					loading
					theme={theme === 'dark' ? 'vs-dark' : 'vs-light'}
					language={activeTab.meta?.toLowerCase()}
					value={activeTab.content}
					onChange={handleEditorChange}
					onMount={handleEditorDidMount}
					options={editorConfigOptions}
					aria-label="Code Editor Area"
				/>
			)}
		</div>
	)
}

export default Editor
