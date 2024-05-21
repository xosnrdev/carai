import ErrorBoundary from '@/components/utils/ErrorBoundary';
import { FC, ReactNode } from 'react';
import BottomNav from '../ui/bottom-nav/bottom-nav';
import TabBar from '../ui/tab-bar/tab-bar';

interface IEditorLayoutProps {
  children: ReactNode;
}

const EditorLayout: FC<IEditorLayoutProps> = ({ children }) => {
  return (
    <ErrorBoundary>
      <div className="flex flex-col items-center">
        <TabBar />
        <main className="dark:bg-[#1E1E2A] bg-[#FFFFFF] w-full">
          {children}
        </main>
        <BottomNav />
      </div>
    </ErrorBoundary>
  );
};

export default EditorLayout;
