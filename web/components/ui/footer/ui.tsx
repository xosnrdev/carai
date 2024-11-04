import { Button } from "@nextui-org/button";
import { Navbar, NavbarContent, NavbarItem } from "@nextui-org/navbar";
import { useTheme } from "next-themes";
import { useState } from "react";

import useAppContext from "@/hooks/useAppContext";
import useTabContext from "@/hooks/useTabContext";

import UserGuide from "../docs/ui";

import { footer } from ".";

export default function Footer() {
    const { activeTab } = useTabContext();
    const { resolvedTheme } = useTheme();
    const { isOpen, setIsOpen } = useAppContext();
    const [isFooterOpen, setIsFooterOpen] = useState(true);

    return (
        <>
            <Navbar className="h-16 border-y border-default" isBlurred={false} maxWidth="full">
                {activeTab && isFooterOpen && (
                    <NavbarContent className="-space-x-2">
                        {footer.map((f, idx) => (
                            <NavbarItem key={f.icon.displayName}>
                                <Button
                                    isIconOnly
                                    color={resolvedTheme === "dark" ? "default" : "primary"}
                                    size="sm"
                                    startContent={<f.icon size={30} />}
                                    variant="light"
                                    onPress={() => {
                                        idx === 0
                                            ? setIsFooterOpen(false)
                                            : idx === 2
                                              ? setIsOpen({ userGuide: true })
                                              : null;
                                    }}
                                />
                            </NavbarItem>
                        ))}
                    </NavbarContent>
                )}
            </Navbar>
            {isOpen.userGuide && <UserGuide />}
        </>
    );
}
