import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'

import clsx from 'clsx'
import dynamic from 'next/dynamic'

import ReduxProvider from '@/components/providers/redux-provider'
import { ThemeProvider } from '@/components/providers/theme-provider'
import LoadingSpinner from '@/components/ui/loading-spinner'
import nohemi from '@/config/fonts'
import siteConfig from '@/config/site'
import '@/styles/global.css'

const MainLayout = dynamic(
        async () => await import('@/components/layouts/MainLayout'),
        {
            loading: () => <LoadingSpinner />,
            ssr: false,
        }
    ),
    metadata: Metadata = {
        metadataBase: new URL(siteConfig.links.url),
        title: {
            default: siteConfig.title,
            template: `%s | ${siteConfig.title}`,
        },
        icons: [
            { rel: 'icon', url: '/carai-icon.svg', type: 'image/svg+xml' },
            { rel: 'icon', url: '/favicon.ico', sizes: '32x32' },
            { rel: 'apple-touch-icon', url: '/apple-touch-icon.png' },
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
        robots: { index: true, follow: true },
        keywords: siteConfig.keywords,
        category: '',
        referrer: 'origin',
        description: siteConfig.description,
        openGraph: {
            title: siteConfig.title,
            description: siteConfig.description,
            siteName: siteConfig.title,
            images: '/siteConfig-og.png',
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
            images: '/siteConfig-og.png',
        },
        formatDetection: { telephone: false },
    },
    viewport: Viewport = {
        width: 'device-width',
        initialScale: 1,
        maximumScale: 1,
        colorScheme: 'dark light',
        themeColor: [
            { media: '(prefers-color-scheme: dark)', color: '#2f2f3a' },
            { media: '(prefers-color-scheme: light)', color: '#f1f5f9' },
        ],
    }

export { metadata, viewport }

const RootLayout = ({ children }: { children: ReactNode }) => {
    return (
        <html suppressHydrationWarning lang="en">
            <head />
            <body
                className={clsx(
                    'box-border min-h-dvh overflow-hidden scroll-smooth bg-background antialiased',
                    nohemi.className
                )}
            >
                <ThemeProvider
                    disableTransitionOnChange
                    enableColorScheme
                    enableSystem
                    attribute="class"
                    defaultTheme="dark"
                    nonce="csp-nonce"
                    storageKey="theme"
                >
                    <ReduxProvider>
                        <MainLayout>{children}</MainLayout>
                    </ReduxProvider>
                </ThemeProvider>
            </body>
        </html>
    )
}

export default RootLayout
