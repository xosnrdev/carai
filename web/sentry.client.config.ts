import * as Sentry from "@sentry/nextjs";

Sentry.init({
    debug: false,
    dsn: process.env.SENTRY_DSN ?? "",
    integrations: [
        Sentry.replayIntegration({
            maskAllText: true,
            blockAllMedia: true,
        }),
    ],
    replaysOnErrorSampleRate: 1.0,
    replaysSessionSampleRate: 0.05,
    tracesSampleRate: 0.5,
});
