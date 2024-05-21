import { FC, ReactNode } from 'react';
import { ThemeProvider } from '../providers/ThemeProvider';

interface IThemeLayoutProp {
  children: ReactNode;
}

const ThemeLayout: FC<IThemeLayoutProp> = ({ children }) => {
  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
        storageKey="b3b5ef01d57214f0a0d1836819294197"
      >
        {children}
      </ThemeProvider>
    </>
  );
};

export default ThemeLayout;
