import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Carai Open Graph Image";
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = "image/png";

export default async function Image() {
    return new ImageResponse(
        <div
            style={{
                fontSize: 128,
                background: "#2f2f3b",
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
            }}
        >
            <svg
                className="lucide lucide-braces"
                fill="none"
                stroke="#FFFFFF"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                style={{
                    width: "1em",
                    height: "1em",
                    marginRight: "0.2em",
                }}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <title>carai logo</title>
                <path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1" />
                <path d="M16 21h1a2 2 0 0 0 2-2v-5c0-1.1.9-2 2-2a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1" />
            </svg>
            <span style={{ lineHeight: 1 }}>Carai</span>
        </div>,
        {
            ...size,
        },
    );
}
