import type { CodeEditorViewState } from "@/redux/tab/index.types";
import type { RefObject } from "react";
import type { TabView } from "./types";

export { scrollActiveTabIntoView, serializeViewState };

function isTabVisible({ tabElement, parentElement }: TabView): boolean {
    const tabRect = tabElement.getBoundingClientRect();
    const parentRect = parentElement.getBoundingClientRect();

    return tabRect.left >= parentRect.left && tabRect.right <= parentRect.right;
}

function computeIdealScrollPosition({
    tabElement,
    parentElement,
    tabWidth,
    tabIndexMap,
}: {
    tabWidth: number;
    tabIndexMap: Map<string, number>;
} & TabView): number {
    const chunkWidth = parentElement.clientWidth;
    const tabIndex = tabIndexMap.get(tabElement.id) ?? 0;
    let scrollLeft = tabIndex * tabWidth - chunkWidth / 2 + tabWidth / 2;

    scrollLeft = Math.max(0, Math.min(scrollLeft, parentElement.scrollWidth - chunkWidth));

    return scrollLeft;
}

function handleCircularScrolling({
    tabIndex,
    numTabs,
    parentElement,
}: {
    tabIndex: number;
    numTabs: number;
    parentElement: HTMLElement;
}): void {
    if (numTabs === 0) {
        return;
    }

    const tabWidth = parentElement.scrollWidth / numTabs;
    const scrollPosition = (tabIndex * tabWidth) % parentElement.scrollWidth;

    parentElement.scroll({
        left: scrollPosition,
        behavior: "smooth",
    });
}

function scrollActiveTabIntoView(
    activeTabRef: RefObject<HTMLElement>,
    tabIndexMap: Map<string, number>,
): void {
    if (!activeTabRef.current) {
        return;
    }

    const tabElement = activeTabRef.current;
    const parentElement = tabElement.parentElement;

    if (!parentElement) {
        return;
    }

    if (!isTabVisible({ tabElement, parentElement })) {
        const tabWidth = tabElement.offsetWidth;
        const idealScrollLeft = computeIdealScrollPosition({
            tabElement,
            parentElement,
            tabWidth,
            tabIndexMap,
        });

        parentElement.scroll({
            left: idealScrollLeft,
            behavior: "smooth",
        });

        const tabIndex = tabIndexMap.get(tabElement.id) ?? 0;
        const numTabs = parentElement.children.length;

        handleCircularScrolling({ tabIndex, numTabs, parentElement });
    }
}

function serializeViewState(state: CodeEditorViewState | null): CodeEditorViewState {
    if (!state) {
        return {
            cursorState: [],
            viewState: {
                scrollLeft: 0,
                firstPosition: { lineNumber: 1, column: 1 },
                firstPositionDeltaTop: 0,
            },
            contributionsState: {},
        };
    }

    return {
        cursorState: state.cursorState.map((cursor) => ({
            inSelectionMode: cursor.inSelectionMode,
            selectionStart: {
                lineNumber: cursor.selectionStart.lineNumber,
                column: cursor.selectionStart.column,
            },
            position: {
                lineNumber: cursor.position.lineNumber,
                column: cursor.position.column,
            },
        })),
        viewState: {
            scrollTop: state.viewState.scrollTop ?? 0,
            scrollTopWithoutViewZones: state.viewState.scrollTopWithoutViewZones ?? 0,
            scrollLeft: state.viewState.scrollLeft,
            firstPosition: {
                lineNumber: state.viewState.firstPosition.lineNumber,
                column: state.viewState.firstPosition.column,
            },
            firstPositionDeltaTop: state.viewState.firstPositionDeltaTop,
        },
        contributionsState: state.contributionsState,
    };
}
