import type { editor } from 'monaco-editor'
import type { MouseEvent, RefObject, SVGProps } from 'react'
import type { IconType } from 'react-icons'
import type { CodeResponse } from './response'

export type IconSvgProps = SVGProps<SVGSVGElement> & {
    size?: number
}

export type Limit = number

export type Units = 'characters' | 'bytes' | 'lines'

export type MaxContentDelimiter = {
    limit: Limit
    units: Units
}

export interface ITabConfig {
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

export type ViewStateField = {
    codeResponse?: CodeResponse & { latency?: string }
    resizePanel: ResizePanel
}

export interface IState extends editor.ICodeEditorViewState {}

export type ViewState = {
    state: IState
    stateFields: ViewStateField
}

export type Metadata = {
    languageName: string
}

export interface ITab {
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
    config: ITabConfig
}

export type TabId = ITab['id']

export type CodeResponsePayload = {
    id: TabId
    codeResponse: CodeResponse
    latency: string
}

export type ResizePanel = Omit<ResizePanelPayload, 'id'>

export type ResizePanelPayload = {
    id: TabId
    viewSize: number
    viewSizeState: number
}

export type AddTabPayload = Omit<ITab, 'id' | 'isDirty' | 'viewState'>

export type UpdateTabPayload = Partial<ITab> & {
    id: TabId
}

export interface SidebarProps {
    id: string
    icon: IconType
    label: string
}

export interface NavProps {
    icon: IconType
}

export interface BrandProps {
    width?: number
    height?: number
}

export interface RouteProps {
    id: string
    label: string
    path: string
}

export type RuntimeProp = {
    languageName: string
    snippet: string
    entryPoint: string
}

export interface OnboardingProps {
    links: RouteProps[]
    texts: string[]
}

export interface TabProps {
    id: string
    filename: string
    activeTabId: TabId
    ref: RefObject<HTMLDivElement> | null
    setActiveTab: (id: TabId) => void
    closeTab: (
        e: MouseEvent<HTMLButtonElement> | KeyboardEvent,
        id: TabId
    ) => void
}

export interface ICodeResponseProps {
    flag: string
    response: string
    flagClassname: string
    latency: string
}
