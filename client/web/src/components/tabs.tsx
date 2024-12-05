import { usePathname } from "next/navigation";
import { type RefObject, useCallback, useRef } from "react";

import useKeyPress from "@/src/hooks/useKeyPress";
import useTabContext from "@/src/hooks/useTabContext";
import Tab from "./tab";

export default function Tabs() {
    const pathname = usePathname();
    const {
        tabs,
        activeTab,
        removeTab,
        switchTab,
        closeAllTabs,
        setActiveTab,
        tabIndexMap,
        codeResponse,
    } = useTabContext();

    const activeTabRef = useRef<HTMLDivElement | null>(null);

    const handleScrollActiveTabIntoView = useCallback(() => {
        scrollActiveTabIntoView(activeTabRef, tabIndexMap);
    }, [tabIndexMap]);

    const handleCloseTab = (id: string) => {
        removeTab(id);
        handleScrollActiveTabIntoView();
    };

    const isAnimatingRef = useRef(false);

    const handleSwitchTab = useCallback(
        (direction: "next" | "previous") => {
            if (!isAnimatingRef.current) {
                isAnimatingRef.current = true;
                requestAnimationFrame(() => {
                    switchTab(direction);
                    handleScrollActiveTabIntoView();
                    isAnimatingRef.current = false;
                });
            }
        },
        [switchTab, handleScrollActiveTabIntoView],
    );

    useKeyPress({
        targetKey: "Q",
        callback: () => {
            if (activeTab && pathname === "/sandbox" && !codeResponse?.isRunning) {
                closeAllTabs();
            }
        },
        modifier: ["ctrlKey", "shiftKey"],
    });

    useKeyPress({
        targetKey: "ArrowRight",
        callback: () => {
            if (activeTab && pathname === "/sandbox") {
                handleSwitchTab("next");
            }
        },
        modifier: ["ctrlKey", "shiftKey"],
    });

    useKeyPress({
        targetKey: "ArrowLeft",
        callback: () => {
            if (activeTab && pathname === "/sandbox") {
                handleSwitchTab("previous");
            }
        },
        modifier: ["ctrlKey", "shiftKey"],
    });

    return (
        <aside className="sticky top-0 z-50 bg-background">
            <div aria-label="tabs" className={"flex flex-row overflow-x-auto"} role="tablist">
                {tabs.map(({ id, filename }) => (
                    <Tab
                        key={id}
                        ref={activeTab.id === id ? activeTabRef : null}
                        activeTabId={activeTab.id}
                        closeTab={handleCloseTab}
                        filename={filename}
                        id={id}
                        setActiveTab={setActiveTab}
                    />
                ))}
            </div>
        </aside>
    );
}

export type TabView = {
    tabElement: HTMLElement;
    parentElement: HTMLElement;
};

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
