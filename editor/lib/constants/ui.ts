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

export { sidebarProps, navProps, headerProps, onboardingProps, runtimeProps }

const sidebarProps: SidebarProps[] = [
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
]

const navProps: NavProps[] = [
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

const headerProps: RouteProps[] = [
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
]

const onboardingProps: OnboardingProps = {
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
}

const runtimeProps: RuntimeProps[] = [
    {
        fileExtension: '.js',
        codeMirrorLanguageSupportName: 'javascript',
        monacoEditorLanguageSupportName: 'javascript',
        imageName: 'javascript',
        languageName: 'JavaScript',
    },
    {
        fileExtension: '.go',
        codeMirrorLanguageSupportName: 'go',
        monacoEditorLanguageSupportName: 'go',
        imageName: 'go',
        languageName: 'Go',
    },
    {
        fileExtension: '.py',
        codeMirrorLanguageSupportName: 'python',
        monacoEditorLanguageSupportName: 'python',
        imageName: 'python',
        languageName: 'Python',
    },
    {
        fileExtension: '.ts',
        codeMirrorLanguageSupportName: 'typescript',
        monacoEditorLanguageSupportName: 'typescript',
        imageName: 'typescript',
        languageName: 'TypeScript',
    },
    {
        fileExtension: '.c',
        codeMirrorLanguageSupportName: 'c',
        monacoEditorLanguageSupportName: 'cpp',
        imageName: 'c',
        languageName: 'C',
    },
    {
        fileExtension: '.cpp',
        codeMirrorLanguageSupportName: 'cpp',
        monacoEditorLanguageSupportName: 'cpp',
        imageName: 'cpp',
        languageName: 'C++',
    },
    {
        fileExtension: '.php',
        codeMirrorLanguageSupportName: 'php',
        monacoEditorLanguageSupportName: 'php',
        imageName: 'php',
        languageName: 'PHP',
    },
    {
        fileExtension: '.rb',
        codeMirrorLanguageSupportName: 'ruby',
        monacoEditorLanguageSupportName: 'ruby',
        imageName: 'ruby',
        languageName: 'Ruby',
    },
    {
        fileExtension: '.lua',
        codeMirrorLanguageSupportName: 'lua',
        monacoEditorLanguageSupportName: 'lua',
        imageName: 'lua',
        languageName: 'Lua',
    },
    {
        fileExtension: '.jl',
        codeMirrorLanguageSupportName: 'julia',
        monacoEditorLanguageSupportName: 'julia',
        imageName: 'julia',
        languageName: 'Julia',
    },
    {
        fileExtension: '.erl',
        codeMirrorLanguageSupportName: 'erlang',
        monacoEditorLanguageSupportName: 'erlang',
        imageName: 'erlang',
        languageName: 'Erlang',
    },
    {
        fileExtension: '.ex',
        // no code mirror language support for elixir
        codeMirrorLanguageSupportName: 'textile',
        // no monaco editor language support for elixir
        monacoEditorLanguageSupportName: 'elixir',
        imageName: 'elixir',
        languageName: 'Elixir',
    },
    {
        fileExtension: '.java',
        codeMirrorLanguageSupportName: 'java',
        monacoEditorLanguageSupportName: 'java',
        imageName: 'java',
        languageName: 'Java',
    },
    {
        fileExtension: '.cl',
        codeMirrorLanguageSupportName: 'commonLisp',
        //no monaco editor language support for common lisp
        monacoEditorLanguageSupportName: 'clisp',
        imageName: 'clisp',
        languageName: 'Clisp',
    },
    {
        fileExtension: '.cs',
        codeMirrorLanguageSupportName: 'csharp',
        monacoEditorLanguageSupportName: 'csharp',
        imageName: 'csharp',
        languageName: 'C#',
    },
    {
        fileExtension: '.rs',
        codeMirrorLanguageSupportName: 'rust',
        monacoEditorLanguageSupportName: 'rust',
        imageName: 'rust',
        languageName: 'Rust',
    },
]
