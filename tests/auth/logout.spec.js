import { test, expect } from '../../src/fixtures/testFixtures.js';
import * as allure from 'allure-js-commons';
import { users } from '../../test-data/users.js';
import { timeouts } from '../../config/timeouts.js';

test.describe('Authentication - Logout', () => {
  test.beforeEach(async ({ loginPage, page, logger }) => {
    logger.info('Setting up: Logging in before logout test');
    await loginPage.navigateToLoginPage();
    const { username, password } = users.valid;
    await loginPage.login(username, password);
    await page.waitForLoadState('networkidle', { timeout: timeouts.NETWORK_IDLE });
  });
  test('Positive: Logout from ecommerce page', { tag: ['@smoke', '@regression'] }, async ({ ecommercePage, loginPage, page, logger }) => {
    allure.label('feature', 'Authentication');
    allure.label('story', 'User Logout');
    allure.severity('normal');
    allure.owner('Ashish');
    allure.tag('@smoke');
    allure.tag('@regression');

    try {
      logger.info('Clicking logout button');
      await ecommercePage.clickLogout();
      await page.waitForLoadState('networkidle', { timeout: timeouts.NETWORK_IDLE });

      logger.info('Verifying user is logged out');
      const isLoginFormDisplayed = await loginPage.isLoginPageDisplayed();
      expect(isLoginFormDisplayed).toBeTruthy();

      const currentURL = loginPage.getCurrentURL();
      expect(currentURL).toContain('auth_ecommerce');

      logger.info('✅ Logout test passed');
    } catch (error) {
      logger.error(`Test failed: ${error.message}`);
      throw error;
    }
  });

  test('Verify logout button is available after login', { tag: ['@smoke'] }, async ({ ecommercePage, logger }) => {
    allure.label('feature', 'Authentication');
    allure.label('story', 'UI Verification');
    allure.severity('minor');
    allure.owner('Ashish');
    allure.tag('@smoke');

    try {
      logger.info('Verifying logout button is visible');
      const isLogoutButtonVisible = await ecommercePage.logoutButton.isVisible({ timeout: timeouts.ELEMENT_VISIBLE });
      expect(isLogoutButtonVisible).toBeTruthy();

      logger.info('✅ Logout button verification passed');
    } catch (error) {
      logger.error(`Test failed: ${error.message}`);
      throw error;
    }
  });
});
