'use client'

import type { FC } from 'react'

import { useRouter } from 'next/navigation'
import { Button } from '@nextui-org/button'

const NotFound: FC = () => {
    const router = useRouter()

    return (
        <section className="prose prose-lg mx-auto flex min-h-dvh flex-col items-center justify-center dark:prose-invert">
            <h5 className="uppercase tracking-widest">404 | Not Found</h5>
            <Button
                color="primary"
                endContent={<span>Go back</span>}
                radius="sm"
                size="sm"
                startContent={
                    <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                }
                variant="ghost"
                onClick={(e) => {
                    e.preventDefault()
                    router.back()
                }}
            />
        </section>
    )
}

export default NotFound
