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
		<AnimatedLayout key="welcome_tabview">
			<div className="mx-auto h-dvh pt-4 lg:px-12 lg:pt-8 xl:px-12 xl:pt-8">
				<div className="flex flex-col items-center justify-center lg:flex-row lg:justify-between xl:flex-row xl:justify-between">
					<div className="grid grid-cols-1 gap-y-6">
						<h1 className="text-nowrap text-2xl font-extrabold text-primary dark:text-secondary-foreground lg:text-6xl xl:text-6xl">
							Get Started with Carai
						</h1>

						<ul className="flex flex-col space-y-6">
							{onboardingProps.texts.map((text, idx) => (
								<li
									key={idx}
									className="z-10 flex flex-row items-center gap-x-1 gap-y-2 text-nowrap text-base text-foreground/50 transition-opacity duration-300 hover:cursor-pointer hover:opacity-75 lg:text-xl xl:text-xl"
								>
									<BiSolidRightArrow />
									<p className="leading-10">{text}</p>
								</li>
							))}
						</ul>

						<div className="mt-12 grid gap-y-4 lg:max-w-md xl:max-w-md">
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
					<div className="hidden lg:block xl:block">
						<Banner />
					</div>
				</div>
			</div>
		</AnimatedLayout>
	)
}

export default Onboarding
