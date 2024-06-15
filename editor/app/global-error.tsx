'use client'

import { Button } from '@/components/ui/button'
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
				<div className="prose prose-lg mx-auto grid min-h-screen max-w-prose place-content-center dark:prose-invert">
					<h2>Something went wrong!</h2>
					<Button variant={'ghost'} size={'sm'} onClick={() => reset()}>
						Try again
					</Button>
				</div>
			</body>
		</html>
	)
}
