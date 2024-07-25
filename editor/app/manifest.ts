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
                src: '/apple-touch-icon.png',
                sizes: '180x180',
                type: 'image/png',
            },
            {
                src: '/android-chrome-512x512.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
        lang: 'en',
        name: siteConfig.name,
        orientation: 'portrait-primary',
        scope: '/',
        start_url: '/',
        id: '_carai_pwa_manifest_id',
    }
}
