import type { IState, TabId } from '@/types'
import type { RefObject } from 'react'

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export {
    capitalizeFirstLetter,
    cn,
    imageNameTransformMap,
    languageNameTransformMap,
    languageSupportTransformMap,
    scrollActiveTabIntoView,
    serializeViewState,
    transformString,
}

const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

function serializeViewState(state: IState | null): IState {
    if (!state) {
        return {
            cursorState: [],
            viewState: {
                scrollLeft: 0,
                firstPosition: { lineNumber: 1, column: 1 },
                firstPositionDeltaTop: 0,
            },
            contributionsState: {},
        }
    }

    return {
        cursorState: state.cursorState.map((cursor) => ({
            inSelectionMode: cursor.inSelectionMode,
            selectionStart: {
                lineNumber: cursor.selectionStart.lineNumber,
                column: cursor.selectionStart.column,
            },
            position: {
                lineNumber: cursor.position.lineNumber,
                column: cursor.position.column,
            },
        })),
        viewState: {
            scrollTop: state.viewState.scrollTop,
            scrollTopWithoutViewZones:
                state.viewState.scrollTopWithoutViewZones,
            scrollLeft: state.viewState.scrollLeft,
            firstPosition: {
                lineNumber: state.viewState.firstPosition.lineNumber,
                column: state.viewState.firstPosition.column,
            },
            firstPositionDeltaTop: state.viewState.firstPositionDeltaTop,
        },
        contributionsState: state.contributionsState,
    }
}

const languageNameTransformMap: Record<string, string> = {
    cpp: 'C++',
    csharp: 'C#',
    fsharp: 'F#',
    clisp: 'Common Lisp',
}

type Into = Partial<{
    capitalize: boolean
    lowerCase: boolean
}>

function transformString(
    str: string,
    map: Record<string, string>,
    into: Into = {
        capitalize: false,
        lowerCase: false,
    }
): string {
    const transform = map[str] || str

    return into.capitalize
        ? capitalizeFirstLetter(transform)
        : into.lowerCase
          ? transform.toLowerCase()
          : transform
}

const imageNameTransformMap: Record<string, string> = {
    go: 'golang',
    d: 'dlang',
    c: 'clang',
    cpp: 'clang',
}

const languageSupportTransformMap: Record<string, string> = {
    c: 'cpp',
}

const capitalizeFirstLetter = (s: string): string => {
    const specialCases: Record<string, string> = {
        php: 'PHP',
        javascript: 'JavaScript',
        typescript: 'TypeScript',
        coffeescript: 'CoffeeScript',
    }

    if (specialCases[s]) {
        return specialCases[s]
    }

    return s
        .split(' ')
        .map(
            (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(' ')
}

type TabViewProps = {
    tabElement: HTMLElement
    parentElement: HTMLElement
}

function isTabVisible({ tabElement, parentElement }: TabViewProps): boolean {
    const tabRect = tabElement.getBoundingClientRect()
    const parentRect = parentElement.getBoundingClientRect()

    return tabRect.left >= parentRect.left && tabRect.right <= parentRect.right
}

function computeIdealScrollPosition({
    tabElement,
    parentElement,
    tabWidth,
    tabIndexMap,
}: {
    tabWidth: number
    tabIndexMap: Map<TabId, number>
} & TabViewProps): number {
    const chunkWidth = parentElement.clientWidth
    const tabIndex = tabIndexMap.get(tabElement.id) ?? 0
    let scrollLeft = tabIndex * tabWidth - chunkWidth / 2 + tabWidth / 2

    scrollLeft = Math.max(
        0,
        Math.min(scrollLeft, parentElement.scrollWidth - chunkWidth)
    )

    return scrollLeft
}

function handleCircularScrolling({
    tabIndex,
    numTabs,
    parentElement,
}: {
    tabIndex: number
    numTabs: number
    parentElement: HTMLElement
}): void {
    if (numTabs === 0) return

    const tabWidth = parentElement.scrollWidth / numTabs
    const scrollPosition = (tabIndex * tabWidth) % parentElement.scrollWidth

    parentElement.scroll({
        left: scrollPosition,
        behavior: 'smooth',
    })
}

function scrollActiveTabIntoView(
    activeTabRef: RefObject<HTMLElement>,
    tabIndexMap: Map<TabId, number>
): void {
    if (!activeTabRef.current) return

    const tabElement = activeTabRef.current
    const parentElement = tabElement.parentElement

    if (!parentElement) return

    if (!isTabVisible({ tabElement, parentElement })) {
        const tabWidth = tabElement.offsetWidth
        const idealScrollLeft = computeIdealScrollPosition({
            tabElement,
            parentElement,
            tabWidth,
            tabIndexMap,
        })

        parentElement.scroll({
            left: idealScrollLeft,
            behavior: 'smooth',
        })

        const tabIndex = tabIndexMap.get(tabElement.id) ?? 0
        const numTabs = parentElement.children.length

        handleCircularScrolling({ tabIndex, numTabs, parentElement })
    }
}
