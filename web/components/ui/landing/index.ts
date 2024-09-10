import type { CodeSnippet, Feature } from './index.types'

import { CodeIcon, Share2Icon, ZapIcon } from 'lucide-react'

export { features, codeSnippet }

const features: Feature[] = [
    {
        icon: CodeIcon,
        title: 'Multi-language Support',
        description: 'Write code in multiple programming languages.',
    },
    {
        icon: ZapIcon,
        title: 'Test Instantly',
        description: 'Run and debug your code in real-time.',
    },
    {
        icon: Share2Icon,
        title: 'Share Easily',
        description: 'Collaborate and share your code snippets with others.',
    },
] as const

const codeSnippet: CodeSnippet = {
    languageName: 'rust',
    content: `// hello_world.rs

fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}

fn main() {
    let name = "World";
    println!("{}", greet(name));
}
`.trim(),
    filename: 'hello_world.rs',
} as const
