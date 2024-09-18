import type { CodeResponse } from '@/app/(sandbox)/types'
import type { editor } from 'monaco-editor'

export type Limit = number

export type Units = 'characters' | 'bytes' | 'lines'

export type MaxContentDelimiter = {
    limit: Limit
    units: Units
}

export type TabConfig = {
    /*
     * Whether the tab can be closed or not
     */
    isClosable: boolean
    /*
     * Maximum number of tabs that can be opened
     */
    maxTabs: number
    /*
     * Maximum number of text content by characters, bytes, or lines
     */
    maxContentDelimiter: MaxContentDelimiter
}

type CodeResponseField = Partial<{
    time: string
    isRunning: boolean
}>

export type ViewStateField = {
    codeResponse?: CodeResponse & CodeResponseField
    resizeLayout: ResizeLayout
}

export type CodeEditorViewState = {} & editor.ICodeEditorViewState

export type ViewStatePayload = {
    id: TabId
    isMounted: boolean
}

export type ViewState = {
    state: CodeEditorViewState
    stateFields: ViewStateField
    isMounted?: boolean
}

export type Metadata = {
    languageName: string
}

export type Tab = {
    /*
     * Unique identifier for a tab
     */
    id: string
    /*
     * filename of a tab
     */
    filename: string
    /*
     * content value of a tab
     */
    content: string
    /*
     * Whether the text value of a tab has been modified or not
     */
    isDirty: boolean
    /*
     * Metadata for a tab
     */
    metadata: Metadata
    /*
     * Editor view state of a tab
     */
    viewState: ViewState
    /*
     * Configuration for a tab
     */
    config: TabConfig
}

export type TabId = Tab['id']

export type CodeResponsePayload = {
    id: TabId
    codeResponse: CodeResponse
    time: string
    isRunning: boolean
}

export type ResizeLayout = Omit<ResizeLayoutPayload, 'id'>

export type ResizeLayoutPayload = {
    id: TabId
    vertical: number[]
    snapshot: number[]
}

export type AddTabPayload = Omit<Tab, 'id' | 'isDirty' | 'viewState'>

export type UpdateTabPayload = Partial<Tab> & {
    id: TabId
}
