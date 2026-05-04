import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { getTimestamp } from '../utils/dataGenerator.js';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const screenshotsDir = path.join(__dirname, '../../screenshots');

if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

/**
 * Take a screenshot and save it
 * @param {Page} page - Playwright page object
 * @param {string} name - Name for the screenshot file
 * @returns {Promise<string>} Full file path to the screenshot
 */
export const takeScreenshot = async (page, name = 'screenshot') => {
  try {
    const timestamp = getTimestamp();
    const filename = `${timestamp}-${name}.png`;
    const filepath = path.join(screenshotsDir, filename);

    await page.screenshot({ path: filepath, fullPage: true });
    console.log(`Screenshot saved: ${filepath}`);
    return filepath;
  } catch (error) {
    console.error(`Failed to take screenshot: ${error.message}`);
    throw error;
  }
};

