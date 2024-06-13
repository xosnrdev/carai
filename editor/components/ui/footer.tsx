import { navProps } from '@/lib/constants/ui'
import { useTabContext } from '@/sdk/tabkit/store'
import { FC } from 'react'

const Footer: FC = () => {
	const { isTabEditor } = useTabContext()
	return (
		<div className="sticky bottom-0 z-20 m-auto flex h-16 w-full flex-row items-center gap-x-3 bg-secondary px-8">
			{isTabEditor &&
				navProps.map((_, idx) => (
					<button key={idx} className="text-primary dark:text-[#E0E0F5]">
						<_.icon size={24} />
					</button>
				))}
		</div>
	)
}

export default Footer
