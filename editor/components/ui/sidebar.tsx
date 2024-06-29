'use client'

import { TabError } from '@/global/tab/slice'
import useKeyPress from '@/hooks/useKeyPress'
import useTabContext from '@/hooks/useTabContext'
import { sidebarProps } from '@/lib/constants/ui'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState, type FC } from 'react'
import toast from 'react-hot-toast'
import {
	SiC,
	SiCplusplus,
	SiJavascript,
	SiJulia,
	SiLua,
	SiPhp,
	SiPython,
	SiRuby,
	SiSqlite,
	SiTypescript,
} from 'react-icons/si'
import { Button } from './button'
import { Input } from './input'
import { Label } from './label'
import Modal from './modal'
import { RadioGroup, RadioGroupItem } from './radio-group'
import useAppContext from '@/hooks/useAppContext'
import CustomTooltip from './customTooltip'

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
	const { addTab, isMobileView } = useTabContext()
	const { isOpen, setIsOpen } = useAppContext()
	const [selectedLanguage, setSelectedLanguage] =
		useState<LanguageProps | null>(null)
	const [searchQuery, setSearchQuery] = useState('')
	const pathname = usePathname()
	const [activeNav, setActiveNav] = useState<number | null>(null)

	const filteredLanguages = useMemo(() => {
		const lowerCaseSearchQuery = searchQuery.toLowerCase().trim()
		return languageProps.filter((language) =>
			language.title.toLowerCase().includes(lowerCaseSearchQuery)
		)
	}, [searchQuery])

	const handleChange = (language: LanguageProps) => {
		setSelectedLanguage(language)
	}

	useEffect(() => {
		if (filteredLanguages.length === 1) {
			setSelectedLanguage(filteredLanguages[0])
		}
	}, [filteredLanguages])

	const handleClick = useCallback(() => {
		if (selectedLanguage) {
			const { title: meta, extension } = selectedLanguage
			const title = `index${extension}`
			try {
				addTab({
					title,
					meta,
					content: '',
					config: {
						maxContentSize: isMobileView ? 10 * 300 : 10 * 700,
						maxTabs: isMobileView ? 3 : 7,
					},
				})
			} catch (error) {
				if (error instanceof TabError) {
					toast.error(<p className="whitespace-nowrap">{error.message}</p>)
				}
			}
			setIsOpen({
				modal: false,
			})
		}
	}, [addTab, selectedLanguage, isMobileView, setIsOpen])

	const handleModal = () => {
		setIsOpen({
			modal: true,
		})
	}

	useKeyPress({
		targetKey: 'T',
		callback: () => {
			if (pathname === '/') {
				handleModal()
			}
		},
		modifier: ['ctrlKey', 'shiftKey'],
	})

	return (
		<>
			{isOpen.modal && (
				<Modal
					title="Choose A Language"
					onClose={() =>
						setIsOpen({
							modal: false,
						})
					}
				>
					<form className="grid grid-cols-1 place-content-between gap-y-2 lg:gap-y-4 xl:gap-y-4">
						<Input
							id="inputarea"
							role="searchbox"
							type="text"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							placeholder="Search language..."
							className="rounded-sm placeholder:tracking-wide focus-visible:ring-2 focus-visible:ring-offset-0"
							aria-label="search language"
						/>

						<div dir="ltr">
							<RadioGroup className="custom-scrollbar grid snap-y snap-mandatory grid-flow-row grid-cols-3 overflow-y-auto lg:snap-x lg:auto-cols-max lg:grid-flow-col lg:grid-cols-none lg:gap-4 lg:overflow-x-auto xl:snap-x xl:auto-cols-max xl:grid-flow-col xl:grid-cols-none xl:gap-4 xl:overflow-x-auto">
								{filteredLanguages.length > 0 ? (
									filteredLanguages.map((language, idx) => (
										<div key={idx} className="snap-start scroll-ms-6">
											<RadioGroupItem
												value={language.title}
												id={language.title}
												className="peer sr-only"
												onFocus={(e) => {
													e.preventDefault()
													handleChange(language)
												}}
											/>
											<Label
												htmlFor={language.title}
												className={cn(
													'grid size-auto grid-cols-1 place-content-between place-items-center gap-y-3 rounded-md border-2 border-muted bg-popover p-4 hover:border-primary peer-data-[state=checked]:border-primary lg:size-24 lg:scale-90 lg:hover:scale-100 xl:size-24 xl:scale-90 xl:hover:scale-100 [&:has([data-state=checked])]:border-primary',
													{
														'border-primary': filteredLanguages.length === 1,
													}
												)}
											>
												<language.iconProps.icon
													size={language.iconProps.size}
													className={language.iconProps.className}
												/>
												<span>{language.title}</span>
											</Label>
										</div>
									))
								) : (
									<p className="text-nowrap text-center">Runtime not found.</p>
								)}
							</RadioGroup>
						</div>
						<Button
							onClick={(e) => {
								e.preventDefault()
								handleClick()
							}}
							aria-label="start coding"
							className="rounded-sm border border-solid border-primary bg-inherit text-black transition-all delay-300 duration-150 ease-linear hover:bg-primary hover:text-white dark:border-[#CDCDDA] dark:text-white dark:hover:bg-[#CDCDDA] dark:hover:text-black"
							type="submit"
						>
							Start Coding
						</Button>
					</form>
				</Modal>
			)}

			{isOpen.sidebar && (
				<aside className="sticky left-0 top-0 z-10 flex h-dvh w-12 flex-col border-r border-solid border-background/80 bg-secondary py-16">
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
									<CustomTooltip
										content={<p className="text-xs">Choose Language</p>}
									>
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
									</CustomTooltip>
								) : (
									!isMobileView && (
										<CustomTooltip
											content={<p className="text-xs">Collaborate</p>}
										>
											<Link href={'/'} aria-label="label">
												<val.icon
													size={30}
													onClick={() => {
														setActiveNav(idx)
													}}
												/>
											</Link>
										</CustomTooltip>
									)
								)}
							</div>
						))}
				</aside>
			)}
		</>
	)
}

export default Sidebar
