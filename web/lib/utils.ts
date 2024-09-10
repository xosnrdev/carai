import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export {
    capitalizeFirstLetter,
    cn,
    debounce,
    imageNameTransformMap,
    isNonEmptyString,
    languageNameTransformMap,
    languageSupportTransformMap,
    transformString,
}

const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

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

function transformString({
    str,
    map,
    capitalize,
    lowerCase,
}: {
    str: string
    map: Record<string, string>
} & Into): string {
    const transform = map[str] || str

    return capitalize
        ? capitalizeFirstLetter(transform)
        : lowerCase
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

const debounce = (func: () => void, delay: number) => {
    let timeoutId: NodeJS.Timeout

    return () => {
        if (timeoutId) clearTimeout(timeoutId)
        timeoutId = setTimeout(() => func(), delay)
    }
}

const isNonEmptyString = (value: string): boolean => {
    return value.trim().length > 0
}
