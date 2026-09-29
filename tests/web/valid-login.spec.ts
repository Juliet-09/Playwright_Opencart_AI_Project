/**
 * Test Case: Valid Login Flow
 *
 * Tags: @master @sanity @regression @web
 *
 * Steps:
 * 1) Open the application
 * 2) Navigate to My Account → Login
 * 3) Verify the login page is displayed
 * 4) Enter valid customer credentials
 * 5) Submit the login form
 * 6) Verify successful authentication
 * 7) Verify the My Account page is displayed
 */

import { test, expect } from '../../fixtures/pageFixtures';
import { Helper } from '../../utils/helper';

test('Valid Login Flow @master @sanity @regression @web', async ({ homePage, loginPage, myAccountPage }) => {
    const { email, password } = Helper.getLoginDetails();

    await test.step('1) Open the application', async () => {
        await homePage.navigateTo();
    });

    await test.step('2) Navigate to the login page', async () => {
        const loginUrl = (process.env.WEB_APP_URL || 'http://localhost/opencart/upload/') + 'index.php?route=account/login';
        await homePage.getPage().goto(loginUrl);
    });

    await test.step('3) Verify the login page is displayed', async () => {
        const isLoginPage = await loginPage.isLoginPageExists();
        expect(isLoginPage).toBeTruthy();
    });

    await test.step('4) Enter valid credentials and submit', async () => {
        await loginPage.login(email, password);
    });

    await test.step('5) Verify successful authentication', async () => {
        const isMyAccount = await myAccountPage.isMyAccountPageExists();
        expect(isMyAccount).toBeTruthy();
    });

    console.log('✅ Valid Login completed successfully!');
});