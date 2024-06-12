import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { BsMoonFill, BsSunFill } from 'react-icons/bs';

const ThemeSwitch: FC = () => {
	const [mounted, setMounted] = useState(false);
	const { theme, setTheme, resolvedTheme } = useTheme();

	useEffect(() => setMounted(true), []);

	const handleThemeToggle = useCallback(() => {
		setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
	}, [setTheme, resolvedTheme]);

	const displayIcon = useMemo(() => {
		return theme === 'dark' || resolvedTheme === 'dark' ? (
			<BsSunFill size={20} />
		) : (
			<BsMoonFill size={20} />
		);
	}, [theme, resolvedTheme]);

	return (
		<motion.button
			id="theme-btn"
			aria-label="Toggle Dark Mode"
			type="button"
			className="ml-1 mr-1 h-8 w-8 rounded p-1"
			whileTap={{
				scale: 0.7,
				rotate: 360,
				transition: {
					duration: 0.2,
				},
			}}
			whileHover={{
				scale: 1.2,
			}}
			onClick={handleThemeToggle}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor"
				className="select-none text-primary dark:text-secondary-foreground"
			>
				{mounted && displayIcon}
			</svg>
		</motion.button>
	);
};

export default ThemeSwitch;
