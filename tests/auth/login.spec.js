import { test, expect } from '../../src/fixtures/testFixtures.js';
import * as allure from 'allure-js-commons';
import { users } from '../../test-data/users.js';
import { timeouts } from '../../config/timeouts.js';

test.describe('Authentication - Login', () => {
  test.beforeEach(async ({ loginPage, logger }) => {
    logger.info('Starting login test');
    await loginPage.navigateToLoginPage();
  });

  test('Positive: Login with valid credentials', { tag: ['@smoke', '@regression'] }, async ({ loginPage, ecommercePage, logger, page }) => {
    allure.label('feature', 'Authentication');
    allure.label('story', 'User Login');
    allure.severity('critical');
    allure.owner('Ashish');
    allure.tag('@smoke');
    allure.tag('@regression');

    const { username, password } = users.valid;

    try {
      logger.info('Performing login with valid credentials');
      await loginPage.login(username, password);
      
      await page.waitForLoadState('networkidle', { timeout: timeouts.NETWORK_IDLE });

      logger.info('Verifying successful login');
      const currentURL = ecommercePage.getCurrentURL();
      expect(currentURL).toContain('auth_ecommerce');

      await expect(ecommercePage.logoutButton).toBeVisible({ timeout: timeouts.ELEMENT_VISIBLE });

      logger.info('✅ Login test passed');
    } catch (error) {
      logger.error(`Test failed: ${error.message}`);
      throw error;
    }
  });

  test('Negative: Login with invalid username', { tag: ['@regression', '@negative'] }, async ({ loginPage, logger, page }) => {
    allure.label('feature', 'Authentication');
    allure.label('story', 'Invalid Login');
    allure.severity('normal');
    allure.owner('Ashish');
    allure.tag('@regression');
    allure.tag('@negative');

    const invalidUser = users.invalid[0]; 
    const { username, password } = invalidUser;

    try {
      logger.info(`Attempting login with ${invalidUser.description}`);
      await loginPage.login(username, password);
      await page.waitForTimeout(1000);

      logger.info('Verifying error message is displayed');
      await expect(loginPage.errorMessage).toBeVisible();
      await expect(loginPage.errorMessage).toContainText(invalidUser.description);
      logger.info('✅ Invalid username test passed');
    } catch (error) {
      logger.error(`Test failed: ${error.message}`);
      throw error;
    }
  });

  test('Negative: Login with invalid password', { tag: ['@regression', '@negative'] }, async ({ loginPage, logger, page }) => {
    allure.label('feature', 'Authentication');
    allure.label('story', 'Invalid Login');
    allure.severity('normal');
    allure.owner('Ashish');
    allure.tag('@regression');
    allure.tag('@negative');

    const invalidUser = users.invalid[1];
    const { username, password } = invalidUser;

    try {
      logger.info(`Attempting login with ${invalidUser.description}`);
      await loginPage.login(username, password);
      await page.waitForTimeout(1000);

      logger.info('Verifying error message is displayed');
      await expect(loginPage.errorMessage).toBeVisible();
      await expect(loginPage.errorMessage).toContainText(invalidUser.description);

      logger.info('✅ Invalid password test passed');
    } catch (error) {
      logger.error(`Test failed: ${error.message}`);
      throw error;
    }
  });

  test('Negative: Login with empty credentials', { tag: ['@regression', '@negative'] }, async ({ loginPage, logger }) => {
    allure.label('feature', 'Authentication');
    allure.label('story', 'Invalid Login');
    allure.severity('normal');
    allure.owner('Ashish');
    allure.tag('@regression');
    allure.tag('@negative');

    const invalidUser = users.invalid[2];
    const { username, password } = invalidUser;

    try {
      logger.info(`Attempting login with ${invalidUser.description}`);
      await loginPage.login(username, password);
      await loginPage.page.waitForTimeout(timeouts.NAVIGATION);

      logger.info('Verifying error message is displayed');
      await expect(loginPage.errorMessage).toBeVisible();
      await expect(loginPage.errorMessage).toContainText(invalidUser.description);

      logger.info('✅ Empty credentials test passed');
    } catch (error) {
      logger.error(`Test failed: ${error.message}`);
      throw error;
    }
  });

  test('Verify login form is displayed', { tag: ['@smoke'] }, async ({ loginPage, logger }) => {
    allure.label('feature', 'Authentication');
    allure.label('story', 'UI Verification');
    allure.severity('minor');
    allure.owner('Ashish');
    allure.tag('@smoke');

    try {
      logger.info('Verifying login form is visible');
      await expect(loginPage.loginForm).toBeVisible();

      logger.info('✅ Login form verification passed');
    } catch (error) {
      logger.error(`Test failed: ${error.message}`);
      throw error;
    }
  });
});
