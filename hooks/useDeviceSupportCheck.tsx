import { useCallback, useEffect, useState } from 'react'

const SUPPORTED_DEVICE_WIDTH = 768
const WINDOW_DEBOUNCE_DELAY = 1000

const debounce = (func: () => void, delay: number) => {
    let timeoutId: NodeJS.Timeout

    return () => {
        if (timeoutId) clearTimeout(timeoutId)
        timeoutId = setTimeout(() => func(), delay)
    }
}

const useDeviceSupportCheck = () => {
    const [isSupported, setIsSupported] = useState(true)

    const checkScreenSize = useCallback(() => {
        const deviceWidth = window.innerWidth

        const supportedDevice = deviceWidth >= SUPPORTED_DEVICE_WIDTH

        setIsSupported(supportedDevice)
    }, [])

    useEffect(() => {
        if (typeof window === 'undefined') {
            setIsSupported(false)

            return
        }

        checkScreenSize()

        const debouncedCheckScreenSize = debounce(
            checkScreenSize,
            WINDOW_DEBOUNCE_DELAY
        )

        window.addEventListener('resize', debouncedCheckScreenSize, true)
        window.addEventListener('load', checkScreenSize, true)

        return () => {
            window.removeEventListener('resize', debouncedCheckScreenSize, true)
            window.removeEventListener('load', checkScreenSize, true)
        }
    }, [checkScreenSize])

    return isSupported
}

export default useDeviceSupportCheck
