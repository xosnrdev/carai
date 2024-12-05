import type { Config } from "release-it";

export default {
    git: {
        commit: true,
        tag: true,
        push: true,
    },
    github: {
        release: true,
    },
    npm: {
        publish: false,
    },
    hooks: {
        "before:init": ["pnpm check"],
    },
} satisfies Config;
