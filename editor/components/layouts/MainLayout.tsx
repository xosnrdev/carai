'use client';

import EditorProvider from '@/context/editor';
import { FC, ReactNode } from 'react';
import ToastProvider from '../../context/toast';
import Header from '../ui/header/header';
import Sidebar from '../ui/sidebar/sidebar';
import EditorLayout from './EditorLayout';

interface IMainLayoutProp {
  children: ReactNode;
}

const MainLayout: FC<IMainLayoutProp> = ({ children }) => (
  <div className="relative flex flex-col h-screen overflow-hidden max-width__wrapper">
    <EditorProvider>
      <Header />
      <ToastProvider>
        <div className="flex flex-row">
          <Sidebar />
          <main className="grow">
            <EditorLayout>{children}</EditorLayout>
          </main>
        </div>
      </ToastProvider>
    </EditorProvider>
  </div>
);

export default MainLayout;
