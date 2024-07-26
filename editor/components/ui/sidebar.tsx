import type { LanguageProps } from '@/types'
import type { ErrorResponse } from '@/types/response'

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
import { languageProps, sidebarProps } from '@/lib/constants/ui'
import { TabError } from '@/lib/error'
import { cn } from '@/lib/utils'
import { RCEHandler } from '@/network/rce-client'

import CustomTooltip from './custom-tooltip'
import { DialogFooter } from './dialog'
import { Label } from './label'
import Modal from './modal'
import { RadioGroup, RadioGroupItem } from './radio-group'

const rceHandler = new RCEHandler()

const Sidebar: FC = () => {
    const { addTab, isMobileView } = useTabContext()
    const { isOpen, setIsOpen } = useAppContext()
    const [selectedLanguage, setSelectedLanguage] =
        useState<LanguageProps | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const pathname = usePathname()
    const [activeNav, setActiveNav] = useState<number | null>(null)
    const router = useRouter()
    const { resolvedTheme } = useTheme()
    const filteredLanguages = useMemo(() => {
        const lowerCaseSearchQuery = searchQuery.toLowerCase().trim()

        /**
         * @see {@link https://www.geeksforgeeks.org/boyer-moore-algorithm-for-pattern-searching/}
         */
        function buildBadCharTable(pattern: string): number[] {
            const table: number[] = new Array(256).fill(pattern.length)

            for (let i = 0; i < pattern.length - 1; i++) {
                table[pattern.charCodeAt(i)] = pattern.length - 1 - i
            }

            return table
        }

        /**
         * @see {@link https://www.geeksforgeeks.org/boyer-moore-algorithm-for-pattern-searching/}
         */
        function boyerMooreSearch(text: string, pattern: string): boolean {
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

        // Sort languageProps by the length of their titles
        const sortedLanguageProps = languageProps.slice().sort((a, b) => {
            return a.runtime.length - b.runtime.length
        })

        return sortedLanguageProps.filter((language) => {
            const lowerCaseTitle = language.runtime.toLowerCase()

            if (lowerCaseSearchQuery.length === 1) {
                return lowerCaseTitle.charAt(0) === lowerCaseSearchQuery
            }

            return boyerMooreSearch(lowerCaseTitle, lowerCaseSearchQuery)
        })
    }, [searchQuery])

    const handleChange = (value: string) => {
        const parsedValue = JSON.parse(value) as LanguageProps

        setSelectedLanguage(parsedValue)
    }

    useEffect(() => {
        if (filteredLanguages.length === 1) {
            setSelectedLanguage(filteredLanguages[0])
        }

        return () => {
            setSelectedLanguage(null)
        }
    }, [filteredLanguages])

    const handleClick = useCallback(() => {
        return new Promise<void>((resolve, reject) => {
            if (!selectedLanguage) {
                reject(new Error('no runtime selected'))

                return
            }

            rceHandler
                .listRuntimes()
                .then(({ runtime }) => {
                    if (!runtime || runtime.length === 0) {
                        reject(new Error('no runtimes available'))

                        return
                    }
                    const runtimeMap = new Map(
                        runtime.map((rt) => [rt.language.toLowerCase(), rt])
                    )
                    const foundRuntime = runtimeMap.get(
                        selectedLanguage.runtime.toLowerCase()
                    )

                    if (!foundRuntime) {
                        reject(new Error('runtime under maintenance'))

                        return
                    }
                    const {
                        runtime: _runtime,
                        extension,
                        mode,
                    } = selectedLanguage

                    const title = `${Array.from(new Set(['index', 'app', 'main', 'entry', 'source', 'code', 'script', 'program']))[Math.floor(Math.random() * 8)]}${extension}`

                    addTab({
                        title,
                        value: '',
                        metadata: {
                            _runtime,
                            mode,
                        },
                        config: {
                            maxValueSize: {
                                value: isMobileView ? 100 : 500,
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
                    setSelectedLanguage(null)
                    setSearchQuery('')
                })
                .catch((error: ErrorResponse) => {
                    if (error instanceof TabError) {
                        reject(error)
                    } else {
                        reject(error)
                        throw error
                    }
                })
        })
    }, [addTab, selectedLanguage, isMobileView, setIsOpen])

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
                        onSubmit={async (e) => {
                            e.preventDefault()
                            toast.promise(handleClick(), {
                                loading: 'checking runtime...',
                                success: 'ready',
                                error: (err: ErrorResponse) => (
                                    <span className="whitespace-nowrap">
                                        {err.message}
                                    </span>
                                ),
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
                                {filteredLanguages.length > 0 ? (
                                    filteredLanguages.map((language) => (
                                        <div
                                            key={language.runtime}
                                            className="snap-start scroll-ms-6"
                                        >
                                            <RadioGroupItem
                                                checked={
                                                    filteredLanguages.length ===
                                                        1 ||
                                                    selectedLanguage?.runtime ===
                                                        language.runtime
                                                }
                                                className="peer sr-only"
                                                id={language.runtime}
                                                value={JSON.stringify(language)}
                                            />
                                            <Label
                                                className={cn(
                                                    'flex size-24 flex-col items-center justify-between gap-y-3 rounded-md border-2 border-default p-4 hover:border-primary peer-data-[state=checked]:border-primary lg:scale-90 lg:hover:scale-100 xl:scale-90 xl:hover:scale-100 [&:has([data-state=checked])]:border-primary'
                                                )}
                                                htmlFor={language.runtime}
                                            >
                                                <Image
                                                    priority
                                                    alt={`
													${language.runtime} icon`}
                                                    className="size-10"
                                                    height={100}
                                                    src={language.src}
                                                    width={100}
                                                />
                                                <span className="text-nowrap">
                                                    {language.runtime}
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
