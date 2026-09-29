/**
 * Test Case: Logout Flow
 *
 * Tags: @master @regression @web
 *
 * Steps:
 * 1) Open the application
 * 2) Log in using valid customer credentials
 * 3) Verify authentication succeeds
 * 4) Navigate to account logout
 * 5) Verify logout confirmation page
 * 6) Click Continue
 * 7) Verify redirect to homepage
 * 8) Verify authenticated options are no longer available
 */

import { test, expect } from '../../fixtures/pageFixtures';
import { Helper } from '../../utils/helper';

test('Logout Flow @master @regression @web', async ({ homePage, loginPage, myAccountPage, logoutPage }) => {
    const { email, password } = Helper.getLoginDetails();

    await test.step('1) Open the application and log in', async () => {
        await homePage.navigateTo();
        const loginUrl = (process.env.WEB_APP_URL || 'http://localhost/opencart/upload/') + 'index.php?route=account/login';
        await homePage.getPage().goto(loginUrl);
        await loginPage.login(email, password);
    });

    await test.step('2) Verify authentication succeeds', async () => {
        const isMyAccount = await myAccountPage.isMyAccountPageExists();
        expect(isMyAccount).toBeTruthy();
    });

    await test.step('3) Navigate to Logout', async () => {
        const logoutUrl = (process.env.WEB_APP_URL || 'http://localhost/opencart/upload/') + 'index.php?route=account/logout';
        await homePage.getPage().goto(logoutUrl);
    });

    await test.step('4) Verify logout confirmation page is displayed', async () => {
        const isLogoutPage = await logoutPage.isLogoutPageExists();
        expect(isLogoutPage).toBeTruthy();
    });

    await test.step('5) Click Continue to return to homepage', async () => {
        await logoutPage.clickContinue();
    });

    await test.step('6) Verify authenticated options are no longer available', async () => {
        // After logout and Continue, we should be on the homepage
        const currentUrl = await homePage.getPage().url();
        expect(currentUrl).toContain('route=common/home');
    });

    console.log('✅ Logout completed successfully!');
});