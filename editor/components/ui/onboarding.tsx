import AnimatedLayout from '@/components/layouts/AnimateLayout';
import { onboardingProps } from '@/lib/constants/ui';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { FC } from 'react';
import { BiSolidRightArrow } from 'react-icons/bi';
import Banner from './banner';
import { Button } from './button';

const Onboarding: FC = () => {
	const router = useRouter();

	return (
		<AnimatedLayout key="_welcome">
			<div className="hidden xl:block min-h-screen pt-12 px-12 mx-auto ">
				<div className="flex flex-row items-center justify-between">
					<div className="grid grid-cols-1 gap-y-6">
						<h1 className="font-extrabold tracking-tight text-primary dark:text-secondary-foreground text-6xl">
							Get Started with Carai
						</h1>

						<ul className="flex flex-col space-y-6">
							{onboardingProps.texts.map((text, idx) => (
								<li
									key={idx}
									className="flex flex-row items-center gap-x-1 gap-y-2 text-xl text-foreground/50 hover:opacity-75 hover:cursor-pointer transition-opacity duration-300"
								>
									<BiSolidRightArrow />
									<p className="leading-10">{text}</p>
								</li>
							))}
						</ul>

						<div className="flex flex-col gap-y-4 mt-12">
							{onboardingProps.links.map((link, idx) => (
								<Button
									key={idx}
									onClick={(e) => {
										router.push(link.path);
										e.preventDefault();
									}}
									className={cn('hover:bg-blue-600 text-white max-w-xs', {
										'dark:bg-secondary-foreground dark:text-secondary bg-accent text-secondary-foreground hover:bg-muted-foreground/50':
											idx === 1,
									})}
									size={'lg'}
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
	);
};

export default Onboarding;
