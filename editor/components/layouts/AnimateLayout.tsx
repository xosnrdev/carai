import { AnimatePresence, Variants, motion } from 'framer-motion'
import type { FC, ReactNode } from 'react'

const PageTransition: Variants = {
	initial: {
		opacity: 0,
	},
	enter: {
		opacity: 1,
		transition: {
			duration: 2.6,
			ease: 'easeInOut',
		},
	},
	exit: {
		opacity: 0,
		transition: {
			duration: 2.4,
			ease: 'easeInOut',
		},
	},
}

interface AnimatedLayoutProps {
	children: ReactNode
}

const AnimatedLayout: FC<AnimatedLayoutProps> = ({ children }) => {
	return (
		<AnimatePresence>
			<motion.div
				initial="initial"
				animate="enter"
				exit="exit"
				variants={PageTransition}
				className="w-full"
			>
				{children}
			</motion.div>
		</AnimatePresence>
	)
}

export default AnimatedLayout
