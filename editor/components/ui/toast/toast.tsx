import { IToastProps } from '@/lib/types/toast';
import { motion } from 'framer-motion';
import { Info, XCircle } from 'lucide-react';
import { FC, memo, useCallback } from 'react';

/**
 * Toast component.
 * @component
 */
const Toast: FC<IToastProps> = memo(({ type, message, position, onClose }) => {
  /**
   * Styles for different types of toasts.
   */
  const toastStyle = {
    error: 'border-red-500 bg-red-200 text-red-500',
    success: 'border-green-500 bg-green-200 text-green-500',
  };

  /**
   * Positions for toasts.
   */
  const toastPositions = {
    'top-center': 'top-2 left-1/2 transform -translate-x-1/2',
    'top-left': 'top-2 left-2',
    'top-right': 'top-2 right-2',
    'bottom-center': 'bottom-2 left-1/2 transform -translate-x-1/2',
    'bottom-left': 'bottom-2 left-2',
    'bottom-right': 'bottom-2 right-2',
  };

  /**
   * Variants for toast motion.
   */
  const motionVariants = {
    initial: {
      opacity: 0,
      y: position.includes('top') ? -50 : 50,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100 },
    },
    exit: {
      opacity: 0,
      y: position.includes('top') ? -50 : 50,
      transition: { duration: 0.5 },
    },
  };

  /**
   * Handle the close event.
   * Calls the onClose function passed in the props.
   */
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <motion.div
      animate="animate"
      initial="initial"
      exit="exit"
      variants={motionVariants}
      className={`px-3 py-4 border border-solid rounded-xl z-50 ${toastStyle[type]} absolute ${toastPositions[position]}`}
    >
      <div className="flex flex-row items-center justify-between gap-x-3">
        <button onClick={handleClose} aria-label="Information">
          <Info size={24} className={`cursor-pointer ${toastStyle[type]}`} />
        </button>
        <p className={`text-base ${toastStyle[type]}`}>{message}</p>
        <button onClick={handleClose} aria-label="Close">
          <XCircle size={24} className={`cursor-pointer ${toastStyle[type]}`} />
        </button>
      </div>
    </motion.div>
  );
});

Toast.displayName = 'Toast';

export default Toast;
