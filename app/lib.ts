import type { NextRequest } from 'next/server'

import { CustomError } from '@/lib/error'

export { EnvVarsParser, RceEngine, RequestValidator }

interface EnvVars {
    baseUrl: string
    accessToken: string
}

class RceEngine {
    private readonly baseUrl: URL

    constructor(env: EnvVars) {
        this.baseUrl = new URL(env.baseUrl)
    }

    public healthCheck(): Promise<Response> {
        return fetch(this.baseUrl, {
            method: 'GET',
        })
    }

    public run(accessToken: string, body: ReadableStream): Promise<Response> {
        return fetch(`${this.baseUrl}/run`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Token': accessToken,
            },
            body,
        })
    }
}

class RequestValidator {
    private static readonly ALLOWED_HOSTNAMES: ReadonlySet<string> = new Set([
        'codespacex.com',
        'carai.pages.dev',
        'localhost',
    ])

    constructor(private readonly request: NextRequest) {}

    public isAllowed(): boolean {
        return (
            this.hasAllowedOrigin() &&
            this.hasAllowedReferer() &&
            this.supportsBrotli()
        )
    }

    public get requestIp(): string {
        return this.request.ip ?? '127.0.0.1'
    }

    public static get allowedHostnames(): ReadonlySet<string> {
        return new Set(RequestValidator.ALLOWED_HOSTNAMES)
    }

    private get origin(): string {
        return this.request.headers.get('Origin') ?? ''
    }

    private get referer(): string {
        return this.request.headers.get('Referer') ?? ''
    }

    public get isSecure(): boolean {
        return this.origin.startsWith('https://')
    }

    private get encoding(): string {
        return this.request.headers.get('Accept-Encoding') ?? ''
    }

    private hasAllowedOrigin(): boolean {
        return this.origin
            ? RequestValidator.hasAllowedHostname(this.origin)
            : false
    }

    private hasAllowedReferer(): boolean {
        return this.referer
            ? RequestValidator.hasAllowedHostname(this.referer)
            : false
    }

    private static hasAllowedHostname(host: string): boolean {
        try {
            const url = new URL(host)

            return RequestValidator.ALLOWED_HOSTNAMES.has(url.hostname)
        } catch (e) {
            console.error(`Invalid URL: ${host}`, e)

            return false
        }
    }

    private supportsBrotli(): boolean {
        if (!this.encoding) return false
        const encodings = this.encoding.split(', ')

        return (
            encodings.includes('br') ||
            encodings.some((enc) => enc.startsWith('br;'))
        )
    }
}

class EnvParser {
    constructor(protected readonly env: EnvVars) {}
    protected getString(field: keyof EnvVars): string {
        if (!(field in this.env) || this.env[field] === '') {
            throw new CustomError(`Missing env var ${field}`)
        }

        return this.env[field]
    }

    protected getNumber(field: keyof EnvVars): number {
        const value = this.getString(field)
        const n = parseInt(value, 10)

        if (isNaN(n)) {
            throw new CustomError(`Invalid number for env var ${field}`)
        }

        return n
    }
}

class EnvVarsParser extends EnvParser {
    private get baseUrl(): string {
        return this.getString('baseUrl')
    }

    private get accessToken(): string {
        return this.getString('accessToken')
    }

    public parse(): EnvVars {
        return {
            baseUrl: this.baseUrl,
            accessToken: this.accessToken,
        }
    }
}
