import type {
    RuntimeProps,
    NavProps,
    OnboardingProps,
    RouteProps,
    SidebarProps,
} from '@/types'

import { HiUsers } from 'react-icons/hi2'
import { IoIosCloseCircle, IoIosInformationCircle } from 'react-icons/io'
import { MdAddBox } from 'react-icons/md'
import { TbAlertTriangleFilled } from 'react-icons/tb'

export const sidebarProps: SidebarProps[] = [
        {
            id: 'add',
            icon: MdAddBox,
            label: 'Add',
        },
        {
            id: 'users',
            icon: HiUsers,
            label: 'Users',
        },
    ],
    navProps: NavProps[] = [
        {
            icon: IoIosCloseCircle,
        },
        {
            icon: TbAlertTriangleFilled,
        },
        {
            icon: IoIosInformationCircle,
        },
    ],
    headerProps: RouteProps[] = [
        {
            id: 'sign-up',
            label: 'Sign Up',
            path: '/sign-up',
        },
        {
            id: 'sign-in',
            label: 'Sign In',
            path: '/sign-in',
        },
    ],
    onboardingProps: OnboardingProps = {
        links: [
            {
                id: 'sign-up',
                label: 'Create Account',
                path: '/sign-up',
            },
            {
                id: 'sign-in',
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
    },
    runtimeProps: RuntimeProps[] = [
        {
            extension: '.js',
            alias: 'javascript',
            name: 'javascript',
            language: 'javascript',
        },
        {
            extension: '.go',
            alias: 'go',
            name: 'go',
            language: 'golang',
        },
        {
            extension: '.py',
            alias: 'python',
            name: 'python',
            language: 'python',
        },
        {
            extension: '.ts',
            alias: 'typescript',
            name: 'typescript',
            language: 'typescript',
        },
        {
            extension: '.c',
            alias: 'c',
            name: 'c',
            language: 'clang',
        },
        {
            extension: '.cpp',
            alias: 'cpp',
            name: 'cpp',
            language: 'cpp',
        },
        {
            extension: '.php',
            alias: 'php',
            name: 'php',
            language: 'php',
        },
        {
            extension: '.rb',
            alias: 'ruby',
            name: 'ruby',
            language: 'ruby',
        },
        {
            extension: '.lua',
            alias: 'lua',
            name: 'lua',
            language: 'lua',
        },
        {
            extension: '.jl',
            alias: 'julia',
            name: 'julia',
            language: 'julia',
        },
        {
            extension: '.erl',
            alias: 'erlang',
            name: 'erlang',
            language: 'erlang',
        },
        {
            extension: '.ex',
            alias: 'textile',
            name: 'elixir',
            language: 'elixir',
        },
        {
            extension: '.java',
            alias: 'java',
            name: 'java',
            language: 'java',
        },
        {
            extension: '.cl',
            alias: 'commonLisp',
            name: 'clisp',
            language: 'clisp',
        },
        {
            extension: '.cs',
            alias: 'csharp',
            name: 'csharp',
            language: 'csharp',
        },
        {
            extension: '.rs',
            alias: 'rust',
            name: 'rust',
            language: 'rust',
        },
    ]
