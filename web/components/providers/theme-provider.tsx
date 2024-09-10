'use client'

import type { ThemeProviderProps } from 'next-themes/dist/types'

import { NextUIProvider } from '@nextui-org/system'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { useRouter } from 'next/navigation'

const ThemeProvider = ({ children, ...props }: ThemeProviderProps) => {
    const router = useRouter()

    return (
        <NextUIProvider navigate={router.push}>
            <NextThemesProvider {...props}>{children}</NextThemesProvider>
        </NextUIProvider>
    )
}

export default ThemeProvider
