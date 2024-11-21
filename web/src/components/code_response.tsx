import { useTheme } from "next-themes";
import type { CSSProperties } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark, atomOneLight } from "react-syntax-highlighter/dist/esm/styles/hljs";

type CodeResponseProp = {
    response: string;
    time?: string;
    customStyle?: CSSProperties;
};

export default function CodeResponse({ response, customStyle }: CodeResponseProp) {
    const { resolvedTheme } = useTheme();

    return (
        <SyntaxHighlighter
            customStyle={{
                background: "inherit",
                ...customStyle,
            }}
            style={resolvedTheme === "dark" ? atomOneDark : atomOneLight}
        >
            {`$ ${response}`}
        </SyntaxHighlighter>
    );
}
