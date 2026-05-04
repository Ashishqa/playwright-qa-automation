/**
 * Generate random email address
 * @returns {string} Random email
 */
export const generateRandomEmail = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `test.user.${timestamp}.${random}@testdata.com`;
};

/**
 * Generate random string of specified length
 * @param {number} length - Length of string to generate
 * @returns {string} Random string
 */
export const generateRandomString = (length = 10) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Generate random number within range
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random number
 */
export const generateRandomNumber = (min = 1, max = 100) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Generate test order data
 * @returns {object} Order data object
 */
export const generateOrderData = () => {
  return {
    firstName: `First${generateRandomString(5)}`,
    lastName: `Last${generateRandomString(5)}`,
    email: generateRandomEmail(),
    phone: `555${generateRandomNumber(1000, 9999)}`,
    address: `${generateRandomNumber(1, 999)} Test Street`,
    city: 'TestCity',
    state: 'TS',
    zipCode: `${generateRandomNumber(10000, 99999)}`
  };
};

/**
 * Get current timestamp in readable format
 * @returns {string} Formatted timestamp
 */
export const getTimestamp = () => {
  return new Date().toISOString().replace(/[:.]/g, '-');
};
