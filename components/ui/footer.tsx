import { useState, type FC } from 'react'
import { Button, ButtonGroup } from '@nextui-org/button'
import { useTheme } from 'next-themes'

import useTabContext from '@/hooks/useTabContext'
import { navProps } from '@/lib/constants/ui'
import useAppContext from '@/hooks/useAppContext'

import UserGuide from './user-guide'

const Footer: FC = () => {
    const { activeTab } = useTabContext()
    const { resolvedTheme } = useTheme()
    const { isOpen, setIsOpen } = useAppContext()
    const [isFooterOpen, setIsFooterOpen] = useState(true)

    if (!isFooterOpen) return <></>

    return (
        <>
            {activeTab && (
                <div className="h-8 border-t border-t-default bg-background">
                    <ButtonGroup>
                        {navProps.map((prop, idx) => (
                            <Button
                                key={idx}
                                isIconOnly
                                color={
                                    resolvedTheme === 'dark'
                                        ? 'default'
                                        : 'primary'
                                }
                                radius="none"
                                size="sm"
                                startContent={<prop.icon size={24} />}
                                variant="light"
                                onClick={(e) => {
                                    idx === 0
                                        ? setIsFooterOpen(false)
                                        : idx === 2
                                          ? setIsOpen({ userGuide: true })
                                          : null
                                    e.preventDefault()
                                }}
                            />
                        ))}
                    </ButtonGroup>
                </div>
            )}
            {isOpen.userGuide && <UserGuide />}
        </>
    )
}

export default Footer
