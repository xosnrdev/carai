"use client";

import type { ReactNode } from "react";

import { Toaster } from "react-hot-toast";

import useDevice from "@/src/hooks/useDevice";

import Header from "../components/header";
import UnsupportedDevice from "../view/unsupported_device";
import Footer from "./footer";
import Sidebar from "./sidebar";

export default function EditorLayout({ children }: { children: ReactNode }) {
    const isSupportedDevice = useDevice();

    if (!isSupportedDevice) {
        return <UnsupportedDevice />;
    }

    return (
        <div className="relative flex min-h-dvh flex-col overflow-hidden border-x border-default">
            <Header />
            <Toaster reverseOrder position="top-center" />
            <main className="flex flex-grow flex-row overflow-hidden">
                <Sidebar />
                <div className="relative flex-1 bg-[#FFFFFF] dark:bg-[#1E1E2A]">{children}</div>
            </main>
            <Footer />
        </div>
    );
}
