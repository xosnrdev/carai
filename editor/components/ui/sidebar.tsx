'use client'

import { sidebarProps } from '@/lib/constants/ui'
import { cn } from '@/lib/utils'
import useKeyPress from '@/sdk/hooks/useKeyPress'
import { TabError, useTabContext } from '@/sdk/tabkit/store'
import Link from 'next/link'
import { FC, useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import { MdNavigateBefore, MdNavigateNext } from 'react-icons/md'
import { Button } from './button'
import { Input } from './input'
import { Label } from './label'
import Modal from './modal'
import { RadioGroup, RadioGroupItem } from './radio-group'
import { usePathname } from 'next/navigation'
import {
	SiC,
	SiCplusplus,
	SiElixir,
	SiErlang,
	SiGo,
	SiJavascript,
	SiJulia,
	SiLua,
	SiPhp,
	SiPython,
	SiRuby,
	SiSqlite,
	SiTypescript,
	SiV,
} from 'react-icons/si'

const languageProps: LanguageProps[] = [
	{
		title: 'Javascript',
		extension: '.js',
		iconProps: {
			icon: SiJavascript,
			className: 'text-yellow-500',
			size: 40,
		},
	},
	// {
	// 	title: 'Go',
	// 	extension: '.go',
	// 	iconProps: {
	// 		icon: SiGo,
	// 		className: 'text-blue-500',
	// 		size: 40,
	// 	},
	// },
	{
		title: 'Python',
		extension: '.py',
		iconProps: {
			icon: SiPython,
			className: 'text-blue-600',
			size: 40,
		},
	},
	{
		title: 'Typescript',
		extension: '.ts',
		iconProps: {
			icon: SiTypescript,
			className: 'text-blue-400',
			size: 40,
		},
	},
	{
		title: 'C',
		extension: '.c',
		iconProps: {
			icon: SiC,
			className: 'text-blue-800',
			size: 40,
		},
	},
	{
		title: 'C++',
		extension: '.cpp',
		iconProps: {
			icon: SiCplusplus,
			className: 'text-purple-500',
			size: 40,
		},
	},
	// {
	// 	title: 'V',
	// 	extension: '.v',
	// 	iconProps: {
	// 		icon: SiV,
	// 		className: 'text-blue-500',
	// 		size: 40,
	// 	},
	// },
	{
		title: 'PHP',
		extension: '.php',
		iconProps: {
			icon: SiPhp,
			className: 'text-purple-600',
			size: 40,
		},
	},
	{
		title: 'SQLite3',
		extension: '.sqlite',
		iconProps: {
			icon: SiSqlite,
			className: 'text-blue-900',
			size: 40,
		},
	},
	{
		title: 'Ruby',
		extension: '.rb',
		iconProps: {
			icon: SiRuby,
			className: 'text-red-600',
			size: 40,
		},
	},
	{
		title: 'Lua',
		extension: '.lua',
		iconProps: {
			icon: SiLua,
			className: 'text-blue-300',
			size: 40,
		},
	},
	{
		title: 'Julia',
		extension: '.jl',
		iconProps: {
			icon: SiJulia,
			className: 'text-purple-700',
			size: 40,
		},
	},
	// {
	// 	title: 'Erlang',
	// 	extension: '.erl',
	// 	iconProps: {
	// 		icon: SiErlang,
	// 		className: 'text-red-500',
	// 		size: 40,
	// 	},
	// },
	// {
	// 	title: 'Elixir',
	// 	extension: '.ex',
	// 	iconProps: {
	// 		icon: SiElixir,
	// 		className: 'text-purple-500',
	// 		size: 40,
	// 	},
	// },
]

const Sidebar: FC = () => {
	const [isOpen, setIsOpen] = useState(false)
	const [selectedLanguage, setSelectedLanguage] =
		useState<LanguageProps | null>(null)
	const [currentView, setCurrentView] = useState(0)
	const [searchQuery, setSearchQuery] = useState('')
	const pathname = usePathname()
	const [activeNav, setActiveNav] = useState<number | null>(null)
	const { addTab } = useTabContext()

	const itemsPerView = 3

	const handleChange = useCallback((language: LanguageProps) => {
		setSelectedLanguage(language)
	}, [])

	const handleClick = useCallback(() => {
		if (selectedLanguage) {
			const { title: meta, extension } = selectedLanguage
			const filename = `index${extension}`
			try {
				addTab({
					title: filename,
					meta,
					content: '',
					config: {
						maxContentSize: 10 * 1000,
						maxTabs: 10,
					},
				})
			} catch (error) {
				if (error instanceof TabError) {
					toast.error(<p className="whitespace-nowrap">{error.message}</p>)
				}
			}
			setIsOpen(false)
		}
	}, [selectedLanguage, addTab])

	const handleModal = useCallback(() => {
		setIsOpen(true)
	}, [])

	useKeyPress({
		targetKey: 't',
		callback: handleModal,
		modifier: 'ctrlKey',
	})

	return (
		<>
			{isOpen && (
				<Modal title="Choose A Language" onClose={() => setIsOpen(false)}>
					<div className="grid w-full grid-cols-1 gap-y-4">
						<Input
							type="text"
							value={searchQuery}
							onChange={(event) => setSearchQuery(event.target.value)}
							placeholder="Search language..."
							className="rounded-sm py-6 placeholder:tracking-wide focus-visible:ring-2 focus-visible:ring-offset-0"
							aria-label="search language"
						/>

						<div className="flex flex-row items-center justify-between">
							<button
								onClick={() => setCurrentView(currentView - 1)}
								disabled={currentView === 0}
								aria-label="previous"
								className="disabled:text-muted-foreground disabled:dark:text-[#FFFFFF66]"
							>
								<MdNavigateBefore size={50} />
							</button>

							<RadioGroup
								className="grid w-full grid-cols-3 gap-4"
								onKeyDown={function (event) {
									if (event.key === 'Enter') {
										event.preventDefault()
										event.stopPropagation()
										handleClick()
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
								className="disabled:text-muted-foreground disabled:dark:text-[#FFFFFF66]"
							>
								<MdNavigateNext size={50} />
							</button>
						</div>

						<Button
							onClick={function (e) {
								e.preventDefault()
								handleClick()
							}}
							aria-label="start coding"
							className="rounded-sm border border-solid border-primary bg-inherit text-black transition-all delay-300 duration-150 ease-linear hover:bg-primary hover:text-white dark:border-[#CDCDDA] dark:text-white dark:hover:bg-[#CDCDDA] dark:hover:text-black"
						>
							Start Coding
						</Button>
					</div>
				</Modal>
			)}

			<aside className="sticky left-0 top-0 m-auto flex h-screen w-16 flex-col border-r border-solid border-background/80 bg-secondary py-16">
				{pathname === '/' &&
					sidebarProps.map(({ label, ...val }, idx) => (
						<div
							key={idx}
							className={cn(
								'mx-auto my-4 flex flex-col items-center text-muted-foreground dark:text-secondary-foreground/30',
								{
									'text-primary dark:text-[#CDCDDA]': activeNav === idx,
								}
							)}
						>
							{idx === 0 ? (
								<button
									onClick={(e) => {
										handleModal()
										setActiveNav(idx)
										e.preventDefault()
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
											setActiveNav(idx)
										}}
									/>
								</Link>
							)}
						</div>
					))}
			</aside>
		</>
	)
}

export default Sidebar
