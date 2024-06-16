// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'

Sentry.init({
	dsn: process.env.SENTRY_DSN,
	integrations: [Sentry.httpIntegration()],

	// Adjust this value in production, or use tracesSampler for greater control
	tracesSampleRate: 0.2,
	attachStacktrace: true,
	sampleRate: 1.0,

	// Setting this option to true will print useful information to the console while you're setting up Sentry.
	debug: process.env.NODE_ENV !== 'production',

	// Uncomment the line below to enable Spotlight (https://spotlightjs.com)
	// spotlight: process.env.NODE_ENV === 'development',
})
