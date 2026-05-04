/**
 * Wait for element to be visible
 * @param {Page} page - Playwright page object
 * @param {Locator} locator - Playwright locator
 * @param {object} options - Optional configuration
 * @param {number} options.timeout - Maximum time to wait (ms)
 * @returns {Promise<void>}
 */
export const waitForElement = async (page, locator, options = {}) => {
  const timeout = options.timeout || 30000;
  await locator.waitFor({ state: 'visible', timeout });
};

/**
 * Wait for element text to match
 * @param {Page} page - Playwright page object
 * @param {Locator} locator - Playwright locator
 * @param {string} text - Expected text
 * @param {object} options - Optional configuration
 * @param {number} options.timeout - Maximum time to wait (ms)
 * @returns {Promise<void>}
 */
export const waitForText = async (page, locator, text, options = {}) => {
  const timeout = options.timeout || 30000;
  await locator.getByText(new RegExp(text, 'i')).waitFor({ state: 'visible', timeout });
};

/**
 * Wait for URL to match pattern
 * @param {Page} page - Playwright page object
 * @param {string|RegExp} urlPattern - URL pattern or string to match
 * @param {object} options - Optional configuration
 * @param {number} options.timeout - Maximum time to wait (ms)
 * @returns {Promise<void>}
 */
export const waitForURL = async (page, urlPattern, options = {}) => {
  const timeout = options.timeout || 30000;
  await page.waitForURL(urlPattern, { timeout });
};

/**
 * Wait for element to disappear
 * @param {Page} page - Playwright page object
 * @param {Locator} locator - Playwright locator
 * @param {object} options - Optional configuration
 * @param {number} options.timeout - Maximum time to wait (ms)
 * @returns {Promise<void>}
 */
export const waitForElementToDisappear = async (page, locator, options = {}) => {
  const timeout = options.timeout || 30000;
  await locator.waitFor({ state: 'hidden', timeout });
};

/**
 * Wait for network idle
 * @param {Page} page - Playwright page object
 * @param {object} options - Optional configuration
 * @param {number} options.timeout - Maximum time to wait (ms)
 * @returns {Promise<void>}
 */
export const waitForNetworkIdle = async (page, options = {}) => {
  const timeout = options.timeout || 30000;
  await page.waitForLoadState('networkidle', { timeout });
};

/**
 * Retry action with exponential backoff
 * @param {Function} fn - Async function to retry
 * @param {object} options - Retry configuration
 * @param {number} options.retries - Number of retries (default: 3)
 * @param {number} options.initialDelay - Initial delay in ms (default: 500)
 * @param {number} options.factor - Exponential backoff factor (default: 2)
 * @param {number} options.maxDelay - Maximum delay in ms (default: 8000)
 * @param {Function} options.onRetry - Callback on retry (attempt, error)
 * @returns {Promise<any>} Result of the function
 * @throws {Error} After retries exhausted
 */
export const retryAction = async (fn, options = {}) => {
  const {
    retries = 3,
    initialDelay = 500,
    factor = 2,
    maxDelay = 8000,
    onRetry
  } = options;

  let lastError;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt === retries) {
        throw new Error(
          `Action failed after ${retries} retries. Last error: ${error.message}`
        );
      }

      const jitter = Math.random() * 100;
      const delay = Math.min(
        initialDelay * Math.pow(factor, attempt) + jitter,
        maxDelay
      );

      if (onRetry) {
        onRetry(attempt + 1, error);
      }

      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw new Error(
    `Action failed after ${retries} retries. Last error: ${lastError.message}`
  );
};
