import type { Footer } from './index.types'

import { CircleX, Info, TriangleAlert } from 'lucide-react'

export const footer: Footer[] = [
    {
        icon: CircleX,
    },
    {
        icon: TriangleAlert,
    },
    {
        icon: Info,
    },
] as const
