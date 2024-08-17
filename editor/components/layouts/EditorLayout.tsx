'use client'

import { Button } from '@nextui-org/button'
import { redirect, usePathname } from 'next/navigation'
import { useEffect, useRef, type FC, type ReactNode } from 'react'
import { Toaster } from 'react-hot-toast'

import useAppContext from '@/hooks/useAppContext'
import { cn } from '@/lib/utils'
import useTabContext from '@/hooks/useTabContext'

import CustomTooltip from '../ui/custom-tooltip'
import Header from '../ui/header'
import Sidebar from '../ui/sidebar'

export interface IMainLayoutProps {
    children: ReactNode
}

const MainLayout: FC<IMainLayoutProps> = ({ children }) => {
    const { isOpen, setIsOpen } = useAppContext()
    const { activeTab } = useTabContext()
    const pathname = usePathname()
    const containerRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        const container = containerRef.current

        if (!container) return

        const checkScreenSize = (width: number) => {
            const minWidth = 640

            if (width < minWidth && pathname !== '/unsupported') {
                redirect('/unsupported')
            } else if (width >= minWidth && pathname === '/unsupported') {
                redirect('/')
            }
        }

        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const { width } = entry.contentRect

                checkScreenSize(width)
            }
        })

        resizeObserver.observe(container)

        checkScreenSize(container.offsetWidth)

        return () => {
            resizeObserver.disconnect()
        }
    }, [pathname])

    return (
        <div
            ref={containerRef}
            className="custom-scrollbar relative flex h-dvh flex-col overflow-hidden bg-background"
        >
            <Header />
            <Toaster position="top-center" reverseOrder={true} />
            <div className="flex h-full flex-row overflow-hidden">
                <div
                    className={cn({
                        hidden: isOpen.sidebar === false,
                    })}
                >
                    <Sidebar />
                </div>
                <div className="h-full flex-1 bg-[#FFFFFF] dark:bg-[#1E1E2A]">
                    {children}
                </div>
            </div>
            <div className="sticky h-12 border-y border-default" />

            {activeTab && (
                <CustomTooltip
                    content={
                        <span>
                            {isOpen.sidebar ? 'Close Sidebar' : 'Open Sidebar'}
                        </span>
                    }
                >
                    <Button
                        isIconOnly
                        className={cn('absolute left-0 top-9 z-50 text-2xl', {
                            'bg-default': isOpen.sidebar === false,
                            'ml-2': isOpen.sidebar,
                        })}
                        radius="none"
                        size={'sm'}
                        variant={'light'}
                        onClick={(e) => {
                            e.preventDefault()
                            if (!isOpen.sidebar) {
                                setIsOpen({
                                    sidebar: true,
                                })
                            } else {
                                setIsOpen({
                                    sidebar: false,
                                })
                            }
                        }}
                    >
                        {isOpen.sidebar ? '⇤' : '⇥'}
                    </Button>
                </CustomTooltip>
            )}
        </div>
    )
}

export default MainLayout
