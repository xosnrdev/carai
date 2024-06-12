'use client';

import { languageProps, sidebarProps } from '@/lib/constants/ui';
import { cn } from '@/lib/utils';
import useKeyPress from '@/sdk/hooks/useKeyPress';
import { TabError, useTabContext } from '@/sdk/tabkit/store';
import Link from 'next/link';
import { FC, useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import { MdNavigateBefore, MdNavigateNext } from 'react-icons/md';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import Modal from './modal';
import { RadioGroup, RadioGroupItem } from './radio-group';

const Sidebar: FC = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [selectedLanguage, setSelectedLanguage] =
		useState<LanguageProps | null>(null);
	const [currentView, setCurrentView] = useState(0);
	const [searchQuery, setSearchQuery] = useState('');

	const [activeNav, setActiveNav] = useState<number | null>(null);
	const { addTab } = useTabContext();

	const itemsPerView = 3;

	const handleChange = useCallback((language: LanguageProps) => {
		setSelectedLanguage(language);
	}, []);

	const handleClick = useCallback(() => {
		if (selectedLanguage) {
			const { title: meta, extension } = selectedLanguage;
			const filename = `index${extension}`;
			try {
				addTab({
					title: filename,
					meta,
					content: '',
					config: {
						maxContentSize: 5000,
						maxTabs: 5,
					},
				});
			} catch (error) {
				if (error instanceof TabError) {
					toast.error(<p className="whitespace-nowrap ">{error.message}</p>);
				}
			}
			setIsOpen(false);
		}
	}, [selectedLanguage, addTab]);

	const handleModal = useCallback(() => {
		setIsOpen(true);
	}, []);

	useKeyPress({
		targetKey: 't',
		callback: handleModal,
		modifier: 'ctrlKey',
	});

	return (
		<>
			{isOpen && (
				<Modal title="Choose A Language" onClose={() => setIsOpen(false)}>
					<div className="grid grid-cols-1 gap-y-4 w-full">
						<Input
							type="text"
							value={searchQuery}
							onChange={(event) => setSearchQuery(event.target.value)}
							placeholder="Search languageProps..."
							className="focus-visible:ring-offset-0 py-6 rounded-sm focus-visible:ring-2 placeholder:tracking-wide"
							aria-label="search language"
						/>

						<div className="flex flex-row justify-between items-center">
							<button
								onClick={() => setCurrentView(currentView - 1)}
								disabled={currentView === 0}
								aria-label="previous"
								className="disabled:dark:text-[#FFFFFF66] disabled:text-muted-foreground"
							>
								<MdNavigateBefore size={50} />
							</button>

							<RadioGroup
								className="grid grid-cols-3 gap-4 w-full"
								onKeyDown={function (event) {
									if (event.key === 'Enter') {
										event.preventDefault();
										event.stopPropagation();
										handleClick();
									}
								}}
							>
								{languageProps
									.filter((language) =>
										language.title
											.toLowerCase()
											.includes(searchQuery.toLowerCase().trim())
									)
									.slice(
										currentView * itemsPerView,
										(currentView + 1) * itemsPerView
									)
									.map((language, idx) => (
										<span key={idx}>
											<RadioGroupItem
												value={language.title}
												id={language.title}
												className="peer sr-only"
												onFocus={() => handleChange(language)}
											/>
											<Label
												htmlFor={language.title}
												className="flex flex-col items-center justify-between gap-y-3 rounded-md border-2 border-muted bg-popover p-4 hover:border-primary hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
											>
												<language.iconProps.icon
													size={language.iconProps.size}
													className={language.iconProps.className}
												/>
												{language.title}
											</Label>
										</span>
									))}
							</RadioGroup>

							<button
								onClick={() => setCurrentView(currentView + 1)}
								disabled={
									(currentView + 1) * itemsPerView >= languageProps.length
								}
								aria-label="next"
								className="disabled:dark:text-[#FFFFFF66] disabled:text-muted-foreground"
							>
								<MdNavigateNext size={50} />
							</button>
						</div>

						<Button
							onClick={function (e) {
								e.preventDefault();
								handleClick();
							}}
							aria-label="start coding"
							className="hover:bg-blue-600 text-white"
						>
							Start Coding
						</Button>
					</div>
				</Modal>
			)}

			<aside className="sticky top-0 left-0 flex h-screen flex-col bg-secondary border-r border-solid border-background/80 px-3 py-16">
				{sidebarProps.map(({ label, ...val }, idx) => (
					<div
						key={idx}
						className={cn(
							'dark:text-secondary-foreground/30 text-muted-foreground mx-auto flex flex-col items-center p-4',
							{
								'text-primary dark:text-[#CDCDDA]': activeNav === idx,
							}
						)}
					>
						{idx === 0 ? (
							<button
								onClick={(e) => {
									handleModal();
									setActiveNav(idx);
									e.preventDefault();
								}}
								aria-label={label}
							>
								<val.icon size={30} />
							</button>
						) : (
							<Link href={'/'} aria-label="label">
								<val.icon
									size={30}
									onClick={() => {
										setActiveNav(idx);
									}}
								/>
							</Link>
						)}
					</div>
				))}
			</aside>
		</>
	);
};

export default Sidebar;
