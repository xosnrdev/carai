import type { LucideProps } from 'lucide-react'
import type { ForwardRefExoticComponent, RefAttributes } from 'react'

export type Feature = {
    icon: ForwardRefExoticComponent<
        Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
    >
    title: string
    description: string
}

export type CodeSnippet = {
    languageName: string
    content: string
    filename: string
}
