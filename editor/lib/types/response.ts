export type Runtime = Readonly<{
	language: string
	version: string
	aliases: string[]
	compiled: boolean
}>

export type RuntimeResponse = Readonly<{
	runtime: Runtime[]
}>

export type ErrorResponse = Readonly<{
	message: string
}>

export type CodeRequestBase = Readonly<{
	language: string
	version: string
	compileTimeout?: number
	runTimeout?: number
	memoryLimit?: number
}>

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

export type CodeOutput = Readonly<{
	stdout: string
	stderr: string
	output: string
	exitCode: number
}>

export type CodeResponse = Readonly<{
	language: string
	version: string
	compile: CodeOutput
	runtime: CodeOutput
}>

export type CodeResponseFormatter = Readonly<{
	format(): {
		combinedOutput: string
		combinedError: string
		displayOutput: string
	} | null
}>
