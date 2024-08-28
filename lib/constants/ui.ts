import type {
    RuntimeProp,
    NavProps,
    OnboardingProps,
    RouteProps,
    SidebarProps,
} from '@/types'

import { HiUsers } from 'react-icons/hi2'
import { IoIosCloseCircle, IoIosInformationCircle } from 'react-icons/io'
import { MdAddBox } from 'react-icons/md'
import { TbAlertTriangleFilled } from 'react-icons/tb'

export { sidebarProps, navProps, headerProps, onboardingProps, runtimePropsMap }

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

const runtimePropsMap = new Map<string, RuntimeProp>([
    [
        '.js',
        {
            languageName: 'javascript',
            snippet: 'console.log("Hello, World!")',
            entryPoint: 'main.js',
        },
    ],
    [
        '.go',
        {
            languageName: 'go',
            snippet:
                'package main\n\nimport "fmt"\n\nfunc main() {\n\tfmt.Println("Hello, World!")\n}',
            entryPoint: 'main.go',
        },
    ],
    [
        '.py',
        {
            languageName: 'python',
            snippet: 'print("Hello, World!")',
            entryPoint: 'main.py',
        },
    ],
    [
        '.ts',
        {
            languageName: 'typescript',
            snippet: 'console.log("Hello, World!")',
            entryPoint: 'main.ts',
        },
    ],
    [
        '.c',
        {
            languageName: 'c',
            snippet:
                '#include <stdio.h>\n\nint main() {\n\tprintf("Hello, World!");\n\treturn 0;\n}',
            entryPoint: 'main.c',
        },
    ],
    [
        '.cpp',
        {
            languageName: 'cpp',
            snippet:
                '#include <iostream>\n\nint main() {\n\tstd::cout << "Hello, World!";\n\treturn 0;\n}',
            entryPoint: 'main.cpp',
        },
    ],
    [
        '.php',
        {
            languageName: 'php',
            snippet: '<?php\n\necho "Hello, World!";',
            entryPoint: 'index.php',
        },
    ],
    [
        '.rb',
        {
            languageName: 'ruby',
            snippet: 'puts "Hello, World!"',
            entryPoint: 'main.rb',
        },
    ],
    [
        '.lua',
        {
            languageName: 'lua',
            snippet: 'print("Hello, World!")',
            entryPoint: 'main.lua',
        },
    ],
    [
        '.jl',
        {
            languageName: 'julia',
            snippet: 'println("Hello, World!")',
            entryPoint: 'main.jl',
        },
    ],
    [
        '.erl',
        {
            languageName: 'erlang',
            snippet:
                '% escript will ignore the first line\n\nmain(_) ->\n    io:format("Hello World!~n").',
            entryPoint: 'main.erl',
        },
    ],
    [
        '.ex',
        {
            languageName: 'elixir',
            snippet: 'IO.puts "Hello, World!"',
            entryPoint: 'main.ex',
        },
    ],
    [
        '.java',
        {
            languageName: 'java',
            snippet:
                'public class Main {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello, World!");\n\t}\n}',
            entryPoint: 'Main.java',
        },
    ],
    [
        '.lsp',
        {
            languageName: 'clisp',
            snippet: '(format t "Hello World!")',
            entryPoint: 'main.lsp',
        },
    ],
    [
        '.cs',
        {
            languageName: 'csharp',
            snippet:
                'using System;\nusing System.Collections.Generic;\nusing System.Linq;\n\nclass MainClass {\n\tstatic void Main() {\n\t\tConsole.WriteLine("Hello, World!");\n\t}\n}',
            entryPoint: 'Program.cs',
        },
    ],
    [
        '.rs',
        {
            languageName: 'rust',
            snippet: 'fn main() {\n\tprintln!("Hello, World!");\n}',
            entryPoint: 'main.rs',
        },
    ],
    [
        '.kt',
        {
            languageName: 'kotlin',
            snippet: 'fun main() {\n\tprintln("Hello, World!")\n}',
            entryPoint: 'Main.kt',
        },
    ],
    [
        '.swift',
        {
            languageName: 'Swift',
            snippet: 'print("Hello, World!")',
            entryPoint: 'main.swift',
        },
    ],
    [
        '.scala',
        {
            languageName: 'Scala',
            snippet: 'object Main extends App {\n\tprintln("Hello, World!")\n}',
            entryPoint: 'Main.scala',
        },
    ],
    [
        '.dart',
        {
            languageName: 'Dart',
            snippet: 'void main() {\n\tprint("Hello, World!");\n}',
            entryPoint: 'main.dart',
        },
    ],
    [
        '.hs',
        {
            languageName: 'Haskell',
            snippet: 'main = putStrLn "Hello, World!"',
            entryPoint: 'Main.hs',
        },
    ],
    [
        '.pl',
        {
            languageName: 'Perl',
            snippet: 'print "Hello, World!\\n";',
            entryPoint: 'main.pl',
        },
    ],
    [
        '.sh',
        {
            languageName: 'Bash',
            snippet: 'echo "Hello, World!"',
            entryPoint: 'main.sh',
        },
    ],
    [
        '.clj',
        {
            languageName: 'Clojure',
            snippet: '(println "Hello, World!")',
            entryPoint: 'main.clj',
        },
    ],
    [
        '.dats',
        {
            languageName: 'ATS',
            snippet: 'implement main0() = print("Hello, World!")',
            entryPoint: 'main.dats',
        },
    ],
    [
        '.nim',
        {
            languageName: 'Nim',
            snippet: 'echo "Hello, World!"',
            entryPoint: 'main.nim',
        },
    ],
    [
        '.coffee',
        {
            languageName: 'coffeescript',
            snippet: 'console.log "Hello, World!"',
            entryPoint: 'main.coffee',
        },
    ],
    [
        '.cr',
        {
            languageName: 'Crystal',
            snippet: 'puts "Hello, World!"',
            entryPoint: 'main.cr',
        },
    ],
    [
        '.zig',
        {
            languageName: 'Zig',
            snippet:
                'const std = @import("std");\n\npub fn main() !void {\n    const stdout = std.io.getStdOut().writer();\n    try stdout.print("{s}\\n", .{"Hello World!"});\n}',
            entryPoint: 'main.zig',
        },
    ],
    [
        '.d',
        {
            languageName: 'D',
            snippet:
                'import std.stdio;\n\nvoid main() {\n\twriteln("Hello, World!");\n}',
            entryPoint: 'main.d',
        },
    ],
    [
        '.elm',
        {
            languageName: 'Elm',
            snippet:
                'module Main exposing (main)\n\nimport Html exposing (..)\n\nmain =\n    text "Hello World!"',
            entryPoint: 'Main.elm',
        },
    ],
    [
        '.fs',
        {
            languageName: 'fsharp',
            snippet: 'printfn "Hello, World!"',
            entryPoint: 'Program.fs',
        },
    ],
    [
        '.groovy',
        {
            languageName: 'Groovy',
            snippet: 'println "Hello, World!"',
            entryPoint: 'Main.groovy',
        },
    ],
    [
        '.scm',
        {
            languageName: 'Guile',
            snippet: '(display "Hello, World!")',
            entryPoint: 'main.scm',
        },
    ],
    [
        '.ha',
        {
            languageName: 'Hare',
            snippet:
                'use fmt;\n\nexport fn main() void = {\n\tfmt::println("Hello World!")!;\n};\n',
            entryPoint: 'main.ha',
        },
    ],
    [
        '.idr',
        {
            languageName: 'Idris',
            snippet: 'main : IO ()\nmain = putStrLn "Hello, World!"',
            entryPoint: 'Main.idr',
        },
    ],
    [
        '.m',
        {
            languageName: 'Mercury',
            snippet:
                ':- module main.\n:- interface.\n:- import_module io.\n\n:- pred main(io::di, io::uo) is det.\n\n:- implementation.\n\nmain(!IO) :-\n    io.write_string("Hello World!", !IO).',
            entryPoint: 'main.m',
        },
    ],
    [
        '.nix',
        {
            languageName: 'Nix',
            snippet: 'let\n    hello = "Hello World!";\nin\nhello',
            entryPoint: 'default.nix',
        },
    ],
    [
        '.ml',
        {
            languageName: 'OCaml',
            snippet: 'print_endline "Hello, World!"',
            entryPoint: 'main.ml',
        },
    ],
    [
        '.pas',
        {
            languageName: 'Pascal',
            snippet:
                "Program Main;\n\nbegin\n  writeln('Hello World!');\nend.\n",
            entryPoint: 'main.pas',
        },
    ],
    [
        '.raku',
        {
            languageName: 'Raku',
            snippet: 'say "Hello, World!";',
            entryPoint: 'main.raku',
        },
    ],
    [
        '.sac',
        {
            languageName: 'SaC',
            snippet:
                'int main () {\n    StdIO::printf ("Hello World!");\n    return 0;\n}',
            entryPoint: 'main.sac',
        },
    ],
    [
        '.cob',
        {
            languageName: 'Cobol',
            snippet: `       IDENTIFICATION DIVISION.
           PROGRAM-ID. HELLO.
    
           PROCEDURE DIVISION.
               DISPLAY 'Hello World!'.
               GOBACK.
           `,
            entryPoint: 'main.cob',
        },
    ],
])
