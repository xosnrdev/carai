import { useState, type FC } from 'react'
import { Button, ButtonGroup } from '@nextui-org/button'
import { useTheme } from 'next-themes'

import useTabContext from '@/hooks/useTabContext'
import { navProps } from '@/lib/constants/ui'

const Footer: FC = () => {
    const { activeTab } = useTabContext()
    const { resolvedTheme } = useTheme()
    const [isOpen, setIsOpen] = useState({
        close: true,
    })

    const handleClose = () => {
        setIsOpen((prev) => ({ ...prev, close: !prev.close }))
    }

    return (
        <>
            {activeTab && isOpen.close && (
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
                                    idx === 0 ? handleClose() : null
                                    e.preventDefault()
                                }}
                            />
                        ))}
                    </ButtonGroup>
                </div>
            )}
        </>
    )
}

export default Footer
