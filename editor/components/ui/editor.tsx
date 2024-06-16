import { useTabContext } from '@/sdk/tabkit/store'
import { EditorProps } from '@monaco-editor/react'
import { editor as monacoEditor } from 'monaco-editor'
import { useTheme } from 'next-themes'
import dynamic from 'next/dynamic'
import { FC, useCallback, useRef, useState } from 'react'
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
	const editorContainerRef = useRef<HTMLDivElement>(null)
	const [editorInstance, setEditorInstance] =
		useState<monacoEditor.IStandaloneCodeEditor | null>(null)

	const handleEditorChange = useCallback(
		(content: string | undefined) => {
			if (activeTab && editorInstance) {
				const rawViewState = editorInstance.saveViewState()
				const viewState = JSON.parse(JSON.stringify(rawViewState))
				updateTab({
					id: activeTab.id,
					content,
					viewState,
				})
			}
		},
		[updateTab, activeTab, editorInstance]
	)

	const handleEditorDidMount = useCallback(
		(editorInstance: monacoEditor.IStandaloneCodeEditor) => {
			if (activeTab && activeTab.viewState) {
				editorInstance.restoreViewState(activeTab.viewState)
			}
			const setAttributes = () => {
				const textarea = editorContainerRef.current?.querySelector('.inputarea')
				if (textarea && activeTab) {
					textarea.id = 'monaco-editor-textarea'
					editorInstance.focus()
				} else {
					console.warn('Textarea not found or activeTab is undefined')
				}
			}

			setAttributes()

			const handleDomChange: MutationCallback = (mutations) => {
				mutations.forEach((mutation) => {
					if (mutation.type === 'childList') {
						setAttributes()
					}
				})
			}

			const observer = new MutationObserver(handleDomChange)

			if (editorContainerRef.current) {
				observer.observe(editorContainerRef.current, {
					childList: true,
					subtree: true,
				})
			} else {
				console.warn('Editor container not found')
			}
			setEditorInstance(editorInstance)
			return () => {
				observer.disconnect()
				editorInstance.dispose()
			}
		},
		[activeTab]
	)

	const editorConfigOptions: monacoEditor.IStandaloneEditorConstructionOptions =
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
			suggestSelection: 'first',
		}

	return (
		<div
			ref={editorContainerRef}
			id="editor-container"
			role="textbox"
			aria-label="code editor"
			tabIndex={0}
			className="flex h-screen flex-col"
		>
			{activeTab && (
				<MonacoEditor
					loading={<LoadingSpinner />}
					theme={theme === 'dark' ? 'vs-dark' : 'vs-light'}
					language={activeTab.meta?.toLowerCase()}
					value={activeTab.content}
					onChange={handleEditorChange}
					onMount={handleEditorDidMount}
					options={editorConfigOptions}
					aria-label="code editor area"
				/>
			)}
		</div>
	)
}

export default Editor
