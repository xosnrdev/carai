import { X } from "lucide-react";
import { usePathname } from "next/navigation";
import { type FC, type RefObject, forwardRef, memo, useCallback, useRef } from "react";

import useKeyPress from "@/src/hooks/useKeyPress";
import useTabContext from "@/src/hooks/useTabContext";
import { cn } from "@/src/lib/utils";

interface TabAction {
    setActiveTab: (id: string) => void;
    closeTab: (id: string) => void;
}

export type TabProp = {
    id: string;
    filename: string;
    activeTabId: string;
    ref: RefObject<HTMLDivElement> | null;
} & TabAction;

const Tab: FC<TabProp> = memo(
    forwardRef<HTMLDivElement, TabProp>(
        ({ id, filename, activeTabId, setActiveTab, closeTab }, ref) => {
            const { updateTab, codeResponse } = useTabContext();
            const pathname = usePathname();

            const isAnimatingRef = useRef(false);

            const handleCloseTab = useCallback(() => {
                if (!isAnimatingRef.current) {
                    isAnimatingRef.current = true;
                    requestAnimationFrame(() => {
                        closeTab(id);

                        isAnimatingRef.current = false;
                    });
                }
            }, [closeTab, id]);

            const handleFilenameChange = useCallback(() => {
                const newFilename = prompt("Enter new filename", filename)?.trim();

                if (!newFilename) {
                    return;
                }

                updateTab({
                    id,
                    filename: newFilename,
                });
            }, [id, filename, updateTab]);

            useKeyPress({
                targetKey: "W",
                callback: () => {
                    if (id === activeTabId && pathname === "/sandbox" && !codeResponse?.isRunning) {
                        handleCloseTab();
                    }
                },
                modifier: ["ctrlKey", "shiftKey"],
            });

            return (
                <div
                    key={id}
                    ref={ref}
                    aria-label="tab"
                    className={cn(
                        "flex h-10 cursor-pointer items-center border-b border-r border-default pl-2 text-center transition-colors duration-500 hover:border-b hover:border-b-primary hover:dark:border-b-white",
                        {
                            "border-b border-b-primary dark:border-b-white": activeTabId === id,
                        },
                    )}
                    id={id}
                    onContextMenu={(e) => {
                        handleFilenameChange();
                        e.preventDefault();
                    }}
                >
                    <button
                        aria-label="tab filename"
                        tabIndex={0}
                        onMouseDown={() => {
                            setActiveTab(id);
                        }}
                        type="button"
                    >
                        {filename}
                    </button>
                    <button
                        className="ml-1 rounded-full p-1 hover:bg-default"
                        disabled={codeResponse?.isRunning}
                        onClick={(e) => {
                            handleCloseTab();
                            e.stopPropagation();
                        }}
                        type="button"
                    >
                        <X size={16} />
                    </button>
                </div>
            );
        },
    ),
);

Tab.displayName = "Tab";

export default Tab;
