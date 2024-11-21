import { type PayloadAction, createEntityAdapter, createSlice, nanoid } from "@reduxjs/toolkit";

import { CustomError } from "@/src/lib/error";
import { isNonEmptyString } from "@/src/lib/utils";
import type { editor } from "monaco-editor";
import type { RootState } from "./store";

const tabAdapter = createEntityAdapter<Tab>();

const initialState = tabAdapter.getInitialState({
    activeTabId: null as TabId | null,
    recentlyUsedTabs: new Array<TabId>(),
});

const tabSlice = createSlice({
    name: "tabs",
    initialState,
    reducers: {
        addTab: (state, action: PayloadAction<AddTabPayload>): void => {
            const { filename, content, config, metadata } = action.payload;
            const maxTabs = config.maxTabs || defaultConfig.maxTabs;

            if (state.ids.length >= maxTabs) {
                throw new CustomError(`Only ${maxTabs} tabs allowed`);
            }

            if (!filename || filename.trim().length === 0) {
                throw new CustomError("Filename must be a non-empty string");
            }

            const newTab: Tab = {
                id: nanoid(),
                filename,
                content,
                isDirty: isNonEmptyString(content),
                metadata,
                viewState: defaultViewState,
                config: { ...defaultConfig, ...config },
            };

            tabAdapter.addOne(state, newTab);
            state.activeTabId = newTab.id;
            if (isNonEmptyString(content)) {
                state.recentlyUsedTabs.push(newTab.id);
            }
        },

        setActiveTab: (state, action: PayloadAction<TabId>): void => {
            const tabId = action.payload;

            if (!state.entities[tabId]) {
                return;
            }
            state.activeTabId = tabId;
        },

        removeTab: (state, action: PayloadAction<TabId>): void => {
            const tabId = action.payload;
            const tab = state.entities[tabId];

            if (!tab || !tab.config.isClosable) {
                return;
            }

            const { ids, recentlyUsedTabs } = state;
            const removedTabIndex = ids.indexOf(tabId);

            tabAdapter.removeOne(state, tabId);

            state.recentlyUsedTabs = recentlyUsedTabs.filter((id) => id !== tabId);

            state.ids = ids.filter((id) => id !== tabId);

            if (state.activeTabId === tabId) {
                let newActiveTabId: TabId | null = null;

                for (const recentTabId of [...recentlyUsedTabs].reverse()) {
                    if (state.entities[recentTabId] && recentTabId !== tabId) {
                        newActiveTabId = recentTabId;
                        break;
                    }
                }

                if (!newActiveTabId) {
                    if (removedTabIndex > 0) {
                        newActiveTabId = state.ids[removedTabIndex - 1];
                    } else if (state.ids.length > 0) {
                        newActiveTabId = state.ids[0];
                    }
                }

                if (newActiveTabId) {
                    tabSlice.caseReducers.setActiveTab(state, {
                        payload: newActiveTabId,
                        type: "setActiveTab",
                    });
                } else {
                    state.activeTabId = null;
                }
            }
        },

        switchTab: (state, action: PayloadAction<"next" | "previous">) => {
            const direction = action.payload;

            const { activeTabId, ids } = state;

            if (!activeTabId) {
                return;
            }

            const currentIndex = ids.indexOf(activeTabId);

            if (currentIndex !== -1) {
                const length = ids.length;
                const increment = direction === "next" ? 1 : -1;
                const newIndex = (currentIndex + increment + length) % length;

                if (state.entities[ids[newIndex]]) {
                    state.activeTabId = ids[newIndex];
                }
            }
        },

        closeAllTabs: (state) => {
            tabAdapter.removeAll(state);
            state.activeTabId = null;
        },

        updateTab: (state, action: PayloadAction<UpdateTabPayload>) => {
            const { id, filename, content, viewState, config } = action.payload;
            const tab = state.entities[id];

            if (!tab) {
                return;
            }

            const maxContentDelimiter = config
                ? config.maxContentDelimiter || tab.config.maxContentDelimiter
                : defaultConfig.maxContentDelimiter;

            if (content && isContentLimited(content, maxContentDelimiter)) {
                throw new CustomError(
                    `Content exceeds ${maxContentDelimiter.limit} ${maxContentDelimiter.units}`,
                );
            }

            const updatedContent = content
                ? sliceContent({
                      content,
                      limit: maxContentDelimiter.limit,
                      units: maxContentDelimiter.units,
                  })
                : tab.content;

            const isDirty = content ? updatedContent !== tab.content : tab.isDirty;

            tabAdapter.updateOne(state, {
                id,
                changes: {
                    filename: filename ?? tab.filename,
                    content: updatedContent,
                    isDirty,
                    viewState: viewState ?? tab.viewState,
                    config: config ? { ...tab.config, ...config } : tab.config,
                },
            });

            if (isDirty) {
                const recentIndex = state.recentlyUsedTabs.indexOf(id);

                if (recentIndex > -1) {
                    state.recentlyUsedTabs.splice(recentIndex, 1);
                }
                state.recentlyUsedTabs.push(id);
            }
        },

        setCodeResponse: (state, action: PayloadAction<CodeResponsePayload>) => {
            const { id, codeResponse, time, isRunning } = action.payload;
            const tab = state.entities[id];

            if (!tab || !tab.viewState) {
                return;
            }
            tab.viewState.stateFields.codeResponse = {
                ...codeResponse,
                time,
                isRunning,
            };
        },

        setResizeLayout: (state, action: PayloadAction<ResizeLayoutPayload>) => {
            const { id, vertical, snapshot } = action.payload;
            const tab = state.entities[id];

            if (!tab || !tab.viewState) {
                return;
            }

            tab.viewState.stateFields.resizeLayout = {
                vertical: [...vertical],
                snapshot: [...snapshot],
            };
        },
        setViewState: (state, action: PayloadAction<ViewStatePayload>) => {
            const { id, isMounted } = action.payload;
            const tab = state.entities[id];

            if (!tab || !tab.viewState) {
                return;
            }

            tab.viewState.isMounted = isMounted;
        },
    },
});

const { selectAll: selectAllTabs, selectById: selectTabById } = tabAdapter.getSelectors<RootState>(
    (state) => state.tabs,
);

const {
    addTab,
    setActiveTab,
    removeTab,
    switchTab,
    closeAllTabs,
    updateTab,
    setCodeResponse,
    setResizeLayout,
    setViewState,
} = tabSlice.actions;

export {
    addTab,
    closeAllTabs,
    tabSlice,
    defaultViewState,
    removeTab,
    selectAllTabs,
    selectTabById,
    setActiveTab,
    setCodeResponse,
    setResizeLayout,
    switchTab,
    tabAdapter,
    updateTab,
    setViewState,
};

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

export type Limit = number;

export type Units = "characters" | "bytes" | "lines";

export type MaxContentDelimiter = {
    limit: Limit;
    units: Units;
};

export type TabConfig = {
    /*
     * Whether the tab can be closed or not
     */
    isClosable: boolean;
    /*
     * Maximum number of tabs that can be opened
     */
    maxTabs: number;
    /*
     * Maximum number of text content by characters, bytes, or lines
     */
    maxContentDelimiter: MaxContentDelimiter;
};

type CodeResponseField = Partial<{
    time: string;
    isRunning: boolean;
}>;

export type ViewStateField = {
    codeResponse?: CodeResponse & CodeResponseField;
    resizeLayout: ResizeLayout;
};

export type CodeEditorViewState = {} & editor.ICodeEditorViewState;

export type ViewStatePayload = {
    id: TabId;
    isMounted: boolean;
};

export type ViewState = {
    state: CodeEditorViewState;
    stateFields: ViewStateField;
    isMounted?: boolean;
};

export type Metadata = {
    languageName: string;
};

export type Tab = {
    /*
     * Unique identifier for a tab
     */
    id: string;
    /*
     * filename of a tab
     */
    filename: string;
    /*
     * content value of a tab
     */
    content: string;
    /*
     * Whether the text value of a tab has been modified or not
     */
    isDirty: boolean;
    /*
     * Metadata for a tab
     */
    metadata: Metadata;
    /*
     * Editor view state of a tab
     */
    viewState: ViewState;
    /*
     * Configuration for a tab
     */
    config: TabConfig;
};

export type TabId = Tab["id"];

export type CodeResponsePayload = {
    id: TabId;
    codeResponse: CodeResponse;
    time: string;
    isRunning: boolean;
};

export type CodeResponse = {
    error: string;
    stderr: string;
    stdout: string;
};

export type ResizeLayout = Omit<ResizeLayoutPayload, "id">;

export type ResizeLayoutPayload = {
    id: TabId;
    vertical: number[];
    snapshot: number[];
};

export type AddTabPayload = Omit<Tab, "id" | "isDirty" | "viewState">;

export type UpdateTabPayload = Partial<Tab> & {
    id: TabId;
};

const getByteLength = (content: string): number => {
    return new TextEncoder().encode(content).byteLength;
};

const sliceBytes = (content: string, limit: number): string => {
    return new TextDecoder().decode(new TextEncoder().encode(content).slice(0, limit));
};

const isContentLimited = (content: string, maxContentDelimiter: MaxContentDelimiter): boolean => {
    const { limit, units } = maxContentDelimiter;

    switch (units) {
        case "characters":
            return content.length > limit;
        case "bytes":
            return getByteLength(content) > limit;
        case "lines":
            return content.split("\n").length > limit;
        default:
            throw new CustomError(`Unsupported unit: ${units}`);
    }
};

const sliceContent = ({
    content,
    limit,
    units,
}: {
    content: string;
    limit: Limit;
    units: Units;
}): string => {
    switch (units) {
        case "characters":
            return content.slice(0, limit);
        case "bytes":
            return sliceBytes(content, limit);
        case "lines":
            return content.split("\n").slice(0, limit).join("\n");
        default:
            throw new CustomError(`Unsupported unit: ${units}`);
    }
};
