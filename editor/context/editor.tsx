/* eslint-disable no-unused-vars */
import LoadingSpinner from '@/components/ui/spinner/loading-spinner';
import randomString from '@/lib/random-string';
import { TabProps } from '@/lib/types/tab';
import { debounce } from 'lodash';
import {
  FC,
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState,
} from 'react';

/**
 * @interface IEditorContextProps
 * @description Interface for the Editor Context properties
 */
export interface IEditorContextProps {
  tabs: TabProps[];
  activeTab: string | null;
  addTab: (title: string, language: string) => void;
  closeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
  updateTabCode: (id: string, content: string) => void;
}

export const EditorContext = createContext<IEditorContextProps | undefined>(
  undefined
);

const LOCAL_STORAGE_TABS_KEY = 'tabs';
const LOCAL_STORAGE_ACTIVE_TAB_KEY = 'activeTab';
const STORAGE_DEBOUNCE_DELAY = 500;
const ONBOARDING_TAB_ID = 'onboarding-tab';

const saveTabsToStorage = debounce((tabs: TabProps[], activeTab: string | null) => {
  localStorage.setItem(LOCAL_STORAGE_TABS_KEY, JSON.stringify(tabs));
  localStorage.setItem(LOCAL_STORAGE_ACTIVE_TAB_KEY, activeTab || '');
}, STORAGE_DEBOUNCE_DELAY);

interface IEditorProviderProps {
  children: ReactNode;
}

/**
 * EditorProvider component
 * @component
 */
export const EditorProvider: FC<IEditorProviderProps> = ({ children }) => {
  const [tabs, setTabs] = useState<TabProps[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const savedTabs = localStorage.getItem(LOCAL_STORAGE_TABS_KEY);
      const savedActiveTab = localStorage.getItem(LOCAL_STORAGE_ACTIVE_TAB_KEY);
      let defaultTabs: TabProps[] = savedTabs ? JSON.parse(savedTabs) : [];
      let defaultActiveTab = savedActiveTab || null;

      if (defaultTabs.length === 0) {
        defaultTabs = [
          { id: ONBOARDING_TAB_ID, title: 'Welcome', type: 'onboarding' },
        ];
        defaultActiveTab = ONBOARDING_TAB_ID;
      }

      setTabs(defaultTabs);
      setActiveTab(defaultActiveTab);
      setIsLoading(false);
    } catch (error) {
      console.error('Error parsing tabs from local storage:', error);
      setTabs([
        { id: ONBOARDING_TAB_ID, title: 'Welcome', type: 'onboarding' },
      ]);
      setActiveTab(ONBOARDING_TAB_ID);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    saveTabsToStorage(tabs, activeTab);
  }, [tabs, activeTab]);

  /**
   * Add a new tab
   * @param {string} title - The title of the new tab
   * @param {string} language - The language of the new tab
   */
  const addTab = useCallback((title: string, language: string) => {
    const newTab: TabProps = {
      id: randomString.uuid(),
      title,
      code: '',
      language,
      isDirty: false,
      type: 'editor',
    };

    // Use a callback function to ensure we're using the latest state
    setTabs((prevTabs) => {
      const tabsWithoutOnboarding = prevTabs.filter(
        (tab) => tab.type !== 'onboarding'
      );
      const updatedTabs = [...tabsWithoutOnboarding, newTab];

      // Set the active tab to the newly created tab
      setActiveTab(newTab.id);

      return updatedTabs;
    });
  }, []);

  /**
   * Close a tab
   * @param {string} tabId - The ID of the tab to close
   */
  const closeTab = useCallback(
    (tabId: string) => {
      // Use a callback function to ensure we're using the latest state
      setTabs((prevTabs) => {
        const closingTabIndex = prevTabs.findIndex((tab) => tab.id === tabId);
        const updatedTabs = prevTabs.filter((tab) => tab.id !== tabId);

        // Check if there are no more editor tabs left
        if (
          updatedTabs.length === 0 ||
          updatedTabs.every((tab) => tab.type === 'onboarding')
        ) {
          const onboardingTab: TabProps = {
            id: ONBOARDING_TAB_ID,
            title: 'Welcome',
            type: 'onboarding',
          };
          updatedTabs.push(onboardingTab);
          setActiveTab(ONBOARDING_TAB_ID);
        } else if (tabId === activeTab) {
          // If the closed tab was the active tab, set the next tab as active
          const nextActiveTabIndex = Math.min(
            closingTabIndex,
            updatedTabs.length - 1
          );
          setActiveTab(updatedTabs[nextActiveTabIndex].id);
        }

        return updatedTabs;
      });
    },
    [activeTab]
  );

  /**
   * Updates the code of a tab.
   * @param {string} id - The ID of the tab to update.
   * @param {string} content - The new content for the tab.
   */
  const updateTabCode = useCallback((id: string, code: string) => {
    setTabs((prevTabs) => {
      const tabToUpdate = prevTabs.find((tab) => tab.id === id);
      if (!tabToUpdate) {
        // If the tab to update is not found, return the previous state
        return prevTabs;
      }
      const updatedTab = { ...tabToUpdate, code: code, isDirty: true };
      const updatedTabs = prevTabs.map((tab) =>
        tab.id === id ? updatedTab : tab
      );
      return updatedTabs;
    });
  }, []);

  return (
    <EditorContext.Provider
      value={{
        tabs,
        activeTab,
        addTab,
        closeTab,
        setActiveTab,
        updateTabCode,
      }}
    >
      {isLoading ? <LoadingSpinner /> : children}
    </EditorContext.Provider>
  );
};

export default EditorProvider;
