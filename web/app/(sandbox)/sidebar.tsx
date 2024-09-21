import { Button } from '@nextui-org/button'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

import useAppContext from '@/hooks/useAppContext'
import useKeyPress from '@/hooks/useKeyPress'
import { cn } from '@/lib/utils'
import CustomTooltip from '@/components/ui/custom-tooltip'

import LanguageCollection from './language-collection'
import sidebarProps from './constants'

export default function Sidebar() {
    const { isOpen, setIsOpen } = useAppContext()
    const pathname = usePathname()
    const [activeNav, setActiveNav] = useState<number | null>(null)

    const handleModal = () => {
        setIsOpen({
            modal: true,
        })
    }

    useKeyPress({
        targetKey: 'N',
        callback: () => {
            if (pathname === '/sandbox') {
                handleModal()
            }
        },
        modifier: ['ctrlKey'],
    })

    return (
        <>
            <aside className="sticky left-0 flex w-16 flex-col border-r border-default py-12">
                {sidebarProps.map(({ id, label, ...val }, idx) => (
                    <div key={id} className="mx-auto my-6 flex flex-col">
                        {idx === 0 ? (
                            <CustomTooltip
                                content={
                                    <span className="text-xs">
                                        Choose Language
                                    </span>
                                }
                            >
                                <Button
                                    isIconOnly
                                    aria-label={label}
                                    className={cn('text-default-500', {
                                        'text-primary dark:text-white':
                                            activeNav === idx,
                                    })}
                                    color="default"
                                    size="md"
                                    startContent={<val.icon size={30} />}
                                    onClick={() => {
                                        handleModal()
                                        setActiveNav(idx)
                                    }}
                                />
                            </CustomTooltip>
                        ) : (
                            <CustomTooltip
                                content={
                                    <span className="text-xs">Collaborate</span>
                                }
                            >
                                <Button
                                    isIconOnly
                                    aria-label={label}
                                    className={cn(
                                        'text-default-500 transition-colors',
                                        {
                                            'text-primary dark:text-white':
                                                activeNav === idx,
                                        }
                                    )}
                                    color="default"
                                    role="link"
                                    size="md"
                                    startContent={
                                        <val.icon
                                            fill="currentColor"
                                            size={32}
                                        />
                                    }
                                    onClick={() => {
                                        // if (pathname !== '/collaborate') {
                                        //   router.push('/collaborate')
                                        // }
                                        setActiveNav(idx)
                                    }}
                                />
                            </CustomTooltip>
                        )}
                    </div>
                ))}
            </aside>
            {isOpen.modal && <LanguageCollection />}
        </>
    )
}
