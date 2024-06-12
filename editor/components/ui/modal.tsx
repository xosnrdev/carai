import { FC } from 'react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
} from './dialog';

const Modal: FC<ModalProps> = ({ title, description, children, onClose }) => {
	return (
		<>
			<Dialog open onOpenChange={onClose}>
				<DialogContent className="bg-secondary">
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
					{children}
				</DialogContent>
			</Dialog>
		</>
	);
};

export default Modal;
