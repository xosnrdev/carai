import type { MetadataRoute } from 'next'

import siteConfig from '@/config/site'

export default function manifest(): MetadataRoute.Manifest {
    return {
        categories: siteConfig.categories,
        description: siteConfig.description,
        display: 'standalone',
        icons: [
            {
                src: '/android-chrome-192x192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/android-chrome-512x512.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
        lang: 'en',
        name: siteConfig.title,
        orientation: 'portrait-primary',
        scope: '/',
        short_name: siteConfig.name,
        start_url: '/',
    }
}
