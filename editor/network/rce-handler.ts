import type {
    CodeRequest,
    CodeResponse,
    ErrorResponse,
} from '../types/response'

import * as Sentry from '@sentry/nextjs'

import { CustomError } from '../lib/error'

const BASE_URL = process.env.NEXT_PUBLIC_RCE_ENGINE_API_URL as string

export class RCEHandler {
    private readonly baseURL: URL

    constructor() {
        this.baseURL = new URL(BASE_URL)
    }

    public async healthz(abortSignal?: AbortSignal): Promise<number> {
        const response = await fetch(new URL('/', this.baseURL).toString(), {
            signal: abortSignal,
            method: 'GET',
        })

        if (response.status !== 200) {
            await this.processError(response)
        }

        return response.status
    }

    public async execute(
        codeRequest: CodeRequest,
        abortSignal?: AbortSignal
    ): Promise<CodeResponse> {
        const response = await fetch(new URL('/run', this.baseURL).toString(), {
            signal: abortSignal,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(codeRequest),
            method: 'POST',
        })

        if (response.status !== 200) {
            await this.processError(response)
        }

        const body = (await response.json()) as CodeResponse

        return {
            error: body.error,
            stderr: body.stderr,
            stdout: body.stdout,
        }
    }

    private async processError(response: Response): Promise<void> {
        switch (response.status) {
            case 404:
                throw new CustomError('URI not found')

            case 500: {
                const body = (await response.json()) as ErrorResponse

                throw new CustomError(body.message)
            }

            case 400: {
                const body = (await response.json()) as ErrorResponse

                throw new CustomError(body.message)
            }

            case 401: {
                const body = (await response.json()) as ErrorResponse

                throw new CustomError(body.message)
            }
        }

        const body = await response.text()

        Sentry.captureException(
            new CustomError(`Received ${response.status} with body
            ${body}`)
        )
    }
}
