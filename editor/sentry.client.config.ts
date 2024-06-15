import * as Sentry from '@sentry/nextjs'

Sentry.init({
	dsn: process.env.SENTRY_DSN ?? '',
	// Replay may only be enabled for the client-side
	integrations: [
		Sentry.browserTracingIntegration(),
		Sentry.replayIntegration(),
	],
	attachStacktrace: true,
	sampleRate: 1.0,
	tracesSampleRate: 0.2,
	tracePropagationTargets: [
		'localhost',
		/^\//,
		/^https:\/\/cexaengine\.com\/api/,
	],
	// Capture Replay for 10% of all sessions,
	// plus for 100% of sessions with an error
	replaysSessionSampleRate: 0.02,
	replaysOnErrorSampleRate: 0.5,
	debug: process.env.NODE_ENV === 'development',
})
