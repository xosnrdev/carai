/**
 * Interface for a Tab.
 * @interface TabProps
 */
export interface TabProps {
  /** Unique identifier for the tab */
  id: string;

  /** Title of the tab */
  title: string;

  /** Content of the tab (optional) */
  code?: string;

  /** Language of the tab (optional) */
  language?: string;

  /** Flag indicating whether the tab has unsaved changes (optional) */
  isDirty?: boolean;

  /** Type of the tab, can be 'editor' or 'onboarding' */
  type: 'editor' | 'onboarding';
}
