import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import type { FC, ReactNode } from 'react'

interface CustomTooltipProp {
	children: ReactNode
	content: ReactNode
}

const CustomTooltip: FC<CustomTooltipProp> = ({ children, content }) => {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>{children}</TooltipTrigger>
				<TooltipContent>{content}</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}

export default CustomTooltip
