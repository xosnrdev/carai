export class CustomError extends Error {
    constructor(public override message: string) {
        super(message)
    }
}
