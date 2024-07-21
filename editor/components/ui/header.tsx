import type { FC } from 'react'

import { useRouter } from 'next/navigation'
import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
} from '@nextui-org/navbar'
import { Button, ButtonGroup } from '@nextui-org/button'
import { useTheme } from 'next-themes'
import Link from 'next/link'

import { headerProps } from '@/lib/constants/ui'
import useTabContext from '@/hooks/useTabContext'

import { ThemeSwitch } from './theme-switch'

const Header: FC = () => {
    const { getActiveTab } = useTabContext(),
        { theme } = useTheme(),
        router = useRouter()

    return (
        <Navbar isBordered height={12} isBlurred={false} maxWidth="full">
            <NavbarBrand className="text-3xl font-extrabold tracking-tighter text-primary dark:text-default-foreground">
                <Link href={'/'}>CARAI</Link>
            </NavbarBrand>
            <NavbarContent justify="end">
                <NavbarItem className="flex flex-row gap-x-4">
                    <ThemeSwitch />
                    {getActiveTab && (
                        <ButtonGroup className="hidden lg:block xl:block">
                            {headerProps.map(({ id, path, label }) => (
                                <Button
                                    key={id}
                                    color={
                                        theme === 'dark' ? 'default' : 'primary'
                                    }
                                    radius="none"
                                    size="sm"
                                    startContent={<span>{label}</span>}
                                    variant="ghost"
                                    onClick={(e) => {
                                        router.push(path)
                                        e.preventDefault()
                                    }}
                                />
                            ))}
                        </ButtonGroup>
                    )}
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    )
}

export default Header
