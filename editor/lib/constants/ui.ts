import { HiUsers } from 'react-icons/hi2'
import {
	IoIosArrowDropleftCircle,
	IoIosArrowDroprightCircle,
	IoIosCloseCircle,
	IoIosInformationCircle,
} from 'react-icons/io'
import { MdAddBox } from 'react-icons/md'

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
