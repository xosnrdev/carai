"use client";

import { Button } from "@nextui-org/button";
import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        Sentry.captureException(error);
    }, [error]);

    return (
        <html lang="en">
            <body>
                <div className="flex flex-col min-h-dvh place-content-center space-y-6 antialiased">
                    <h2>Something went wrong!</h2>
                    <Button
                        startContent={<span>Try again</span>}
                        onPress={() => reset()}
                        color="danger"
                    />
                </div>
            </body>
        </html>
    );
}
