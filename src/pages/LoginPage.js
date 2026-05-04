import { test } from '@playwright/test';
import { BasePage } from '../base/BasePage.js';
import { retryAction } from '../helpers/waitHelper.js';

export class LoginPage extends BasePage {
  get usernameInput() {
    return this.page.getByRole('textbox', { name: 'Email' });
  }

  get passwordInput() {
    return this.page.getByRole('textbox', { name: 'Password' });
  }

  get loginButton() {
    return this.page.getByRole('button', { name: 'Submit' });
  }

  get errorMessage() {
    return this.page.getByRole('alert');
  }

  get loginForm() {
    return this.page.locator('form#login');
  }

  async navigateToLoginPage() {
    return await test.step('Navigate to login page', async () => {
      this.logger.info('[LoginPage] navigateToLoginPage() called');
      try {
        await this.navigateTo('/auth_ecommerce');
        await this.loginForm.waitFor({ state: 'visible', timeout: 30000 });
        this.logger.info('[LoginPage] navigateToLoginPage() completed');
      } catch (error) {
        this.logger.error(`[LoginPage] navigateToLoginPage() failed: ${error.message}`);
        throw error;
      }
    });
  }

  async enterUsername(username) {
    return await test.step(`Enter username: ${username}`, async () => {
      this.logger.info(`[LoginPage] enterUsername() called with: ${username}`);
      try {
        await this.usernameInput.waitFor({ state: 'visible', timeout: 10000 });
        await this.usernameInput.fill(username);
        this.logger.info('[LoginPage] enterUsername() completed');
      } catch (error) {
        this.logger.error(`[LoginPage] enterUsername() failed: ${error.message}`);
        throw error;
      }
    });
  }

  async enterPassword(password) {
    return await test.step(`Enter password`, async () => {
      this.logger.info('[LoginPage] enterPassword() called');
      try {
        await this.passwordInput.waitFor({ state: 'visible', timeout: 10000 });
        await this.passwordInput.fill(password);
        this.logger.info('[LoginPage] enterPassword() completed');
      } catch (error) {
        this.logger.error(`[LoginPage] enterPassword() failed: ${error.message}`);
        throw error;
      }
    });
  }

  async clickLoginButton() {
    return await test.step('Click login button', async () => {
      this.logger.info('[LoginPage] clickLoginButton() called');
      try {
        await retryAction(
          () => this.loginButton.click(),
          {
            retries: 2,
            initialDelay: 300,
            onRetry: (attempt, err) =>
              this.logger.warn(`[LoginPage] Login button click retry ${attempt}: ${err.message}`)
          }
        );
        this.logger.info('[LoginPage] clickLoginButton() completed');
      } catch (error) {
        this.logger.error(`[LoginPage] clickLoginButton() failed: ${error.message}`);
        throw error;
      }
    });
  }

  async login(username, password) {
    return await test.step(`Login with user: ${username}`, async () => {
      this.logger.info(`[LoginPage] login() called with user: ${username}`);
      try {
        await this.enterUsername(username);
        await this.enterPassword(password);
        await this.clickLoginButton();
        this.logger.info('[LoginPage] login() completed');
      } catch (error) {
        this.logger.error(`[LoginPage] login() failed: ${error.message}`);
        throw error;
      }
    });
  }

  async getErrorMessage() {
    return await test.step('Get error message', async () => {
      this.logger.info('[LoginPage] getErrorMessage() called');
      try {
        await this.errorMessage.waitFor({ state: 'visible', timeout: 5000 });
        const message = await this.getElementText(this.errorMessage);
        this.logger.info(`[LoginPage] Error message: ${message}`);
        return message;
      } catch (error) {
        this.logger.warn('[LoginPage] No error message found');
        return null;
      }
    });
  }

  async isLoginPageDisplayed() {
    return await test.step('Verify login page is displayed', async () => {
      this.logger.info('[LoginPage] isLoginPageDisplayed() called');
      try {
        const isVisible = await this.loginForm.isVisible();
        this.logger.info(`[LoginPage] Login form visible: ${isVisible}`);
        return isVisible;
      } catch (error) {
        this.logger.error(`[LoginPage] isLoginPageDisplayed() failed: ${error.message}`);
        return false;
      }
    });
  }
}
