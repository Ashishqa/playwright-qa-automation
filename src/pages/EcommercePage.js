import { test } from '@playwright/test';
import { BasePage } from '../base/BasePage.js';
import { retryAction } from '../helpers/waitHelper.js';

export class EcommercePage extends BasePage {

  get productCards() {
    return this.page.locator('.shop-item');
  }

  get addToCartButtons() {
    return this.page.locator('.shop-item-button');
  }

  get cartItems() {
    return this.page.getByRole('button', { name: 'REMOVE' });
  }

  get checkoutButton() {
    return this.page.getByRole('button', { name:'PROCEED TO CHECKOUT' });
  }

  get successMessage() {
    return this.page.locator('#message');
  }

  get phoneNameInput() {
    return this.page.getByRole('textbox', { name: 'Enter phone number' });
  }

  get streetAddressInput() {
    return this.page.getByRole('textbox', { name: '5876 Little Streets' });
  }

  get cityInput() {
    return this.page.getByRole('textbox', { name: 'London' });
  }
  
  get country() {
    return this.page.locator('#countries_dropdown_menu');
  }

  get submitOrderButton() {
    return this.page.getByRole('button', { name: 'Submit Order' });
  }

  get cartItemName() {
    return this.page.locator('.cart-item-title');
  }

  get cartItemPrice() {
    return this.page.locator(`//span[@class='cart-price cart-column']`);
  }

  get cartItemQuantity() {
    return this.page.locator('.cart-quantity-input');
  }
  
  get cartTotalPrice() {
    return this.page.locator('.cart-total-price');
  }

  get quantityInputs() {
    return this.page.getByRole('spinbutton');
  }

  
  get logoutButton() {
    return this.page.locator('#logout');
  }

  async navigateToEcommerce() {
    return await test.step('Navigate to ecommerce page', async () => {
      this.logger.info('[EcommercePage] navigateToEcommerce() called');
      try {
        await this.navigateTo('/auth_ecommerce.html');
        await this.page.waitForLoadState('networkidle');
        this.logger.info('[EcommercePage] navigateToEcommerce() completed');
      } catch (error) {
        this.logger.error(`[EcommercePage] navigateToEcommerce() failed: ${error.message}`);
        throw error;
      }
    });
  }

   async getProductCount() {
    return await test.step('Get product count', async () => {
      this.logger.info('[EcommercePage] getProductCount() called');
      try {
        const count = await this.productCards.count();
        this.logger.info(`[EcommercePage] Product count: ${count}`);
        return count;
      } catch (error) {
        this.logger.error(`[EcommercePage] getProductCount() failed: ${error.message}`);
        return 0;
      }
    });
  }

   async addItemToCart(productName) {
    return await test.step(`Add item to cart: "${productName}"`, async () => {
      this.logger.info(`[EcommercePage] addItemToCart() called with productName: "${productName}"`);
      try {
        const matchingCards = this.productCards.filter({ hasText: productName });
        const cardCount = await matchingCards.count();

        if (cardCount === 0) {
          throw new Error(`Product not found: "${productName}". No matching product card on page.`);
        }

        const button = matchingCards.first().locator('.shop-item-button');

        await retryAction(
          () => button.click(),
          {
            retries: 2,
            initialDelay: 300,
            onRetry: (attempt, err) =>
              this.logger.warn(`[EcommercePage] Add to cart retry ${attempt}: ${err.message}`)
          }
        );

        this.logger.info('[EcommercePage] addItemToCart() completed');
      } catch (error) {
        this.logger.error(`[EcommercePage] addItemToCart() failed: ${error.message}`);
        throw error;
      }
    });
  }

  async addMultipleItemsToCart(productNames) {
    return await test.step(`Add multiple items to cart: ${productNames.join(', ')}`, async () => {
      this.logger.info(`[EcommercePage] addMultipleItemsToCart() called with products: ${productNames.join(', ')}`);
      try {
        for (const productName of productNames) {
          await this.addItemToCart(productName);
          await this.page.waitForTimeout(500);
        }
        this.logger.info('[EcommercePage] addMultipleItemsToCart() completed');
      } catch (error) {
        this.logger.error(`[EcommercePage] addMultipleItemsToCart() failed: ${error.message}`);
        throw error;
      }
    });
  }

  async getCartItemsCount() {
    return await test.step('Get cart items count', async () => {
      this.logger.info('[EcommercePage] getCartItemsCount() called');
      try {
        const count = await this.cartItems.count();
        this.logger.info(`[EcommercePage] Cart items count: ${count}`);
        return count;
      } catch (error) {
        this.logger.error(`[EcommercePage] getCartItemsCount() failed: ${error.message}`);
        return 0;
      }
    });
  }

  async clickCheckout() {
    return await test.step('Click PROCEED TO CHECKOUT button', async () => {
      this.logger.info('[EcommercePage] clickCheckout() called');
      try {
        await retryAction(
          () => this.checkoutButton.click(),
          {
            retries: 2,
            initialDelay: 300,
            onRetry: (attempt, err) =>
              this.logger.warn(`[EcommercePage] Checkout click retry ${attempt}: ${err.message}`)
          }
        );
        this.logger.info('[EcommercePage] clickCheckout() completed');
      } catch (error) {
        this.logger.error(`[EcommercePage] clickCheckout() failed: ${error.message}`);
        throw error;
      }
    });
  }

   async isCheckoutButtonVisible() {
    return await test.step('Check if checkout button is visible', async () => {
      this.logger.info('[EcommercePage] isCheckoutButtonVisible() called');
      try {
        const visible = await this.checkoutButton.isVisible();
        this.logger.info(`[EcommercePage] Checkout button visible: ${visible}`);
        return visible;
      } catch (error) {
        this.logger.error(`[EcommercePage] isCheckoutButtonVisible() failed: ${error.message}`);
        return false;
      }
    });
  }

  async getSuccessMessage() {
    return await test.step('Get success/confirmation message', async () => {
      this.logger.info('[EcommercePage] getSuccessMessage() called');
      try {
        await this.successMessage.waitFor({ state: 'visible', timeout: 10000 });
        const message = await this.getElementText(this.successMessage);
        this.logger.info(`[EcommercePage] Success message: "${message}"`);
        return message;
      } catch (error) {
        this.logger.warn('[EcommercePage] No success message found within timeout');
        return null;
      }
    });
  }

  async clickLogout() {
    return await test.step('Click Log Out link', async () => {
      this.logger.info('[EcommercePage] clickLogout() called');
      try {
        await retryAction(
          () => this.logoutButton.click(),
          {
            retries: 2,
            initialDelay: 300,
            onRetry: (attempt, err) =>
              this.logger.warn(`[EcommercePage] Logout click retry ${attempt}: ${err.message}`)
          }
        );
        this.logger.info('[EcommercePage] clickLogout() completed');
      } catch (error) {
        this.logger.error(`[EcommercePage] clickLogout() failed: ${error.message}`);
        throw error;
      }
    });
  }

  async fillPhoneNumber(phoneNumber) {
    return await test.step(`Fill phone number: "${phoneNumber}"`, async () => {
      this.logger.info(`[EcommercePage] fillPhoneNumber() called with: "${phoneNumber}"`);
      try {
        await this.phoneNameInput.waitFor({ state: 'visible', timeout: 5000 });
        await this.phoneNameInput.fill(phoneNumber);
        this.logger.info(`[EcommercePage] Phone number filled successfully`);
      } catch (error) {
        this.logger.error(`[EcommercePage] fillPhoneNumber() failed: ${error.message}`);
        throw error;
      }
    });
  }

  async fillStreetAddress(street) {
    return await test.step(`Fill street address: "${street}"`, async () => {
      this.logger.info(`[EcommercePage] fillStreetAddress() called with: "${street}"`);
      try {
        await this.streetAddressInput.waitFor({ state: 'visible', timeout: 10000 });
        await this.streetAddressInput.fill(street);
        this.logger.info(`[EcommercePage] Street address filled successfully`);
      } catch (error) {
        this.logger.error(`[EcommercePage] fillStreetAddress() failed: ${error.message}`);
        throw error;
      }
    });
  }

 async fillCity(city) {
    return await test.step(`Fill city: "${city}"`, async () => {
      this.logger.info(`[EcommercePage] fillCity() called with: "${city}"`);
      try {
        await this.cityInput.waitFor({ state: 'visible', timeout: 5000 });
        await this.cityInput.fill(city);
        this.logger.info(`[EcommercePage] City filled successfully`);
      } catch (error) {
        this.logger.error(`[EcommercePage] fillCity() failed: ${error.message}`);
        throw error;
      }
    });
  }

  async selectCountry(countryName) {
    return await test.step(`Select country: "${countryName}"`, async () => {
      this.logger.info(`[EcommercePage] selectCountry() called with: "${countryName}"`);
      try {
        await this.country.waitFor({ state: 'visible', timeout: 5000 });
        await this.country.selectOption(countryName);
        this.logger.info(`[EcommercePage] Country selected successfully`);
      } catch (error) {
        this.logger.error(`[EcommercePage] selectCountry() failed: ${error.message}`);
        throw error;
      }
    });
  }

 async fillShippingDetails(phoneNumber, street, city, country) {
    return await test.step('Fill complete shipping details', async () => {
      this.logger.info('[EcommercePage] fillShippingDetails() called');
      try {
        await this.fillPhoneNumber(phoneNumber);
        await this.fillStreetAddress(street);
        await this.fillCity(city);
        await this.selectCountry(country);
        this.logger.info('[EcommercePage] fillShippingDetails() completed successfully');
      } catch (error) {
        this.logger.error(`[EcommercePage] fillShippingDetails() failed: ${error.message}`);
        throw error;
      }
    });
  }

  async submitOrder() {
    return await test.step('Click Submit Order button', async () => {
      this.logger.info('[EcommercePage] submitOrder() called');
      try {
        await retryAction(
          () => this.submitOrderButton.click(),
          {
            retries: 2,
            initialDelay: 300,
            onRetry: (attempt, err) =>
              this.logger.warn(`[EcommercePage] Submit order retry ${attempt}: ${err.message}`)
          }
        );
        this.logger.info('[EcommercePage] submitOrder() completed');
      } catch (error) {
        this.logger.error(`[EcommercePage] submitOrder() failed: ${error.message}`);
        throw error;
      }
    });
  }

  async getCartItemsDetails() {
    return await test.step('Get cart items details', async () => {
      this.logger.info('[EcommercePage] getCartItemsDetails() called');
      try {
        const items = [];
        const itemNames = await this.cartItemName.allTextContents();
        const itemPrices = await this.cartItemPrice.allTextContents();
        const quantityInputs = this.cartItemQuantity;
        const quantityCount = await quantityInputs.count();

        for (let i = 0; i < itemNames.length; i++) {
          const quantityValue = await quantityInputs.nth(i).inputValue();
          
          items.push({
            name: itemNames[i],
            price: itemPrices[i],
            quantity: quantityValue
          });
        }

        this.logger.info(`[EcommercePage] Retrieved ${items.length} cart items`);
        return items;
      } catch (error) {
        this.logger.error(`[EcommercePage] getCartItemsDetails() failed: ${error.message}`);
        return [];
      }
    });
  }

  async getCartTotalPrice() {
    return await test.step('Get cart total price', async () => {
      this.logger.info('[EcommercePage] getCartTotalPrice() called');
      try {
        const totalPrice = await this.getElementText(this.cartTotalPrice);
        this.logger.info(`[EcommercePage] Cart total price: "${totalPrice}"`);
        return totalPrice;
      } catch (error) {
        this.logger.error(`[EcommercePage] getCartTotalPrice() failed: ${error.message}`);
        return null;
      }
    });
  }
}
