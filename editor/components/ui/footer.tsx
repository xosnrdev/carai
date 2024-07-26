import { useState, type FC } from 'react'
import { Button, ButtonGroup } from '@nextui-org/button'
import { useTheme } from 'next-themes'

import useTabContext from '@/hooks/useTabContext'
import { navProps } from '@/lib/constants/ui'

import TermsOfService from './terms-of-service'

const Footer: FC = () => {
    const { getActiveTab, isMobileView } = useTabContext(),
        { resolvedTheme } = useTheme(),
        [isOpen, setIsOpen] = useState({
            close: true,
            disclaimer: false,
        }),
        handleClose = () => {
            setIsOpen((prev) => ({ ...prev, close: !prev.close }))
        },
        handleDisclaimer = () => {
            setIsOpen((prev) => ({ ...prev, disclaimer: !prev.disclaimer }))
        }

    return (
        <>
            {getActiveTab && isOpen.close && (
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
                                startContent={
                                    <prop.icon size={isMobileView ? 18 : 20} />
                                }
                                variant="light"
                                onClick={(e) => {
                                    idx === 0
                                        ? handleClose()
                                        : idx === 1
                                          ? handleDisclaimer()
                                          : null
                                    e.preventDefault()
                                }}
                            />
                        ))}
                    </ButtonGroup>
                </div>
            )}
            {isOpen.disclaimer && (
                <TermsOfService handleClose={handleDisclaimer} />
            )}
        </>
    )
}

export default Footer
