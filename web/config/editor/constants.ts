import type { editor } from "monaco-editor";
import type { Runtime } from "./types";

import caraiDark from "./theme/carai-dark.json";
import caraiLight from "./theme/carai-light.json";

export { darkThemeData, lightThemeData, runtimeRecord };

const darkThemeData: editor.IStandaloneThemeData = {
    base: "vs-dark",
    inherit: true,
    rules: caraiDark.tokenColors.map((token) => {
        const tokenScope = Array.isArray(token.scope) ? token.scope.join(", ") : token.scope;

        return {
            token: tokenScope,
            foreground: token.settings.foreground,
            fontStyle: token.settings.fontStyle,
        };
    }),
    colors: caraiDark.colors,
} as const;

const lightThemeData: editor.IStandaloneThemeData = {
    base: "vs",
    inherit: true,
    rules: caraiLight.tokenColors.map((token) => {
        const tokenScope = Array.isArray(token.scope) ? token.scope.join(", ") : token.scope;

        return {
            token: tokenScope,
            foreground: token.settings.foreground,
            fontStyle: token.settings.fontStyle,
            background: token.settings.background,
        };
    }),
    colors: caraiLight.colors,
} as const;

const runtimeRecord: Record<string, Runtime> = {
    ".js": {
        languageName: "javascript",
        snippet: 'console.log("Hello, World!")',
        filename: "main.js",
    },
    ".go": {
        languageName: "go",
        snippet: 'package main\n\nimport "fmt"\n\nfunc main() {\n\tfmt.Println("Hello, World!")\n}',
        filename: "main.go",
    },
    ".py": {
        languageName: "python",
        snippet: 'print("Hello, World!")',
        filename: "main.py",
    },
    ".ts": {
        languageName: "typescript",
        snippet: 'console.log("Hello, World!")',
        filename: "main.ts",
    },
    ".c": {
        languageName: "c",
        snippet: '#include <stdio.h>\n\nint main() {\n\tprintf("Hello, World!");\n\treturn 0;\n}',
        filename: "main.c",
    },
    ".cpp": {
        languageName: "cpp",
        snippet:
            '#include <iostream>\n\nint main() {\n\tstd::cout << "Hello, World!";\n\treturn 0;\n}',
        filename: "main.cpp",
    },
    ".php": {
        languageName: "php",
        snippet: '<?php\n\necho "Hello, World!";',
        filename: "index.php",
    },
    ".rb": {
        languageName: "ruby",
        snippet: 'puts "Hello, World!"',
        filename: "main.rb",
    },
    ".lua": {
        languageName: "lua",
        snippet: 'print("Hello, World!")',
        filename: "main.lua",
    },
    ".jl": {
        languageName: "julia",
        snippet: 'println("Hello, World!")',
        filename: "main.jl",
    },
    ".erl": {
        languageName: "erlang",
        snippet:
            '% escript will ignore the first line\n\nmain(_) ->\n    io:format("Hello World!~n").',
        filename: "main.erl",
    },
    ".ex": {
        languageName: "elixir",
        snippet: 'IO.puts "Hello, World!"',
        filename: "main.ex",
    },
    ".java": {
        languageName: "java",
        snippet:
            'public class Main {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello, World!");\n\t}\n}',
        filename: "Main.java",
    },
    ".lsp": {
        languageName: "clisp",
        snippet: '(format t "Hello World!")',
        filename: "main.lsp",
    },
    ".cs": {
        languageName: "csharp",
        snippet:
            'using System;\nusing System.Collections.Generic;\nusing System.Linq;\n\nclass MainClass {\n\tstatic void Main() {\n\t\tConsole.WriteLine("Hello, World!");\n\t}\n}',
        filename: "Program.cs",
    },
    ".rs": {
        languageName: "rust",
        snippet: 'fn main() {\n\tprintln!("Hello, World!");\n}',
        filename: "main.rs",
    },
    ".kt": {
        languageName: "kotlin",
        snippet: 'fun main() {\n\tprintln("Hello, World!")\n}',
        filename: "Main.kt",
    },
    ".swift": {
        languageName: "Swift",
        snippet: 'print("Hello, World!")',
        filename: "main.swift",
    },
    ".scala": {
        languageName: "Scala",
        snippet: 'object Main extends App {\n\tprintln("Hello, World!")\n}',
        filename: "Main.scala",
    },
    ".dart": {
        languageName: "Dart",
        snippet: 'void main() {\n\tprint("Hello, World!");\n}',
        filename: "main.dart",
    },
    ".hs": {
        languageName: "Haskell",
        snippet: 'main = putStrLn "Hello, World!"',
        filename: "Main.hs",
    },
    ".pl": {
        languageName: "Perl",
        snippet: 'print "Hello, World!\\n";',
        filename: "main.pl",
    },
    ".sh": {
        languageName: "Bash",
        snippet: 'echo "Hello, World!"',
        filename: "main.sh",
    },
    ".clj": {
        languageName: "Clojure",
        snippet: '(println "Hello, World!")',
        filename: "main.clj",
    },
    ".dats": {
        languageName: "ATS",
        snippet: 'implement main0() = print("Hello, World!")',
        filename: "main.dats",
    },
    ".nim": {
        languageName: "Nim",
        snippet: 'echo "Hello, World!"',
        filename: "main.nim",
    },
    ".coffee": {
        languageName: "coffeescript",
        snippet: 'console.log "Hello, World!"',
        filename: "main.coffee",
    },
    ".cr": {
        languageName: "Crystal",
        snippet: 'puts "Hello, World!"',
        filename: "main.cr",
    },
    ".zig": {
        languageName: "Zig",
        snippet:
            'const std = @import("std");\n\npub fn main() !void {\n    const stdout = std.io.getStdOut().writer();\n    try stdout.print("{s}\\n", .{"Hello World!"});\n}',
        filename: "main.zig",
    },
    ".d": {
        languageName: "D",
        snippet: 'import std.stdio;\n\nvoid main() {\n\twriteln("Hello, World!");\n}',
        filename: "main.d",
    },
    ".elm": {
        languageName: "Elm",
        snippet:
            'module Main exposing (main)\n\nimport Html exposing (..)\n\nmain =\n    text "Hello World!"',
        filename: "Main.elm",
    },
    ".fs": {
        languageName: "fsharp",
        snippet: 'printfn "Hello, World!"',
        filename: "Program.fs",
    },
    ".groovy": {
        languageName: "Groovy",
        snippet: 'println "Hello, World!"',
        filename: "Main.groovy",
    },
    ".scm": {
        languageName: "Guile",
        snippet: '(display "Hello, World!")',
        filename: "main.scm",
    },
    ".ha": {
        languageName: "Hare",
        snippet: 'use fmt;\n\nexport fn main() void = {\n\tfmt::println("Hello World!")!;\n};\n',
        filename: "main.ha",
    },
    ".idr": {
        languageName: "Idris",
        snippet: 'main : IO ()\nmain = putStrLn "Hello, World!"',
        filename: "Main.idr",
    },
    ".m": {
        languageName: "Mercury",
        snippet:
            ':- module main.\n:- interface.\n:- import_module io.\n\n:- pred main(io::di, io::uo) is det.\n\n:- implementation.\n\nmain(!IO) :-\n    io.write_string("Hello World!", !IO).',
        filename: "main.m",
    },
    ".nix": {
        languageName: "Nix",
        snippet: 'let\n    hello = "Hello World!";\nin\nhello',
        filename: "default.nix",
    },
    ".ml": {
        languageName: "OCaml",
        snippet: 'print_endline "Hello, World!"',
        filename: "main.ml",
    },
    ".pas": {
        languageName: "Pascal",
        snippet: "Program Main;\n\nbegin\n  writeln('Hello World!');\nend.\n",
        filename: "main.pas",
    },
    ".raku": {
        languageName: "Raku",
        snippet: 'say "Hello, World!";',
        filename: "main.raku",
    },
    ".sac": {
        languageName: "SaC",
        snippet: 'int main () {\n    StdIO::printf ("Hello World!");\n    return 0;\n}',
        filename: "main.sac",
    },
    ".cob": {
        languageName: "Cobol",
        snippet: `       IDENTIFICATION DIVISION.
           PROGRAM-ID. HELLO.

           PROCEDURE DIVISION.
               DISPLAY 'Hello World!'.
               GOBACK.
           `,
        filename: "main.cob",
    },
};
