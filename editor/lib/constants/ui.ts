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
        snippet: 'console.log("Hello, World!")',
    },
    {
        fileExtension: '.go',
        codeMirrorLanguageSupportName: 'go',
        monacoEditorLanguageSupportName: 'go',
        imageName: 'go',
        languageName: 'Go',
        snippet:
            'package main\n\nimport "fmt"\n\nfunc main() {\n\tfmt.Println("Hello, World!")\n}',
    },
    {
        fileExtension: '.py',
        codeMirrorLanguageSupportName: 'python',
        monacoEditorLanguageSupportName: 'python',
        imageName: 'python',
        languageName: 'Python',
        snippet: 'print("Hello, World!")',
    },
    {
        fileExtension: '.ts',
        codeMirrorLanguageSupportName: 'typescript',
        monacoEditorLanguageSupportName: 'typescript',
        imageName: 'typescript',
        languageName: 'TypeScript',
        snippet: 'console.log("Hello, World!")',
    },
    {
        fileExtension: '.c',
        codeMirrorLanguageSupportName: 'c',
        monacoEditorLanguageSupportName: 'cpp',
        imageName: 'c',
        languageName: 'C',
        snippet:
            '#include <stdio.h>\n\nint main() {\n\tprintf("Hello, World!");\n\treturn 0;\n}',
    },
    {
        fileExtension: '.cpp',
        codeMirrorLanguageSupportName: 'cpp',
        monacoEditorLanguageSupportName: 'cpp',
        imageName: 'cpp',
        languageName: 'C++',
        snippet:
            '#include <iostream>\n\nint main() {\n\tstd::cout << "Hello, World!";\n\treturn 0;\n}',
    },
    {
        fileExtension: '.php',
        codeMirrorLanguageSupportName: 'php',
        monacoEditorLanguageSupportName: 'php',
        imageName: 'php',
        languageName: 'PHP',
        snippet: '<?php\n\necho "Hello, World!";',
    },
    {
        fileExtension: '.rb',
        codeMirrorLanguageSupportName: 'ruby',
        monacoEditorLanguageSupportName: 'ruby',
        imageName: 'ruby',
        languageName: 'Ruby',
        snippet: 'puts "Hello, World!"',
    },
    {
        fileExtension: '.lua',
        codeMirrorLanguageSupportName: 'lua',
        monacoEditorLanguageSupportName: 'lua',
        imageName: 'lua',
        languageName: 'Lua',
        snippet: 'print("Hello, World!")',
    },
    {
        fileExtension: '.jl',
        codeMirrorLanguageSupportName: 'julia',
        monacoEditorLanguageSupportName: 'julia',
        imageName: 'julia',
        languageName: 'Julia',
        snippet: 'println("Hello, World!")',
    },
    {
        fileExtension: '.erl',
        codeMirrorLanguageSupportName: 'erlang',
        monacoEditorLanguageSupportName: 'erlang',
        imageName: 'erlang',
        languageName: 'Erlang',
        snippet:
            '% escript will ignore the first line\n\nmain(_) ->\n    io:format("Hello World!~n").',
    },
    {
        fileExtension: '.ex',
        // no code mirror language support for elixir
        codeMirrorLanguageSupportName: 'textile',
        // no monaco editor language support for elixir
        monacoEditorLanguageSupportName: 'elixir',
        imageName: 'elixir',
        languageName: 'Elixir',
        snippet: 'IO.puts "Hello, World!"',
    },
    {
        fileExtension: '.java',
        codeMirrorLanguageSupportName: 'java',
        monacoEditorLanguageSupportName: 'java',
        imageName: 'java',
        languageName: 'Java',
        snippet:
            'public class Main {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello, World!");\n\t}\n}',
    },
    {
        fileExtension: '.cl',
        codeMirrorLanguageSupportName: 'commonLisp',
        //no monaco editor language support for common lisp
        monacoEditorLanguageSupportName: 'clisp',
        imageName: 'clisp',
        languageName: 'Common Lisp',
        snippet: '(print "Hello, World!")',
    },
    {
        fileExtension: '.cs',
        codeMirrorLanguageSupportName: 'csharp',
        monacoEditorLanguageSupportName: 'csharp',
        imageName: 'csharp',
        languageName: 'C#',
        snippet:
            'using System;\nusing System.Collections.Generic;\nusing System.Linq;\n\nclass MainClass {\n\tstatic void Main() {\n\t\tConsole.WriteLine("Hello, World!");\n\t}\n}',
    },
    {
        fileExtension: '.rs',
        codeMirrorLanguageSupportName: 'rust',
        monacoEditorLanguageSupportName: 'rust',
        imageName: 'rust',
        languageName: 'Rust',
        snippet: 'fn main() {\n\tprintln!("Hello, World!");\n}',
    },
    {
        fileExtension: '.kt',
        codeMirrorLanguageSupportName: 'kotlin',
        monacoEditorLanguageSupportName: 'kotlin',
        imageName: 'kotlin',
        languageName: 'Kotlin',
        snippet: 'fun main() {\n\tprintln("Hello, World!")\n}',
    },
    {
        fileExtension: '.swift',
        codeMirrorLanguageSupportName: 'swift',
        monacoEditorLanguageSupportName: 'swift',
        imageName: 'swift',
        languageName: 'Swift',
        snippet: 'print("Hello, World!")',
    },
    {
        fileExtension: '.scala',
        codeMirrorLanguageSupportName: 'scala',
        monacoEditorLanguageSupportName: 'scala',
        imageName: 'scala',
        languageName: 'Scala',
        snippet: 'object Main extends App {\n\tprintln("Hello, World!")\n}',
    },
    {
        fileExtension: '.dart',
        codeMirrorLanguageSupportName: 'dart',
        monacoEditorLanguageSupportName: 'dart',
        imageName: 'dart',
        languageName: 'Dart',
        snippet: 'void main() {\n\tprint("Hello, World!");\n}',
    },
    {
        fileExtension: '.hs',
        codeMirrorLanguageSupportName: 'haskell',
        monacoEditorLanguageSupportName: 'haskell',
        imageName: 'haskell',
        languageName: 'Haskell',
        snippet: 'main = putStrLn "Hello, World!"',
    },
    {
        fileExtension: '.pl',
        codeMirrorLanguageSupportName: 'perl',
        monacoEditorLanguageSupportName: 'perl',
        imageName: 'perl',
        languageName: 'Perl',
        snippet: 'print "Hello, World!\\n";',
    },
    {
        fileExtension: '.sh',
        codeMirrorLanguageSupportName: 'shell',
        monacoEditorLanguageSupportName: 'shell',
        imageName: 'bash',
        languageName: 'Bash',
        snippet: 'echo "Hello, World!"',
    },
    {
        fileExtension: 'clj',
        codeMirrorLanguageSupportName: 'clojure',
        monacoEditorLanguageSupportName: 'clojure',
        imageName: 'clojure',
        languageName: 'Clojure',
        snippet: '(println "Hello, World!")',
    },
    {
        fileExtension: '.dats',
        codeMirrorLanguageSupportName: 'textile',
        monacoEditorLanguageSupportName: 'ats',
        imageName: 'ats',
        languageName: 'ATS',
        snippet: 'implement main0() = print("Hello, World!")',
    },
    {
        fileExtension: '.nim',
        codeMirrorLanguageSupportName: 'textile',
        monacoEditorLanguageSupportName: 'nim',
        imageName: 'nim',
        languageName: 'Nim',
        snippet: 'echo "Hello, World!"',
    },
    {
        fileExtension: '.coffee',
        codeMirrorLanguageSupportName: 'coffeescript',
        monacoEditorLanguageSupportName: 'coffeescript',
        imageName: 'coffeescript',
        languageName: 'CoffeeScript',
        snippet: 'console.log "Hello, World!"',
    },
    {
        fileExtension: '.cr',
        codeMirrorLanguageSupportName: 'crystal',
        monacoEditorLanguageSupportName: 'crystal',
        imageName: 'crystal',
        languageName: 'Crystal',
        snippet: 'puts "Hello, World!"',
    },
    {
        fileExtension: '.zig',
        codeMirrorLanguageSupportName: 'textile',
        monacoEditorLanguageSupportName: 'zig',
        imageName: 'zig',
        languageName: 'Zig',
        snippet:
            'const std = @import("std");\n\npub fn main() !void {\n    const stdout = std.io.getStdOut().writer();\n    try stdout.print("{s}\\n", .{"Hello World!"});\n}',
    },
    {
        fileExtension: '.d',
        codeMirrorLanguageSupportName: 'd',
        monacoEditorLanguageSupportName: 'd',
        imageName: 'd',
        languageName: 'D',
        snippet:
            'import std.stdio;\n\nvoid main() {\n\twriteln("Hello, World!");\n}',
    },
    {
        fileExtension: '.elm',
        codeMirrorLanguageSupportName: 'elm',
        monacoEditorLanguageSupportName: 'elm',
        imageName: 'elm',
        languageName: 'Elm',
        snippet:
            'module Main exposing (main)\n\nimport Html exposing (..)\n\nmain =\n    text "Hello World!"',
    },
    {
        fileExtension: '.fs',
        codeMirrorLanguageSupportName: 'textile',
        monacoEditorLanguageSupportName: 'fsharp',
        imageName: 'fsharp',
        languageName: 'F#',
        snippet: 'printfn "Hello, World!"',
    },
    {
        fileExtension: '.groovy',
        codeMirrorLanguageSupportName: 'groovy',
        monacoEditorLanguageSupportName: 'groovy',
        imageName: 'groovy',
        languageName: 'Groovy',
        snippet: 'println "Hello, World!"',
    },
    {
        fileExtension: '.scm',
        codeMirrorLanguageSupportName: 'textile',
        monacoEditorLanguageSupportName: 'guile',
        imageName: 'guile',
        languageName: 'Guile',
        snippet: '(display "Hello, World!")',
    },
    {
        fileExtension: '.ha',
        codeMirrorLanguageSupportName: 'textile',
        monacoEditorLanguageSupportName: 'hare',
        imageName: 'hare',
        languageName: 'Hare',
        snippet:
            'use fmt;\n\nexport fn main() void = {\n\tfmt::println("Hello World!")!;\n};\n',
    },
    {
        fileExtension: '.idr',
        codeMirrorLanguageSupportName: 'textile',
        monacoEditorLanguageSupportName: 'idris',
        imageName: 'idris',
        languageName: 'Idris',
        snippet: 'main : IO ()\nmain = putStrLn "Hello, World!"',
    },
    {
        fileExtension: '.m',
        codeMirrorLanguageSupportName: 'textile',
        monacoEditorLanguageSupportName: 'mercury',
        imageName: 'mercury',
        languageName: 'Mercury',
        snippet:
            ':- module main.\n:- interface.\n:- import_module io.\n\n:- pred main(io::di, io::uo) is det.\n\n:- implementation.\n\nmain(!IO) :-\n    io.write_string("Hello World!", !IO).',
    },
    {
        fileExtension: '.nix',
        codeMirrorLanguageSupportName: 'nix',
        monacoEditorLanguageSupportName: 'nix',
        imageName: 'nix',
        languageName: 'Nix',
        snippet: 'let\n    hello = "Hello World!";\nin\nhello',
    },
    {
        fileExtension: '.ml',
        codeMirrorLanguageSupportName: 'textile',
        monacoEditorLanguageSupportName: 'ocaml',
        imageName: 'ocaml',
        languageName: 'OCaml',
        snippet: 'print_endline "Hello, World!"',
    },
    {
        fileExtension: '.pas',
        codeMirrorLanguageSupportName: 'pascal',
        monacoEditorLanguageSupportName: 'pascal',
        imageName: 'pascal',
        languageName: 'Pascal',
        snippet: "Program Main;\n\nbegin\n  writeln('Hello World!');\nend.\n",
    },
    {
        fileExtension: '.raku',
        codeMirrorLanguageSupportName: 'textile',
        monacoEditorLanguageSupportName: 'raku',
        imageName: 'raku',
        languageName: 'Raku',
        snippet: 'say "Hello, World!";',
    },
    {
        fileExtension: '.sac',
        codeMirrorLanguageSupportName: 'textile',
        monacoEditorLanguageSupportName: 'sac',
        imageName: 'sac',
        languageName: 'SAC',
        snippet:
            'int main () {\n    StdIO::printf ("Hello World!");\n    return 0;\n}',
    },
]
