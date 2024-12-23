import type { MetadataRoute } from "next";

import siteConfig from "@/src/common/site";

export default function manifest(): MetadataRoute.Manifest {
    return {
        id: "phantom-architect-authenticate-chest",
        description: siteConfig.description,
        display: "standalone",
        icons: [
            {
                src: "/android-chrome-192x192.png",
                sizes: "192x192",
                type: "image/png",
            },
            {
                src: "/android-chrome-512x512.png",
                sizes: "512x512",
                type: "image/png",
            },
        ],
        name: siteConfig.name,
        short_name: siteConfig.name,
        scope: "/",
        start_url: "/",
    };
}
