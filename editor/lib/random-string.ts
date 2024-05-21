/**
 * Generates a UUID (Universally Unique Identifier).
 * @function generateUUID
 * @returns {string} - The generated UUID.
 */
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.floor(Math.random() * 16);
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Object containing utility functions for generating random strings.
 */
const randomString = {
  /** Function to generate a UUID */
  uuid: generateUUID,
};

export default randomString;
