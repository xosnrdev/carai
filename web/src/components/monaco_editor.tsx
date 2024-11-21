import type { BeforeMount, EditorProps } from "@monaco-editor/react";

import caraiDark from "@/public/assets/carai-dark.json";
import caraiLight from "@/public/assets/carai-light.json";
import { Logo } from "@/src/components/icons";
import type { editor } from "monaco-editor";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("@monaco-editor/react"), {
    loading: () => <Logo />,
    ssr: false,
});

export default function MonacoEditor({ ...props }: EditorProps) {
    const { resolvedTheme } = useTheme();

    const handleBeforeMount: BeforeMount = (monaco) => {
        monaco.editor.defineTheme("carai-dark", darkThemeData);

        monaco.editor.defineTheme("carai-light", lightThemeData);
    };

    const editorConfigOptions: editor.IStandaloneEditorConstructionOptions = {
        wordWrap: "on",
        minimap: {
            enabled: false,
        },
        fontSize: 13,
        tabSize: 2,
        fixedOverflowWidgets: true,
        fontFamily: "var(--font-jetbrains-mono)",
        bracketPairColorization: {
            enabled: true,
        },
        cursorStyle: "block",
        lineDecorationsWidth: 0,
        lineNumbersMinChars: 2,
    };

    return (
        <Editor
            beforeMount={handleBeforeMount}
            loading={<Logo />}
            options={editorConfigOptions}
            theme={resolvedTheme === "dark" ? "carai-dark" : "carai-light"}
            {...props}
        />
    );
}

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
