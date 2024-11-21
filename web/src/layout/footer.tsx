import { Button } from "@nextui-org/button";
import { Navbar, NavbarContent, NavbarItem } from "@nextui-org/navbar";
import { useTheme } from "next-themes";
import { IoMdCloseCircle } from "react-icons/io";

import useAppContext from "@/src/hooks/useAppContext";
import useTabContext from "@/src/hooks/useTabContext";

import { useState } from "react";
import { GoAlertFill } from "react-icons/go";
import type { IconType } from "react-icons/lib";
import { MdInfo } from "react-icons/md";
import ActionModal from "../components/action_modal";

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
                        {footer.map((v, idx) => (
                            <NavbarItem key={v.icon.name}>
                                <Button
                                    isIconOnly
                                    color={resolvedTheme === "dark" ? "default" : "primary"}
                                    size="sm"
                                    startContent={<v.icon size={30} />}
                                    variant="light"
                                    onPress={() => {
                                        idx === 0
                                            ? setIsFooterOpen(false)
                                            : idx === 2
                                              ? setIsOpen({ actionModal: true })
                                              : null;
                                    }}
                                />
                            </NavbarItem>
                        ))}
                    </NavbarContent>
                )}
            </Navbar>
            {isOpen.actionModal && <ActionModal />}
        </>
    );
}

type _Footer = {
    icon: IconType;
};

const footer: _Footer[] = [
    {
        icon: IoMdCloseCircle,
    },
    {
        icon: GoAlertFill,
    },
    {
        icon: MdInfo,
    },
] as const;
