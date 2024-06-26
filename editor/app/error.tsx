'use client'

import { Button } from '@/components/ui/button'
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
		<html>
			<body>
				<div className="prose prose-xl mx-auto flex min-h-screen flex-col items-center justify-center">
					<h2>Something went wrong!</h2>
					<Button
						variant={'outline'}
						size={'sm'}
						onClick={() => reset()}
						role="reset and try again"
					>
						Try again
					</Button>
				</div>
			</body>
		</html>
	)
}
