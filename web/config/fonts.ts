import { JetBrains_Mono, Mukta } from "next/font/google";

export const mukta = Mukta({
    weight: ["200", "300", "400", "500", "600", "700", "800"],
    display: "swap",
    subsets: ["latin"],
    preload: true,
    variable: "--font-mukta",
});

export const jetbrainsMono = JetBrains_Mono({
    weight: ["200", "300", "400", "500", "600", "700", "800"],
    display: "swap",
    subsets: ["latin"],
    preload: true,
    variable: "--font-jetbrains-mono",
});
