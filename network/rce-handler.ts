import type {
    CodeRequest,
    CodeResponse,
    ErrorResponse,
} from '../types/response'

import * as Sentry from '@sentry/nextjs'

import { CustomError } from '../lib/error'

export class RCEHandler {
    public async execute(
        codeRequest: CodeRequest,
        abortSignal?: AbortSignal
    ): Promise<CodeResponse> {
        const response = await fetch('/api/rce-engine/run', {
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
