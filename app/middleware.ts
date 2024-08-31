import { type NextRequest, NextResponse, userAgent } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { kv } from '@vercel/kv'

import { RequestValidator } from './lib'

const ratelimit = new Ratelimit({
    redis: kv,
    limiter: Ratelimit.slidingWindow(5, '10 s'),
})

export const config = {
    matcher: '/',
}

export default async function middleware(request: NextRequest) {
    const ip = new RequestValidator(request).requestIp
    const { success } = await ratelimit.limit(ip)
    const { device } = userAgent(request)

    if (device.type === 'mobile' || device.type === undefined) {
        return NextResponse.json(
            { success: false, message: 'Device not supported' },
            { status: 403 }
        )
    }

    return success
        ? NextResponse.next()
        : NextResponse.json(
              { success: false, message: 'Rate limit exceeded' },
              { status: 429 }
          )
}
