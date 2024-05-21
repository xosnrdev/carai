import { IToastContext, IToastProps } from '@/lib/types/toast';
import { debounce } from 'lodash';
import { FC, ReactNode, createContext, useCallback, useState } from 'react';
import Toast from '../components/ui/toast/toast';

/**
 * Context for toast.
 * @type {React.Context<IToastContext | undefined>}
 */
export const ToastContext: React.Context<IToastContext | undefined> =
  createContext<IToastContext | undefined>(undefined);

interface IToastProviderProps {
  children: ReactNode;
}

/**
 * Toast provider component.
 * @param {IToastProviderProps} props - The props.
 */
const ToastProvider: FC<IToastProviderProps> = ({
  children,
}: IToastProviderProps) => {
  const [toasts, setToasts] = useState<IToastProps[]>([]);

  /**
   * Remove a toast from the list of toasts.
   * @param {string} toastId - The ID of the toast to remove.
   */
  const removeToast = useCallback((toastId: string) => {
    setToasts((prevToasts) =>
      prevToasts.filter((toast) => toast.id !== toastId)
    );
  }, []);

  /**
   * Add a toast to the list of toasts.
   * @param {string} toastId - The ID of the toast.
   * @param {string} toastMessage - The message of the toast.
   * @param {IToastProps['type']} toastType - The type of the toast.
   * @param {IToastProps['position']} toastPosition - The position of the toast.
   */
  const addToast = useCallback(
    (
      toastId: string,
      toastMessage: string,
      toastType: IToastProps['type'],
      toastPosition: IToastProps['position']
    ) => {
      const debouncedAddToast = debounce(
        () => {
          // Check if a toast with the same ID already exists
          const doesToastExist = toasts.some((toast) => toast.id === toastId);

          if (doesToastExist) {
            return;
          }

          // Create a new toast
          const newToast: IToastProps = {
            id: toastId,
            type: toastType,
            message: toastMessage,
            position: toastPosition,
            onClose: () => removeToast(toastId),
          };

          // Add the new toast to the list of toasts
          setToasts((toasts) => [...toasts, newToast]);

          // Calculate the duration for the toast based on the length of the message
          const toastDuration = calculateToastDuration(toastMessage);

          // Set a timer to automatically remove the toast after the calculated duration
          const toastTimer = setTimeout(
            () => removeToast(toastId),
            toastDuration
          );

          // Return a cleanup function that clears the timeout
          return () => clearTimeout(toastTimer);
        },
        500,
        { trailing: true }
      );

      debouncedAddToast();
    },
    [toasts, removeToast]
  );

  /**
   * Calculate the duration for the toast based on the length of the message.
   * @param {string} toastMessage - The message displayed in the toast.
   * @returns {number} The duration for the toast based on the length of the message.
   */
  const calculateToastDuration = (toastMessage: string) => {
    return toastMessage.split(' ').length * 2000;
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </ToastContext.Provider>
  );
};

export default ToastProvider;
