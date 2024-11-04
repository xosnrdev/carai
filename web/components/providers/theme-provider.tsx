"use client";

import { NextUIProvider } from "@nextui-org/system";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useRouter } from "next/navigation";

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();

    return (
        <NextUIProvider navigate={router.push}>
            <NextThemesProvider
                disableTransitionOnChange
                enableSystem
                attribute="class"
                defaultTheme="system"
                storageKey="theme"
            >
                {children}
            </NextThemesProvider>
        </NextUIProvider>
    );
};

export default ThemeProvider;
