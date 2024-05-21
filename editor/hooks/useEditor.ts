import { EditorContext, IEditorContextProps } from '@/context/editor';
import { useContext, useMemo } from 'react';

/**
 * Custom hook for using the Editor context.
 * Throws an error if the hook is used outside of the EditorProvider.
 *
 * @returns {IEditorContextProps & {isActiveTabOnboarding: boolean}} The Editor context object with isActiveTabOnboarding.
 * @throws Will throw an error if used outside of an EditorProvider.
 */
function useEditor(): IEditorContextProps & { isActiveTabOnboarding: boolean } {
  const editorContext = useContext(EditorContext);

  if (!editorContext) {
    throw new Error('useEditor must be used within an EditorProvider');
  }

  const { tabs, activeTab } = editorContext;

  const isActiveTabOnboarding = useMemo(() => {
    return (
      tabs.length === 0 || (tabs.length === 1 && activeTab === 'onboarding-tab')
    );
  }, [tabs, activeTab]);

  return { ...editorContext, isActiveTabOnboarding };
}

export default useEditor;
