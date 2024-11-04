import { useEffect, useRef, useState } from "react";

import { addActivityListeners, removeActivityListeners } from "./utils";

export default function useIdleTracker(timeout: number) {
    const [isIdle, setIsIdle] = useState(false);

    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const resetTimeout = () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
                setIsIdle(true);
            }, timeout);
        };

        const handleActivity = () => {
            setIsIdle(false);
            resetTimeout();
        };

        addActivityListeners(handleActivity);

        resetTimeout();

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            removeActivityListeners(handleActivity);
        };
    }, [timeout]);

    return isIdle;
}
