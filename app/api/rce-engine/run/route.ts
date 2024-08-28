import { NextResponse, type NextRequest } from 'next/server'
import * as Sentry from '@sentry/nextjs'

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

    if (!isRequestAllowed) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    if (!requestBody) {
        return NextResponse.json({ error: 'Bad request' }, { status: 400 })
    }

    try {
        const run = await new RceEngine(envVars).run(
            envVars.accessToken,
            requestBody
        )

        const runResponse = await run.text()

        return new NextResponse(runResponse, { status: run.status })
    } catch (e) {
        Sentry.captureException(e)

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
