import { MetadataRoute } from 'next'

import siteConfig from '@/config/site'

const sitemap = (): MetadataRoute.Sitemap => {
    return [
        {
            url: siteConfig.siteUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1.0,
        },
    ]
}

export default sitemap
