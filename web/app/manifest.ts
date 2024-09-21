import type { MetadataRoute } from 'next'

import siteConfig from '@/config/site'

export default function manifest(): MetadataRoute.Manifest {
    return {
        id: 'phantom-architect-authenticate-chest',
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
        name: siteConfig.name,
        short_name: siteConfig.name,
        scope: '/',
        start_url: '/',
        theme_color: '#2f2f3b',
        background_color: '#2f2f3b',
    }
}
