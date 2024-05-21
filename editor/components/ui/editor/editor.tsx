import useEditor from '@/hooks/useEditor';
import { TabProps } from '@/lib/types/tab';
import { EditorProps } from '@monaco-editor/react';
import { debounce } from 'lodash';
import { editor as MonacoEditorType } from 'monaco-editor';
import { useTheme } from 'next-themes';
import dynamic from 'next/dynamic';
import { FC, useCallback, useMemo } from 'react';
import LoadingSpinner from '../spinner/loading-spinner';

const MonacoEditor = dynamic<EditorProps>(
  () => import('@monaco-editor/react'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

/**
 * CodeEditor component
 * @component
 */
const CodeEditor: FC = () => {
  const { tabs, activeTab, updateTabCode } = useEditor();
  const { theme } = useTheme();

  /**
   * Debounced function to update the content of the current active tab.
   * @param {Function} updateTabCode - Function to update the tab content.
   * @param {TabProps | undefined} currentActiveTab - The current active tab.
   * @param {string | undefined} editorCode - The current content of the editor.
   */
  const debouncedUpdate = debounce(
    (updateTabCode, currentActiveTab, editorCode) => {
      if (currentActiveTab) {
        updateTabCode(currentActiveTab.id, editorCode);
      }
    },
    1500,
    { trailing: true, leading: false }
  );

  /**
   * Handle changes to the editor.
   * @param {string | undefined} editorCode - The current content of the editor.
   */
  const handleEditorContentChange = useCallback(
    (editorCode: string | undefined) => {
      const currentActiveTab = tabs.find((tab) => tab.id === activeTab);
      debouncedUpdate(updateTabCode, currentActiveTab, editorCode);
    },
    [tabs, activeTab, updateTabCode, debouncedUpdate]
  );

  /**
   * Handle the mounting of the editor.
   * @param {MonacoEditorType.IStandaloneCodeEditor} editorInstance - The instance of the editor that has been mounted.
   */
  const handleEditorDidMount = useCallback(
    (editorInstance: MonacoEditorType.IStandaloneCodeEditor) => {
      if (activeTab) {
        editorInstance.focus();
      }
    },
    [activeTab]
  );

  const editorOptions: MonacoEditorType.IStandaloneEditorConstructionOptions = useMemo(() => ({
    wordWrap: 'on',
    minimap: { enabled: false },
    showUnused: false,
    folding: false,
    glyphMargin: false,
    lineNumbers: 'on',
    lineNumbersMinChars: 3,
    fontSize: 14,
    automaticLayout: true,
    lineHeight: 19,
    scrollBeyondLastLine: false,
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
  }), [])


  /**
   * Find the data of the active tab.
   * @type {TabProps | undefined}
   */
  const activeTabProps: TabProps | undefined = tabs.find(
    (tab) => tab.id === activeTab
  );

  return (
    <div role="application" aria-label="Code Editor" className="flex flex-col w-full h-screen">
      <MonacoEditor
        loading
        theme={theme === 'dark' ? 'vs-dark' : 'vs-light'}
        language={activeTabProps?.language}
        value={activeTabProps?.code}
        onChange={handleEditorContentChange}
        onMount={handleEditorDidMount}
        options={editorOptions}
        aria-label="Code Editor Area"
        height={"79dvh"}
      />
    </div>
  );
};

export default CodeEditor;