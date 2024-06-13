import { headerProps } from '@/lib/constants/ui'
import { cn } from '@/lib/utils'
import { useTabContext } from '@/sdk/tabkit/store'
import { useRouter } from 'next/navigation'
import { FC } from 'react'
import ThemeSwitch from '../utils/ThemeSwitch'
import Brand from './brand'
import { Button } from './button'

const Header: FC = () => {
	const { isTabEditor } = useTabContext()

	const router = useRouter()
	return (
		<header className="sticky top-0 z-10 m-auto flex h-16 w-full flex-row items-center justify-between border-b border-solid border-background/80 bg-secondary px-8">
			<Brand />
			<div className="flex flex-row items-center justify-center gap-x-6">
				<ThemeSwitch />
				{isTabEditor && (
					<div className="flex flex-row gap-x-4">
						{headerProps.map((p, idx) => (
							<Button
								key={idx}
								onClick={(e) => {
									router.push(p.path)
									e.preventDefault()
								}}
								className={cn(
									'rounded-sm border border-solid border-primary bg-inherit text-black transition-all delay-300 duration-150 ease-linear hover:bg-primary hover:text-white dark:border-[#CDCDDA] dark:text-white dark:hover:bg-[#CDCDDA] dark:hover:text-black'
								)}
							>
								{p.label}
							</Button>
						))}
					</div>
				)}
			</div>
		</header>
	)
}

export default Header
