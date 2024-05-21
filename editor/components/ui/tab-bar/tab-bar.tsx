import useEditor from '@/hooks/useEditor';
import useToast from '@/hooks/useToast';
import { TabProps } from '@/lib/types/tab';
import { cn } from '@/lib/utils';
import { ClientConfig, RCEClient } from '@/network/client';
import { FC, MouseEvent, useState } from 'react';
import { IconType } from 'react-icons';
import {
  IoIosArrowDropleftCircle,
  IoIosArrowDroprightCircle,
} from 'react-icons/io';
import { Button } from '../button/button';
import Tab from '../tab/tab'; 

/**
 * @interface TabPropsIcon
 * @description Interface for tab icons
 */
interface TabPropsIcon {
  icon: IconType;
  id: string;
}

/**
 * @constant tabIcons
 * @description Array of tab icons
 */
const tabIcons: TabPropsIcon[] = [
  { icon: IoIosArrowDropleftCircle, id: 'previousTab' },
  { icon: IoIosArrowDroprightCircle, id: 'nextTab' },
];

const rceClient = new RCEClient(
  process.env.NEXT_PUBLIC_BASE_URL as ClientConfig
)

/**
 * @component TabBar
 * @description TabBar Component - Displays tabs and handles tab interactions.
 */
const TabBar: FC = () => {
  const { tabs, activeTab, closeTab, setActiveTab, isActiveTabOnboarding } =
    useEditor();

  /**
   * @function handleTabSwitch
   * @description Switches to the previous or next tab.
   * @param {string} direction - The direction to switch ('previous' or 'next').
   */
  const handleTabSwitch = (direction: 'previous' | 'next') => {
    if (!activeTab) {
      return;
    }

    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
    if (currentIndex === -1) {
      console.error('Active tab not found in tabs array');
      return;
    }

    const newIndex =
      direction === 'previous'
        ? Math.max(0, currentIndex - 1)
        : Math.min(tabs.length - 1, currentIndex + 1);

    setActiveTab(tabs[newIndex].id);
  };

  /**
   * Handles closing a tab.
   * @param {MouseEvent<HTMLButtonElement>} event - The mouse event.
   * @param {string} tabId - The ID of the tab to close.
   */
  const handleCloseTab = (
    event: MouseEvent<HTMLButtonElement>,
    tabId: string
  ) => {
    closeTab(tabId);
    event.stopPropagation();
  };

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const toast = useToast();

  const handleCodeExecution = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const activeTabProps: TabProps | undefined = tabs.find(
      (tab) => tab.id === activeTab
    );

    if (activeTabProps?.code === "" || typeof activeTabProps?.code === "undefined") {
      toast("code is empty", {
        type: 'error',
        position: 'top-right',
      });
      return;
    }

    const { language, code } = activeTabProps;

    try {
      setIsLoading(true);

      const codeResponse = await rceClient.execute({
        language: language!.slice(0, 1) + language!.slice(1).toLowerCase(),
        version: "latest",
        code
      });

      console.log("output:", codeResponse.runtime.output);

      toast("Code executed successfully", {
        type: 'success',
        position: 'top-right',
      });
    } catch (error) {
      if (error instanceof Error) {
        toast(error.message, {
          type: 'error',
          position: 'top-right',
        });
      } else {
        toast("An unknown error occurred", {
          type: 'error',
          position: 'top-right',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="sticky top-0 flex flex-row items-center w-full bg-secondary px-6 justify-between">
      <div className="flex flex-row items-center">
        {!isActiveTabOnboarding &&
          tabs.length >= 2 &&
          tabIcons.map((el, index) => {
            const isDisabled =
              (index === 0 &&
                tabs.findIndex((tab) => tab.id === activeTab) === 0) ||
              (index === 1 &&
                tabs.findIndex((tab) => tab.id === activeTab) ===
                tabs.length - 1);

            return (
              <div
                key={index}
                className={cn(
                  'dark:text-[#FFFFFF66] text-muted-foreground mx-auto flex flex-row items-center px-4 py-3',
                  {
                    'dark:text-white text-primary': !isDisabled,
                  }
                )}
              >
                <button
                  onClick={() =>
                    handleTabSwitch(index === 0 ? 'previous' : 'next')
                  }
                  aria-label={`Switch to ${index === 0 ? 'previous' : 'next'
                    } tab`}
                  aria-disabled={
                    index === 0
                      ? activeTab === tabs[0].id
                      : activeTab === tabs[tabs.length - 1].id
                  }
                  disabled={isDisabled}
                >
                  <el.icon size={22} />
                </button>
              </div>
            );
          })}
        <div className="flex flex-row">
          {tabs.map(({ id, title }) => (
            <Tab
              key={id}
              id={id}
              title={title}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              closeTab={handleCloseTab}
            />
          ))}
        </div>
      </div>

      {!isActiveTabOnboarding && (
        <Button className="gap-x-3 rounded-sm bg-[#1B501D] hover:bg-[#1B501D] text-white"
          onClick={handleCodeExecution} disabled={isLoading}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_2982_19306)">
              <path
                d="M2 1.92188C0.89543 1.92188 0 2.81731 0 3.92188V12.1559C0 13.2605 0.895431 14.1559 2 14.1559H22C23.1046 14.1559 24 13.2605 24 12.1559V3.92188C24 2.81731 23.1046 1.92188 22 1.92188H2ZM9.45313 10.438C9.69324 10.7432 9.64052 11.1852 9.33538 11.4253C9.03022 11.6654 8.58818 11.6127 8.34805 11.3076L6.74922 9.27564C6.17823 8.54999 6.17823 7.52777 6.74922 6.80212L8.34805 4.7702C8.58818 4.46504 9.03022 4.41232 9.33538 4.65245C9.64052 4.89257 9.69324 5.33459 9.45313 5.63974L8.5385 6.80213C7.96753 7.52778 7.96753 8.54998 8.5385 9.27562L9.45313 10.438ZM12.7031 11.1297C12.7031 11.518 12.3883 11.8328 12 11.8328C11.6117 11.8328 11.2969 11.518 11.2969 11.1297V4.94806C11.2969 4.55973 11.6117 4.24493 12 4.24493C12.3883 4.24493 12.7031 4.55973 12.7031 4.94806V11.1297ZM15.6519 11.3076C15.4118 11.6127 14.9698 11.6654 14.6646 11.4253C14.3595 11.1852 14.3068 10.7432 14.5469 10.438L15.4615 9.27562C16.0325 8.54998 16.0325 7.52778 15.4615 6.80213L14.5469 5.63974C14.3068 5.33459 14.3595 4.89257 14.6646 4.65245C14.9698 4.41232 15.4118 4.46504 15.6519 4.7702L17.2508 6.80212C17.8218 7.52777 17.8218 8.54999 17.2508 9.27564L15.6519 11.3076Z"
                fill="white"
              />
              <path
                d="M0 17.439C0 18.4753 0.840122 19.3154 1.87646 19.3154H6.83963C7.22861 19.3154 7.54395 19.6309 7.54395 20.0199C7.54395 20.4087 7.22828 20.7241 6.83945 20.7241C6.45112 20.7241 6.13586 21.0389 6.13586 21.4272C6.13586 21.8155 6.45066 22.1303 6.83899 22.1303H17.161C17.5493 22.1303 17.8641 21.8155 17.8641 21.4272C17.8641 21.0389 17.5489 20.7241 17.1606 20.7241C16.7717 20.7241 16.4561 20.4087 16.4561 20.0199C16.4561 19.6309 16.7714 19.3154 17.1604 19.3154H22.1235C23.1599 19.3154 24 18.4753 24 17.439C24 16.4026 23.1599 15.5625 22.1235 15.5625H1.87646C0.840122 15.5625 0 16.4026 0 17.439Z"
                fill="white"
              />
            </g>
            <defs>
              <clipPath id="clip0_2982_19306">
                <rect width="24" height="24" fill="white" />
              </clipPath>
            </defs>
          </svg>
          {isLoading ? "Loading..." : "Run"}
        </Button>
      )}
    </div>
  );
};

export default TabBar;
