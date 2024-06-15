import * as Sentry from '@sentry/browser'

Sentry.init({
	dsn: process.env.SENTRY_DSN ?? '',
	integrations: [Sentry.httpClientIntegration()],
	sendDefaultPii: true,
	attachStacktrace: true,
	sampleRate: 1.0,
	tracesSampleRate: 0.2,
	debug: process.env.NODE_ENV === 'development',
})
