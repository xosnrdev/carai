import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

import { IState } from '@/types'

export {
    cn,
    serializeViewState,
    transformString,
    languageNameTransformMap,
    imageNameTransformMap,
    languageSupportTransformMap,
    capitalizeFirstLetter,
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
