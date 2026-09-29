/**
 * Test Case: User Registration Flow
 *
 * Tags: @master @sanity @regression @web
 *
 * Steps:
 * 1) Open the application
 * 2) Navigate to My Account → Register
 * 3) Verify the registration page is displayed
 * 4) Generate unique customer data and fill the form
 * 5) Accept Privacy Policy and submit
 * 6) Verify registration success
 * 7) Verify account-created confirmation message
 * 8) Verify the newly created account is accessible
 */

import { test, expect } from '../../fixtures/pageFixtures';
import { Helper } from '../../utils/helper';

test('User Registration Flow @master @sanity @regression @web', async ({ homePage, registerPage, accountSuccessPage, myAccountPage }) => {
    const userData = Helper.getRegistrationData();

    await test.step('1) Open the application', async () => {
        await homePage.navigateTo();
    });

    await test.step('2) Navigate to the registration page', async () => {
        const registerUrl = (process.env.WEB_APP_URL || 'http://localhost/opencart/upload/') + 'index.php?route=account/register';
        await homePage.getPage().goto(registerUrl);
    });

    await test.step('3) Verify the registration page is displayed', async () => {
        const isRegisterPage = await registerPage.isRegisterPageExists();
        expect(isRegisterPage).toBeTruthy();
    });

    await test.step('4) Fill the registration form with valid data', async () => {
        await registerPage.completeRegistration(userData);
    });

    await test.step('5) Verify registration success and confirmation message', async () => {
        const isSuccess = await accountSuccessPage.isAccountSuccessPageExists();
        expect(isSuccess).toBeTruthy();

        const successHeading = await accountSuccessPage.getSuccessHeading();
        expect(successHeading).toContain('Your Account Has Been Created!');
    });

    await test.step('6) Navigate to My Account and verify account is accessible', async () => {
        await accountSuccessPage.clickContinue();
        const isMyAccount = await myAccountPage.isMyAccountPageExists();
        expect(isMyAccount).toBeTruthy();
    });

    console.log('✅ User Registration completed successfully!');
});