import { useTheme } from 'next-themes'
import Image from 'next/image'
import Link from 'next/link'
import { FC, useEffect, useState } from 'react'

const Brand: FC<BrandProps> = ({ width = 110, height = 50, ...props }) => {
	const { resolvedTheme } = useTheme()
	const [isThemeLoaded, setIsThemeLoaded] = useState(false)

	useEffect(() => {
		setIsThemeLoaded(true)
	}, [])

	if (!isThemeLoaded) {
		return null
	}

	const logoSrc =
		resolvedTheme === 'dark' ? '/carai-dark.svg' : '/carai-light.svg'

	return (
		<Link href={'/'}>
			<Image
				src={logoSrc}
				alt="brand logo"
				width={width}
				height={height}
				priority
				className="pointer-events-none h-auto w-auto"
				{...props}
			/>
		</Link>
	)
}

export default Brand
