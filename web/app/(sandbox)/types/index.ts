import type { ForwardRefExoticComponent, RefAttributes } from "react";

import type { LucideProps } from "lucide-react";

export type ErrorResponse = {
    message: string;
};

export type CodeFileRequest = {
    language: string;
    files: Array<{
        name: string;
        content: string;
    }>;
};

export type CodeRequest = {
    image: string;
    payload: CodeFileRequest;
};

export type CodeResponse = {
    error: string;
    stderr: string;
    stdout: string;
};

export type EnvConfig = {
    baseUrl: string;
    accessToken: string;
};

export type SidebarProp = {
    id: string;
    icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
    label: string;
};
