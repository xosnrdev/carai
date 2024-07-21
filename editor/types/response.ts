export type Runtime = {
    language: string
    version: string
    aliases: string[]
    compiled: boolean
}

export type RuntimeResponse = {
    runtime: Runtime[]
}

export type ErrorResponse = {
    message: string
}

export type CodeRequestBase = {
    language: string
    version: string
    compileTimeout?: number
    runTimeout?: number
    memoryLimit?: number
}

export type CodeSnippetRequest = CodeRequestBase & {
    code: string
}

export type CodeFileRequest = CodeRequestBase & {
    files: Array<{
        name: string
        code: string
        entrypoint: boolean
    }>
}

export type CodeRequest = CodeSnippetRequest | CodeFileRequest

export type CodeOutput = {
    stdout: string
    stderr: string
    output: string
    exitCode: number
}

export type CodeResponse = {
    language: string
    version: string
    compile: CodeOutput
    runtime: CodeOutput
}

export type CodeResponseFormatter = {
    format(): {
        combinedOutput: string
        combinedError: string
        displayOutput: string
    }
}
