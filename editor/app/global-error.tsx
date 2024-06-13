'use client'

import { Button } from '@/components/ui/button'

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string }
	reset: () => void
}) {
	return (
		<html>
			<body>
				<div className="prose prose-lg mx-auto grid min-h-screen max-w-prose place-content-center dark:prose-invert">
					<h2>Something went wrong!</h2>
					{error && <p>{error.message}</p>}
					<Button variant={'ghost'} size={'sm'} onClick={() => reset()}>
						Try again
					</Button>
				</div>
			</body>
		</html>
	)
}
