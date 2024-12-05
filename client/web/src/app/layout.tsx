import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import siteConfig from "@/src/common/site";
import ReduxProvider from "@/src/layout/redux_provider";
import ThemeProvider from "@/src/layout/theme_provider";
import "@/styles/global.css";
import { JetBrains_Mono, Mukta } from "next/font/google";

const mukta = Mukta({
    weight: ["200", "300", "400", "500", "600", "700", "800"],
    display: "swap",
    subsets: ["latin"],
    preload: true,
    variable: "--font-mukta",
});

const jetbrainsMono = JetBrains_Mono({
    weight: ["200", "300", "400", "500", "600", "700", "800"],
    display: "swap",
    subsets: ["latin"],
    preload: true,
    variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
    metadataBase: new URL(siteConfig.siteUrl),
    title: {
        default: siteConfig.title,
        template: `%s | ${siteConfig.name}`,
    },
    icons: [
        {
            rel: "icon",
            url: "/favicon-32x32.svg",
            type: "image/svg+xml",
        },
        { rel: "icon", url: "/favicon.ico", sizes: "32x32" },
        {
            rel: "apple-touch-icon",
            url: "/apple-touch-icon.png",
        },
    ],
    referrer: "origin",
    description: siteConfig.description,
    alternates: { canonical: siteConfig.siteUrl },
};

export const viewport: Viewport = {
    maximumScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html suppressHydrationWarning lang="en">
            <body className={`${mukta.variable} ${jetbrainsMono.variable}`}>
                <ThemeProvider>
                    <ReduxProvider>{children}</ReduxProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
