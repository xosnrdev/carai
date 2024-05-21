import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import { FC, useEffect, useState } from 'react';

/**
 * Brand component properties.
 * @interface
 */
interface IBrandProps {
  width?: number;
  height?: number;
}

/**
 * Brand component.
 * @component
 */
const Brand: FC<IBrandProps> = ({ width = 110, height = 50, ...props }) => {
  const { resolvedTheme } = useTheme();
  const [isThemeLoaded, setIsThemeLoaded] = useState(false);

  // Set theme loaded state to true after component has mounted
  useEffect(() => {
    setIsThemeLoaded(true);
  }, []);

  // Don't render anything until theme is loaded
  if (!isThemeLoaded) {
    return null;
  }

  const logoSrc =
    resolvedTheme === 'dark' ? '/carai-dark.svg' : '/carai-light.svg';

  return (
    <Link href={'/'}>
      <Image
        src={logoSrc}
        alt="brand logo"
        width={width}
        height={height}
        priority
        className="select-none pointer-events-none w-auto h-auto"
        {...props}
      />
    </Link>
  );
};

export default Brand;
