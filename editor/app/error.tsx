'use client'

import { Button } from '@nextui-org/button'
import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'

export default function Error({
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
                <div className="prose prose-lg mx-auto flex min-h-screen flex-col items-center justify-center">
                    <h2>Something went wrong!</h2>
                    <Button
                        color="primary"
                        size={'sm'}
                        startContent={<span>Try again</span>}
                        variant="flat"
                        onPress={() => reset()}
                    />
                </div>
            </body>
        </html>
    )
}
