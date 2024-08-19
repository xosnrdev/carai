import type { RuntimeProps } from '@/types'

import { Button } from '@nextui-org/button'
import { Input } from '@nextui-org/input'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState, type FC } from 'react'
import toast from 'react-hot-toast'

import useAppContext from '@/hooks/useAppContext'
import useKeyPress from '@/hooks/useKeyPress'
import useTabContext from '@/hooks/useTabContext'
import { runtimeProps, sidebarProps } from '@/lib/constants/ui'
import { CustomError } from '@/lib/error'
import { cn } from '@/lib/utils'
import { RCEHandler } from '@/network/rce-handler'

import CustomTooltip from './custom-tooltip'
import { DialogFooter } from './dialog'
import { Label } from './label'
import Modal from './modal'
import { RadioGroup, RadioGroupItem } from './radio-group'

const rceHandler = new RCEHandler()

const Sidebar: FC = () => {
    const { addTab } = useTabContext()
    const { isOpen, setIsOpen } = useAppContext()
    const [selectedRuntime, setSelectedRuntime] = useState<RuntimeProps | null>(
        null
    )

    const [searchQuery, setSearchQuery] = useState('')

    const [newFilename, setNewFilename] = useState('')

    const pathname = usePathname()
    const [activeNav, setActiveNav] = useState<number | null>(null)
    const router = useRouter()
    const { resolvedTheme } = useTheme()

    const filteredRuntimes = useMemo(() => {
        const lowerCaseSearchQuery = searchQuery.toLowerCase().trim()

        /**
         * @see {@link https://www.geeksforgeeks.org/boyer-moore-algorithm-for-pattern-searching}
         */
        const buildBadCharTable = (pattern: string) => {
            const table: number[] = new Array(256).fill(pattern.length)

            for (let i = 0; i < pattern.length - 1; i++) {
                table[pattern.charCodeAt(i)] = pattern.length - 1 - i
            }

            return table
        }

        /**
         * @see {@link https://www.geeksforgeeks.org/boyer-moore-algorithm-for-pattern-searching}
         */
        const boyerMooreSearch = (text: string, pattern: string) => {
            const badCharTable = buildBadCharTable(pattern)
            let i = pattern.length - 1

            while (i < text.length) {
                let j = pattern.length - 1

                while (j >= 0 && text.charAt(i) === pattern.charAt(j)) {
                    i--
                    j--
                }
                if (j < 0) {
                    return true
                }
                i += Math.max(
                    badCharTable[text.charCodeAt(i)],
                    pattern.length - 1 - j
                )
            }

            return false
        }

        // Sort RuntimeProps by the length of their titles
        const sortedRuntimeProps = runtimeProps.slice().sort((a, b) => {
            return a.languageName.trim().length - b.languageName.trim().length
        })

        return sortedRuntimeProps.filter((language) => {
            const lowerCaseTitle = language.languageName.trim().toLowerCase()

            if (lowerCaseSearchQuery.length === 1) {
                return lowerCaseTitle.charAt(0) === lowerCaseSearchQuery
            }

            return boyerMooreSearch(lowerCaseTitle, lowerCaseSearchQuery)
        })
    }, [searchQuery])

    const handleChange = (value: string) => {
        const parsedValue = JSON.parse(value) as RuntimeProps

        setSelectedRuntime(parsedValue)
    }

    useEffect(() => {
        if (filteredRuntimes.length === 1) {
            setSelectedRuntime(filteredRuntimes[0])
        }

        return () => {
            setSelectedRuntime(null)
        }
    }, [filteredRuntimes])

    const handleClick = useCallback(() => {
        return new Promise<void>((resolve, reject) => {
            if (!selectedRuntime) {
                reject(new CustomError('No language selected'))

                return
            }

            rceHandler
                .healthz()
                .then((status) => {
                    if (status !== 200) {
                        reject(new CustomError('Something went wrong!'))

                        return
                    }

                    const {
                        monacoEditorLanguageSupportName,
                        fileExtension,
                        imageName,
                        codeMirrorLanguageSupportName,
                        snippet,
                    } = selectedRuntime

                    const customFilename = `${Array.from(new Set(['index', 'app', 'main', 'entry', 'source', 'code', 'script', 'program']))[Math.floor(Math.random() * 8)]}${fileExtension}`

                    const filename = newFilename.trim() || customFilename

                    addTab({
                        filename,
                        value: snippet || '',

                        metadata: {
                            monacoEditorLanguageSupportName,
                            imageName,
                            codeMirrorLanguageSupportName,
                        },
                        config: {
                            maxValueSize: {
                                value: 500,
                                units: 'lines',
                            },
                            maxTabs: 10,
                            isClosable: true,
                        },
                    })
                    setIsOpen({
                        modal: false,
                        sidebar: false,
                    })

                    resolve()
                    setSelectedRuntime(null)
                    setSearchQuery('')
                    setNewFilename('')
                })
                .catch((error) => {
                    reject(new CustomError(error.message))
                })
        })
    }, [addTab, selectedRuntime, setIsOpen, newFilename])

    const handleModal = () => {
        if (pathname !== '/') {
            router.replace('/')
        }
        setIsOpen({
            modal: true,
        })
    }

    useKeyPress({
        targetKey: 'T',
        callback: () => {
            if (pathname === '/') {
                handleModal()
            }
        },
        modifier: ['ctrlKey', 'shiftKey'],
    })

    return (
        <>
            {isOpen.modal === true && (
                <Modal
                    aria-label="choose language modal"
                    title="Choose A Language"
                    onOpenChange={() =>
                        setIsOpen({
                            modal: false,
                        })
                    }
                >
                    <form
                        className="flex flex-col justify-between gap-y-2 overflow-hidden lg:gap-y-4 xl:gap-y-4"
                        onSubmit={(e) => {
                            e.preventDefault()
                            toast.promise(handleClick(), {
                                loading: 'Running health check...',
                                success: 'Ready',
                                error: (err) => <span>{err.message}</span>,
                            })
                        }}
                    >
                        <div className="inline-flex flex-row gap-x-2">
                            <Input
                                autoFocus
                                aria-label="enter filename"
                                color={
                                    resolvedTheme === 'dark'
                                        ? 'default'
                                        : 'primary'
                                }
                                id="filename-input"
                                label="Enter Filename"
                                radius="md"
                                role="searchbox"
                                size={'md'}
                                type="text"
                                value={newFilename}
                                variant="bordered"
                                onChange={(e) => setNewFilename(e.target.value)}
                            />
                            <Input
                                aria-label="search language"
                                color={
                                    resolvedTheme === 'dark'
                                        ? 'default'
                                        : 'primary'
                                }
                                id="searchQuery-input"
                                label="Search Language"
                                radius="md"
                                role="searchbox"
                                size={'md'}
                                type="text"
                                value={searchQuery}
                                variant="bordered"
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div
                            aria-label="runtime group container"
                            className="overflow-hidden"
                            dir="ltr"
                        >
                            <RadioGroup
                                className="flex snap-x snap-mandatory flex-row gap-4 overflow-auto scrollbar-hide"
                                orientation="horizontal"
                                tabIndex={-1}
                                onValueChange={handleChange}
                            >
                                {filteredRuntimes.length > 0 ? (
                                    filteredRuntimes.map((runtime) => (
                                        <div
                                            key={runtime.languageName}
                                            className="snap-start scroll-ms-6"
                                        >
                                            <RadioGroupItem
                                                checked={
                                                    filteredRuntimes.length ===
                                                        1 ||
                                                    selectedRuntime?.languageName ===
                                                        runtime.languageName
                                                }
                                                className="peer sr-only"
                                                id={runtime.languageName}
                                                value={JSON.stringify(runtime)}
                                            />
                                            <Label
                                                className={cn(
                                                    'flex size-24 flex-col items-center justify-between gap-y-3 rounded-md border-2 border-default p-4 hover:border-primary peer-data-[state=checked]:border-primary lg:scale-90 lg:hover:scale-100 xl:scale-90 xl:hover:scale-100 [&:has([data-state=checked])]:border-primary'
                                                )}
                                                htmlFor={runtime.languageName}
                                            >
                                                <Image
                                                    priority
                                                    alt={`
													${runtime.languageName} icon`}
                                                    className="size-10"
                                                    height={100}
                                                    src={`/assets/language/${runtime.imageName}.svg`}
                                                    width={100}
                                                />
                                                <span className="text-nowrap">
                                                    {runtime.languageName}
                                                </span>
                                            </Label>
                                        </div>
                                    ))
                                ) : (
                                    <p className="flex-1 text-nowrap text-center">
                                        {`${searchQuery} not found.`}
                                    </p>
                                )}
                            </RadioGroup>
                        </div>
                        <DialogFooter className="p-1">
                            <Button
                                fullWidth
                                aria-label="code"
                                color={
                                    resolvedTheme === 'dark'
                                        ? 'default'
                                        : 'primary'
                                }
                                radius="md"
                                startContent={<span>Code</span>}
                                type="submit"
                                variant="ghost"
                            />
                        </DialogFooter>
                    </form>
                </Modal>
            )}

            <aside className="sticky left-0 z-10 flex h-full w-12 flex-col border-r border-default pt-16">
                {sidebarProps.map(({ id, label, ...val }, idx) => (
                    <div key={id} className="mx-auto my-4 flex flex-col">
                        {idx === 0 ? (
                            <CustomTooltip
                                content={
                                    <span className="text-xs">
                                        Choose Language
                                    </span>
                                }
                            >
                                <Button
                                    isIconOnly
                                    aria-label={label}
                                    className={cn('text-default-500', {
                                        'text-primary dark:text-default-foreground':
                                            activeNav === idx,
                                    })}
                                    radius="none"
                                    size="sm"
                                    startContent={<val.icon size={24} />}
                                    variant="light"
                                    onClick={(e) => {
                                        handleModal()
                                        setActiveNav(idx)
                                        e.preventDefault()
                                    }}
                                />
                            </CustomTooltip>
                        ) : (
                            <CustomTooltip
                                content={
                                    <span className="text-xs">Collaborate</span>
                                }
                            >
                                <Button
                                    isIconOnly
                                    aria-label={label}
                                    className={cn('text-default-500', {
                                        'text-primary dark:text-default-foreground':
                                            activeNav === idx,
                                    })}
                                    radius="none"
                                    role="link"
                                    size="sm"
                                    startContent={<val.icon size={24} />}
                                    variant="light"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        // if (pathname !== '/collaborate') {
                                        //   router.push('/collaborate')
                                        // }
                                        setActiveNav(idx)
                                    }}
                                />
                            </CustomTooltip>
                        )}
                    </div>
                ))}
            </aside>
        </>
    )
}

export default Sidebar
