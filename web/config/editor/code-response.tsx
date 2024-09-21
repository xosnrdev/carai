import type { CodeResponseProp } from './types'

import { useTheme } from 'next-themes'
import SyntaxHighlighter from 'react-syntax-highlighter'
import {
    atomOneDark,
    atomOneLight,
} from 'react-syntax-highlighter/dist/esm/styles/hljs'

export default function CodeResponse({
    response,
    customStyle,
}: CodeResponseProp) {
    const { resolvedTheme } = useTheme()

    return (
        <SyntaxHighlighter
            customStyle={{
                background: 'inherit',
                ...customStyle,
            }}
            style={resolvedTheme === 'dark' ? atomOneDark : atomOneLight}
        >
            {`$ ${response}`}
        </SyntaxHighlighter>
    )
}
