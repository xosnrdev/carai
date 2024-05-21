/* eslint-disable no-unused-vars */
/**
 * Interface for toast properties.
 * @interface IToastProps
 */
export interface IToastProps {
  /** Unique identifier for the toast */
  id: string;

  /** Type of the toast, can be 'success' or 'error' */
  type: 'success' | 'error';

  /** Message to be displayed in the toast */
  message: string;

  /** Position of the toast on the screen */
  position:
    | 'top-center'
    | 'top-left'
    | 'top-right'
    | 'bottom-center'
    | 'bottom-left'
    | 'bottom-right';

  /** Function to be called when the toast is closed */
  onClose: () => void;
}

/**
 * Interface for toast context.
 * @interface IToastContext
 */
export interface IToastContext {
  /** Function to add a toast */
  addToast: (
    id: string,
    message: string,
    type: IToastProps['type'],
    position: IToastProps['position']
  ) => void;

  /** Function to remove a toast */
  removeToast: (id: string) => void;
}
