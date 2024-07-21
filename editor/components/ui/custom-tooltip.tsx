import type { FC } from 'react'

import { Tooltip, type TooltipProps } from '@nextui-org/tooltip'

const CustomTooltip: FC<TooltipProps> = ({ ...props }) => {
    return <Tooltip {...props} showArrow offset={-7} radius="none" size="sm" />
}

export default CustomTooltip
