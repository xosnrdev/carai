import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Kbd } from "@nextui-org/kbd";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/table";
import { Tab, Tabs } from "@nextui-org/tabs";
import { Command } from "lucide-react";
import { useTheme } from "next-themes";
import { type FC, Fragment, type Key, useMemo, useState } from "react";

import useAppContext from "@/src/hooks/useAppContext";
import { DialogFooter } from "./dialog";
import Modal from "./modal";

const features = [
    {
        title: "Getting Started",
        content: [
            <Fragment key="0">
                Click the <Kbd>+</Kbd> button in the sidebar to select a programming language.
            </Fragment>,
            <Fragment key="1">
                Run your code by clicking the <Kbd>Run</Kbd> button in the isolated terminal.
            </Fragment>,
        ],
    },
    {
        title: "Key Features",
        content: [
            <Fragment key="0">Syntax highlighting.</Fragment>,
            <Fragment key="1">Visual Studio Code keybindings.</Fragment>,
            <Fragment key="2">Tab Functionality.</Fragment>,
        ],
    },
];

const QuickStartTab: FC = () => (
    <div className="prose max-h-96 overflow-auto dark:prose-invert">
        {features.map((feature) => (
            <div key={feature.title}>
                <h3>{feature.title}</h3>
                {feature.title === "Getting Started" ? (
                    <ol>
                        {feature.content.map((item) => (
                            <li key={item.key}>{item}</li>
                        ))}
                    </ol>
                ) : (
                    <ul className="list-none pl-0">
                        {feature.content.map((item) => (
                            <li key={item.key} className="flex flex-row items-center space-x-1">
                                <Command className="mr-1" size={18} />
                                {item}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        ))}
    </div>
);

const KeybindingsTab: FC<{ searchTerm: string; resolvedTheme: string }> = ({
    searchTerm,
    resolvedTheme,
}) => {
    const filteredKeybindings = useMemo(() => {
        const searchResult = keybindings.filter(
            (kb) =>
                kb.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
                kb.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                kb.category.toLowerCase().includes(searchTerm.toLowerCase()),
        );

        return searchResult.length > 0
            ? searchResult
            : [
                  {
                      key: `${searchTerm}`,
                      description: "Not found.",
                      category: "No category",
                  },
              ];
    }, [searchTerm]);

    const categories = useMemo(
        () => Array.from(new Set(filteredKeybindings.map((kb) => kb.category))),
        [filteredKeybindings],
    );

    return (
        <div className="prose max-h-96 overflow-auto p-4 dark:prose-invert prose-thead:border-none prose-tr:border-none">
            {categories.map((category) => (
                <div key={category}>
                    <h3>{category}</h3>
                    <Table
                        fullWidth
                        isHeaderSticky
                        removeWrapper
                        aria-label="keybindings table"
                        color={resolvedTheme === "dark" ? "default" : "primary"}
                    >
                        <TableHeader>
                            <TableColumn>Shortcut</TableColumn>
                            <TableColumn>Description</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {filteredKeybindings
                                .filter((kb) => kb.category === category)
                                .map((kb) => (
                                    <TableRow key={kb.key}>
                                        <TableCell>
                                            <Kbd>{kb.key}</Kbd>
                                        </TableCell>
                                        <TableCell>{kb.description}</TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </div>
            ))}
        </div>
    );
};

export default function ActionModal() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selected, setSelected] = useState<Key>(TabKey[0]);
    const { resolvedTheme } = useTheme();
    const { isOpen, setIsOpen } = useAppContext();

    if (!isOpen.actionModal) {
        return;
    }

    return (
        <Modal
            aria-label="user guide modal"
            className="max-w-xl selection:bg-default"
            title="Are you lost?"
            onOpenChange={(open) => setIsOpen({ actionModal: open })}
        >
            <Tabs
                fullWidth
                aria-label="user guide tabs"
                color={resolvedTheme === "dark" ? "default" : "primary"}
                selectedKey={selected.toString()}
                variant="underlined"
                onSelectionChange={(key) => setSelected(key as Key)}
            >
                <Tab key={TabKey[0]} className="m-0 p-0" title={TabKey[0]}>
                    <QuickStartTab />
                </Tab>
                <Tab key={TabKey[1]} className="m-0 p-0" title={TabKey[1]}>
                    <Input
                        aria-label="search keybindings"
                        id="keybindings-search"
                        maxLength={10}
                        placeholder="Search keybindings..."
                        radius="md"
                        role="searchbox"
                        size="md"
                        type="text"
                        value={searchTerm}
                        variant="bordered"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <KeybindingsTab
                        resolvedTheme={resolvedTheme ?? "dark"}
                        searchTerm={searchTerm}
                    />
                </Tab>
            </Tabs>
            <DialogFooter className="p-1">
                <Button
                    fullWidth
                    aria-label="close user guide"
                    color={resolvedTheme === "dark" ? "default" : "primary"}
                    radius="md"
                    variant="ghost"
                    onClick={() => {
                        setIsOpen({ actionModal: false });
                    }}
                >
                    Got it
                </Button>
            </DialogFooter>
        </Modal>
    );
}

enum TabKey {
    QuickStart = 0,
    Keybindings = 1,
}

type Keybinding = {
    category: string;
    key: string;
    description: string;
};

const keybindings: Keybinding[] = [
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
