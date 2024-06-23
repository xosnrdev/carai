import useTabContext from '@/hooks/useTabContext'
import { EditorProps } from '@monaco-editor/react'
import type { editor as editorType } from 'monaco-editor'
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
	const { updateTab, activeTab, codeResponse, onResize } = useTabContext()
	const { theme } = useTheme()
	const editorContainerRef = useRef<HTMLDivElement>(null)
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
		[updateTab, activeTab, editorInstance, codeResponse, onResize]
	)

	const handleEditorDidMount = useCallback(
		(editorInstance: editorType.IStandaloneCodeEditor) => {
			if (activeTab && activeTab.editorViewState) {
				editorInstance.restoreViewState(activeTab.editorViewState)
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
				<div
					ref={editorContainerRef}
					id="playground-left-container"
					role="tabpanel"
					tabIndex={0}
					className="h-full"
					key={activeTab.id}
					aria-label={`playground for ${activeTab ? activeTab.meta : 'unknown language'}`}
				>
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
