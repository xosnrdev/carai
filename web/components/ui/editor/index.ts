import type { ThemeDataProp } from '@/components/ui/editor/index.types'

import caraiDark from './theme/carai-dark.json'
import caraiLight from './theme/carai-light.json'

export { darkThemeData, lightThemeData }

const darkThemeData: ThemeDataProp = {
    base: 'vs-dark',
    inherit: true,
    rules: caraiDark.tokenColors.map((token) => {
        const tokenScope = Array.isArray(token.scope)
            ? token.scope.join(', ')
            : token.scope

        return {
            token: tokenScope,
            foreground: token.settings.foreground,
            fontStyle: token.settings.fontStyle,
        }
    }),
    colors: caraiDark.colors,
} as const

const lightThemeData: ThemeDataProp = {
    base: 'vs',
    inherit: true,
    rules: caraiLight.tokenColors.map((token) => {
        const tokenScope = Array.isArray(token.scope)
            ? token.scope.join(', ')
            : token.scope

        return {
            token: tokenScope,
            foreground: token.settings.foreground,
            fontStyle: token.settings.fontStyle,
            background: token.settings.background,
        }
    }),
    colors: caraiLight.colors,
} as const
