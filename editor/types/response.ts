export type ErrorResponse = {
    message: string
}

export type CodeFileRequest = {
    language: string
    files: Array<{
        name: string
        content: string
    }>
}

export type CodeRequest = {
    image: string
    payload: CodeFileRequest
}

export type CodeResponse = {
    error: string
    stderr: string
    stdout: string
}
