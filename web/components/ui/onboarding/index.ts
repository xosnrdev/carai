import type { OnboardingProp } from "./index.types";

const onboardingProps: OnboardingProp = {
    quickLinks: [
        {
            id: "sign-up",
            label: "Create Account",
            uri: "/sign-up",
        },
        {
            id: "sign-in",
            label: "Log In",
            uri: "/sign-in",
        },
    ],
    features: [
        "Share, review, and improve your code",
        "Connect and code with peers",
        "Communicate in real-time",
        "Keep track of changes",
        "Start collaborating today",
    ],
} as const;

export default onboardingProps;
