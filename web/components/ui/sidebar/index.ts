import type { SidebarProp } from './index.types'

import { PlusIcon, UsersRoundIcon } from 'lucide-react'

const sidebarProps: SidebarProp[] = [
    {
        id: 'add',
        icon: PlusIcon,
        label: 'Add',
    },
    {
        id: 'users',
        icon: UsersRoundIcon,
        label: 'Users',
    },
] as const

export default sidebarProps
