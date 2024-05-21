/* eslint-disable no-unused-vars */

import { cn } from '@/lib/utils';
import { FC, MouseEvent, memo } from 'react';

/**
 * @interface TabPropsProps
 * @description Interface for Tab component props
 */
interface TabPropsProps {
  id: string;
  title: string;
  activeTab: string | null;
  setActiveTab: (id: string) => void;
  closeTab: (e: MouseEvent<HTMLButtonElement>, id: string) => void;
}

/**
 * @component Tab
 * @description Memoized tab component
 */
const Tab: FC<TabPropsProps> = memo(
  ({ id, title, activeTab, setActiveTab, closeTab }) => (
    <div
      key={id}
      className={cn(
        'flex items-center border-t-2 border-solid border-[#FFFFFF] dark:border-[#1E1E2A] dark:bg-[#1E1E2A] bg-[#FFFFFF] px-4 py-3 transition-all duration-150 hover:border-primary dark:hover:border-secondary-foreground delay-300 ease-linear',
        {
          'border-primary dark:border-secondary-foreground': activeTab === id,
        }
      )}
    >
      <span
        role="button"
        onClick={() => setActiveTab(id)}
        className="cursor-pointer select-none"
        aria-label="switch active tab"
      >
        {title}
      </span>
      {id !== 'onboarding-tab' && (
        <button
          role="button"
          onClick={(e) => closeTab(e, id)}
          className={cn('ml-2 p-1 rounded-full dark:bg-[#E0E0F5] bg-primary', {
            'animate-pulse': activeTab === id,
          })}
          aria-label="close tab"
        ></button>
      )}
    </div>
  )
);
Tab.displayName = 'Tab';

export default Tab;
