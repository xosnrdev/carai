import { withSentryConfig } from '@sentry/nextjs'

/** @type {import('next').NextConfig} */
const nextConfig = {
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production',
    },
    experimental: {
        instrumentationHook: true,
    },
    poweredByHeader: false,
    reactStrictMode: true,
    swcMinify: true,
}

const config = withSentryConfig(nextConfig, {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    automaticVercelMonitors: false,
    disableLogger: true,

    // Only print logs for uploading source maps in CI
    hideSourceMaps: true,

    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    org: 'xosnrdev',

    // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
    // This can increase your server load as well as your hosting bill.
    // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
    // side errors will fail.
    project: 'carai-editor',

    // Hides source maps from generated client bundles
    silent: !process.env.CI,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    tunnelRoute: '/monitoring',

    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    widenClientFileUpload: true,
})

export default config
