import { useEffect, useRef, useState } from "react";

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

function addActivityListeners(handler: () => void) {
    window.addEventListener("mousemove", handler);
    window.addEventListener("click", handler);
    window.addEventListener("keypress", handler);
}

function removeActivityListeners(handler: () => void) {
    window.removeEventListener("mousemove", handler);
    window.removeEventListener("click", handler);
    window.removeEventListener("keypress", handler);
}
