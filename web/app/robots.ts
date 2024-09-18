import type { MetadataRoute } from 'next'

export default {
    rules: {
        userAgent: '*',
        allow: '/',
    },
} satisfies MetadataRoute.Robots
