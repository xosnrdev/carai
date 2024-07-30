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
            src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-plain.svg',
            alias: 'javascript',
            name: 'javascript',
        },
        {
            extension: '.go',
            src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/go/go-original.svg',
            alias: 'go',
            name: 'go',
        },
        {
            extension: '.py',
            src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg',
            alias: 'python',
            name: 'python',
        },
        {
            extension: '.ts',
            src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-plain.svg',
            alias: 'typescript',
            name: 'typescript',
        },
        {
            extension: '.c',
            src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/c/c-plain.svg',
            alias: 'c',
            name: 'c',
        },
        {
            extension: '.cpp',
            src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-plain.svg',
            alias: 'cpp',
            name: 'cpp',
        },
        {
            extension: '.v',
            src: 'https://upload.wikimedia.org/wikipedia/commons/d/dd/V_programming_language.svg',
            alias: 'textile',
            name: 'v',
        },
        {
            extension: '.php',
            src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-original.svg',
            alias: 'php',
            name: 'php',
        },
        {
            extension: '.sql',
            src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/sqlite/sqlite-original.svg',
            alias: 'sql',
            name: 'sqlite3',
        },
        {
            extension: '.rb',
            src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/ruby/ruby-original.svg',
            alias: 'ruby',
            name: 'ruby',
        },
        {
            extension: '.lua',
            src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/lua/lua-plain.svg',
            alias: 'lua',
            name: 'lua',
        },
        {
            extension: '.jl',
            src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/julia/julia-original.svg',
            alias: 'julia',
            name: 'julia',
        },
        {
            extension: '.erl',
            src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/erlang/erlang-original.svg',
            alias: 'erlang',
            name: 'erlang',
        },
        {
            extension: '.ex',
            src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/elixir/elixir-original.svg',
            alias: 'textile',
            name: 'elixir',
        },
        {
            extension: '.java',
            src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg',
            alias: 'java',
            name: 'java',
        },
        {
            extension: '.bf',
            src: 'assets/icons/brainfuck.svg',
            alias: 'brainfuck',
            name: 'brainfuck',
        },
        {
            extension: '.cl',
            src: 'https://upload.wikimedia.org/wikipedia/commons/4/48/Lisp_logo.svg',
            alias: 'commonLisp',
            name: 'common lisp',
        },
        {
            extension: '.tengo',
            src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/go/go-original.svg',
            alias: 'go',
            name: 'tengo',
        },
        {
            extension: '.janet',
            src: 'assets/icons/janet.svg',
            alias: 'textile',
            name: 'janet',
        },
        {
            extension: '.cs',
            src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-plain.svg',
            alias: 'csharp',
            name: 'csharp',
        },
        {
            extension: '.rs',
            src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/rust/rust-original.svg',
            alias: 'rust',
            name: 'rust',
        },
    ]
