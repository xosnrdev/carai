import type { CodeResponse } from '@/app/(sandbox)/types'

import { useState } from 'react'

import handleCodeExecution from '@/app/(sandbox)/action'

export default function useCodeRunner() {
    const [codeResponse, setCodeResponse] = useState<
        (CodeResponse & { time?: string }) | null
    >(null)
    const [isRunning, setIsRunning] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const run = async ({
        languageName,
        content,
        filename,
    }: {
        languageName: string
        content: string
        filename: string
    }) => {
        setIsRunning(true)
        setError(null)

        try {
            const response = await handleCodeExecution({
                languageName,
                content,
                filename,
            })

            setCodeResponse({
                stdout: response.stdout,
                stderr: response.stderr,
                error: response.error,
                time: response.time?.toFixed(2),
            })
        } catch (err) {
            setError('Something went wrong, please try again.')
            setCodeResponse(null)
        } finally {
            setIsRunning(false)
        }
    }

    return { codeResponse, isRunning, error, run }
}
