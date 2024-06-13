import AnimatedLayout from '@/components/layouts/AnimateLayout'
import { onboardingProps } from '@/lib/constants/ui'
import { useRouter } from 'next/navigation'
import { FC } from 'react'
import { BiSolidRightArrow } from 'react-icons/bi'
import Banner from './banner'
import { Button } from './button'

const Onboarding: FC = () => {
	const router = useRouter()

	return (
		<AnimatedLayout key="_welcome">
			<div className="mx-auto hidden min-h-screen px-12 pt-12 xl:block">
				<div className="flex flex-row items-center justify-between">
					<div className="grid grid-cols-1 gap-y-6">
						<h1 className="text-6xl font-extrabold text-primary dark:text-secondary-foreground">
							Get Started with Carai
						</h1>

						<ul className="flex flex-col space-y-6">
							{onboardingProps.texts.map((text, idx) => (
								<li
									key={idx}
									className="flex flex-row items-center gap-x-1 gap-y-2 text-xl text-foreground/50 transition-opacity duration-300 hover:cursor-pointer hover:opacity-75"
								>
									<BiSolidRightArrow />
									<p className="leading-10">{text}</p>
								</li>
							))}
						</ul>

						<div className="mt-12 grid max-w-md gap-y-4">
							{onboardingProps.links.map((link, idx) => (
								<Button
									key={idx}
									onClick={(e) => {
										router.push(link.path)
										e.preventDefault()
									}}
									className="rounded-sm border border-solid border-primary bg-inherit text-black transition-all delay-300 duration-150 ease-linear hover:bg-primary hover:text-white dark:border-[#CDCDDA] dark:text-white dark:hover:bg-[#CDCDDA] dark:hover:text-black"
									size={'sm'}
								>
									{link.label}
								</Button>
							))}
						</div>
					</div>
					<Banner />
				</div>
			</div>
		</AnimatedLayout>
	)
}

export default Onboarding
