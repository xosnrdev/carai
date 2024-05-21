'use client';

import CodeEditor from '@/components/ui/editor/editor';
import Onboarding from '@/components/ui/onboarding/onboarding';
import useEditor from '@/hooks/useEditor';
import { FC, useMemo } from 'react';

const Home: FC = () => {
  const { isActiveTabOnboarding } = useEditor();

  // Memoized component based on the active tab
  const content = useMemo(() => {
    return isActiveTabOnboarding ? <Onboarding /> : <CodeEditor />;
  }, [isActiveTabOnboarding]);

  return (
    <main className="flex flex-grow items-center justify-center">{content}</main>
  );
};

export default Home;
