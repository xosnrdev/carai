import type { CodeSnippet, Feature } from './types'

import {
    CodeIcon,
    GlobeIcon,
    PlayIcon,
    SettingsIcon,
    Share2Icon,
} from 'lucide-react'

export { codeSnippet, features }

const features: Feature[] = [
    {
        icon: CodeIcon,
        title: 'Multi-language Support',
        description: 'Write code in 44 programming languages.',
    },
    {
        icon: PlayIcon,
        title: 'Run Code',
        description:
            'The code is executed in a transient docker container without network.',
    },
    {
        icon: Share2Icon,
        title: 'Share Easily',
        description:
            'Share your code snippets with others by simply copying the URL.',
    },
    {
        icon: SettingsIcon,
        title: 'Key Bindings',
        description: 'The editor supports Visual Studio Code key bindings.',
    },
    {
        icon: GlobeIcon,
        title: 'Open Source',
        description:
            'If your favorite language or library is missing you can open an issue or pull request on GitHub to get it added.',
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
