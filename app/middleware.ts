import { type NextRequest, NextResponse } from 'next/server'
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

    return success
        ? NextResponse.next()
        : NextResponse.json(
              { success: false, message: 'Rate limit exceeded' },
              { status: 429 }
          )
}
