import { Button } from '@nextui-org/button'
import { Chip } from '@nextui-org/chip'
import { Input } from '@nextui-org/input'
import { Kbd } from '@nextui-org/kbd'
import {
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from '@nextui-org/table'
import { Tab, Tabs } from '@nextui-org/tabs'
import { useTheme } from 'next-themes'
import { type FC, type Key, useMemo, useState } from 'react'
import { Command } from 'lucide-react'

import useAppContext from '@/hooks/useAppContext'

import { DialogFooter } from './dialog'
import { NotificationIcon } from './icons'
import Modal from './modal'
import { ScrollArea } from './scroll-area'

enum TAB_KEYS {
    QUICKSTART = 'quickstart',
    KEYBINDINGS = 'keybindings',
}

type Keybinding = {
    category: string
    key: string
    description: string
}

const keybindings: Keybinding[] = [
    {
        category: 'Tab Management',
        key: 'Ctrl+W',
        description: 'Close the active tab.',
    },
    {
        category: 'Tab Management',
        key: 'Ctrl+Q',
        description: 'Close all tabs.',
    },
    {
        category: 'Tab Management',
        key: 'Ctrl+Shift+ArrowLeft',
        description: 'Switch to the previous tab.',
    },
    {
        category: 'Tab Management',
        key: 'Ctrl+Shift+ArrowRight',
        description: 'Switch to the next tab.',
    },
    {
        category: 'Interface Navigation',
        key: 'Ctrl+N',
        description: 'Open the language modal.',
    },
]

const features = [
    {
        title: 'Getting Started',
        content: [
            <>
                Click the <Kbd>+</Kbd> button in the sidebar to select a
                programming language.
            </>,
            <>
                Run your code by clicking the <Kbd>Run</Kbd> button at the top
                right of the tab.
            </>,
            <>
                Save your work{' '}
                <Chip
                    color="warning"
                    endContent={<NotificationIcon size={18} />}
                    variant="flat"
                >
                    beta
                </Chip>
                .
            </>,
        ],
    },
    {
        title: 'Key Features',
        content: [
            <>Syntax highlighting.</>,
            <>Visual Studio Code keybindings.</>,
            <>
                Intergrated terminal{' '}
                <Chip
                    className="tex"
                    color="warning"
                    endContent={<NotificationIcon size={18} />}
                    variant="flat"
                >
                    beta
                </Chip>
                .
            </>,
            <>
                Real-time collaboration{' '}
                <Chip
                    color="warning"
                    endContent={<NotificationIcon size={18} />}
                    variant="flat"
                >
                    beta
                </Chip>
                .
            </>,
            <>
                Version control{' '}
                <Chip
                    color="warning"
                    endContent={<NotificationIcon size={18} />}
                    variant="flat"
                >
                    beta
                </Chip>
                .
            </>,
        ],
    },
]

const QuickStartTab: FC = () => (
    <ScrollArea className="h-full overflow-auto">
        <div className="prose prose-base dark:prose-invert">
            {features.map((feature) => (
                <div key={feature.title}>
                    <h3>{feature.title}</h3>
                    {feature.title === 'Getting Started' ? (
                        <ol>
                            {feature.content.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ol>
                    ) : (
                        <ul className="list-none pl-0">
                            {feature.content.map((item, index) => (
                                <li
                                    key={index}
                                    className="flex flex-row items-center space-x-1"
                                >
                                    <Command className="mr-1" size={18} />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            ))}
        </div>
    </ScrollArea>
)

const KeybindingsTab: FC<{ searchTerm: string; resolvedTheme: string }> = ({
    searchTerm,
    resolvedTheme,
}) => {
    const filteredKeybindings = useMemo(
        () =>
            keybindings.filter(
                (kb) =>
                    kb.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    kb.description
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    kb.category.toLowerCase().includes(searchTerm.toLowerCase())
            ),
        [searchTerm]
    )

    const categories = useMemo(
        () => Array.from(new Set(filteredKeybindings.map((kb) => kb.category))),
        [filteredKeybindings]
    )

    return (
        <ScrollArea className="h-full overflow-auto">
            <div className="prose prose-base p-4 dark:prose-invert prose-thead:border-none prose-tr:border-none">
                {categories.map((category) => (
                    <div key={category}>
                        <h3>{category}</h3>
                        <Table
                            fullWidth
                            isCompact
                            isHeaderSticky
                            removeWrapper
                            aria-label="keybindings table"
                            color={
                                resolvedTheme === 'dark' ? 'default' : 'primary'
                            }
                        >
                            <TableHeader>
                                <TableColumn>Shortcut</TableColumn>
                                <TableColumn>Description</TableColumn>
                            </TableHeader>
                            <TableBody>
                                {filteredKeybindings
                                    .filter((kb) => kb.category === category)
                                    .map((kb, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <Kbd>{kb.key}</Kbd>
                                            </TableCell>
                                            <TableCell>
                                                {kb.description}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </div>
                ))}
            </div>
        </ScrollArea>
    )
}

const UserGuide: FC = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [selected, setSelected] = useState<Key>(TAB_KEYS.QUICKSTART)
    const { resolvedTheme } = useTheme()
    const { isOpen, setIsOpen } = useAppContext()

    if (!isOpen.userGuide) return <></>

    return (
        <Modal
            aria-label="user guide modal"
            className="h-3/5 w-2/5"
            title="Welcome to Carai"
            onOpenChange={(open) => setIsOpen({ userGuide: open })}
        >
            <Tabs
                fullWidth
                aria-label="user guide tabs"
                color={resolvedTheme === 'dark' ? 'default' : 'primary'}
                selectedKey={selected}
                size="md"
                variant="underlined"
                onSelectionChange={setSelected}
            >
                <Tab
                    key={TAB_KEYS.QUICKSTART}
                    className="overflow-hidden"
                    title="Quick Start"
                >
                    <QuickStartTab />
                </Tab>
                <Tab
                    key={TAB_KEYS.KEYBINDINGS}
                    className="overflow-hidden"
                    title="Keybindings"
                >
                    <Input
                        aria-label="search keybindings"
                        id="keybindings-search"
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
                        resolvedTheme={resolvedTheme ?? 'dark'}
                        searchTerm={searchTerm}
                    />
                </Tab>
            </Tabs>
            <DialogFooter className="p-1">
                <Button
                    fullWidth
                    aria-label="close user guide"
                    color={resolvedTheme === 'dark' ? 'default' : 'primary'}
                    radius="md"
                    variant="ghost"
                    onClick={() => {
                        setIsOpen({ userGuide: false })
                    }}
                >
                    Got it, let&apos;s code!
                </Button>
            </DialogFooter>
        </Modal>
    )
}

export default UserGuide
