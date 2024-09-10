import type { Runtime } from './index.types'

import { Button } from '@nextui-org/button'
import { Input } from '@nextui-org/input'
import * as Sentry from '@sentry/nextjs'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import { useCallback, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'

import useAppContext from '@/hooks/useAppContext'
import useTabContext from '@/hooks/useTabContext'
import { cn, languageNameTransformMap, transformString } from '@/lib/utils'

import { DialogFooter } from '../dialog'
import { Label } from '../label'
import Modal from '../modal'
import { RadioGroup, RadioGroupItem } from '../radio-group'

import { runtimeMap } from '.'

export default function LanguageCollection() {
    const [selectedRuntime, setSelectedRuntime] = useState<Runtime | null>(null)
    const [searchQuery, setSearchQuery] = useState('')

    const [newEntryPoint, setnewEntryPoint] = useState('')
    const { setIsOpen } = useAppContext()
    const { addTab } = useTabContext()

    const { resolvedTheme } = useTheme()

    const filteredRuntimes = useMemo(() => {
        const lowerCaseSearchQuery = searchQuery.toLowerCase().trim()

        const buildBadCharTable = (pattern: string) => {
            const table: number[] = new Array(256).fill(pattern.length)

            for (let i = 0; i < pattern.length - 1; i++) {
                table[pattern.charCodeAt(i)] = pattern.length - 1 - i
            }

            return table
        }

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

        const sortedRuntimeProps = Array.from(runtimeMap.entries())
            .slice()
            .sort(([_, propsA], [__, propsB]) => {
                return (
                    propsA.languageName.trim().length -
                    propsB.languageName.trim().length
                )
            })

        return sortedRuntimeProps.filter(([_, props]) => {
            const lowerCaseTitle = props.languageName.trim().toLowerCase()

            if (lowerCaseSearchQuery.length === 1) {
                return lowerCaseTitle.charAt(0) === lowerCaseSearchQuery
            }

            return boyerMooreSearch(lowerCaseTitle, lowerCaseSearchQuery)
        })
    }, [searchQuery])

    useEffect(() => {
        if (filteredRuntimes.length === 1) {
            setSelectedRuntime(filteredRuntimes[0][1])
        }

        return () => setSelectedRuntime(null)
    }, [filteredRuntimes])

    const handleChange = (value: string) => {
        const parsedValue = JSON.parse(value) as Runtime

        setSelectedRuntime(parsedValue)
    }

    const handleSelectedLanguage = useCallback(() => {
        if (!selectedRuntime) {
            toast.error('No language selected')

            return
        }

        try {
            const { snippet, entryPoint, languageName } = selectedRuntime
            const filename = newEntryPoint.trim() || entryPoint

            addTab({
                filename,
                content: newEntryPoint ? '' : snippet,

                metadata: {
                    languageName,
                },
                config: {
                    maxContentDelimiter: {
                        limit: 10485760,
                        units: 'bytes',
                    },
                    maxTabs: Infinity,
                    isClosable: true,
                },
            })
            setIsOpen({
                modal: false,
            })

            setSelectedRuntime(null)
            setSearchQuery('')
            setnewEntryPoint('')
        } catch (error) {
            Sentry.captureException(error)
            toast.error((error as Error).message)
        }
    }, [addTab, selectedRuntime, setIsOpen, newEntryPoint])

    return (
        <Modal
            aria-label="choose language modal"
            className="max-w-lg"
            title="Choose a Language"
            onOpenChange={(open) =>
                setIsOpen({
                    modal: open,
                })
            }
        >
            <form
                className="flex flex-col justify-between gap-y-4 overflow-hidden"
                onSubmit={(e) => {
                    e.preventDefault()
                    handleSelectedLanguage()
                }}
            >
                <div className="inline-flex flex-row gap-x-2">
                    <Input
                        autoFocus
                        aria-label="enter filename"
                        color={resolvedTheme === 'dark' ? 'default' : 'primary'}
                        id="filename-input"
                        label="Enter Filename"
                        maxLength={20}
                        role="searchbox"
                        size={'md'}
                        type="text"
                        value={newEntryPoint}
                        variant="bordered"
                        onChange={(e) => setnewEntryPoint(e.target.value)}
                    />
                    <Input
                        fullWidth
                        aria-label="search language"
                        color={resolvedTheme === 'dark' ? 'default' : 'primary'}
                        id="searchQuery-input"
                        label="Search Language"
                        maxLength={20}
                        role="searchbox"
                        size={'md'}
                        type="text"
                        value={searchQuery}
                        variant="bordered"
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div dir="ltr">
                    <RadioGroup
                        className="flex snap-x snap-mandatory flex-row gap-4 overflow-x-auto"
                        orientation="vertical"
                        tabIndex={-1}
                        onValueChange={handleChange}
                    >
                        {filteredRuntimes.length > 0 ? (
                            filteredRuntimes.map(([_, runtime]) => (
                                <div
                                    key={runtime.languageName}
                                    className="snap-start scroll-ms-6"
                                >
                                    <RadioGroupItem
                                        checked={
                                            filteredRuntimes.length === 1 ||
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
                                            src={`/assets/language/${runtime.languageName.toLowerCase()}.svg`}
                                            width={100}
                                        />
                                        <span className="text-nowrap">
                                            {transformString({
                                                str: runtime.languageName,
                                                map: languageNameTransformMap,
                                                capitalize: true,
                                            })}
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
                        color={resolvedTheme === 'dark' ? 'default' : 'primary'}
                        startContent={<span>Code</span>}
                        type="submit"
                        variant="ghost"
                    />
                </DialogFooter>
            </form>
        </Modal>
    )
}
