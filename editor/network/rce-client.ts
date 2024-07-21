import type {
    CodeOutput,
    CodeRequest,
    CodeResponse,
    CodeResponseFormatter,
    ErrorResponse,
    RuntimeResponse,
} from '../types/response'

import {
    InternalServerError,
    MissingParameterError,
    RuntimeNotFoundError,
} from '../lib/error'

export class RCEHandler {
    private readonly baseURL: URL

    constructor() {
        this.baseURL = new URL('https://cexaengine.com')
    }

    public async listRuntimes(
        abortSignal?: AbortSignal
    ): Promise<RuntimeResponse> {
        const response = await fetch(
            new URL('/api/list-runtimes', this.baseURL).toString(),
            {
                signal: abortSignal,
                headers: {
                    Accept: 'application/json',
                },
                method: 'GET',
            }
        )

        if (response.status !== 200) {
            await this.processError(response)
        }

        const body = (await response.json()) as RuntimeResponse

        return { runtime: body.runtime }
    }

    public async execute(
        codeRequest: CodeRequest,
        abortSignal?: AbortSignal
    ): Promise<CodeResponse> {
        const response = await fetch(
            new URL('/api/execute', this.baseURL).toString(),
            {
                signal: abortSignal,
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(codeRequest),
                method: 'POST',
            }
        )

        if (response.status !== 200) {
            await this.processError(response)
        }

        const body = (await response.json()) as CodeResponse

        return {
            language: body.language,
            version: body.version,
            runtime: body.runtime,
            compile: body.compile,
        }
    }

    private async processError(response: Response): Promise<void> {
        switch (response.status) {
            case 404:
                throw new Error('api path not found')
            case 500: {
                const body = (await response.json()) as ErrorResponse

                throw new InternalServerError(body.message)
            }

            case 400: {
                const body = (await response.json()) as ErrorResponse

                if (body?.message === 'Runtime not found')
                    throw new RuntimeNotFoundError()
                if (body?.message.startsWith('Missing parameters'))
                    throw new MissingParameterError(body.message)
                throw new Error(
                    `${body.message} (this is probably a problem with the SDK, please submit an issue on our Github repository)`
                )
            }
        }

        const body = await response.text()

        throw new Error(
            `Received ${response.status} with body ${body} (this is probably a problem with the SDK, please submit an issue on our Github repository)`
        )
    }
}

export class RCEFormatter implements CodeResponseFormatter {
    private readonly codeResponse: CodeResponse

    constructor(codeResponse: CodeResponse) {
        this.codeResponse = codeResponse
    }

    private trimProperty(
        obj: Pick<CodeOutput, 'stderr' | 'output'>,
        property: keyof typeof obj
    ) {
        return obj ? obj[property].trim() : ''
    }

    public format() {
        const hasCompileError = this.trimProperty(
                this.codeResponse?.compile,
                'stderr'
            ),
            hasRuntimeError = this.trimProperty(
                this.codeResponse?.runtime,
                'stderr'
            ),
            compileOutput = this.trimProperty(
                this.codeResponse?.compile,
                'output'
            ),
            runtimeOutput = this.trimProperty(
                this.codeResponse?.runtime,
                'output'
            ),
            combinedOutput = [compileOutput, runtimeOutput]
                .filter(Boolean)
                .join('\n'),
            combinedError = [hasCompileError, hasRuntimeError]
                .filter(Boolean)
                .join('\n'),
            displayOutput = combinedOutput || 'no response.'

        return { combinedOutput, combinedError, displayOutput }
    }
}
