import type { FC } from "react";

import { type SwitchProps, useSwitch } from "@nextui-org/switch";
import { useIsSSR } from "@react-aria/ssr";
import { VisuallyHidden } from "@react-aria/visually-hidden";
import clsx from "clsx";
import { useTheme } from "next-themes";

import { MoonFilledIcon, SunFilledIcon } from "@/components/ui/icons";

export interface ThemeSwitchProps {
    className?: string;
    classNames?: SwitchProps["classNames"];
}

export const ThemeSwitch: FC<ThemeSwitchProps> = ({ className, classNames }) => {
    const { setTheme, resolvedTheme } = useTheme();
    const isSSR = useIsSSR();

    const onChange = () => {
        resolvedTheme === "light" ? setTheme("dark") : setTheme("light");
    };

    const { Component, slots, isSelected, getBaseProps, getInputProps, getWrapperProps } =
        useSwitch({
            isSelected: resolvedTheme === "light" || isSSR,
            "aria-label": `Switch to ${resolvedTheme === "light" || isSSR ? "dark" : "light"} mode`,
            onChange,
        });

    return (
        <Component
            {...getBaseProps({
                className: clsx(
                    "px-px transition-opacity hover:opacity-80 cursor-pointer",
                    className,
                    classNames?.base,
                ),
            })}
        >
            <VisuallyHidden>
                <input {...getInputProps()} />
            </VisuallyHidden>
            <div
                {...getWrapperProps()}
                className={slots.wrapper({
                    class: clsx(
                        [
                            "h-auto w-auto",
                            "bg-transparent",
                            "rounded-lg",
                            "flex items-center justify-center",
                            "group-data-[selected=true]:bg-transparent",
                            "!text-default-500",
                            "pt-px",
                            "px-0",
                            "mx-0",
                        ],
                        classNames?.wrapper,
                    ),
                })}
            >
                {!isSelected || isSSR ? <SunFilledIcon size={22} /> : <MoonFilledIcon size={22} />}
            </div>
        </Component>
    );
};
