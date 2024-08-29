import type { FC } from 'react'

const UnsupportedDevice: FC = () => {
    return (
        <div className="flex min-h-dvh items-center justify-center p-5">
            <div className="prose prose-base w-full max-w-lg flex-1">
                <h1 className="mb-4">Unsupported Device</h1>
                <p className="mb-3">
                    It looks like you&apos;re using a device that may not
                    provide the best experience for this application.
                </p>
                <p className="mb-3">
                    For the best experience, please use a larger device such as
                    a desktop or tablet.
                </p>
                <p>Thank you for your understanding!</p>
            </div>
        </div>
    )
}

export default UnsupportedDevice
