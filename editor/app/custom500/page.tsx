import type { FC } from 'react'

import Link from 'next/link'

const Custom500: FC = () => {
    return (
        <section className="prose prose-lg mx-auto grid min-h-screen max-w-prose place-content-center dark:prose-invert">
            <h2>500</h2>
            <blockquote className="font-normal not-italic">
                <strong className="mb-4 block text-xl">
                    Internal server error.
                </strong>
                <small className="text-base">
                    If you think this shouldn&apos;t happen, you can help us fix
                    this error by sending us a bug report to our{' '}
                    <Link
                        className="decoration-dashed decoration-2 hover:decoration-solid"
                        href="https://github.com/xosnrdev/carai/issues"
                        rel="noopener noreferrer"
                        target="_blank"
                    >
                        Github Issue
                    </Link>
                    page.
                </small>
            </blockquote>
        </section>
    )
}

export default Custom500
