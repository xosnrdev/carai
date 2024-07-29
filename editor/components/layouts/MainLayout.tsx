'use client'

import type { FC, ReactNode } from 'react'

import { Toaster } from 'react-hot-toast'
import { Button } from '@nextui-org/button'

import useAppContext from '@/hooks/useAppContext'
import { cn } from '@/lib/utils'

import Header from '../ui/header'
import Sidebar from '../ui/sidebar'
import CustomTooltip from '../ui/custom-tooltip'

export interface IMainLayoutProps {
    children: ReactNode
}

const MainLayout: FC<IMainLayoutProps> = ({ children }) => {
    const { isOpen, setIsOpen } = useAppContext()

    return (
        <div className="custom-scrollbar relative flex h-dvh flex-col overflow-hidden">
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
            <CustomTooltip
                content={
                    <span>
                        {isOpen.sidebar ? 'Close Sidebar' : 'Open Sidebar'}
                    </span>
                }
            >
                <Button
                    isIconOnly
                    className="absolute left-2 top-0 z-10 mt-9 text-3xl lg:text-2xl xl:text-2xl"
                    radius="none"
                    size={'sm'}
                    startContent={
                        <span className="mt-1">
                            {isOpen.sidebar ? '⇤' : '⇥'}
                        </span>
                    }
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
                />
            </CustomTooltip>
        </div>
    )
}

export default MainLayout
