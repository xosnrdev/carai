export class MissingParameterError extends Error {
    constructor(public override message: string) {
        super(message)
    }
}

export class InternalServerError extends Error {
    constructor(public override message: string) {
        super(message)
    }
}

export class RuntimeNotFoundError extends Error {
    constructor(language?: string, version?: string) {
        const combination: string =
            language !== undefined && version !== undefined
                ? ` of ${language} and ${version}`
                : ''

        super(
            `Provided language-version combination${combination} does not exists on the RCE engine`
        )
    }
}

export class TabError extends Error {
    constructor(public override message: string) {
        super(message)
    }
}
