import useEditor from '@/hooks/useEditor';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { FC } from 'react';
import ThemeSwitch from '../../utils/ThemeSwitch';
import Brand from '../brand/brand';
import { Button } from '../button/button';

interface IButtonItem {
  label: string;
  path: string;
}

const buttonItems: IButtonItem[] = [
  { label: 'Sign Up', path: '/sign-up' },
  { label: 'Sign In', path: '/sign-in' },
];

const Header: FC = () => {
  const { isActiveTabOnboarding } = useEditor();
  const router = useRouter();
  return (
    <header className="sticky z-10 top-0 w-full border-b border-solid border-background/80 bg-secondary xl:py-3 xl:px-8">
      <div className="flex flex-row items-center justify-between">
        <Brand />
        <div className="flex flex-row items-center justify-center gap-x-6">
          <ThemeSwitch />
          {!isActiveTabOnboarding && (
            <div className="flex flex-row gap-x-4">
              {buttonItems.map((item, idx) => (
                <Button
                  key={idx}
                  onClick={(e) => {
                    router.push(item.path);
                    e.preventDefault();
                  }}
                  className={cn(
                    'border-primary hover:bg-primary dark:hover:bg-[#CDCDDA] dark:hover:text-black hover:text-white delay-300 duration-150 transition-all ease-linear text-black rounded-sm dark:border-[#CDCDDA] bg-inherit border border-solid dark:text-white'
                  )}
                >
                  {item.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
