'use client'

import { Button } from '@nextui-org/button'
import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        Sentry.captureException(error)
    }, [error])

    return (
        <html>
            <body>
                <div className="mx-auto flex min-h-dvh flex-col items-center justify-center space-y-4 font-mukta">
                    <h2>Something went wrong!</h2>
                    <Button
                        startContent={<span>Try again</span>}
                        onPress={() => reset()}
                    />
                </div>
            </body>
        </html>
    )
}
