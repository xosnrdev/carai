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
    const { addTab, isMobileView } = useTabContext()
    const { isOpen, setIsOpen } = useAppContext()
    const [selectedRuntime, setSelectedRuntime] = useState<RuntimeProps | null>(
        null
    )
    const [searchQuery, setSearchQuery] = useState('')
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
            return a.name.length - b.name.length
        })

        return sortedRuntimeProps.filter((language) => {
            const lowerCaseTitle = language.name.toLowerCase()

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
                reject(new CustomError('no runtime selected'))

                return
            }

            rceHandler
                .healthz()
                .then((status) => {
                    if (status !== 200) {
                        reject(new CustomError('something went wrong!'))

                        return
                    }

                    const { name, extension, language, alias } = selectedRuntime

                    const title = `${Array.from(new Set(['index', 'app', 'main', 'entry', 'source', 'code', 'script', 'program']))[Math.floor(Math.random() * 8)]}${extension}`

                    addTab({
                        title,
                        value: '',

                        metadata: {
                            name,
                            language,
                            alias,
                        },
                        config: {
                            maxValueSize: {
                                value: isMobileView ? 100 : 500,
                                units: 'lines',
                            },
                            maxTabs: 15,
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
                })
                .catch((error) => {
                    reject(new CustomError(error.message))
                    throw error
                })
        })
    }, [addTab, selectedRuntime, isMobileView, setIsOpen])

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
                    aria-label="choose runtime modal"
                    title="Choose A Runtime"
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
                                loading: 'checking health status...',
                                success: 'ready',
                                error: (err) => <span>{err.message}</span>,
                            })
                        }}
                    >
                        <Input
                            autoFocus
                            aria-label="search runtime"
                            color={
                                resolvedTheme === 'dark' ? 'default' : 'primary'
                            }
                            id="inputarea"
                            label="Search Runtime"
                            radius="md"
                            role="searchbox"
                            size={isMobileView ? 'sm' : 'md'}
                            type="text"
                            value={searchQuery}
                            variant="bordered"
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />

                        <div
                            aria-label="runtime container"
                            className="overflow-hidden"
                            dir="ltr"
                        >
                            <RadioGroup
                                className="flex snap-x snap-mandatory flex-row overflow-auto lg:gap-4 xl:gap-4"
                                orientation="horizontal"
                                tabIndex={-1}
                                onValueChange={handleChange}
                            >
                                {filteredRuntimes.length > 0 ? (
                                    filteredRuntimes.map((runtime) => (
                                        <div
                                            key={runtime.name}
                                            className="snap-start scroll-ms-6"
                                        >
                                            <RadioGroupItem
                                                checked={
                                                    filteredRuntimes.length ===
                                                        1 ||
                                                    selectedRuntime?.name ===
                                                        runtime.name
                                                }
                                                className="peer sr-only"
                                                id={runtime.name}
                                                value={JSON.stringify(runtime)}
                                            />
                                            <Label
                                                className={cn(
                                                    'flex size-24 flex-col items-center justify-between gap-y-3 rounded-md border-2 border-default p-4 hover:border-primary peer-data-[state=checked]:border-primary lg:scale-90 lg:hover:scale-100 xl:scale-90 xl:hover:scale-100 [&:has([data-state=checked])]:border-primary'
                                                )}
                                                htmlFor={runtime.name}
                                            >
                                                <Image
                                                    priority
                                                    alt={`
													${runtime.language} icon`}
                                                    className="size-10"
                                                    height={100}
                                                    src={`/assets/language/${runtime.language}.svg`}
                                                    width={100}
                                                />
                                                <span className="text-nowrap">
                                                    {runtime.name}
                                                </span>
                                            </Label>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-nowrap text-center">
                                        Runtime not found.
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
                                        Choose Runtime
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
                            !isMobileView && (
                                <CustomTooltip
                                    content={
                                        <span className="text-xs">
                                            Collaborate
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
                            )
                        )}
                    </div>
                ))}
            </aside>
        </>
    )
}

export default Sidebar
