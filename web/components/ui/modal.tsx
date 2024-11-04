import type {
    DialogContentProps,
    DialogOverlayProps,
    DialogProps,
    DialogTitleProps,
} from "@radix-ui/react-dialog";
import type { FC } from "react";

import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from "./dialog";

interface IModalProps
    extends DialogProps,
        DialogOverlayProps,
        DialogContentProps,
        DialogTitleProps {}

const Modal: FC<IModalProps> = ({
    title,
    children,
    className,
    onOpenChange = () => {},
    ...props
}) => {
    return (
        <Dialog open onOpenChange={onOpenChange} {...props}>
            <DialogOverlay>
                <DialogContent
                    aria-describedby={undefined}
                    className={`border-default ${className} `}
                >
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                    </DialogHeader>
                    {children}
                </DialogContent>
            </DialogOverlay>
        </Dialog>
    );
};

export default Modal;
