import { type NextRequest, NextResponse } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { kv } from '@vercel/kv'

import { RequestValidator } from './lib'

const ratelimit = new Ratelimit({
    redis: kv,
    limiter: Ratelimit.slidingWindow(5, '10 s'),
})

export const config = {
    matcher: '/*',
}

export default async function middleware(request: NextRequest) {
    const ip = new RequestValidator(request).requestIp
    const { success, limit, reset, remaining } = await ratelimit.limit(ip)

    const headers = {
        'X-RateLimit-Limit': limit.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': reset.toString(),
    }

    return success
        ? NextResponse.next({
              status: 200,
              headers,
          })
        : NextResponse.json({ message: 'Rate limit exceeded' }, { status: 429 })
}
