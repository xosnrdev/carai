import type { BeforeMount, EditorProps } from "@monaco-editor/react";

import type { editor } from "monaco-editor";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";

import { Logo } from "@/components/ui/icons";
import { darkThemeData, lightThemeData } from "@/config/editor/constants";

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
