import { useEffect, useRef } from "react";

type KeyPressCallback = (event: KeyboardEvent) => void;

interface UseKeyPressOptions {
    targetKey: string;
    callback: KeyPressCallback;
    modifier?: (keyof KeyboardEvent)[];
}

const useKeyPress = ({ targetKey, callback, modifier }: UseKeyPressOptions) => {
    const callbackRef = useRef(callback);

    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            const isModifierPressed = modifier ? modifier.every((mod) => e[mod]) : true;

            if (isModifierPressed && e.key.toLowerCase() === targetKey.toLowerCase()) {
                e.preventDefault();
                e.stopPropagation();
                callbackRef.current(e);
            }
        };

        window.addEventListener("keydown", handleKeyPress, true);

        return () => {
            window.removeEventListener("keydown", handleKeyPress, true);
        };
    }, [targetKey, modifier]);
};

export default useKeyPress;
