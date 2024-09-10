import { MetadataRoute } from 'next'

import siteConfig from '@/config/site'

const robots = (): MetadataRoute.Robots => {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/api/',
        },
        sitemap: `${siteConfig.siteUrl}/sitemap.xml`,
    }
}

export default robots
