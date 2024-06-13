import Image from 'next/image'
import { FC } from 'react'

const Banner: FC = () => (
	<>
		<Image
			src={'onboarding.svg'}
			alt="Banner image"
			width={500}
			height={400}
			priority
			className="h-auto w-auto"
		/>
	</>
)

export default Banner
