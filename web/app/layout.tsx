import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'

import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

import ReduxProvider from '@/components/providers/redux-provider'
import ThemeProvider from '@/components/providers/theme-provider'
import { jetbrainsMono, mukta } from '@/config/fonts'
import siteConfig from '@/config/site'
import '@/styles/global.css'

export const metadata: Metadata = {
    metadataBase: new URL(siteConfig.siteUrl),
    title: {
        default: siteConfig.title,
        template: `%s | ${siteConfig.name}`,
    },
    icons: [
        {
            rel: 'icon',
            url: '/favicon-32x32.svg',
            type: 'image/svg+xml',
        },
        { rel: 'icon', url: '/favicon.ico', sizes: '32x32' },
        {
            rel: 'apple-touch-icon',
            url: '/apple-touch-icon.png',
        },
    ],
    robots: 'index, follow',
    keywords: siteConfig.keywords,
    referrer: 'origin',
    description: siteConfig.description,
    openGraph: {
        images: siteConfig.OGImage,
        type: 'website',
        url: new URL(siteConfig.siteUrl),
    },
    twitter: {
        card: 'summary_large_image',
        creator: siteConfig.twitterHandle,
        images: siteConfig.OGImage,
    },
    alternates: { canonical: siteConfig.siteUrl },
}

export const viewport: Viewport = {
    maximumScale: 1,
}

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html suppressHydrationWarning lang="en">
            <body className={`${mukta.variable} ${jetbrainsMono.variable}`}>
                <ThemeProvider
                    disableTransitionOnChange
                    enableSystem
                    attribute="class"
                    defaultTheme="system"
                    storageKey="theme"
                >
                    <ReduxProvider>{children}</ReduxProvider>
                    <SpeedInsights />
                    <Analytics />
                </ThemeProvider>
            </body>
        </html>
    )
}
