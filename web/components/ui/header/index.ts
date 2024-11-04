import type { HeaderProp } from "./index.types";

const headerProps: HeaderProp[] = [
    {
        id: "sign-up",
        label: "Sign Up",
        path: "/sign-up",
    },
    {
        id: "sign-in",
        label: "Sign In",
        path: "/sign-in",
    },
] as const;

export default headerProps;
