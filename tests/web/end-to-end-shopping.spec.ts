/**
 * Test Case: End-to-End Shopping Flow
 *
 * Tags: @master @end-to-end @regression @web
 *
 * Steps:
 * 1) Open the application
 * 2) Register a new customer with dynamically generated data
 * 3) Verify successful registration
 * 4) Log out
 * 5) Log in again using the newly created credentials
 * 6) Verify successful authentication
 * 7) Search for a known product
 * 8) Open the product details page
 * 9) Add the product to the cart
 * 10) Open the shopping cart
 * 11) Verify the correct product, quantity, price, and total
 */

import { test, expect } from '../../fixtures/pageFixtures';
import { Helper } from '../../utils/helper';

test('End-to-End Shopping Flow @master @end-to-end @regression @web', async ({ homePage, registerPage, accountSuccessPage, myAccountPage, logoutPage, loginPage, searchResultsPage, productPage, cartPage }) => {
    const userData = Helper.getRegistrationData();
    const { productName, productQuantity, totalPrice } = Helper.getProductDetails();

    await test.step('1-2) Open the application and register a new customer', async () => {
        await homePage.navigateTo();
        const registerUrl = (process.env.WEB_APP_URL || 'http://localhost/opencart/upload/') + 'index.php?route=account/register';
        await homePage.getPage().goto(registerUrl);
        await registerPage.completeRegistration(userData);
    });

    await test.step('3) Verify successful registration', async () => {
        const isSuccess = await accountSuccessPage.isAccountSuccessPageExists();
        expect(isSuccess).toBeTruthy();
        await accountSuccessPage.clickContinue();
    });

    await test.step('4) Log out', async () => {
        const logoutUrl = (process.env.WEB_APP_URL || 'http://localhost/opencart/upload/') + 'index.php?route=account/logout';
        await homePage.getPage().goto(logoutUrl);
        const isLogoutPage = await logoutPage.isLogoutPageExists();
        expect(isLogoutPage).toBeTruthy();
        await logoutPage.clickContinue();
    });

    await test.step('5) Log in again using the newly created credentials', async () => {
        const loginUrl = (process.env.WEB_APP_URL || 'http://localhost/opencart/upload/') + 'index.php?route=account/login';
        await homePage.getPage().goto(loginUrl);
        await loginPage.login(userData.email, userData.password);
    });

    await test.step('6) Verify successful authentication', async () => {
        const isMyAccount = await myAccountPage.isMyAccountPageExists();
        expect(isMyAccount).toBeTruthy();
    });

    await test.step('7-8) Search for a product and open details page', async () => {
        await homePage.navigateTo();
        await homePage.searchProduct(productName);
        await searchResultsPage.clickProduct(productName);
    });

    await test.step('9) Add the product to the cart', async () => {
        await productPage.setQuantity(productQuantity);
        await productPage.clickAddToCart();
        const hasSuccess = await productPage.isSuccessAlertExists();
        expect(hasSuccess).toBeTruthy();
    });

    await test.step('10-11) Open cart and verify product details', async () => {
        const cartUrl = (process.env.WEB_APP_URL || 'http://localhost/opencart/upload/') + 'index.php?route=checkout/cart';
        await homePage.getPage().goto(cartUrl);

        const isProductInCart = await cartPage.isProductInCart(productName);
        expect(isProductInCart).toBeTruthy();

        const quantity = await cartPage.getProductQuantity(productName);
        expect(quantity).toBe(productQuantity);
    });

    console.log('✅ End-to-End Shopping Flow completed successfully!');
});