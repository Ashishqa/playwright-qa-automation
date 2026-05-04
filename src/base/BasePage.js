import { takeScreenshot } from '../helpers/screenshotHelper.js';

/**
 * Base Page class that all page objects extend
 */
export class BasePage {
  /**
   * Constructor for BasePage
   * @param {Page} page - Playwright page object
   * @param {object} config - Configuration object
   * @param {object} logger - Logger instance
   */
  constructor(page, config, logger) {
    this.page = page;
    this.config = config;
    this.logger = logger;
  }

  /**
   * Navigate to a specific URL
   * @param {string} path - Path to navigate to
   * @returns {Promise<void>}
   */
  async navigateTo(path = '') {
    this.logger.info(`[BasePage] Navigating to: ${path}`);
    try {
      const url = path.startsWith('http') ? path : `${this.config.baseURL}${path}`;
      await this.page.goto(url, { waitUntil: 'networkidle' });
      this.logger.info(`[BasePage] Navigation completed`);
    } catch (error) {
      this.logger.error(`[BasePage] Navigation failed: ${error.message}`);
      await takeScreenshot(this.page, 'navigation-error');
      throw error;
    }
  }

  /**
   * Wait for page to load
   * @param {number} timeout - Timeout in milliseconds
   * @returns {Promise<void>}
   */
  async waitForPageLoad(timeout = 30000) {
    this.logger.info(`[BasePage] Waiting for page load...`);
    try {
      await this.page.waitForLoadState('networkidle', { timeout });
      this.logger.info(`[BasePage] Page load completed`);
    } catch (error) {
      this.logger.error(`[BasePage] Page load timeout: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get current page URL
   * @returns {string} Current URL
   */
  getCurrentURL() {
    this.logger.info(`[BasePage] Getting current URL`);
    return this.page.url();
  }

  /**
   * Get page title
   * @returns {string} Page title
   */
  async getPageTitle() {
    this.logger.info(`[BasePage] Getting page title`);
    return await this.page.title();
  }

  /**
   * Verify element is visible
   * @param {Locator} locator - Playwright locator
   * @returns {Promise<boolean>}
   */
  async isElementVisible(locator) {
    try {
      return await locator.isVisible();
    } catch (error) {
      return false;
    }
  }

  /**
   * Verify element exists
   * @param {Locator} locator - Playwright locator
   * @returns {Promise<boolean>}
   */
  async doesElementExist(locator) {
    try {
      return await locator.isVisible({ timeout: 5000 });
    } catch (error) {
      return false;
    }
  }

  /**
   * Get text from element
   * @param {Locator} locator - Playwright locator
   * @returns {Promise<string>}
   */
  async getElementText(locator) {
    await locator.waitFor({ state: 'visible' });
    return (await locator.textContent()).trim();
  }

  /**
   * Take a screenshot (helper method)
   * @param {string} name - Screenshot name
   * @returns {Promise<string>}
   */
  async takeScreenshot(name) {
    return await takeScreenshot(this.page, name);
  }
}
