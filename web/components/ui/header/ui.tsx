import { Button } from '@nextui-org/button'
import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
} from '@nextui-org/navbar'
import { BracesIcon } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import useTabContext from '@/hooks/useTabContext'

import { ThemeSwitch } from '../theme-switch'

import headerProps from '.'

export default function Header() {
    const { activeTab } = useTabContext()
    const router = useRouter()

    return (
        <Navbar isBordered className="h-16" isBlurred={false} maxWidth="full">
            <NavbarBrand className="text-4xl font-extrabold tracking-tight text-primary dark:text-white">
                <BracesIcon size={30} />
                <Link href={'/sandbox'}>Carai</Link>
            </NavbarBrand>
            <NavbarContent justify="end">
                <NavbarItem className="mt-2">
                    <ThemeSwitch />
                </NavbarItem>
                {activeTab && (
                    <>
                        {headerProps.map(({ id, path, label }, index) => (
                            <NavbarItem key={id}>
                                <Button
                                    color={index === 0 ? 'primary' : 'default'}
                                    size="md"
                                    startContent={<span>{label}</span>}
                                    onPress={() => {
                                        router.push(path)
                                    }}
                                />
                            </NavbarItem>
                        ))}
                    </>
                )}
            </NavbarContent>
        </Navbar>
    )
}
