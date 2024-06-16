// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'

Sentry.init({
	dsn: 'https://f48e61d0f37c7305174dd13b6a1b952d@o4506923082973184.ingest.us.sentry.io/4507421399777280',

	integrations: [Sentry.httpIntegration()],
	attachStacktrace: true,
	sampleRate: 1.0,

	// Adjust this value in production, or use tracesSampler for greater control
	tracesSampleRate: 0.2,

	// Setting this option to true will print useful information to the console while you're setting up Sentry.
	debug: process.env.NODE_ENV !== 'production',

	// Uncomment the line below to enable Spotlight (https://spotlightjs.com)
	// spotlight: process.env.NODE_ENV === 'development',
})
