// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'

Sentry.init({
	dsn: process.env.SENTRY_DSN,

	// Adjust this value in production, or use tracesSampler for greater control
	sampleRate: 1.0,
	tracesSampleRate: 0.2,
	attachStacktrace: true,
	tracePropagationTargets: ['localhost', 'https://cexaengine.com'],

	// Setting this option to true will print useful information to the console while you're setting up Sentry.
	debug: process.env.NODE_ENV !== 'production',

	replaysOnErrorSampleRate: 0.5,

	// This sets the sample rate to be 10%. You may want this to be 100% while
	// in development and sample at a lower rate in production
	replaysSessionSampleRate: 0.02,

	// You can remove this option if you're not planning to use the Sentry Session Replay feature:
	integrations: [
		Sentry.replayIntegration({
			// Additional Replay configuration goes in here, for example:
			maskAllText: true,
			blockAllMedia: true,
		}),
		Sentry.browserTracingIntegration(),
	],
})
