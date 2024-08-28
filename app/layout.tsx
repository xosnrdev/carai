import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { SpeedInsights } from '@vercel/speed-insights/next'

import ReduxProvider from '@/components/providers/redux-provider'
import ThemeProvider from '@/components/providers/theme-provider'
import nohemi from '@/config/fonts'
import siteConfig from '@/config/site'
import '@/styles/global.css'

const metadata: Metadata = {
    metadataBase: new URL(siteConfig.links.url),
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
            url: new URL(siteConfig.links.authorUrl),
        },
    ],
    generator: siteConfig.publisher,
    creator: siteConfig.author,
    publisher: siteConfig.publisher,
    robots: 'index, follow',
    keywords: siteConfig.keywords,
    category: 'Coding Playground',
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
    alternates: { canonical: siteConfig.links.url },
}

const RootLayout = ({ children }: { children: ReactNode }) => {
    return (
        <html suppressHydrationWarning lang="en">
            <body className={nohemi.className}>
                <ThemeProvider
                    disableTransitionOnChange
                    enableColorScheme
                    enableSystem
                    attribute="class"
                    defaultTheme="system"
                    nonce="carai"
                    storageKey="theme"
                >
                    <ReduxProvider>{children}</ReduxProvider>
                    <SpeedInsights />
                </ThemeProvider>
            </body>
        </html>
    )
}

export { RootLayout as default, metadata }
