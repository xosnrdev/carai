import type { FC } from 'react'

const UnsupportedDevice: FC = () => {
    return (
        <div className="flex min-h-dvh items-center justify-center bg-gray-100 p-5">
            <div className="w-full max-w-lg flex-1 rounded-lg border border-gray-200 bg-white p-6 shadow-md md:p-8">
                <h1 className="mb-4 text-2xl font-semibold text-gray-800 md:text-3xl">
                    Unsupported Device
                </h1>
                <p className="mb-3 text-base text-gray-600 md:text-lg">
                    It looks like you&apos;re using a device that may not
                    provide the best experience for this application.
                </p>
                <p className="mb-3 text-base text-gray-600 md:text-lg">
                    For the best experience, please use a larger device such as
                    a desktop or tablet.
                </p>
                <p className="text-base text-gray-600 md:text-lg">
                    Thank you for your understanding!
                </p>
            </div>
        </div>
    )
}

export default UnsupportedDevice
