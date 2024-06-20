import Head from 'next/head'
import type { FC } from 'react'

interface MetaDataProps {
	title?: string
	description?: string
	imageUrl?: string
}

const MetaData: FC<MetaDataProps> = ({ title, description, imageUrl }) => (
	<Head>
		<title>{title || 'Carai - Code Playground'}</title>
		<meta
			name="description"
			content={description || 'Carai: Your online coding companion.'}
		/>
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<meta charSet="utf-8" />
		<link rel="icon" href="../../app/favicon.ico" />
		<meta property="og:title" content={title || 'Carai - Code Playground'} />
		<meta
			property="og:description"
			content={description || 'Carai: Your online coding companion.'}
		/>
		<meta property="og:image" content={imageUrl || ''} />
		<meta
			property="og:url"
			content={typeof window !== 'undefined' ? window.location.href : ''}
		/>
		<meta name="twitter:card" content="summary_large_image" />
	</Head>
)

export default MetaData
