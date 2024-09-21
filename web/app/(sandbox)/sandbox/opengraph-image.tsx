import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Sandbox | Carai Open Graph Image'
export const size = {
    width: 1200,
    height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    fontSize: 128,
                    background: '#2f2f3b',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                Sandbox | Carai
            </div>
        ),
        {
            ...size,
        }
    )
}
