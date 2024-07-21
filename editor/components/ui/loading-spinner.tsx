import type { FC } from 'react'

import Image from 'next/image'

const LoadingSpinner: FC = () => (
    <div className="flex h-screen flex-col items-center justify-center">
        <Image
            priority
            alt="loading spinner"
            height={100}
            src={'/loading-spinner.svg'}
            width={100}
        />
    </div>
)

export default LoadingSpinner
