import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

class SafeJson {
    static stringify<T>(value: T, fallback?: string): string {
        try {
            return JSON.stringify(value)
        } catch {
            return fallback as string
        }
    }
    static parse<T>(json: string, fallback?: T): T {
        try {
            return JSON.parse(json)
        } catch {
            return fallback as T
        }
    }
}

export { cn, SafeJson }
