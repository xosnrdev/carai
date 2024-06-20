'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import type { FC } from 'react'

const NotFound: FC = () => {
	const router = useRouter()
	return (
		<section className="prose prose-xl mx-auto grid min-h-screen place-content-center dark:prose-invert">
			<h5 className="uppercase tracking-widest">404 | Not Found</h5>
			<Button
				variant={null}
				className="gap-x-2 underline decoration-solid underline-offset-2"
				onClick={(event) => {
					event.preventDefault()
					router.back()
				}}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth="1.5"
					stroke="currentColor"
					className="h-5 w-5"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
					/>
				</svg>

				<span>Go back</span>
			</Button>
		</section>
	)
}

export default NotFound
