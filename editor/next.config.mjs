/**
 * @type {import('next').NextConfig}
 */

import { withSentryConfig } from '@sentry/nextjs'

export const nextConfig = {
	poweredByHeader: false,
}

export async function rewrites() {
	return [
		{
			source: '/api/:path*',
			destination: 'https://cexaengine.com/api/:path*',
		},
	]
}

export default withSentryConfig(nextConfig, {
	org: 'xosnrdev',
	project: 'carai-editor',

	// An auth token is required for uploading source maps.
	authToken: process.env.SENTRY_AUTH_TOKEN,

	silent: false, // Can be used to suppress logs
	disableLogger: true,
	tunnelRoute: '/monitoring-tunnel',
	widenClientFileUpload: true,
	hideSourceMaps: true,
	sourcemaps: {
		disable: true,
	},
})
