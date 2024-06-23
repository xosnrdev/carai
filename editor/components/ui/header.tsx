'use client'

import useTabContext from '@/hooks/useTabContext'
import { headerProps } from '@/lib/constants/ui'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import type { FC } from 'react'
import ThemeSwitch from '../utils/ThemeSwitch'
import Brand from './brand'
import { Button } from './button'

const Header: FC = () => {
	const { isTabViewEditor } = useTabContext()

	const router = useRouter()
	return (
		<header className="sticky top-0 z-50 m-auto flex h-14 w-full flex-row items-center justify-between border-b border-solid border-background/80 bg-secondary px-4 lg:h-16 lg:px-8 xl:h-16 xl:px-8">
			<Brand />
			<div className="flex flex-row items-center justify-center gap-x-6">
				<ThemeSwitch />
				{isTabViewEditor && (
					<div className="hidden flex-row gap-x-4 lg:flex xl:flex">
						{headerProps.map((prop, idx) => (
							<Button
								key={idx}
								onClick={(e) => {
									router.push(prop.path)
									e.preventDefault()
								}}
								className={cn(
									'rounded-sm border border-solid border-primary bg-inherit text-black transition-all delay-300 duration-150 ease-linear hover:bg-primary hover:text-white dark:border-[#CDCDDA] dark:text-white dark:hover:bg-[#CDCDDA] dark:hover:text-black'
								)}
							>
								{prop.label}
							</Button>
						))}
					</div>
				)}
			</div>
		</header>
	)
}

export default Header
