import { useEffect, useState } from "react";

import { debounce } from "@/src/lib/utils";

const SUPPORTED_DEVICE_WIDTH = 768;
const WINDOW_DEBOUNCE_DELAY = 1000;

export default function useDevice() {
    const [isSupported, setIsSupported] = useState(true);

    useEffect(() => {
        if (typeof window === "undefined") {
            setIsSupported(false);

            return;
        }

        const handleDeviceCheck = () => {
            const deviceWidth = window.innerWidth;

            const supportedDeviceWidth = deviceWidth >= SUPPORTED_DEVICE_WIDTH;

            const userAgent = navigator.userAgent.toLowerCase();
            const isMobileDevice =
                /iphone|ipod|android.*mobile|blackberry|mini|windows\sce|palm/i.test(userAgent);

            const supportedDevice = supportedDeviceWidth && !isMobileDevice;

            setIsSupported(supportedDevice);
        };

        handleDeviceCheck();

        const debouceDeviceCheck = debounce(handleDeviceCheck, WINDOW_DEBOUNCE_DELAY);

        window.addEventListener("resize", debouceDeviceCheck, true);
        window.addEventListener("load", handleDeviceCheck, true);

        return () => {
            window.removeEventListener("resize", debouceDeviceCheck, true);
            window.removeEventListener("load", handleDeviceCheck, true);
        };
    }, []);

    return isSupported;
}
