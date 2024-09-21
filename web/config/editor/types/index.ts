import type { CSSProperties } from 'react'

export type Runtime = {
    languageName: string
    snippet: string
    filename: string
}

export type CodeResponseProp = {
    response: string
    time?: string
    customStyle?: CSSProperties
}
