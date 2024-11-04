import * as Sentry from "@sentry/nextjs";
import { useEffect, useState } from "react";

import { CustomError } from "@/lib/error";

export default function useCopyToClipboard(duration = 2000) {
    const [isCopied, setIsCopied] = useState(false);

    useEffect(() => {
        let timeoutId: NodeJS.Timeout | null = null;

        if (!isCopied) {
            return;
        }

        timeoutId = setTimeout(() => {
            setIsCopied(false);
        }, duration);

        return () => {
            if (!timeoutId) {
                return;
            }

            clearTimeout(timeoutId);
        };
    }, [isCopied, duration]);

    const handleCopyToClipboard = async (
        value: string,
    ): Promise<{
        success: boolean;
        error?: CustomError;
    }> => {
        if (!value) {
            return {
                success: false,
                error: new CustomError("No value to copy"),
            };
        }

        if (!navigator.clipboard) {
            return {
                success: false,
                error: new CustomError("Clipboard API not available"),
            };
        }

        try {
            await navigator.clipboard.writeText(value);
            setIsCopied(true);

            return { success: true };
        } catch (error) {
            Sentry.captureException(error);

            return {
                success: false,
            };
        }
    };

    const reset = () => setIsCopied(false);

    return { isCopied, handleCopyToClipboard, reset };
}
