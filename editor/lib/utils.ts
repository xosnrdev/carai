import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

import { languageProps } from '@/lib/constants/ui'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export class SafeJson {
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

const ACE_THEMES = new Set(['tomorrow', 'tomorrow_night']),
    ACE_EXTENSIONS = new Set([
        'beautify',
        'code_lens',
        'command_bar',
        'elastic_tabstops_lite',
        'emmet',
        'error_marker',
        'hardwrap',
        'inline_autocomplete',
        'keybinding_menu',
        'language_tools',
        'linking',
        'modelist',
        'options',
        'prompt',
        'rtl',
        'searchbox',
        'settings_menu',
        'simple_tokenizer',
        'spellcheck',
        'split',
        'static_highlight',
        'statusbar',
        'textarea',
        'themelist',
        'whitespace',
    ])

export const ACE_MODES = new Set(languageProps.map((lang) => lang.mode)),
    loadAceModules = async () => {
        const imports = [
                ...Array.from(ACE_THEMES).map((theme) => ({
                    type: 'theme',
                    value: theme,
                })),
                ...Array.from(ACE_EXTENSIONS).map((extension) => ({
                    type: 'extension',
                    value: extension,
                })),
                ...Array.from(ACE_MODES).map((mode) => ({
                    type: 'mode',
                    value: mode,
                })),
            ],
            importPromises = imports.map((item) => {
                switch (item.type) {
                    case 'theme':
                        return import(
                            `ace-builds/src-noconflict/theme-${item.value}`
                        )
                    case 'extension':
                        return import(
                            `ace-builds/src-noconflict/ext-${item.value}`
                        )
                    case 'mode':
                        return import(
                            `ace-builds/src-noconflict/mode-${item.value}`
                        )
                    default:
                        throw new Error(`Unknown import type: ${item.type}`)
                }
            })

        await Promise.all(importPromises)
        const { default: ace } = await import('react-ace')

        return ace
    }
