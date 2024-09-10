'use client'

import type { ReactNode } from 'react'

import { Toaster } from 'react-hot-toast'

import useDevice from '@/hooks/useDevice'

import UnsupportedDevice from '../ui/unsupported-device'
import Footer from '../ui/footer/ui'
import Header from '../ui/header/ui'
import Sidebar from '../ui/sidebar/ui'

export default function EditorLayout({ children }: { children: ReactNode }) {
    const isSupportedDevice = useDevice()

    if (!isSupportedDevice) {
        return <UnsupportedDevice />
    }

    return (
        <div className="flex min-h-dvh flex-col overflow-hidden border-x border-default">
            <Header />
            <Toaster reverseOrder position="top-center" />
            <main className="flex flex-grow flex-row overflow-hidden">
                <Sidebar />
                <div className="flex-1 bg-[#FFFFFF] dark:bg-[#1E1E2A]">
                    {children}
                </div>
            </main>
            <Footer />
        </div>
    )
}
