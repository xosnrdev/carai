import { FC, ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '../dialog/dialog';

interface IModalProps {
  title: string;
  description?: string;
  children?: ReactNode;
  onClose: () => void;
}

const Modal: FC<IModalProps> = ({ title, description, children, onClose }) => (
  <>
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-secondary max-w-md">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
        {children}
      </DialogContent>
    </Dialog>
  </>
);

export default Modal;
