import { useState } from "react";

import { isNonEmptyString } from "@/src/lib/utils";
import handleCodeExecution from "../lib/rce_action";
import type { CodeResponse } from "../redux/tab_slice";

export default function useCodeRunner() {
    const [codeResponse, setCodeResponse] = useState<(CodeResponse & { time?: string }) | null>(
        null,
    );
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const run = async ({
        languageName,
        content,
        filename,
    }: {
        languageName: string;
        content: string;
        filename: string;
    }) => {
        if (isRunning || !isNonEmptyString(content)) {
            return;
        }
        setIsRunning(true);
        setError(null);

        try {
            const response = await handleCodeExecution({
                languageName,
                content,
                filename,
            });

            setCodeResponse({
                stdout: response.stdout,
                stderr: response.stderr,
                error: response.error,
                time: response.time?.toFixed(2) ?? "",
            });
        } catch (_) {
            setError("Something went wrong, please try again.");
            setCodeResponse(null);
        } finally {
            setIsRunning(false);
        }
    };

    return { codeResponse, isRunning, error, run };
}
