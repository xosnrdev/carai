import useTabContext from '@/hooks/useTabContext'
import type { EditorProps } from '@monaco-editor/react'
import type { editor as editorType } from 'monaco-editor'
import { useTheme } from 'next-themes'
import dynamic from 'next/dynamic'
import { useCallback, useRef, useState, type FC } from 'react'
import LoadingSpinner from './loading-spinner'

const MonacoEditor = dynamic<EditorProps>(
	() => import('@monaco-editor/react'),
	{
		loading: () => <LoadingSpinner />,
		ssr: false,
	}
)

const Editor: FC<EditorDivProps> = ({ ...props }) => {
	const { updateTab, activeTab, codeResponse, onResize } = useTabContext()
	const { theme } = useTheme()
	const editorContainerRef = useRef<HTMLDivElement | null>(null)
	const [editorInstance, setEditorInstance] =
		useState<editorType.IStandaloneCodeEditor | null>(null)

	const handleEditorChange = useCallback(
		(content: string | undefined) => {
			if (activeTab && editorInstance) {
				const defaultViewState = editorInstance.saveViewState()
				if (defaultViewState) {
					const extendedViewState = {
						...defaultViewState,
						codeResponse,
						onResize,
					}
					const editorViewState = JSON.parse(JSON.stringify(extendedViewState))
					updateTab({
						id: activeTab.id,
						content,
						editorViewState,
					})
				}
			}
		},
		[updateTab, editorInstance, codeResponse, onResize, activeTab]
	)

	const handleEditorDidMount = useCallback(
		(editorInstance: editorType.IStandaloneCodeEditor) => {
			if (activeTab && activeTab.editorViewState) {
				editorInstance.restoreViewState(activeTab.editorViewState)
			}

			editorInstance.focus()

			setEditorInstance(editorInstance)
			return () => {
				editorInstance.dispose()
			}
		},
		[activeTab]
	)

	const editorConfigOptions: editorType.IStandaloneEditorConstructionOptions = {
		wordWrap: 'on',
		minimap: {
			enabled: false,
		},
		fontSize: 14,
		lightbulb: {
			enabled: false,
		},
		automaticLayout: true,
		lineHeight: 18,
	}

	return (
		<>
			{activeTab && (
				<div ref={editorContainerRef} {...props}>
					<MonacoEditor
						loading={<LoadingSpinner />}
						theme={theme === 'dark' ? 'vs-dark' : 'vs-light'}
						language={activeTab.meta?.toLowerCase()}
						value={activeTab.content}
						onChange={handleEditorChange}
						onMount={handleEditorDidMount}
						options={editorConfigOptions}
					/>
				</div>
			)}
		</>
	)
}

export default Editor
