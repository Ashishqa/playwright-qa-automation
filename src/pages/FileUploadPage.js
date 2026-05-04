import { test } from '@playwright/test';
import { BasePage } from '../base/BasePage.js';
import { retryAction } from '../helpers/waitHelper.js';

export class FileUploadPage extends BasePage {
  get fileInput() {
    return this.page.getByRole('button', { name: 'Choose File' });
  }

  get uploadButton() {
    return this.page.getByRole('button', { name: 'Submit' });
  }

  get successMessage() {
    return this.page.locator('#file_upload_response');
  }

  get errorMessage() {
    return this.page.getByRole('alert');
  }

  get uploadForm() {
    return this.page.getByRole('heading', { name: 'File Upload Example', level: 2 });
  }

  get filePreview() {
    return this.page.locator('[class*="preview"], img[alt*="preview"]');
  }

  async navigateToFileUpload() {
    return await test.step('Navigate to file upload page', async () => {
      this.logger.info('[FileUploadPage] navigateToFileUpload() called');
      try {
        await this.navigateTo('/file-upload');
        await this.uploadForm.waitFor({ state: 'visible', timeout: 30000 });
        this.logger.info('[FileUploadPage] navigateToFileUpload() completed');
      } catch (error) {
        this.logger.error(`[FileUploadPage] navigateToFileUpload() failed: ${error.message}`);
        throw error;
      }
    });
  }

  async uploadFile(filePath) {
    return await test.step(`Upload file: ${filePath}`, async () => {
      this.logger.info(`[FileUploadPage] uploadFile() called with path: ${filePath}`);
      try {
        await this.fileInput.setInputFiles(filePath);
        this.logger.info('[FileUploadPage] File selected');
      } catch (error) {
        this.logger.error(`[FileUploadPage] uploadFile() failed: ${error.message}`);
        throw error;
      }
    });
  }

  async clickUpload() {
    return await test.step('Click upload button', async () => {
      this.logger.info('[FileUploadPage] clickUpload() called');
      try {
        await retryAction(
          () => this.uploadButton.click(),
          {
            retries: 2,
            initialDelay: 300,
            onRetry: (attempt, err) =>
              this.logger.warn(`[FileUploadPage] Upload button click retry ${attempt}: ${err.message}`)
          }
        );
        this.logger.info('[FileUploadPage] clickUpload() completed');
      } catch (error) {
        this.logger.error(`[FileUploadPage] clickUpload() failed: ${error.message}`);
        throw error;
      }
    });
  }

  async uploadAndSubmit(filePath) {
    return await test.step(`Upload and submit file: ${filePath}`, async () => {
      this.logger.info(`[FileUploadPage] uploadAndSubmit() called with path: ${filePath}`);
      try {
        await this.uploadFile(filePath);
        await this.clickUpload();
        this.logger.info('[FileUploadPage] uploadAndSubmit() completed');
      } catch (error) {
        this.logger.error(`[FileUploadPage] uploadAndSubmit() failed: ${error.message}`);
        throw error;
      }
    });
  }
  
  async getSuccessMessage() {
    return await test.step('Get success message', async () => {
      this.logger.info('[FileUploadPage] getSuccessMessage() called');
      try {
        await this.successMessage.waitFor({ state: 'visible', timeout: 10000 });
        const message = await this.getElementText(this.successMessage);
        this.logger.info(`[FileUploadPage] Success message: ${message}`);
        return message;
      } catch (error) {
        this.logger.warn('[FileUploadPage] No success message found');
        return null;
      }
    });
  }

  async getErrorMessage() {
    return await test.step('Get error message', async () => {
      this.logger.info('[FileUploadPage] getErrorMessage() called');
      try {
        await this.errorMessage.waitFor({ state: 'visible', timeout: 5000 });
        const message = await this.getElementText(this.errorMessage);
        this.logger.info(`[FileUploadPage] Error message: ${message}`);
        return message;
      } catch (error) {
        this.logger.warn('[FileUploadPage] No error message found');
        return null;
      }
    });
  }

  
  isUploadSuccessful() {
    this.logger.info('[FileUploadPage] isUploadSuccessful() — returning successMessage locator');
    return this.successMessage;
  }

  async checkUploadSuccess() {
    return await test.step('Check upload was successful', async () => {
      this.logger.info('[FileUploadPage] checkUploadSuccess() called');
      try {
        const message = await this.getSuccessMessage();
        const isSuccessful = message !== null;
        this.logger.info(`[FileUploadPage] Upload successful: ${isSuccessful}`);
        return isSuccessful;
      } catch (error) {
        this.logger.error(`[FileUploadPage] checkUploadSuccess() failed: ${error.message}`);
        return false;
      }
    });
  }
}
