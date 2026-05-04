import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { EcommercePage } from '../pages/EcommercePage.js';
import { FileUploadPage } from '../pages/FileUploadPage.js';
import { createLogger } from '../utils/logger.js';
import environments from '../../config/environments.js';

const env = process.env.ENV || 'staging';
const envConfig = environments[env];

export const test = base.extend({
  logger: async ({ }, use, testInfo) => {
    const logger = createLogger(testInfo.title);
    const startTime = Date.now();
    logger.info(`Test started: ${testInfo.title} at ${new Date().toISOString()}`);

    await use(logger);

    const duration = Date.now() - startTime;
    logger.info(`Test completed: ${testInfo.title} (Duration: ${duration}ms)`);
  },

  envConfig: async ({ }, use) => {
    await use(envConfig);
  },

  loginPage: async ({ page, logger, envConfig }, use) => {
    const loginPage = new LoginPage(page, envConfig, logger);
    await use(loginPage);
  },

  ecommercePage: async ({ page, logger, envConfig }, use) => {
    const ecommercePage = new EcommercePage(page, envConfig, logger);
    await use(ecommercePage);
  },

  fileUploadPage: async ({ page, logger, envConfig }, use) => {
    const fileUploadPage = new FileUploadPage(page, envConfig, logger);
    await use(fileUploadPage);
  }
});

export { expect };
