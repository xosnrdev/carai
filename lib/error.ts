export class MissingParameterError extends Error {
    constructor(public override message: string) {
        super(message)
    }
}

export class CustomError extends Error {
    constructor(public override message: string) {
        super(message)
    }
}
