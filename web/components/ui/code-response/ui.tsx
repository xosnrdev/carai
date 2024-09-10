import type { CodeResponseProp } from './index.types'

import { useTheme } from 'next-themes'
import SyntaxHighlighter from 'react-syntax-highlighter'
import {
    atomOneDark,
    atomOneLight,
} from 'react-syntax-highlighter/dist/esm/styles/hljs'

export default function CodeResponse({ response }: CodeResponseProp) {
    const { resolvedTheme } = useTheme()

    return (
        <div className="selection:bg-background">
            <SyntaxHighlighter
                customStyle={{
                    background: 'inherit',
                    fontSize: '1rem',
                }}
                style={resolvedTheme === 'dark' ? atomOneDark : atomOneLight}
            >
                {response}
            </SyntaxHighlighter>
        </div>
    )
}
