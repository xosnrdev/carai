import * as Sentry from "@sentry/nextjs";

Sentry.init({
    dsn: process.env.SENTRY_DSN ?? "",
    tracesSampleRate: 0.5,
    debug: false,
    spotlight: process.env.NODE_ENV === "development",
});
