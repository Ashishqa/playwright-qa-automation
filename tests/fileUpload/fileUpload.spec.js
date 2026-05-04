import { test, expect } from '../../src/fixtures/testFixtures.js';
import * as allure from 'allure-js-commons';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { timeouts } from '../../config/timeouts.js'; 

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const testFilesDir = path.join(__dirname, '../../test-data');

test.describe('File Upload', () => {
  test.beforeEach(async ({ fileUploadPage, logger }) => {
    logger.info('Starting file upload test');
    await fileUploadPage.navigateToFileUpload();
  });

   test('Verify file upload form is displayed', { tag: ['@smoke'] }, async ({ fileUploadPage, logger }) => {
    allure.label('feature', 'File Upload');
    allure.label('story', 'UI Verification');
    allure.severity('minor');
    allure.owner('Ashish');
    allure.tag('@smoke');

    try {
      logger.info('Verifying file upload form elements');
      await test.step('Verify form elements', async () => {
        await expect(fileUploadPage.fileInput).toBeVisible({ timeout: timeouts.ELEMENT_VISIBLE });
        await expect(fileUploadPage.uploadButton).toBeVisible({ timeout: timeouts.ELEMENT_VISIBLE });
      });

      logger.info('✅ File upload form verification passed');
    } catch (error) {
      logger.error(`Test failed: ${error.message}`);
      throw error;
    }
  });

  test('Positive: Upload valid file', { tag: ['@smoke', '@regression'] }, async ({ fileUploadPage, logger }) => {
    allure.label('feature', 'File Upload');
    allure.label('story', 'Valid File Upload');
    allure.severity('critical');
    allure.owner('Ashish');
    allure.tag('@smoke');
    allure.tag('@regression');

    // Create test file if it doesn't exist
    const testFile = path.join(testFilesDir, 'sample.txt');

    try {
      if (!fs.existsSync(testFile)) {
        fs.writeFileSync(testFile, 'Sample test file for upload', 'utf8');
      }

      logger.info('Uploading file');
      await test.step('Upload and submit file', async () => {
        await fileUploadPage.uploadAndSubmit(testFile);
        await fileUploadPage.page.waitForTimeout(timeouts.ELEMENT_WAIT);
      });

      logger.info('Verifying upload success');
      await test.step('Verify success message', async () => {
        await expect(fileUploadPage.isUploadSuccessful()).toContainText('You have successfully uploaded "sample.txt"');
      });

      logger.info('✅ Valid file upload test passed');
    } catch (error) {
      logger.error(`Test failed: ${error.message}`);
      throw error;
    } finally {
      // Cleanup — runs whether the test passed or failed
      if (fs.existsSync(testFile)) {
        fs.unlinkSync(testFile);
      }
    }
  });

  test('Negative: Attempt upload without selecting file', { tag: ['@regression', '@negative'] }, async ({ fileUploadPage, logger }) => {
    allure.label('feature', 'File Upload');
    allure.label('story', 'Invalid File Upload');
    allure.severity('normal');
    allure.owner('Ashish');
    allure.tag('@regression');
    allure.tag('@negative');

    try {
      logger.info('Attempting upload without file selection');
      await test.step('Click upload without file', async () => {
        await fileUploadPage.clickUpload();
        await fileUploadPage.page.waitForTimeout(timeouts.ELEMENT_WAIT);
      });

      logger.info('Verifying error message or validation');
      await test.step('Verify error or disabled state', async () => {
        await expect(fileUploadPage.isUploadSuccessful()).not.toContainText('You have successfully uploaded ""');
      });

      logger.info('✅ No file upload attempt test passed');
    } catch (error) {
      logger.error(`Test failed: ${error.message}`);
      throw error;
    }
  });

  test('Negative: Upload with large file size (if applicable)', { tag: ['@regression', '@negative'] }, async ({ fileUploadPage, logger }) => {
    allure.label('feature', 'File Upload');
    allure.label('story', 'File Validation');
    allure.severity('normal');
    allure.owner('Ashish');
    allure.tag('@regression');
    allure.tag('@negative');

    const largeTestFile = path.join(testFilesDir, 'large-file.txt');

    try {
      const largeContent = 'x'.repeat(5 * 1024 * 1024);
      fs.writeFileSync(largeTestFile, largeContent, 'utf8');

      logger.info('=== Attempting upload with large file ===');
      
      await test.step('Select large file', async () => {
        await fileUploadPage.uploadFile(largeTestFile);
        logger.info('Large file selected');
      });

      await test.step('Submit upload', async () => {
        await fileUploadPage.clickUpload();
        await fileUploadPage.page.waitForTimeout(timeouts.ELEMENT_WAIT);
      });

      await test.step('Check result', async () => {
        const errorMessage = await fileUploadPage.getErrorMessage();
        const successMessage = await fileUploadPage.getSuccessMessage();
        
        // Either error or success is acceptable depending on app config
        const hasResult = errorMessage !== null || successMessage !== null;
        expect(hasResult).toBeTruthy();
        
        logger.info('✅ Large file handling verified');
      });
    } catch (error) {
      logger.error(`Test failed: ${error.message}`);
      throw error;
    } finally {
      if (fs.existsSync(largeTestFile)) {
        fs.unlinkSync(largeTestFile);
      }
    }
  });
});
