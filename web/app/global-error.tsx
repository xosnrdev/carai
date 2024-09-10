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
        <html lang="en">
            <body>
                <div className="prose prose-lg mx-auto flex min-h-dvh flex-col items-center justify-center font-mukta">
                    <h2>Something went wrong!</h2>
                    <Button
                        color="primary"
                        size={'sm'}
                        startContent={<span>Try again</span>}
                        variant="ghost"
                        onPress={() => reset()}
                    />
                </div>
            </body>
        </html>
    )
}
