import { Ratelimit } from '@upstash/ratelimit'
import { kv } from '@vercel/kv'
import { type NextRequest, NextResponse, userAgent } from 'next/server'

import { RequestValidator } from './(sandbox)/core'

const ratelimit = new Ratelimit({
    redis: kv,
    limiter: Ratelimit.slidingWindow(5, '10 s'),
})

export const config = {
    matcher: '/',
}

export default async function middleware(request: NextRequest) {
    const requestValidator = new RequestValidator(request)
    const isRequestAllowed = requestValidator.isAllowed()
    const { device } = userAgent(request)
    const ip = new RequestValidator(request).requestIp

    if (!isRequestAllowed || !device.type || device.type === 'mobile') {
        return NextResponse.json('Forbidden', { status: 403 })
    }

    const { success } = await ratelimit.limit(ip)

    return success
        ? NextResponse.next()
        : NextResponse.json({ message: 'Too many requests' }, { status: 429 })
}
