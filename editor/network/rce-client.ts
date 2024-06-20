import {
	InternalServerError,
	MissingParameterError,
	RuntimeNotFoundError,
} from '../lib/types/error'
import type {
	CodeOutput,
	CodeRequest,
	CodeResponse,
	CodeResponseFormatter,
	ErrorResponse,
} from '../lib/types/response'

export class RCEHandler {
	private readonly baseURL: URL

	constructor() {
		this.baseURL = new URL('https://cexaengine.com')
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
	): string {
		return obj[property].trim()
	}

	public format() {
		if (!this.codeResponse) return null
		const hasCompileError = this.trimProperty(
			this.codeResponse.compile,
			'stderr'
		)
		const hasRuntimeError = this.trimProperty(
			this.codeResponse.runtime,
			'stderr'
		)
		const compileOutput = this.trimProperty(this.codeResponse.compile, 'output')
		const runtimeOutput = this.trimProperty(this.codeResponse.runtime, 'output')

		const combinedOutput = [compileOutput, runtimeOutput]
			.filter(Boolean)
			.join('\n')
		const combinedError = [hasCompileError, hasRuntimeError]
			.filter(Boolean)
			.join('\n')

		const displayOutput = combinedOutput || 'No response!'

		return { combinedOutput, combinedError, displayOutput }
	}
}
