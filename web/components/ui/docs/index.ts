import type { Keybinding } from "./index.types";

export const keybindings: Keybinding[] = [
    {
        category: "Tab Management",
        key: "Ctrl+W",
        description: "Close the active tab.",
    },
    {
        category: "Tab Management",
        key: "Ctrl+Q",
        description: "Close all tabs.",
    },
    {
        category: "Tab Management",
        key: "Ctrl+Shift+ArrowLeft",
        description: "Switch to the previous tab.",
    },
    {
        category: "Tab Management",
        key: "Ctrl+Shift+ArrowRight",
        description: "Switch to the next tab.",
    },
    {
        category: "Interface Navigation",
        key: "Ctrl+N",
        description: "Open the language modal.",
    },
] as const;
