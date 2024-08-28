import { MetadataRoute } from 'next'

import siteConfig from '@/config/site'

const robots = (): MetadataRoute.Robots => {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/api/',
        },
        sitemap: `${siteConfig.links.url}/sitemap.xml`,
    }
}

export default robots
