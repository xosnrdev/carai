import "server-only";

import * as Sentry from "@sentry/nextjs";

import { CustomError } from "@/src/lib/error";
import type { CodeResponse } from "../redux/tab_slice";

class EnvConfigValidator {
    constructor(protected readonly env: EnvConfig) {}

    protected getString(field: keyof EnvConfig): string {
        if (!(field in this.env) || this.env[field] === "") {
            throw new CustomError(`Missing env var ${field}`);
        }

        return this.env[field];
    }

    protected getNumber(field: keyof EnvConfig): number {
        const value = this.getString(field);
        const n = Number.parseInt(value, 10);

        if (Number.isNaN(n)) {
            throw new CustomError(`Invalid number for env var ${field}`);
        }

        return n;
    }
}

export class EnvConfigParser extends EnvConfigValidator {
    private get baseUrl(): string {
        return this.getString("baseUrl");
    }

    private get accessToken(): string {
        return this.getString("accessToken");
    }

    public parse(): EnvConfig {
        return {
            baseUrl: this.baseUrl,
            accessToken: this.accessToken,
        };
    }
}

export class RequestValidator {
    private static readonly ALLOWED_HOSTNAMES: ReadonlySet<string> = new Set([
        "www.codespacex.com",
        "codespacex.com",
        "carai-eight.vercel.app",
        "localhost",
    ]);

    constructor(private readonly request: Request) {}

    public static get allowedHostnames(): ReadonlySet<string> {
        return new Set(RequestValidator.ALLOWED_HOSTNAMES);
    }

    public get requestIp(): string {
        return this.request.headers.get("CF-Connecting-IP") ?? "127.0.0.1";
    }

    public get isSecure(): boolean {
        return this.origin.startsWith("https://");
    }

    private get origin(): string {
        return this.request.headers.get("Origin") ?? "";
    }

    private get referer(): string {
        return this.request.headers.get("Referer") ?? "";
    }

    private get encoding(): string {
        return this.request.headers.get("Accept-Encoding") ?? "";
    }

    private static hasAllowedHostname(host: string): boolean {
        try {
            const url = new URL(host);

            return RequestValidator.ALLOWED_HOSTNAMES.has(url.hostname);
        } catch (_) {
            return false;
        }
    }

    public isAllowed(): boolean {
        return this.hasAllowedOrigin() && this.hasAllowedReferer() && this.supportsBrotli();
    }

    private hasAllowedOrigin(): boolean {
        return this.origin ? RequestValidator.hasAllowedHostname(this.origin) : false;
    }

    private hasAllowedReferer(): boolean {
        return this.referer ? RequestValidator.hasAllowedHostname(this.referer) : false;
    }

    private supportsBrotli(): boolean {
        if (!this.encoding) {
            return false;
        }
        const encodings = this.encoding.split(", ");

        return encodings.includes("br") || encodings.some((enc) => enc.startsWith("br;"));
    }
}

export class RCEHandler {
    public async execute(
        codeRequest: CodeRequest,
        abortSignal?: AbortSignal,
    ): Promise<CodeResponse> {
        const { env } = process;

        if (!env.RCE_BASE_URL || !env.RCE_ACCESS_TOKEN) {
            throw new CustomError("Missing env vars");
        }

        const envConfig = new EnvConfigParser({
            baseUrl: env.RCE_BASE_URL,
            accessToken: env.RCE_ACCESS_TOKEN,
        }).parse();

        const response = await fetch(envConfig.baseUrl, {
            signal: abortSignal ?? null,
            headers: {
                "Content-Type": "application/json",
                "X-Access-Token": envConfig.accessToken,
            },
            body: JSON.stringify(codeRequest),
            method: "POST",
        });

        if (response.status !== 200) {
            await this.processError(response);
        }

        const body = (await response.json()) as CodeResponse;

        return {
            error: body.error,
            stderr: body.stderr,
            stdout: body.stdout,
        };
    }

    private async processError(response: Response): Promise<void> {
        switch (response.status) {
            case 404:
                throw new CustomError("URI not found");

            case 500: {
                const body = (await response.json()) as ErrorResponse;

                throw new CustomError(body.message);
            }

            case 400: {
                const body = (await response.json()) as ErrorResponse;

                throw new CustomError(body.message);
            }

            case 401: {
                const body = (await response.json()) as ErrorResponse;

                throw new CustomError(body.message);
            }
        }

        const body = await response.text();

        Sentry.captureException(
            new CustomError(`Received ${response.status} with body
            ${body}`),
        );
    }
}

type ErrorResponse = {
    message: string;
};

type CodeFileRequest = {
    language: string;
    files: Array<{
        name: string;
        content: string;
    }>;
};

type CodeRequest = {
    image: string;
    payload: CodeFileRequest;
};

type EnvConfig = {
    baseUrl: string;
    accessToken: string;
};
