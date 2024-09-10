import { Button } from '@nextui-org/button'
import { useTheme } from 'next-themes'
import { useState } from 'react'
import { Navbar, NavbarContent, NavbarItem } from '@nextui-org/navbar'

import useAppContext from '@/hooks/useAppContext'
import useTabContext from '@/hooks/useTabContext'

import UserGuide from '../docs/ui'

import { footer } from '.'

export default function Footer() {
    const { activeTab } = useTabContext()
    const { resolvedTheme } = useTheme()
    const { isOpen, setIsOpen } = useAppContext()
    const [isFooterOpen, setIsFooterOpen] = useState(true)

    return (
        <>
            <Navbar
                className="h-16 border-y border-default"
                isBlurred={false}
                maxWidth="full"
            >
                {activeTab && isFooterOpen && (
                    <NavbarContent className="-space-x-2">
                        {footer.map((_, idx) => (
                            <NavbarItem key={idx}>
                                <Button
                                    isIconOnly
                                    color={
                                        resolvedTheme === 'dark'
                                            ? 'default'
                                            : 'primary'
                                    }
                                    size="sm"
                                    startContent={<_.icon size={30} />}
                                    variant="light"
                                    onPress={() => {
                                        idx === 0
                                            ? setIsFooterOpen(false)
                                            : idx === 2
                                              ? setIsOpen({ userGuide: true })
                                              : null
                                    }}
                                />
                            </NavbarItem>
                        ))}
                    </NavbarContent>
                )}
            </Navbar>
            {isOpen.userGuide && <UserGuide />}
        </>
    )
}
