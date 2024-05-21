'use client';

import useEditor from '@/hooks/useEditor';
import useToast from '@/hooks/useToast';
import sidebarButtons from '@/lib/constants/sidebar';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { FC, MouseEvent, useCallback, useState } from 'react';
import { IconType } from 'react-icons';
import { SiGo, SiJavascript, SiPython } from 'react-icons/si';
import { Button } from '../button/button';
import { Label } from '../label/label';
import Modal from '../modal/modal';
import { RadioGroup, RadioGroupItem } from '../radio-group/radio-group';

/**
 * @interface ILanguage - Describes the structure of a language object.
 */
interface ILanguage {
  name: string;
  extension: string;
  icon: IconType;
}

/**
 * @constant languages - An array of language objects.
 */
const languages: ILanguage[] = [
  {
    name: 'JavaScript',
    extension: '.js',
    icon: SiJavascript,
  },
  {
    name: 'Go',
    extension: '.go',
    icon: SiGo,
  },
  {
    name: 'Python',
    extension: '.py',
    icon: SiPython,
  },
];

const MAX_TAB_COUNT = 5;
/**
 * @function Sidebar - A functional component that renders a sidebar.
 */
const Sidebar: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<ILanguage | null>(
    null
  );
  const [activeNav, setActiveNav] = useState<number | null>(null);
  const { addTab, tabs } = useEditor();
  const toast = useToast();

  /**
   * @function handleFocus - Sets the selected language.
   * @param {ILanguage} language - The selected language.
   */
  const handleFocus = useCallback((language: ILanguage) => {
    setSelectedLanguage(language);
  }, []);

  /**
   * @function handleClick - Handles the click event.
   * @param {MouseEvent<HTMLButtonElement>} e - The mouse event.
   */
  const handleClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      if (selectedLanguage) {
        const { name, extension } = selectedLanguage;
        const filename = `main${extension}`;

        if (tabs.length >= MAX_TAB_COUNT) {
          setIsOpen(false);
          toast(`Maximum active tabs allowed is ${tabs.length}`, {
            type: 'error',
            position: 'top-right',
          });
          return;
        }

        addTab(filename, name);

        setIsOpen(false);
      }
      e.preventDefault();
    },
    [selectedLanguage, addTab, toast, tabs.length]
  );

  /**
   * @function handleModal - Handles the modal open event.
   * @param {MouseEvent<HTMLButtonElement>} e - The mouse event.
   */
  const handleModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  return (
    <>
      {isOpen && (
        <Modal title="Choose A Language" onClose={() => setIsOpen(false)}>
          <div className="grid gap-y-6">
            <RadioGroup className="grid grid-cols-3 gap-4">
              {languages.map((language, idx) => (
                <span key={idx}>
                  <RadioGroupItem
                    value={language.name}
                    id={language.name}
                    className="peer sr-only"
                    onFocus={() => handleFocus(language)}
                  />
                  <Label
                    htmlFor={language.name}
                    className="flex flex-col items-center justify-between gap-y-3 rounded-md border-2 border-muted bg-popover p-4 hover:border-primary hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <language.icon
                      size={40}
                      className={cn(
                        { 'text-yellow-500': idx === 0 },
                        { 'text-blue-500': idx === 1 },
                        { 'text-green-500': idx === 2 }
                      )}
                    />
                    {language.name}
                  </Label>
                </span>
              ))}
            </RadioGroup>

            <Button
              onClick={handleClick}
              aria-label="start coding"
              className="hover:bg-blue-600 text-white"
            >
              Start Coding
            </Button>
          </div>
        </Modal>
      )}

      <aside className="sticky top-0 left-0 flex h-screen flex-col bg-secondary border-r border-solid border-background/80 px-3 py-16">
        {sidebarButtons.map(({ label, ...val }, idx) => (
          <div
            key={idx}
            className={cn(
              'dark:text-secondary-foreground/30 text-muted-foreground mx-auto flex flex-col items-center p-4',
              {
                'text-primary dark:text-[#CDCDDA]': activeNav === idx,
              }
            )}
          >
            {idx === 0 ? (
              <button
                onClick={(e) => {
                  handleModal();
                  setActiveNav(idx);
                  e.preventDefault();
                }}
                aria-label={label}
              >
                <val.icon size={30} />
              </button>
            ) : (
              <Link href={'/'} aria-label="label">
                <val.icon
                  size={30}
                  onClick={() => {
                    setActiveNav(idx);
                  }}
                />
              </Link>
            )}
          </div>
        ))}
      </aside>
    </>
  );
};

export default Sidebar;
