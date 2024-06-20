import type { MainLayoutProps } from '@/components/layouts/MainLayout'
import LoadingSpinner from '@/components/ui/loading-spinner'
import nohemi from '@/lib/fonts/nohemi'
import '@/styles/global.css'
import type { Metadata } from 'next'
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
	description: 'Carai: Your online coding companion.',
	openGraph: {
		title: 'Carai - Code Playground',
		description: 'Carai: Your online coding companion.',
		// url: siteMetadata.siteUrl,
		siteName: 'Carai - Code Playground',
		//images: [siteMetadata.socialBanner],
		locale: 'en_US',
		type: 'website',
	},
}

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en">
			<body className={nohemi.className}>
				<MainLayout>{children}</MainLayout>
			</body>
		</html>
	)
}
