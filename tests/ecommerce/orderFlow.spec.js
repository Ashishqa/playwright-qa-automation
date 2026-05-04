import { test, expect } from '../../src/fixtures/testFixtures.js';
import * as allure from 'allure-js-commons';
import { users } from '../../test-data/users.js';
import { products } from '../../test-data/products.js';
import { shippingAddresses } from '../../test-data/shippingData.js';
import { PriceHelper } from '../../src/helpers/priceHelper.js';
import { timeouts } from '../../config/timeouts.js';

test.describe('E-Commerce - Order Flow', () => {

  test.beforeEach(async ({ loginPage, page, logger }) => {
    logger.info('beforeEach: navigating to login page and logging in');
    await loginPage.navigateToLoginPage();
    const { username, password } = users.valid;
    await loginPage.login(username, password);
    await page.waitForLoadState('networkidle', { timeout: timeouts.NETWORK_IDLE });
    logger.info('beforeEach: login complete – shop page ready');
  });

  test('Positive: Add single item to cart', { tag: ['@smoke', '@regression'] }, async ({ ecommercePage, logger }) => {
    allure.label('feature', 'E-Commerce');
    allure.label('story', 'Add to Cart');
    allure.severity('critical');
    allure.owner('Ashish');
    allure.tag('@smoke');
    allure.tag('@regression');

    try {
      logger.info('Adding first product to cart');
      await test.step('Add first item', async () => {
        await ecommercePage.addItemToCart(products[0].name);
      });

      await test.step('Verify item count > 0', async () => {
        const cartCount = await ecommercePage.getCartItemsCount();
        logger.info(`Cart count after add: ${cartCount}`);
        expect(cartCount).toBeGreaterThan(0);
      });

      logger.info('✅ Add single item test passed');
    } catch (error) {
      logger.error(`Test failed: ${error.message}`);
      throw error;
    }
  });

  test('Positive: Add multiple items to cart', { tag: ['@regression'] }, async ({ ecommercePage, logger }) => {
    allure.label('feature', 'E-Commerce');
    allure.label('story', 'Add to Cart');
    allure.severity('critical');
    allure.owner('Ashish');
    allure.tag('@regression');

    try {
      const itemsToAdd = [products[0].name, products[1].name, products[2].name];

      logger.info(`Adding ${itemsToAdd.length} items to cart`);
      await test.step('Add 3 products', async () => {
        await ecommercePage.addMultipleItemsToCart(itemsToAdd);
      });

      await test.step('Verify cart has >= 3 items', async () => {
        const cartCount = await ecommercePage.getCartItemsCount();
        logger.info(`Cart count after add: ${cartCount}`);
        expect(cartCount).toBeGreaterThanOrEqual(3);
      });

      logger.info('✅ Add multiple items test passed');
    } catch (error) {
      logger.error(`Test failed: ${error.message}`);
      throw error;
    }
  });

  test('Positive: Complete order checkout', { tag: ['@smoke', '@regression'] }, async ({ ecommercePage, page, logger }) => {
    allure.label('feature', 'E-Commerce');
    allure.label('story', 'Order Checkout');
    allure.severity('critical');
    allure.owner('Ashish');
    allure.tag('@smoke');
    allure.tag('@regression');

    try {
      logger.info('Step 1: Adding items to cart');
      await test.step('Add 2 items to cart', async () => {
        await ecommercePage.addMultipleItemsToCart([products[0].name, products[1].name]);
      });

      await test.step('Verify cart has >= 2 items', async () => {
        const cartCount = await ecommercePage.getCartItemsCount();
        logger.info(`Cart count: ${cartCount}`);
        expect(cartCount).toBeGreaterThanOrEqual(2);
      });

      logger.info('Step 2: Clicking checkout/purchase');
      await test.step('Click checkout button', async () => {
        await ecommercePage.clickCheckout();
        await page.waitForTimeout(timeouts.NAVIGATION);
      });

      await test.step('Verify order success message', async () => {
        const successMessage = await ecommercePage.getSuccessMessage();
        expect(successMessage).not.toBeNull();
        logger.info(`✅ Order success message: "${successMessage}"`);
      });

      logger.info('✅ Complete order checkout test passed');
    } catch (error) {
      logger.error(`Test failed: ${error.message}`);
      throw error;
    }
  });

  test('Negative: Attempt checkout with empty cart', { tag: ['@regression', '@negative'] }, async ({ ecommercePage, logger }) => {
    allure.label('feature', 'E-Commerce');
    allure.label('story', 'Order Checkout');
    allure.severity('normal');
    allure.owner('Ashish');
    allure.tag('@regression');
    allure.tag('@negative');

    try {
      await test.step('Verify cart is empty (0 REMOVE buttons)', async () => {
        const cartCount = await ecommercePage.getCartItemsCount();
        logger.info(`Initial cart item count: ${cartCount}`);
        expect(cartCount).toBe(0);
      });

      await test.step('Verify checkout button NOT visible when cart is empty', async () => {
        const checkoutVisible = await ecommercePage.isCheckoutButtonVisible();
        logger.info(`Checkout button visible: ${checkoutVisible}`);
        expect(checkoutVisible).toBe(false);
        logger.info('✅ Checkout button correctly hidden for empty cart');
      });

    } catch (error) {
      logger.error(`Test failed: ${error.message}`);
      throw error;
    }
  });

  test('Verify cart state management', { tag: ['@regression'] }, async ({ ecommercePage, logger }) => {
    allure.label('feature', 'E-Commerce');
    allure.label('story', 'Cart Management');
    allure.severity('normal');
    allure.owner('Ashish');
    allure.tag('@regression');

    try {
      await test.step('Verify cart starts empty (0 items)', async () => {
        const initialCount = await ecommercePage.getCartItemsCount();
        logger.info(`Initial cart count: ${initialCount}`);
        expect(initialCount).toBe(0);
      });

      await test.step('Add one item', async () => {
        await ecommercePage.addItemToCart(products[0].name);
      });

      await test.step('Verify cart has exactly 1 item', async () => {
        const updatedCount = await ecommercePage.getCartItemsCount();
        logger.info(`Cart count after 1 add: ${updatedCount}`);
        expect(updatedCount).toBe(1);
      });

      logger.info('✅ Cart state management test passed');
    } catch (error) {
      logger.error(`Test failed: ${error.message}`);
      throw error;
    }
  });

  test('Happy Path: Complete E-Commerce Flow (Login → Add Items → Checkout → Logout) with multiple products and shipping form',
    { tag: ['@smoke', '@e2e', '@full-flow'] },
    async ({ loginPage, ecommercePage, page, logger }, testInfo) => {
      allure.label('feature', 'E-Commerce');
      allure.label('story', 'Complete Purchase Flow');
      allure.severity('critical');
      allure.owner('Ashish');
      allure.tag('@smoke');
      allure.tag('@e2e');
      allure.tag('@full-flow');

      try {
        
        logger.info('=== STEP 1: Verify logged-in state ===');
        await test.step('Verify logout button is visible (user is logged in)', async () => {
          await expect(ecommercePage.logoutButton).toBeVisible({ timeout: timeouts.ELEMENT_VISIBLE });
          logger.info('✅ Logout button visible – user is authenticated');
        });

        logger.info('=== STEP 2: Add items to cart ===');
        const itemsToAdd = [products[0].name, products[1].name, products[2].name];
        const totalPrice = PriceHelper.sumPrices(products[0].price, products[1].price, products[2].price); 
        await test.step(`Add ${itemsToAdd.length} items to cart`, async () => {
          logger.info(`Adding: ${itemsToAdd.join(', ')}`);
          await ecommercePage.addMultipleItemsToCart(itemsToAdd);
        });

        logger.info('=== STEP 2: Verify cart has items ===');
        await test.step('Verify cart has items', async () => {
          const cartCount = await ecommercePage.getCartItemsCount();
          logger.info(`Cart contains ${cartCount} items`);
          expect(cartCount).toBeGreaterThanOrEqual(3);
          logger.info('✅ Items successfully added to cart');
        });

        logger.info('=== STEP 3: Submit order (checkout) ===');
        await test.step('Click Purchase / Checkout button', async () => {
          await ecommercePage.clickCheckout();
          await page.waitForTimeout(timeouts.NAVIGATION);
        });


        logger.info('=== STEP 4: Fill shipping form ===');
        const shippingData = {
          phoneNumber: shippingAddresses[2].phoneNumber,
          street: shippingAddresses[2].street,
          city: shippingAddresses[2].city,
          country: shippingAddresses[2].country
        };

        await test.step('Enter phone number', async () => {
          await ecommercePage.fillPhoneNumber(shippingData.phoneNumber);
          logger.info(`✅ Phone number entered: ${shippingData.phoneNumber}`);
        });

        await test.step('Enter street address', async () => {
          await ecommercePage.fillStreetAddress(shippingData.street);
          logger.info(`✅ Street address entered: ${shippingData.street}`);
        });

        await test.step('Enter city', async () => {
          await ecommercePage.fillCity(shippingData.city);
          logger.info(`✅ City entered: ${shippingData.city}`);
        });

        await test.step('Select country from dropdown', async () => {
          await ecommercePage.selectCountry(shippingData.country);
          logger.info(`✅ Country selected: ${shippingData.country}`);
        });

        logger.info('=== STEP 5: Submit order ===');
        await test.step('Click Submit Order button', async () => {
          await ecommercePage.submitOrder();
          await page.waitForTimeout(timeouts.NAVIGATION);
        });

        logger.info('=== STEP 6: Verify success message ===');
        await test.step('Verify order success message with price and address', async () => {
          const successMessage = await ecommercePage.getSuccessMessage();
          
          logger.info(`Success message: "${successMessage}"`);
          const expectedPrice = PriceHelper.formatPrice(totalPrice);
          const expectedMessage = `Congrats! Your order of  ${expectedPrice}  has been registered and will be shipped to ${shippingData.street}, ${shippingData.city} - ${shippingData.country}.`;
          logger.info(`Expected message pattern: ${expectedMessage}`);
          expect(successMessage).toEqual(expectedMessage);
          logger.info('✅ Success message contains all required components');
          logger.info(`✅ Order confirmed with price (${expectedPrice}) and address`);
        });

        logger.info('=== STEP 7: Logout ===');
        await test.step('Click logout', async () => {
          await ecommercePage.clickLogout();
          await page.waitForLoadState('networkidle', { timeout: timeouts.NETWORK_IDLE });
        });

        await test.step('Verify redirected back to login form', async () => {
          await expect(loginPage.loginForm).toBeVisible({ timeout: timeouts.ELEMENT_WAIT });
          logger.info('✅ Logout successful – login form is showing');
        });

        logger.info('=== ✅ HAPPY PATH TEST PASSED ===');
      } catch (error) {
        logger.error(`Happy path test failed: ${error.message}`);
        throw error;
      }
    });

test('Happy Path: Complete E-Commerce Flow (Login → Add Items → Checkout → Logout) with single products and shipping form',
    { tag: ['@smoke', '@e2e', '@full-flow'] },
    async ({ ecommercePage, page, logger }, testInfo) => {
      allure.label('feature', 'E-Commerce');
      allure.label('story', 'Complete Order Flow');
      allure.severity('critical');
      allure.owner('Ashish');
      allure.tag('@smoke');
      allure.tag('@e2e');
      allure.tag('@full-flow');

      try {
        logger.info('=== STEP 1: Add product to cart ===');
        const productToAdd = products[0].name;
        await test.step(`Add product: "${productToAdd}"`, async () => {
          logger.info(`Adding product: ${productToAdd}`);
          await ecommercePage.addItemToCart(productToAdd);
        });

        logger.info('=== STEP 2: Verify cart details ===');
        await test.step('Verify item count in cart', async () => {
          const cartCount = await ecommercePage.getCartItemsCount();
          logger.info(`Cart item count: ${cartCount}`);
          expect(cartCount).toBeGreaterThan(0);
        });

        await test.step('Verify product name, price, and count', async () => {
          const cartItems = await ecommercePage.getCartItemsDetails();
          logger.info(`Cart items: ${JSON.stringify(cartItems)}`);
          
          expect(cartItems.length).toBeGreaterThan(0);
          const firstItem = cartItems[0];
          
          expect(firstItem.name).toEqual(products[0].name);
          logger.info(`✅ Product name: ${firstItem.name}`);
          
          expect(firstItem.price).toEqual(products[0].price);
          logger.info(`✅ Product price: ${firstItem.price}`);
          
          expect(firstItem.quantity).toEqual("1");
          logger.info(`✅ Product quantity: ${firstItem.quantity}`);
        });

        await test.step('Verify total price', async () => {
          const totalPrice = await ecommercePage.getCartTotalPrice();
          logger.info(`Total price: ${totalPrice}`);
          expect(totalPrice).toBeTruthy();
        });

        logger.info('=== STEP 3: Proceed to checkout ===');
        await test.step('Click checkout button', async () => {
          await ecommercePage.clickCheckout();
          await page.waitForTimeout(timeouts.NAVIGATION);
        });

        logger.info('=== STEP 4: Fill shipping form ===');
        const shippingData = {
          phoneNumber: shippingAddresses[0].phoneNumber,
          street: shippingAddresses[0].street,
          city: shippingAddresses[0].city,
          country: shippingAddresses[0].country
        };

        await test.step('Enter phone number', async () => {
          await ecommercePage.fillPhoneNumber(shippingData.phoneNumber);
          logger.info(`✅ Phone number entered: ${shippingData.phoneNumber}`);
        });

        await test.step('Enter street address', async () => {
          await ecommercePage.fillStreetAddress(shippingData.street);
          logger.info(`✅ Street address entered: ${shippingData.street}`);
        });

        await test.step('Enter city', async () => {
          await ecommercePage.fillCity(shippingData.city);
          logger.info(`✅ City entered: ${shippingData.city}`);
        });

        await test.step('Select country from dropdown', async () => {
          await ecommercePage.selectCountry(shippingData.country);
          logger.info(`✅ Country selected: ${shippingData.country}`);
        });

        logger.info('=== STEP 5: Submit order ===');
        await test.step('Click Submit Order button', async () => {
          await ecommercePage.submitOrder();
          await page.waitForTimeout(timeouts.NAVIGATION);
        });

        logger.info('=== STEP 6: Verify success message ===');
        await test.step('Verify order success message with price and address', async () => {
          const successMessage = await ecommercePage.getSuccessMessage();
          logger.info(`Success message: "${successMessage}"`);
          
          const productPrice = products[0].price;

          const expectedMessage = `Congrats! Your order of  ${productPrice}  has been registered and will be shipped to ${shippingData.street}, ${shippingData.city} - ${shippingData.country}.`;
          logger.info(`Expected message pattern: ${expectedMessage}`);
          expect(successMessage).toEqual(expectedMessage);
          
          logger.info('✅ Success message contains required components');
          logger.info(`✅ Order confirmed with price (${productPrice}) and address`);
        });

        logger.info('=== ✅ COMPLETE ORDER FLOW TEST PASSED ===');
      } catch (error) {
        logger.error(`Complete order flow test failed: ${error.message}`);
        throw error;
      }
    });

});
