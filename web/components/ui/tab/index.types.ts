import type { RefObject } from 'react'

interface TabAction {
    setActiveTab: (id: string) => void
    closeTab: (id: string) => void
}

export type TabProp = {
    id: string
    filename: string
    activeTabId: string
    ref: RefObject<HTMLDivElement> | null
} & TabAction
