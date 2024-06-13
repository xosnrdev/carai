import Image from 'next/image'
import { FC } from 'react'

const LoadingSpinner: FC = () => (
	<div className="flex flex-col items-center justify-center">
		<Image
			src={'/loading-spinner.svg'}
			width={100}
			height={100}
			alt="loading spinner"
			priority
			className=""
		/>
	</div>
)

export default LoadingSpinner
