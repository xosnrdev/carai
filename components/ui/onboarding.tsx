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
        <div className="m-12 flex flex-col items-center lg:flex-row lg:justify-between xl:flex-row xl:justify-between">
            <div className="flex flex-col space-y-12">
                <h1 className="text-5xl font-black text-primary dark:text-default-foreground lg:text-5xl xl:text-5xl">
                    Get Started with Carai
                </h1>

                <ul className="">
                    {onboardingProps.texts.map((text, idx) => (
                        <li
                            key={idx}
                            className="<duration-300 mb-12 flex flex-row items-center gap-x-1.5 whitespace-nowrap text-2xl font-light text-[#757582] transition-opacity hover:scale-105 hover:cursor-pointer hover:opacity-75 dark:text-[#85858d]"
                        >
                            <BiSolidRightArrow />
                            <p>{text}</p>
                        </li>
                    ))}
                </ul>

                <div className="inline-flex flex-col gap-y-4">
                    {onboardingProps.links.map(({ id, path, label }) => (
                        <Button
                            key={id}
                            fullWidth
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
            <div className="hidden lg:block xl:block">
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
