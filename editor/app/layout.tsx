import type { MainLayoutProps } from '@/components/layouts/MainLayout'
import GlobalProvider from '@/components/providers/GlobalProvider'
import LoadingSpinner from '@/components/ui/loading-spinner'
import nohemi from '@/lib/fonts/nohemi'
import '@/styles/global.css'
import type { Metadata, Viewport } from 'next'
import dynamic from 'next/dynamic'
import { ReactNode } from 'react'

const MainLayout = dynamic<MainLayoutProps>(
	() => import('@/components/layouts/MainLayout'),
	{
		loading: () => <LoadingSpinner />,
		ssr: false,
	}
)

export const metadata: Metadata = {
	metadataBase: new URL('https://cexaengine.com'),

	title: {
		default: 'Carai - Code Playground',
		template: `%s | Carai - Code Playground`,
	},
	applicationName: 'carai',
	authors: [{ name: 'xosnrdev', url: new URL('https://cexaengine.com') }],
	generator: 'xosnrdev',
	creator: 'xosnrdev',
	publisher: 'carai',
	robots: 'index, follow',
	keywords: [
		'docker',
		'multi-language-support',
		'sandbox-environment',
		'code-runner',
		'web-code-editor',
		'traefik-docker',
		'standalone-app',
		'online-code-editor',
		'remote-code-execution-engine',
	],
	referrer: 'origin',
	description: 'Carai: Your online coding playground.',
	openGraph: {
		title: 'Carai - Code Playground',
		description: 'Carai: Your online coding playground.',
		url: new URL('https://cexaengine.com'),
		siteName: 'Carai - Code Playground',
		//images: [siteMetadata.socialBanner],
		locale: 'en_US',
		type: 'website',
	},
	twitter: {
		card: 'summary',
		title: {
			default: 'Carai - Code Playground',
			template: `%s | Carai - Code Playground`,
		},
		creator: '@xosnrdev',
		description: 'Carai: Your online coding playground.',
	},
	formatDetection: { telephone: false },
}
export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
	maximumScale: 1,
	userScalable: false,
}
export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en">
			<body className={nohemi.className}>
				<GlobalProvider>
					<MainLayout>{children}</MainLayout>
				</GlobalProvider>
			</body>
		</html>
	)
}
