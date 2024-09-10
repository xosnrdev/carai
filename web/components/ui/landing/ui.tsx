'use client'

import { Button } from '@nextui-org/button'
import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
} from '@nextui-org/navbar'
import { motion } from 'framer-motion'
import {
    BracesIcon,
    ChevronRightIcon,
    CogIcon,
    GithubIcon,
    TwitterIcon,
    ZapIcon,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { type FC, type ReactNode } from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import {
    atomOneDark,
    atomOneLight,
} from 'react-syntax-highlighter/dist/esm/styles/hljs'

import useCodeRunner from '@/hooks/useRunCode'
import { cn } from '@/lib/utils'

import { codeSnippet, features } from '.'

export default function LandingPage() {
    const router = useRouter()
    const { isRunning, codeResponse, run, error } = useCodeRunner()
    const { languageName, filename, content } = codeSnippet
    const { resolvedTheme } = useTheme()

    const runningCtx = `Running ${filename}...`
    const timeCtx = `Finished in ${codeResponse?.time}ms`

    const handleCodeRunner = async () => {
        await run({
            languageName,
            content,
            filename,
        })
    }

    return (
        <div className="min-h-dvh bg-gradient-to-b from-background to-default selection:bg-secondary selection:text-white">
            <header className="container mx-auto">
                <Navbar
                    className="bg-inherit"
                    isBlurred={false}
                    maxWidth="full"
                    position="static"
                >
                    <NavbarBrand>
                        <BracesIcon className="size-6 text-primary lg:size-8" />
                        <span className="text-lg font-bold md:text-3xl">
                            Carai
                        </span>
                    </NavbarBrand>
                    <NavbarContent justify="end">
                        <NavbarItem className="transition-colors duration-500">
                            <Link
                                className="text-sm hover:text-primary md:text-lg"
                                href="#features"
                            >
                                Features
                            </Link>
                        </NavbarItem>
                        <NavbarItem>
                            <Link
                                className="text-sm hover:text-primary md:text-lg"
                                href="#demo"
                            >
                                Demo
                            </Link>
                        </NavbarItem>
                        <NavbarItem>
                            <Link
                                className="text-sm hover:text-primary md:text-lg"
                                href="/sandbox"
                            >
                                Sandbox
                            </Link>
                        </NavbarItem>
                    </NavbarContent>
                </Navbar>
            </header>

            <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <section className="mb-16 text-center">
                    <motion.h1
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 text-3xl font-bold md:text-5xl"
                        initial={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                    >
                        Write, Test, and Share Code Online
                    </motion.h1>
                    <motion.p
                        animate={{ opacity: 1, y: 0 }}
                        className="mx-auto mb-8 max-w-prose text-base text-default-500 md:text-xl"
                        initial={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        An online platform to easily write, test, and share code
                        with others at the speed of thought. Your all-in-one
                        open-source platform for coding sessions, testing, and
                        collaboration.
                    </motion.p>
                    <motion.div
                        animate={{ opacity: 1, y: 0 }}
                        initial={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <Button
                            className="text-white"
                            color="primary"
                            endContent={<ChevronRightIcon size={16} />}
                            radius="sm"
                            size="lg"
                            startContent={<span>Try Sandbox</span>}
                            variant="shadow"
                            onPress={() => router.push('/sandbox')}
                        />
                    </motion.div>
                </section>

                <section className="mb-16" id="features">
                    <h2 className="mb-8 text-center text-2xl font-bold md:text-3xl">
                        Features
                    </h2>
                    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="cursor-pointer rounded-lg bg-background p-4 shadow-lg transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-xl sm:p-6 lg:p-8"
                            >
                                <feature.icon
                                    className="mb-4 text-primary"
                                    size={40}
                                />
                                <h3 className="mb-2 text-lg font-semibold md:text-xl">
                                    {feature.title}
                                </h3>
                                <p className="text-default-500">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mb-16" id="demo">
                    <h2 className="mb-8 text-center text-2xl font-bold md:text-3xl">
                        Demo
                    </h2>
                    <CodeBlock
                        code={
                            <div className="space-y-4">
                                <SyntaxHighlighter
                                    showLineNumbers
                                    wrapLongLines
                                    customStyle={{
                                        background: 'inherit',
                                    }}
                                    language={languageName}
                                    style={
                                        resolvedTheme === 'dark'
                                            ? atomOneDark
                                            : atomOneLight
                                    }
                                >
                                    {content}
                                </SyntaxHighlighter>
                                {isRunning ? (
                                    <SyntaxHighlighter
                                        customStyle={{
                                            background: 'inherit',
                                        }}
                                        style={
                                            resolvedTheme === 'dark'
                                                ? atomOneDark
                                                : atomOneLight
                                        }
                                    >
                                        {runningCtx}
                                    </SyntaxHighlighter>
                                ) : codeResponse?.time ? (
                                    <SyntaxHighlighter
                                        customStyle={{
                                            background: 'inherit',
                                        }}
                                        style={
                                            resolvedTheme === 'dark'
                                                ? atomOneDark
                                                : atomOneLight
                                        }
                                    >
                                        {timeCtx}
                                    </SyntaxHighlighter>
                                ) : null}
                                <div
                                    className={cn(
                                        'transition-opacity duration-500',
                                        {
                                            'opacity-0': isRunning,
                                            'opacity-100': !isRunning,
                                        }
                                    )}
                                >
                                    {codeResponse?.stderr && (
                                        <SyntaxHighlighter
                                            customStyle={{
                                                background: 'inherit',
                                            }}
                                            style={
                                                resolvedTheme === 'dark'
                                                    ? atomOneDark
                                                    : atomOneLight
                                            }
                                        >
                                            {codeResponse.stderr}
                                        </SyntaxHighlighter>
                                    )}
                                    {codeResponse?.stdout && (
                                        <SyntaxHighlighter
                                            customStyle={{
                                                background: 'inherit',
                                            }}
                                            style={
                                                resolvedTheme === 'dark'
                                                    ? atomOneDark
                                                    : atomOneLight
                                            }
                                        >
                                            {codeResponse.stdout}
                                        </SyntaxHighlighter>
                                    )}
                                    {error && (
                                        <SyntaxHighlighter
                                            customStyle={{
                                                background: 'inherit',
                                            }}
                                            style={
                                                resolvedTheme === 'dark'
                                                    ? atomOneDark
                                                    : atomOneLight
                                            }
                                        >
                                            {error}
                                        </SyntaxHighlighter>
                                    )}
                                </div>
                            </div>
                        }
                    />
                    <div className="mt-4 text-center">
                        <Button
                            className={cn(
                                'animate-pulse text-white hover:animate-none',
                                {
                                    'animate-none': isRunning,
                                }
                            )}
                            color="success"
                            endContent={
                                <ZapIcon
                                    className={cn({ hidden: isRunning })}
                                    size={16}
                                />
                            }
                            isDisabled={isRunning}
                            isLoading={isRunning}
                            radius="sm"
                            size="lg"
                            spinner={
                                <CogIcon
                                    className={cn({
                                        'animate-spin': isRunning,
                                    })}
                                    size={16}
                                />
                            }
                            spinnerPlacement="end"
                            startContent={<span>Click me</span>}
                            onPress={handleCodeRunner}
                        />
                    </div>
                </section>

                <section className="mb-16 text-center">
                    <h2 className="mb-8 text-2xl font-bold md:text-3xl">
                        Ready to get started?
                    </h2>
                    <div>
                        <Button
                            className="text-white"
                            color="primary"
                            endContent={<ChevronRightIcon size={16} />}
                            radius="sm"
                            size="lg"
                            startContent={<span>Try Sandbox</span>}
                            variant="shadow"
                            onPress={() => router.push('/sandbox')}
                        />
                    </div>
                </section>

                <footer className="container mx-auto">
                    <Navbar
                        className="bg-inherit"
                        isBlurred={false}
                        maxWidth="full"
                        position="static"
                    >
                        <NavbarBrand>
                            <p>
                                Copyright &copy; {new Date().getFullYear()}{' '}
                                Carai
                            </p>
                        </NavbarBrand>
                        <NavbarContent justify="end">
                            <NavbarItem>
                                <Link
                                    className="text-default-500 transition-colors hover:text-primary"
                                    href="https://github.com/xosnrdev/carai"
                                    rel="noopener noreferrer"
                                    target="_blank"
                                >
                                    <GithubIcon size={24} />
                                </Link>
                            </NavbarItem>
                            <NavbarItem>
                                <Link
                                    className="text-default-500 transition-colors hover:text-primary"
                                    href="https://twitter.com/xosnrdev"
                                    rel="noopener noreferrer"
                                    target="_blank"
                                >
                                    <TwitterIcon size={24} />
                                </Link>
                            </NavbarItem>
                        </NavbarContent>
                    </Navbar>
                </footer>
            </main>
        </div>
    )
}

const CodeBlock: FC<{ code: ReactNode }> = ({ code }) => {
    return (
        <div className="mx-auto max-w-prose rounded-lg bg-background pb-4 text-default-500 shadow-lg">
            <div className="flex items-center justify-start space-x-2 rounded-t-lg p-3">
                <span className="size-3 rounded-full bg-red-500" />
                <span className="size-3 rounded-full bg-yellow-500" />
                <span className="size-3 rounded-full bg-green-500" />
            </div>

            {code}
        </div>
    )
}
