import { ToastContext } from '@/context/toast';
import randomString from '@/lib/random-string';
import { IToastProps } from '@/lib/types/toast';
import { useContext } from 'react';

/**
 * Custom hook to use the toast context.
 * @function useToast
 * @returns {Function} - The toast function.
 */
const useToast = (): Function => {
  const toastContext = useContext(ToastContext);

  if (!toastContext) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  const { addToast } = toastContext;

  /**
   * Function to create a toast.
   * @param {string} message - The message of the toast.
   * @param {Object} options - The options for the toast.
   * @param {IToastProps['type']} options.type - The type of the toast.
   * @param {IToastProps['position']} options.position - The position of the toast.
   */
  const toast = (
    message: string,
    options: {
      type?: IToastProps['type'];
      position?: IToastProps['position'];
    } = {}
  ) => {
    const { type = 'success', position = 'top-right' } = options;
    const id = randomString.uuid();
    addToast(id, message, type, position);
  };

  return toast;
};

export default useToast;
