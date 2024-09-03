import type { IconSvgProps } from '@/types'

export {
    MoonFilledIcon,
    SunFilledIcon,
    ComputerFilledIcon,
    SplashScreen,
    NotificationIcon,
}

const MoonFilledIcon = ({
    size = 24,
    width,
    height,
    ...props
}: IconSvgProps) => (
    <svg
        aria-hidden="true"
        className="text-primary"
        focusable="false"
        height={size || height}
        role="presentation"
        viewBox="0 0 24 24"
        width={size || width}
        {...props}
    >
        <path
            d="M21.53 15.93c-.16-.27-.61-.69-1.73-.49a8.46 8.46 0 01-1.88.13 8.409 8.409 0 01-5.91-2.82 8.068 8.068 0 01-1.44-8.66c.44-1.01.13-1.54-.09-1.76s-.77-.55-1.83-.11a10.318 10.318 0 00-6.32 10.21 10.475 10.475 0 007.04 8.99 10 10 0 002.89.55c.16.01.32.02.48.02a10.5 10.5 0 008.47-4.27c.67-.93.49-1.519.32-1.79z"
            fill="currentColor"
        />
    </svg>
)

const SunFilledIcon = ({
    size = 24,
    width,
    height,
    ...props
}: IconSvgProps) => (
    <svg
        aria-hidden="true"
        className="text-default-foreground"
        focusable="false"
        height={size || height}
        role="presentation"
        viewBox="0 0 24 24"
        width={size || width}
        {...props}
    >
        <g fill="currentColor">
            <path d="M19 12a7 7 0 11-7-7 7 7 0 017 7z" />
            <path d="M12 22.96a.969.969 0 01-1-.96v-.08a1 1 0 012 0 1.038 1.038 0 01-1 1.04zm7.14-2.82a1.024 1.024 0 01-.71-.29l-.13-.13a1 1 0 011.41-1.41l.13.13a1 1 0 010 1.41.984.984 0 01-.7.29zm-14.28 0a1.024 1.024 0 01-.71-.29 1 1 0 010-1.41l.13-.13a1 1 0 011.41 1.41l-.13.13a1 1 0 01-.7.29zM22 13h-.08a1 1 0 010-2 1.038 1.038 0 011.04 1 .969.969 0 01-.96 1zM2.08 13H2a1 1 0 010-2 1.038 1.038 0 011.04 1 .969.969 0 01-.96 1zm16.93-7.01a1.024 1.024 0 01-.71-.29 1 1 0 010-1.41l.13-.13a1 1 0 011.41 1.41l-.13.13a.984.984 0 01-.7.29zm-14.02 0a1.024 1.024 0 01-.71-.29l-.13-.14a1 1 0 011.41-1.41l.13.13a1 1 0 010 1.41.97.97 0 01-.7.3zM12 3.04a.969.969 0 01-1-.96V2a1 1 0 012 0 1.038 1.038 0 01-1 1.04z" />
        </g>
    </svg>
)

const ComputerFilledIcon = ({
    size = 24,
    width,
    height,
    ...props
}: IconSvgProps) => (
    <svg
        aria-hidden="true"
        className="text-default-foreground"
        focusable="false"
        height={size || height}
        role="presentation"
        viewBox="0 0 24 24"
        width={size || width}
        {...props}
    >
        <g clipPath="url(#clip0_2982_19306)">
            <path
                d="M2 1.92188C0.89543 1.92188 0 2.81731 0 3.92188V12.1559C0 13.2605 0.895431 14.1559 2 14.1559H22C23.1046 14.1559 24 13.2605 24 12.1559V3.92188C24 2.81731 23.1046 1.92188 22 1.92188H2ZM9.45313 10.438C9.69324 10.7432 9.64052 11.1852 9.33538 11.4253C9.03022 11.6654 8.58818 11.6127 8.34805 11.3076L6.74922 9.27564C6.17823 8.54999 6.17823 7.52777 6.74922 6.80212L8.34805 4.7702C8.58818 4.46504 9.03022 4.41232 9.33538 4.65245C9.64052 4.89257 9.69324 5.33459 9.45313 5.63974L8.5385 6.80213C7.96753 7.52778 7.96753 8.54998 8.5385 9.27562L9.45313 10.438ZM12.7031 11.1297C12.7031 11.518 12.3883 11.8328 12 11.8328C11.6117 11.8328 11.2969 11.518 11.2969 11.1297V4.94806C11.2969 4.55973 11.6117 4.24493 12 4.24493C12.3883 4.24493 12.7031 4.55973 12.7031 4.94806V11.1297ZM15.6519 11.3076C15.4118 11.6127 14.9698 11.6654 14.6646 11.4253C14.3595 11.1852 14.3068 10.7432 14.5469 10.438L15.4615 9.27562C16.0325 8.54998 16.0325 7.52778 15.4615 6.80213L14.5469 5.63974C14.3068 5.33459 14.3595 4.89257 14.6646 4.65245C14.9698 4.41232 15.4118 4.46504 15.6519 4.7702L17.2508 6.80212C17.8218 7.52777 17.8218 8.54999 17.2508 9.27564L15.6519 11.3076Z"
                fill="white"
            />
            <path
                d="M0 17.439C0 18.4753 0.840122 19.3154 1.87646 19.3154H6.83963C7.22861 19.3154 7.54395 19.6309 7.54395 20.0199C7.54395 20.4087 7.22828 20.7241 6.83945 20.7241C6.45112 20.7241 6.13586 21.0389 6.13586 21.4272C6.13586 21.8155 6.45066 22.1303 6.83899 22.1303H17.161C17.5493 22.1303 17.8641 21.8155 17.8641 21.4272C17.8641 21.0389 17.5489 20.7241 17.1606 20.7241C16.7717 20.7241 16.4561 20.4087 16.4561 20.0199C16.4561 19.6309 16.7714 19.3154 17.1604 19.3154H22.1235C23.1599 19.3154 24 18.4753 24 17.439C24 16.4026 23.1599 15.5625 22.1235 15.5625H1.87646C0.840122 15.5625 0 16.4026 0 17.439Z"
                fill="white"
            />
        </g>
        <defs>
            <clipPath id="clip0_2982_19306">
                <rect fill="white" height="24" width="24" />
            </clipPath>
        </defs>
    </svg>
)

const SplashScreen = ({ size = 50, width, height, ...props }: IconSvgProps) => (
    <div className="flex min-h-dvh items-center justify-center">
        <svg
            aria-label="splash screen logo"
            className="animate-bounce text-primary dark:text-default-foreground"
            fill="none"
            focusable="false"
            height={size || height}
            role="presentation"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width={size || width}
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
        </svg>
    </div>
)

const NotificationIcon = ({ size, height, width, ...props }: IconSvgProps) => {
    return (
        <svg
            fill="none"
            height={size || height || 24}
            viewBox="0 0 24 24"
            width={size || width || 24}
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                clipRule="evenodd"
                d="M18.707 8.796c0 1.256.332 1.997 1.063 2.85.553.628.73 1.435.73 2.31 0 .874-.287 1.704-.863 2.378a4.537 4.537 0 01-2.9 1.413c-1.571.134-3.143.247-4.736.247-1.595 0-3.166-.068-4.737-.247a4.532 4.532 0 01-2.9-1.413 3.616 3.616 0 01-.864-2.378c0-.875.178-1.682.73-2.31.754-.854 1.064-1.594 1.064-2.85V8.37c0-1.682.42-2.781 1.283-3.858C7.861 2.942 9.919 2 11.956 2h.09c2.08 0 4.204.987 5.466 2.625.82 1.054 1.195 2.108 1.195 3.745v.426zM9.074 20.061c0-.504.462-.734.89-.833.5-.106 3.545-.106 4.045 0 .428.099.89.33.89.833-.025.48-.306.904-.695 1.174a3.635 3.635 0 01-1.713.731 3.795 3.795 0 01-1.008 0 3.618 3.618 0 01-1.714-.732c-.39-.269-.67-.694-.695-1.173z"
                fill="currentColor"
                fillRule="evenodd"
            />
        </svg>
    )
}
