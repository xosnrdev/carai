import * as Sentry from '@sentry/nextjs'
import { NextResponse, type NextRequest } from 'next/server'

import { EnvVarsParser, RceEngine, RequestValidator } from '@/app/lib'

export const runtime = 'edge'

export async function POST(request: NextRequest) {
    const { env } = process

    if (!env.RCE_ENGINE_BASE_URL || !env.RCE_ENGINE_ACCESS_TOKEN) {
        return NextResponse.json({ error: 'Missing env var' }, { status: 404 })
    }

    const envVars = new EnvVarsParser({
        baseUrl: env.RCE_ENGINE_BASE_URL,
        accessToken: env.RCE_ENGINE_ACCESS_TOKEN,
    }).parse()

    const requestValidator = new RequestValidator(request)
    const isRequestAllowed = requestValidator.isAllowed()

    const requestBody = request.clone().body

    if (!isRequestAllowed || !requestBody) {
        return NextResponse.json(
            { error: isRequestAllowed ? 'Bad request' : 'Forbidden' },
            { status: isRequestAllowed ? 400 : 403 }
        )
    }

    try {
        const engine = new RceEngine(envVars)
        const runResponse = await engine.run(envVars.accessToken, requestBody)

        return runResponse
    } catch (e) {
        Sentry.captureException(e)

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function GET(request: NextRequest) {
    return NextResponse.redirect(new URL('/', request.url))
}
