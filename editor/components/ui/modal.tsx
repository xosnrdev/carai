import type { FC } from 'react'
import type {
    DialogContentProps,
    DialogOverlayProps,
    DialogProps,
    DialogTitleProps,
} from '@radix-ui/react-dialog'

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogOverlay,
    DialogTitle,
} from './dialog'

interface IModalProps
    extends DialogProps,
        DialogOverlayProps,
        DialogContentProps,
        DialogTitleProps {}

const Modal: FC<IModalProps> = ({
    title,
    children,
    onOpenChange,
    ...props
}) => {
    return (
        <Dialog open onOpenChange={onOpenChange} {...props}>
            <DialogOverlay>
                <DialogContent
                    aria-describedby={undefined}
                    className="max-w-sm border-default md:max-w-md lg:max-w-lg xl:max-w-lg"
                >
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                    </DialogHeader>
                    {children}
                </DialogContent>
            </DialogOverlay>
        </Dialog>
    )
}

export default Modal
