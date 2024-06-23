import { FC } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from './dialog'

const Modal: FC<ModalProps> = ({ title, description, children, onClose }) => {
	return (
		<>
			<Dialog open onOpenChange={onClose}>
				<DialogContent className="max-w-sm bg-secondary lg:max-w-lg xl:max-w-lg">
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
					{children}
				</DialogContent>
			</Dialog>
		</>
	)
}

export default Modal
