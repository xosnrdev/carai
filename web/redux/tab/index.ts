import type { TabConfig, ViewState } from "./index.types";

export { defaultConfig, defaultViewState };

const defaultConfig: TabConfig = {
    isClosable: true,
    maxTabs: 2,
    maxContentDelimiter: {
        limit: 1000,
        units: "characters",
    },
} as const;

const defaultViewState: ViewState = {
    state: {
        cursorState: [],
        viewState: {
            scrollLeft: 0,
            firstPosition: {
                lineNumber: 1,
                column: 1,
            },
            firstPositionDeltaTop: 0,
        },
        contributionsState: {},
    },
    stateFields: {
        codeResponse: {
            error: "",
            stderr: "",
            stdout: "",
        },
        resizeLayout: {
            vertical: [70, 30],
            snapshot: [70, 30],
        },
    },
} as const;
