import onBoardingMock from '@/lib/constants/onboarding';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation'; // Corrected import for useRouter
import { FC } from 'react';
import { BiSolidRightArrow } from 'react-icons/bi';
import Banner from '../banner/banner';
import { Button } from '../button/button';

interface IButtonItem {
  label: string;
  path: string;
}

const buttonItems: IButtonItem[] = [
  { label: 'Create Account', path: '/sign-up' },
  { label: 'Log In', path: '/sign-in' },
];

const Onboarding: FC = () => {
  const router = useRouter();

  return (
    <div className=" hidden xl:block w-full h-screen overflow-y-auto overflow-x-hidden scroll-smooth py-24 px-8">
      <div className="flex flex-row items-center justify-between">
        <div className="grid grid-cols-1 gap-y-6 px-16">
          <h1 className="font-extrabold tracking-tight text-primary dark:text-secondary-foreground text-6xl">
            Get Started with Carai
          </h1>

          <ul className="flex flex-col space-y-6">
            {onBoardingMock.map((data, idx) => (
              <li
                key={idx}
                className="flex flex-row items-center gap-x-1 gap-y-2 text-xl text-foreground/50 hover:opacity-75 hover:cursor-pointer transition-opacity duration-300"
              >
                <BiSolidRightArrow />
                <p className='leading-10'>{data}</p>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-y-4 mt-12">
            {buttonItems.map((item, idx) => (
              <Button
                key={idx}
                onClick={(e) => {
                  router.push(item.path);
                  e.preventDefault();
                }}
                className={cn('hover:bg-blue-600 text-white max-w-xs', {
                  'dark:bg-secondary-foreground dark:text-secondary bg-accent text-secondary-foreground hover:bg-muted-foreground/50':
                    idx === 1,
                })}
                size={'lg'}
              >
                {item.label}
              </Button>
            ))}
          </div>
        </div>
        <Banner />
      </div>
    </div>
  );
};

export default Onboarding;
