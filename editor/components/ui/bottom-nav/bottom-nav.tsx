import useEditor from '@/hooks/useEditor';
import { FC } from 'react';
import { IconType } from 'react-icons';
import { IoIosCloseCircle, IoIosInformationCircle } from 'react-icons/io';
import { TbAlertTriangleFilled } from 'react-icons/tb';

interface INavIcons {
  icon: IconType;
}

const navIcons: INavIcons[] = [
  { icon: IoIosCloseCircle },
  { icon: TbAlertTriangleFilled },
  { icon: IoIosInformationCircle },
];

const BottomNav: FC = () => {
  const { isActiveTabOnboarding } = useEditor();
  return (
    <div className="sticky w-full bottom-0 z-20 flex flex-row items-center gap-x-3 py-8 px-6 bg-secondary">
      {!isActiveTabOnboarding &&
        navIcons.map((_, idx) => (
          <button key={idx} className="text-primary dark:text-[#E0E0F5]">
            <_.icon size={24} />
          </button>
        ))}
    </div>
  );
};

export default BottomNav;
