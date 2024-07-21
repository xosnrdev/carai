import type { Ace } from 'ace-builds'
import type { editor } from 'monaco-editor'
import type { HTMLAttributes, MouseEvent, SVGProps } from 'react'
import type { IconType } from 'react-icons'
import type { CodeResponse } from './response'

export type IconSvgProps = SVGProps<SVGSVGElement> & {
    size?: number
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
     * Maximum number of text value by characters, bytes, or lines
     */
    maxValueSize: {
        value: number
        units: 'characters' | 'bytes' | 'lines'
    }
}

export interface IVSDefaults {
    codeResponse?: CodeResponsePayload['codeResponse']
    resizePane?: ResizePanePayload['resizePane']
}

export interface IParsedMonacoVS
    extends editor.ICodeEditorViewState,
        IVSDefaults {}

export interface IParsedAceVS extends IVSDefaults {
    cursorPosition?: Ace.Point
    scrollTop?: number
    scrollLeft?: number
    selection?: {
        start: Ace.Point
        end: Ace.Point
    }
    folds?: Ace.Fold[]
}

export enum EditorViewState {
    Monaco,
    Ace,
}

export interface ITab {
    /*
     * Unique identifier for a tab
     */
    id: string
    /*
     * Title of a tab
     */
    title: string
    /*
     * Text value of a tab
     */
    value: string
    /*
     * Whether the text value of a tab has been modified or not
     */
    isDirty: boolean
    /*
     * Metadata for a tab
     */
    metadata: Record<string, string>
    /*
     * Editor view state of a tab
     */
    viewState: {
        type: EditorViewState
        value: string
    }
    /*
     * Configuration for a tab
     */
    config: ITabConfig
}

export type TabId = ITab['id']

export type CodeResponsePayload = {
    id: TabId
    codeResponse: CodeResponse
}

export type ResizePanePayload = {
    id: TabId
    resizePane: boolean
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

export interface LanguageProps {
    runtime: string
    extension: string
    src: string
    mode: string
}

export interface OnboardingProps {
    links: RouteProps[]
    texts: string[]
}

export interface TabProps {
    id: string
    title: string
    activeTabId: TabId
    setActiveTab: (id: TabId) => void
    closeTab: (
        e: MouseEvent<HTMLButtonElement> | KeyboardEvent,
        id: TabId
    ) => void
}

export interface EditorDivProps extends HTMLAttributes<HTMLDivElement> {}
