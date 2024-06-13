import { HiUsers } from 'react-icons/hi2'
import {
	IoIosArrowDropleftCircle,
	IoIosArrowDroprightCircle,
	IoIosCloseCircle,
	IoIosInformationCircle,
} from 'react-icons/io'
import { MdAddBox } from 'react-icons/md'
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
import { TbAlertTriangleFilled } from 'react-icons/tb'

export const sidebarProps: SidebarProps[] = [
	{
		icon: MdAddBox,
		label: 'Add',
	},
	{
		icon: HiUsers,
		label: 'Users',
	},
]

export const navProps: NavProps[] = [
	{
		icon: IoIosCloseCircle,
	},
	{
		icon: TbAlertTriangleFilled,
	},
	{
		icon: IoIosInformationCircle,
	},
]

export const languageProps: LanguageProps[] = [
	{
		title: 'Javascript',
		extension: '.js',
		iconProps: {
			icon: SiJavascript,
			className: 'text-yellow-500',
			size: 40,
		},
	},
	{
		title: 'Go',
		extension: '.go',
		iconProps: {
			icon: SiGo,
			className: 'text-blue-500',
			size: 40,
		},
	},
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
	{
		title: 'V',
		extension: '.v',
		iconProps: {
			icon: SiV,
			className: 'text-blue-500',
			size: 40,
		},
	},
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
		title: 'SQLite',
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
	{
		title: 'Erlang',
		extension: '.erl',
		iconProps: {
			icon: SiErlang,
			className: 'text-red-500',
			size: 40,
		},
	},
	{
		title: 'Elixir',
		extension: '.ex',
		iconProps: {
			icon: SiElixir,
			className: 'text-purple-500',
			size: 40,
		},
	},
]

export const headerProps: RouteProps[] = [
	{
		label: 'Sign Up',
		path: '/sign-up',
	},
	{
		label: 'Sign In',
		path: '/sign-in',
	},
]

export const onboardingProps: OnboardingProps = {
	links: [
		{
			label: 'Create Account',
			path: '/sign-up',
		},
		{
			label: 'Log In',
			path: '/sign-in',
		},
	],
	texts: [
		'Share, review, and improve your code',
		'Connect and code with peers',
		'Communicate in real-time',
		'Keep track of changes',
		'Start collaborating today',
	],
}

export const tabBarProps: TabBarProps[] = [
	{
		icon: IoIosArrowDropleftCircle,
		label: 'previous_tab',
	},
	{
		icon: IoIosArrowDroprightCircle,
		label: 'next_tab',
	},
]
