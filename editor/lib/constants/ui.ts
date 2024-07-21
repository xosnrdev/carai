import type {
    LanguageProps,
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
    languageProps: LanguageProps[] = [
        {
            runtime: 'Javascript',
            extension: '.js',
            src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-plain.svg',
            mode: 'javascript',
        },
        {
            runtime: 'Go',
            extension: '.go',
            src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/go/go-original.svg',
            mode: 'golang',
        },
        {
            runtime: 'Python',
            extension: '.py',
            src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg',
            mode: 'python',
        },
        {
            runtime: 'Typescript',
            extension: '.ts',
            src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-plain.svg',
            mode: 'typescript',
        },
        {
            runtime: 'C',
            extension: '.c',
            src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/c/c-plain.svg',
            mode: 'c_cpp',
        },
        {
            runtime: 'CPP',
            extension: '.cpp',
            src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-plain.svg',
            mode: 'c_cpp',
        },
        {
            runtime: 'V',
            extension: '.v',
            src: 'https://upload.wikimedia.org/wikipedia/commons/d/dd/V_programming_language.svg',
            mode: 'text',
        },
        {
            runtime: 'PHP',
            extension: '.php',
            src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-original.svg',
            mode: 'php',
        },
        {
            runtime: 'SQLite3',
            extension: '.sql',
            src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/sqlite/sqlite-original.svg',
            mode: 'sql',
        },
        {
            runtime: 'Ruby',
            extension: '.rb',
            src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/ruby/ruby-original.svg',
            mode: 'ruby',
        },
        {
            runtime: 'Lua',
            extension: '.lua',
            src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/lua/lua-plain.svg',
            mode: 'lua',
        },
        {
            runtime: 'Julia',
            extension: '.jl',
            src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/julia/julia-original.svg',
            mode: 'julia',
        },
        {
            runtime: 'Erlang',
            extension: '.erl',
            src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/erlang/erlang-original.svg',
            mode: 'erlang',
        },
        {
            runtime: 'Elixir',
            extension: '.ex',
            src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/elixir/elixir-original.svg',
            mode: 'elixir',
        },
        {
            runtime: 'Java',
            extension: '.java',
            src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg',
            mode: 'java',
        },
        {
            runtime: 'Brainfuck',
            extension: '.bf',
            src: 'assets/icons/brainfuck.svg',
            mode: 'text',
        },
        {
            runtime: 'Common Lisp',
            extension: '.cl',
            src: 'https://upload.wikimedia.org/wikipedia/commons/4/48/Lisp_logo.svg',
            mode: 'text',
        },
        {
            runtime: 'Tengo',
            extension: '.tengo',
            src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/go/go-original.svg',
            mode: 'golang',
        },
        {
            runtime: 'Janet',
            extension: '.janet',
            src: 'assets/icons/janet.svg',
            mode: 'text',
        },
        {
            runtime: 'CSharp',
            extension: '.cs',
            src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-plain.svg',
            mode: 'csp',
        },
        {
            runtime: 'Rust',
            extension: '.rs',
            src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/rust/rust-original.svg',
            mode: 'rst',
        },
    ]
