import type { FC } from 'react'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { BiSolidRightArrow } from 'react-icons/bi'
import { Button } from '@nextui-org/button'
import { useTheme } from 'next-themes'

import { onboardingProps } from '@/lib/constants/ui'

const Onboarding: FC = () => {
    const router = useRouter()
    const { resolvedTheme } = useTheme()

    return (
        <div className="relative flex place-items-center pt-4 lg:flex-row lg:justify-between lg:px-12 xl:flex-row xl:justify-between xl:px-12">
            <div className="flex h-[calc(100dvh-25dvh)] flex-col space-y-12">
                <h1 className="text-3xl font-extrabold text-primary dark:text-default-foreground lg:text-5xl xl:text-5xl">
                    Get Started with Carai
                </h1>

                <ul className="flex h-full flex-col justify-between">
                    {onboardingProps.texts.map((text, idx) => (
                        <li
                            key={idx}
                            className="flex flex-row items-center gap-x-1.5 gap-y-2 text-nowrap text-base text-[#757582] transition-opacity duration-300 hover:cursor-pointer hover:opacity-75 dark:text-[#85858d] lg:text-xl xl:text-xl"
                        >
                            <BiSolidRightArrow />
                            <p>{text}</p>
                        </li>
                    ))}
                </ul>

                <div className="flex flex-col gap-y-4">
                    {onboardingProps.links.map(({ id, path, label }) => (
                        <Button
                            key={id}
                            color={
                                resolvedTheme === 'dark' ? 'default' : 'primary'
                            }
                            radius="none"
                            size={'md'}
                            startContent={<span>{label}</span>}
                            variant="ghost"
                            onClick={(e) => {
                                router.push(path)
                                e.preventDefault()
                            }}
                        />
                    ))}
                </div>
            </div>
            <div className="hidden md:block lg:block xl:block">
                <Image
                    priority
                    alt="coding illustration"
                    className="h-auto w-auto"
                    height={500}
                    src={'/onboarding.svg'}
                    width={500}
                />
            </div>
        </div>
    )
}

export default Onboarding
