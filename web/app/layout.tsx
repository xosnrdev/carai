import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

import ReduxProvider from '@/components/providers/redux-provider'
import ThemeProvider from '@/components/providers/theme-provider'
import siteConfig from '@/config/site'
import '@/styles/global.css'
import { mukta, jetbrainsMono } from '@/config/fonts'

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
    applicationName: siteConfig.name,
    authors: [
        {
            name: siteConfig.author,
            url: new URL(siteConfig.socials.authorUrl),
        },
    ],
    generator: siteConfig.publisher,
    creator: siteConfig.author,
    publisher: siteConfig.publisher,
    robots: 'index, follow',
    keywords: siteConfig.keywords,
    referrer: 'origin',
    description: siteConfig.description,
    openGraph: {
        title: siteConfig.title,
        description: siteConfig.description,
        siteName: siteConfig.name,
        images: siteConfig.OGImage,
        locale: siteConfig.locale,
        type: 'website',
    },
    twitter: {
        title: {
            default: siteConfig.title,
            template: `%s | ${siteConfig.title}`,
        },
        card: 'summary_large_image',
        creator: siteConfig.twitterHandle,
        description: siteConfig.description,
        images: siteConfig.OGImage,
    },
    formatDetection: { telephone: false },
    alternates: { canonical: siteConfig.siteUrl },
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
