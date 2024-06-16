/**
 * @type {import('next').NextConfig}
 */

import { withSentryConfig } from '@sentry/nextjs'

export const nextConfig = {
	poweredByHeader: false,
	output: 'standalone',
}

export async function rewrites() {
	return [
		{
			source: '/api/:path*',
			destination: 'https://cexaengine.com/api/:path*',
		},
	]
}

export default withSentryConfig(
	withSentryConfig(nextConfig, {
		org: 'xosnrdev',
		project: 'carai-editor',

		// An auth token is required for uploading source maps.
		authToken: process.env.SENTRY_AUTH_TOKEN,

		silent: false, // Can be used to suppress logs
		disableLogger: true,
		tunnelRoute: '/monitoring-tunnel',
		widenClientFileUpload: true,
		hideSourceMaps: true,
	}),
	{
		// For all available options, see:
		// https://github.com/getsentry/sentry-webpack-plugin#options

		org: 'xosnrdev',
		project: 'carai-editor',

		// Only print logs for uploading source maps in CI
		silent: !process.env.CI,

		// For all available options, see:
		// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

		// Upload a larger set of source maps for prettier stack traces (increases build time)
		widenClientFileUpload: true,

		// Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
		// This can increase your server load as well as your hosting bill.
		// Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
		// side errors will fail.
		// tunnelRoute: "/monitoring",

		// Hides source maps from generated client bundles
		hideSourceMaps: true,

		// Automatically tree-shake Sentry logger statements to reduce bundle size
		disableLogger: true,

		// Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
		// See the following for more information:
		// https://docs.sentry.io/product/crons/
		// https://vercel.com/docs/cron-jobs
		automaticVercelMonitors: true,
	}
)
