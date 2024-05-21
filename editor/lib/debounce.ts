/* eslint-disable no-unused-vars */
/**
 * Creates a debounced function that delays invoking the provided function
 * until after `waitMilliseconds` have elapsed since the last time the
 * debounced function was invoked.
 *
 * @template T - The type of the function to debounce.
 *
 * @param {T} func - The function to debounce.
 * @param {number} [waitMilliseconds=50] - The number of milliseconds to delay.
 *
 * @returns {(...funcArgs: Parameters<T>) => void} - The debounced function.
 */
function debounce<T extends (...args: any[]) => void>(
  func: T,
  waitMilliseconds: number = 50
): (...funcArgs: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func(...args);
    }, waitMilliseconds);
  };
}

export default debounce;
