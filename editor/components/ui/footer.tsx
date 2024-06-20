import useTabContext from '@/hooks/useTabContext'
import { navProps } from '@/lib/constants/ui'
import type { FC } from 'react'

const Footer: FC = () => {
	const { isTabViewEditor } = useTabContext()
	return (
		<div className="sticky bottom-0 z-20 m-auto flex h-16 w-full flex-row items-center gap-x-3 bg-secondary px-8">
			{isTabViewEditor &&
				navProps.map((prop, idx) => (
					<button key={idx} className="text-primary dark:text-[#E0E0F5]">
						<prop.icon size={24} />
					</button>
				))}
		</div>
	)
}

export default Footer
