# Playwright E2E Automation Framework

A production-ready, enterprise-grade test automation framework built with Playwright JavaScript.

## Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Configuration](#environment-configuration)
- [Running Tests](#running-tests)
- [Running on Specific Browsers](#running-on-specific-browsers)
- [Running by Tag](#running-by-tag)
- [Viewing Reports](#viewing-reports)
- [Allure Report Features](#allure-report-features)
- [Folder Structure](#folder-structure)
- [How to Add a New Page Object](#how-to-add-a-new-page-object)
- [How to Add a New Test](#how-to-add-a-new-test)
- [How to Add a New Environment](#how-to-add-a-new-environment)
- [CI/CD Pipeline](#cicd-pipeline)
- [Exponential Backoff Retry](#exponential-backoff-retry)
- [Logging](#logging)
- [Troubleshooting](#troubleshooting)
- [Contributing Guidelines](#contributing-guidelines)
- [License](#license)

## Project Overview

This framework automates end-to-end testing for:

1. **E-Commerce Authentication & Order Flow** (https://qa-practice.netlify.app/auth_ecommerce)
   - User login with valid/invalid credentials
   - Add multiple items to cart
   - Checkout and order submission
   - User logout

2. **File Upload** (https://qa-practice.netlify.app/file-upload)
   - Valid file uploads
   - Error handling for invalid uploads
   - Form validation

**Framework Philosophy:**
- **Page Object Model (POM)**: Clean separation of test logic from page interactions
- **Enterprise-Grade**: Production-ready with full logging, reporting, and error handling
- **Cross-Browser**: Parallel execution across Chromium, Firefox, and WebKit
- **CI/CD Ready**: GitHub Actions workflow with result aggregation and reporting
- **Comprehensive Reporting**: HTML reports + Allure reports with detailed step visualization

## Architecture

```
playwright-qa-automation/
├── config/                          # Configuration management
│   ├── environments.js             # Environment-specific URLs & credentials
│   ├── playwright.config.js        # Playwright configuration
│   └── timeouts.js                 # Centralised timeout constants
│
├── src/                             # Source code
│   ├── base/
│   │   └── BasePage.js             # Base class for all page objects
│   ├── pages/                      # Page Object Models
│   │   ├── LoginPage.js
│   │   ├── EcommercePage.js
│   │   └── FileUploadPage.js
│   ├── fixtures/
│   │   └── testFixtures.js         # Playwright fixtures with page objects
│   ├── helpers/                    # Test helper utilities
│   │   ├── waitHelper.js           # Wait strategies & exponential backoff retry
│   │   ├── screenshotHelper.js     # Screenshot capture & reporting
│   │   └── priceHelper.js          # Price calculation & formatting utilities
│   └── utils/                      # Utility functions
│       ├── logger.js               # Winston logger with file & console transport
│       └── dataGenerator.js        # Test data generation utilities
│
├── tests/                           # Test specifications
│   ├── auth/                       # Authentication tests
│   │   ├── login.spec.js          # Login tests (positive & negative)
│   │   └── logout.spec.js         # Logout tests
│   ├── ecommerce/                 # E-commerce tests
│   │   └── orderFlow.spec.js      # Order flow (add to cart, checkout)
│   └── fileUpload/                # File upload tests
│       └── fileUpload.spec.js     # Upload scenarios
│
├── test-data/                       # Test data
│   ├── users.js                    # User credentials (valid & invalid)
│   ├── products.js                 # Product data
│   └── files/                      # Sample files for upload testing
│       ├── sample.pdf
│       ├── sample.png
│       └── sample.txt
│
├── logs/                           # Test execution logs (generated)
├── screenshots/                    # Failure screenshots (generated)
├── allure-results/                 # Allure report results (generated)
└── playwright-report/              # HTML report (generated)

Data Flow: Tests → Fixtures → Page Objects → BasePage → Helpers → Utils
```

## Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| Playwright | 1.59+ | Browser automation & E2E testing |
| Node.js | 20+ | JavaScript runtime |
| @playwright/test | 1.59+ | Test runner, assertions & native tag support |
| Winston | 3.19+ | Logging (file & console) |
| Allure CLI | 2.x | Advanced test reporting (requires Java 11+) |
| allure-js-commons | 3.7+ | Allure report integration |
| allure-playwright | 3.7+ | Playwright-Allure bridge |
| dotenv | 17.4+ | Environment variable management |
| cross-env | 10.1+ | Cross-platform env variables |

## Prerequisites

- **Node.js**: Version 20 or higher
  - Download: https://nodejs.org/
  - Verify: `node --version`

- **npm**: Comes with Node.js
  - Verify: `npm --version`

- **Java 11+** (for Allure CLI only)
  - macOS: `brew install java11` (or use OpenJDK)
  - Ubuntu/Linux: `sudo apt-get install openjdk-11-jdk`
  - Windows: Download from https://adoptopenjdk.net/
  - Verify: `java -version`

- **Allure CLI** (for generating Allure reports)
  - macOS: `brew install allure`
  - Ubuntu/Linux: `sudo apt-add-repository ppa:qameta/allure && sudo apt-get update && sudo apt-get install allure2`
  - Windows: Download installer from https://docs.qameta.io/allure/

## Installation

### Step 1: Clone Repository
```bash
git clone https://github.com/Ashishqa/playwright-qa-automation.git
cd playwright-qa-automation
```

### Step 2: Install Dependencies
```bash
npm install
```

This installs all packages from `package.json`:
- Playwright and browsers
- Winston logger
- Allure reporting tools
- All required dependencies

### Step 3: Verify Installation
```bash
npx playwright --version
npm run test -- --help
```

## Environment Configuration

### .env File Setup

1. Copy the example file:
```bash
cp .env.example .env
```

2. Configure your environment:
```bash
# Environment to test
ENV=staging

# Logging
LOG_LEVEL=info

# Timeouts (milliseconds)
DEFAULT_TIMEOUT=30000
NAVIGATION_TIMEOUT=30000

# Retry Configuration
MAX_RETRIES=3
INITIAL_DELAY=500
RETRY_FACTOR=2

# Browser Configuration
HEADLESS=true
SLOW_MO=0
```

### Environment Files (config/environments.js)

Define URLs and credentials for each environment:

```javascript
const environments = {
  staging: {
    baseURL: 'https://qa-practice.netlify.app',
    credentials: {
      valid: { username: 'admin@admin.com', password: 'admin123' },
      invalid: [ /* ... */ ]
    }
  },
  production: {
    baseURL: 'https://qa-practice.netlify.app',
    credentials: { /* ... */ }
  }
};
```

### Running Against Different Environments

```bash
# Run against staging (default)
npm test

# Run against production
ENV=production npm test
```

## Running Tests

### All Tests
```bash
npm test
```

**Expected Output:**
```
✓ Authentication - Login > Positive: Login with valid credentials (1.2s)
✓ Authentication - Login > Negative: Login with invalid username (0.8s)
✓ E-Commerce - Order Flow > Add single item to cart (2.1s)
...
```

### Tests in Headed Mode (see browser)
```bash
npm run test:headed
```

### Debug Mode (opens Playwright Inspector)
```bash
npm run test:debug
```

### Run Specific Test File
```bash
npx playwright test tests/auth/login.spec.js
```

### Run Specific Test by Name
```bash
npx playwright test -g "Login with valid credentials"
```

## Running on Specific Browsers

### Chromium Only
```bash
npm run test:chromium
```

### Firefox Only
```bash
npm run test:firefox
```

### WebKit Only
```bash
npm run test:webkit
```

### All Browsers (Default)
```bash
npm test
```

### Single Browser Headed Mode
```bash
npx playwright test --project=chromium --headed
```

## Running by Tag

Tests use **two tagging systems** that work together:

| System | Purpose | Example |
|--------|---------|---------|
| Playwright native `{ tag: [...] }` | Powers `--grep` filtering at collection time | `{ tag: ['@smoke', '@e2e'] }` |
| `allure.tag('...')` inside test body | Labels tests in the Allure HTML report | `allure.tag('@smoke')` |

**Available tags:**

| Tag | Description | Tests |
|-----|-------------|-------|
| `@smoke` | Critical path, fast sanity checks | Login, add to cart, checkout, upload |
| `@regression` | Full regression suite | All positive + negative scenarios |
| `@negative` | Error & validation scenarios | Invalid login, empty cart, bad upload |
| `@e2e` | Full end-to-end happy path flows | Complete order flow (login→cart→checkout→logout) |
| `@full-flow` | Alias for complete flow tests | Same as `@e2e` tests |

### Run Smoke Tests Only
```bash
npm run test:smoke
```

### Run Regression Tests
```bash
npm run test:regression
```

### Run Negative Tests
```bash
npm run test:negative
```

### Run E2E Happy Path Tests
```bash
npm run test:e2e
```

### Custom Tag Filtering
```bash
npx playwright test --config=config/playwright.config.js --grep @smoke
npx playwright test --config=config/playwright.config.js --grep "@smoke|@e2e"
npx playwright test --config=config/playwright.config.js --grep @full-flow
```

## Viewing Reports

### Playwright HTML Report
```bash
# Run tests (generates report automatically)
npm test

# View report
npm run report
```

**Report Location:** `playwright-report/index.html`

The HTML report shows:
- Test results (passed/failed/skipped)
- Duration and timing
- Error details and stack traces
- Screenshots of failures
- Video recordings of failures
- Detailed trace logs

### Allure Report

#### Run Tests + Generate + Open Report (One Command)

These scripts run tests, then automatically generate and open the Allure report — even if tests fail:

```bash
# All tests → Allure report
npm run test:allure

# All tests headed (see browser) → Allure report
npm run test:allure:headed

# Smoke tests → Allure report
npm run test:allure:smoke

# Regression tests → Allure report
npm run test:allure:regression

# E2E happy path tests → Allure report
npm run test:allure:e2e

# Negative tests → Allure report
npm run test:allure:negative
```

#### Generate Allure Report (from existing results)
```bash
npm run allure:generate
```

#### View Allure Report (open already generated)
```bash
npm run allure:open
```

#### Generate and Open (from existing results)
```bash
npm run allure:report
```

**Report Location:** `allure-report/index.html`

#### Allure Report Features

**Test Information:**
- Test name, description, and status
- Execution duration
- Failure details with stack trace
- Attached screenshots and logs
- Video recordings

**Steps & Hierarchies:**
- Detailed step breakdown with duration
- Step status (passed/failed/skipped)
- Parameter visibility

**Metadata:**
- Severity levels (critical, normal, minor)
- Feature tags and stories
- Owner information
- Custom labels

**Environment Info:**
- Node version
- Platform/OS
- Environment (staging/production)
- Execution date/time

**Example Navigation:**
- Click on test to see detailed steps
- Expand "Attachments" to view screenshots
- Review "Log" section for detailed logs

## Allure Report Features

### Test Metadata (In Spec Files)

```javascript
import * as allure from 'allure-js-commons';

test('My test', async () => {
  allure.label('feature', 'Authentication');
  allure.label('story', 'User Login');
  allure.severity('critical');  // critical | normal | minor
  allure.owner('Ashish');
  allure.tag('@smoke');
  // ... test code
});
```

### Page Object Steps

Every method automatically appears as a step in Allure:

```javascript
async login(username, password) {
  return await step(`Login with user: ${username}`, async () => {
    // Code automatically wrapped in Allure step
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLoginButton();
  });
}
```

### Manual Steps in Tests

```javascript
await test.step('Add item to cart', async () => {
  await ecommercePage.addItemToCart(0);
  expect(cartCount).toBeGreaterThan(0);
});
```

### Failure Screenshots

**Single-layer approach — no extra code needed:**

**Playwright built-in** (`playwright.config.js`):
```javascript
screenshot: 'only-on-failure'
video: 'retain-on-failure'
```
Playwright automatically captures a full-page screenshot of the failing page and attaches it to both the **HTML report** (`playwright-report/`) and the **Allure report** (via the `allure-playwright` reporter). No manual attachment code required.

## Folder Structure

```
playwright-qa-automation/
├── config/
│   ├── environments.js             # Environment configuration
│   ├── playwright.config.js        # Playwright settings
│   └── timeouts.js                 # Centralised timeout constants
├── src/
│   ├── base/
│   │   └── BasePage.js             # Base page class
│   ├── pages/
│   │   ├── LoginPage.js
│   │   ├── EcommercePage.js
│   │   └── FileUploadPage.js
│   ├── fixtures/
│   │   └── testFixtures.js         # Test fixtures
│   ├── helpers/
│   │   ├── screenshotHelper.js
│   │   ├── waitHelper.js
│   │   └── priceHelper.js
│   └── utils/
│       ├── dataGenerator.js
│       └── logger.js
├── tests/
│   ├── auth/
│   │   ├── login.spec.js
│   │   └── logout.spec.js
│   ├── ecommerce/
│   │   └── orderFlow.spec.js
│   └── fileUpload/
│       └── fileUpload.spec.js
├── test-data/
│   ├── files/                      # Temp files created & deleted per test run
│   ├── products.js
│   ├── shippingData.js
│   └── users.js
├── logs/                           # Generated test logs
├── screenshots/                    # Generated failure screenshots
├── allure-results/                 # Generated Allure results
├── playwright-report/              # Generated HTML report
├── .env.example
├── .env                            # Your environment variables
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

## How to Add a New Page Object

### Example: `src/pages/FileUploadPage.js`

The following is taken directly from the existing [`FileUploadPage.js`](src/pages/FileUploadPage.js) to show the exact pattern to follow when adding a new page object.

**Step 1:** Create the file `src/pages/FileUploadPage.js`

```javascript
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

  get uploadForm() {
    return this.page.getByRole('heading', { name: 'File Upload Example', level: 2 });
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

  async uploadAndSubmit(filePath) {
    return await test.step(`Upload and submit file: ${filePath}`, async () => {
      this.logger.info(`[FileUploadPage] uploadAndSubmit() called with path: ${filePath}`);
      try {
        await this.fileInput.setInputFiles(filePath);
        await retryAction(
          () => this.uploadButton.click(),
          {
            retries: 2,
            initialDelay: 300,
            onRetry: (attempt, err) =>
              this.logger.warn(`[FileUploadPage] Upload retry ${attempt}: ${err.message}`)
          }
        );
        this.logger.info('[FileUploadPage] uploadAndSubmit() completed');
      } catch (error) {
        this.logger.error(`[FileUploadPage] uploadAndSubmit() failed: ${error.message}`);
        throw error;
      }
    });
  }

  isUploadSuccessful() {
    return this.successMessage;
  }
}
```

**Step 2:** Add fixture in `src/fixtures/testFixtures.js`

```javascript
import { FileUploadPage } from '../pages/FileUploadPage.js';

export const test = base.extend({
  // ... existing fixtures ...

  fileUploadPage: async ({ page, logger, envConfig }, use) => {
    const fileUploadPage = new FileUploadPage(page, envConfig, logger);
    await use(fileUploadPage);
  }
});
```

**Step 3:** Use in tests

```javascript
test('Upload valid file', async ({ fileUploadPage }) => {
  await fileUploadPage.navigateToFileUpload();
  await fileUploadPage.uploadAndSubmit('/path/to/sample.txt');
  await expect(fileUploadPage.isUploadSuccessful()).toContainText('successfully uploaded');
});
```

## How to Add a New Test

### Example: `tests/fileUpload/fileUpload.spec.js`

The following is taken directly from the existing [`fileUpload.spec.js`](tests/fileUpload/fileUpload.spec.js) to show the exact pattern to follow when adding a new test.

**Step 1:** Create file `tests/fileUpload/fileUpload.spec.js`

```javascript
import { test, expect } from '../../src/fixtures/testFixtures.js';
import * as allure from 'allure-js-commons';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { timeouts } from '../../config/timeouts.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const testFilesDir = path.join(__dirname, '../../test-data/files');

test.describe('File Upload', () => {
  test.beforeEach(async ({ fileUploadPage, logger }) => {
    logger.info('Starting file upload test');
    await fileUploadPage.navigateToFileUpload();
  });

  test('Positive: Upload valid file', { tag: ['@smoke', '@regression'] }, async ({ fileUploadPage, logger }) => {
    // ARRANGE
    allure.label('feature', 'File Upload');
    allure.label('story', 'Valid File Upload');
    allure.severity('critical');
    allure.owner('Ashish');
    allure.tag('@smoke');
    allure.tag('@regression');

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
      if (fs.existsSync(testFile)) {
        fs.unlinkSync(testFile);
      }
    }
  });
});
```

**Test Structure:**
- `// ARRANGE` - Setup test data
- `// ACT` - Perform test actions
- `// ASSERT` - Verify expected outcomes

## How to Add a New Environment

### Step 1: Update `config/environments.js`

```javascript
const environments = {
  staging: { /* ... */ },
  production: { /* ... */ },
  
  // Add new environment
  qa: {
    baseURL: 'https://qa.example.com',
    credentials: {
      valid: {
        username: 'admin@admin.com',
        password: 'admin123'
      },
      invalid: [
        // Invalid credential scenarios
      ]
    }
  }
};
```

### Step 2: Run Tests Against New Environment

```bash
ENV=qa npm test
```

## CI/CD Pipeline

### GitHub Actions Workflow

> **Note:** A `.github/workflows/` directory is not yet present in this repository. Create `.github/workflows/playwright.yml` with the content below to enable CI/CD.

The workflow automates testing:

**Trigger Events:**
- Push to `main` or `develop` branches
- Pull requests to `main`
- Manual workflow dispatch with environment selection

**Workflow Strategy:**

1. **Parallel Sharding** (4 runners)
   - Tests split across 4 runners for speed
   - Each shard runs independently
   - Results merged in final Allure report

2. **Steps:**
   - Checkout code
   - Setup Node.js 20
   - Cache node_modules
   - Install dependencies
   - Install Playwright browsers
   - Create directories (logs, screenshots, allure-results)
   - Run tests (with sharding & environment)
   - Upload artifacts:
     - HTML reports
     - Allure results
     - Screenshots (on failure)
     - Test logs

3. **Allure Report Generation:**
   - Waits for all shards to complete
   - Downloads all Allure results
   - Merges sharded results
   - Generates combined HTML report
   - Deploys to GitHub Pages

4. **Branch Rules:**
   - Always runs on push to main/develop
   - Always runs on PRs to main
   - Can be manually triggered with environment selection

**Manual Trigger:**
```
GitHub UI → Actions → Playwright E2E Tests → Run workflow
- Select environment: staging or production
- Select browser: all, chromium, firefox, or webkit
```

## Exponential Backoff Retry

The `retryAction()` helper implements full exponential backoff with jitter:

### Configuration Options

| Option | Default | Description |
|--------|---------|-------------|
| retries | 3 | Number of retry attempts |
| initialDelay | 500ms | First delay (ms) |
| factor | 2 | Exponential multiplier |
| maxDelay | 8000ms | Maximum delay cap (ms) |
| onRetry | undefined | Callback on each retry |

### Usage in Page Objects

```javascript
async clickSubmitButton() {
  return await step('Click submit button', async () => {
    try {
      await retryAction(
        () => this.submitButton.click(),
        {
          retries: 3,
          initialDelay: 300,
          factor: 2,
          maxDelay: 5000,
          onRetry: (attempt, error) =>
            this.logger.warn(`Submit click retry ${attempt}: ${error.message}`)
        }
      );
    } catch (error) {
      throw error;
    }
  });
}
```

### Delay Calculation

```
Delay = min(initialDelay × (factor ^ attempt) + jitter, maxDelay)
Jitter = random(0-100ms) for stability
```

**Example Timeline (with defaults):**
- Attempt 1: 500ms initial delay
- Attempt 2: 1000ms (500 × 2)
- Attempt 3: 2000ms (500 × 4)
- After 3 retries: Error thrown

## Logging

### Log Levels

| Level | Usage | Example |
|-------|-------|---------|
| debug | Detailed debugging info | Entry/exit logs |
| info | General information | Test steps, navigation |
| warn | Warning messages | Retry attempts |
| error | Error messages | Test failures |

### Log Format

```
[TIMESTAMP] [LEVEL] [TestName] message

Example:
[2024-05-01 10:30:45] [info] [Login with valid credentials] [LoginPage] login() completed
[2024-05-01 10:30:46] [error] [Add item to cart] [EcommercePage] Element not clickable
```

### Log Locations

- **Console Output:** Real-time during test execution
- **File Logs:** `logs/test.log` (persistent)

### Reading Logs After Test Run

```bash
# View entire log file
cat logs/test.log

# View last 50 lines
tail -50 logs/test.log

# Search for specific test
grep "My test name" logs/test.log

# View only errors
grep "\[error\]" logs/test.log
```

### Configuring Log Level

Edit `.env` file:
```bash
LOG_LEVEL=debug    # Verbose
LOG_LEVEL=info     # Normal
LOG_LEVEL=warn     # Warnings only
LOG_LEVEL=error    # Errors only
```

## Troubleshooting

### Issue 1: Browser Not Installed
**Error:** `Error: Chromium is not installed`

**Cause:** Playwright browsers not downloaded

**Fix:**
```bash
npx playwright install
# Or for specific browser
npx playwright install chromium
```

### Issue 2: Allure Report Empty
**Error:** Allure report shows no tests

**Cause:** Allure results directory empty or Java not installed

**Fixes:**
```bash
# Check Java installation
java -version

# Install Java if needed
brew install java11

# Run tests to generate results
npm test

# Generate Allure report
npm run allure:generate
```

### Issue 3: Tests Flaky on CI
**Error:** Tests pass locally but fail on GitHub Actions

**Causes & Fixes:**
- Increase timeouts: Edit `playwright.config.js` use.timeout
- Add network idle waits: `await page.waitForLoadState('networkidle')`
- Use explicit waits: `await locator.waitFor({ state: 'visible' })`
- Enable retries: Set `retries: 2` in config

### Issue 4: ENV Variable Not Picked Up
**Error:** Wrong environment used or ENV undefined

**Fixes:**
```bash
# Set ENV before running
export ENV=production
npm test

# Or inline
ENV=production npm test

# Verify ENV is set
echo $ENV

# On Windows
set ENV=production && npm test
```

### Issue 5: Screenshots Not Saved
**Error:** Screenshots directory is empty after test failure

**Cause:** Directory missing or permissions issue

**Fix:**
```bash
# Create directory
mkdir -p screenshots

# Check permissions
ls -la screenshots

# Run test again
npm test
```

### Issue 6: Allure Steps Not Showing
**Error:** Steps appear in HTML report but not in Allure

**Cause:** Missing `step()` wrapper or allure imports

**Fix:** Ensure page object methods use:
```javascript
import { step } from 'allure-js-commons';

async myMethod() {
  return await step('Method description', async () => {
    // Code here
  });
}
```

### Issue 7: Java Not Found for Allure CLI
**Error:** `command not found: allure` or Java version error

**Fixes:**
```bash
# Install Allure
brew install allure          # macOS
sudo apt install allure2     # Linux

# Install Java
brew install java11          # macOS
sudo apt install openjdk-11-jdk  # Linux

# Verify
java -version
allure --version
```

### Issue 8: Port Conflict on Report Server
**Error:** Port 4040 already in use when opening Allure

**Fixes:**
```bash
# Kill process using port 4040
lsof -i :4040
kill -9 <PID>

# Or use different port
allure open allure-report --port 4041
```

## Contributing Guidelines

### Branch Naming
- Feature: `feature/description`
- Bug fix: `bugfix/description`
- Hotfix: `hotfix/description`

Example: `feature/add-payment-tests`

### Commit Messages
```
[TYPE] Brief description

Detailed explanation (optional)

Type: feat | fix | refactor | test | docs | chore
```

### PR Checklist
- [ ] Tests pass locally (`npm test`)
- [ ] Allure report generated (`npm run allure:generate`)
- [ ] No console errors or warnings
- [ ] Commit message follows format
- [ ] Branch is up to date with main
- [ ] Code follows existing patterns
- [ ] New tests have proper annotations
- [ ] README updated if needed

### Adding Changes

**For new tests:**
1. Create test file following existing pattern
2. Add Playwright native tags to the `test()` call for `--grep` filtering:
   ```javascript
   test('My test title', { tag: ['@smoke', '@regression'] }, async ({ ... }) => {
   ```
3. Add matching `allure.tag('@smoke')` calls **inside** the test body for Allure report labelling
4. Add allure metadata: `allure.label('feature', ...)`, `allure.severity(...)`, `allure.owner(...)`
5. Run locally: `npm test`
6. Generate + view report: `npm run test:allure`

**For new page objects:**
1. Create class extending BasePage
2. Use step() decorator for all methods
3. Add logging entry/exit
4. Include error screenshots
5. Add to fixtures
6. Create example test

**For utilities/helpers:**
1. Add JSDoc comments
2. Export as named export
3. Include error handling
4. Add unit-like test example in README

