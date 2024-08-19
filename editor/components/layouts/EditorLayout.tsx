'use client'

import { Button } from '@nextui-org/button'
import { type FC, type ReactNode } from 'react'
import { Toaster } from 'react-hot-toast'

import useAppContext from '@/hooks/useAppContext'
import useDeviceSupportCheck from '@/hooks/useDeviceSupportCheck'
import useTabContext from '@/hooks/useTabContext'
import { cn } from '@/lib/utils'

import CustomTooltip from '../ui/custom-tooltip'
import Header from '../ui/header'
import Sidebar from '../ui/sidebar'
import UnsupportedDevice from '../ui/unsupported-device'

export interface IMainLayoutProps {
    children: ReactNode
}

const MainLayout: FC<IMainLayoutProps> = ({ children }) => {
    const { isOpen, setIsOpen } = useAppContext()
    const { activeTab } = useTabContext()

    const isSupportedDevice = useDeviceSupportCheck()

    if (!isSupportedDevice) {
        return <UnsupportedDevice />
    }

    if (!activeTab) {
        return (
            <div className="custom-scrollbar relative flex h-dvh flex-col overflow-hidden border-x border-default">
                <Header />
                <Toaster position="top-center" reverseOrder={true} />
                <div className="flex h-full flex-row overflow-hidden">
                    <div>
                        <Sidebar />
                    </div>
                    <div className="h-full flex-1 bg-[#FFFFFF] dark:bg-[#1E1E2A]">
                        {children}
                    </div>
                </div>
                <div className="sticky h-12 border-y border-default" />
            </div>
        )
    }

    return (
        <div className="custom-scrollbar relative flex h-dvh flex-col overflow-hidden border-x border-default">
            <Header />
            <Toaster position="top-center" reverseOrder={true} />
            <div className="flex h-full flex-row overflow-hidden">
                <div
                    className={cn({
                        hidden: !isOpen.sidebar,
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
                            'bg-default': !isOpen.sidebar,
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
