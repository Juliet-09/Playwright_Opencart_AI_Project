/**
 * Test Case: Invalid Login Flow
 *
 * Tags: @master @regression @web
 *
 * Steps:
 * 1) Open the application
 * 2) Navigate to My Account → Login
 * 3) Enter invalid email and/or password
 * 4) Submit the form
 * 5) Verify authentication fails
 * 6) Verify the appropriate warning message
 * 7) Verify the customer is not authenticated
 */

import { test, expect } from '../../fixtures/pageFixtures';

test('Invalid Login Flow @master @regression @web', async ({ homePage, loginPage, myAccountPage }) => {
    const invalidEmail = 'invalid@email.com';
    const invalidPassword = 'wrongpassword';

    await test.step('1) Open the application', async () => {
        await homePage.navigateTo();
    });

    await test.step('2) Navigate to the login page', async () => {
        const loginUrl = (process.env.WEB_APP_URL || 'http://localhost/opencart/upload/') + 'index.php?route=account/login';
        await homePage.getPage().goto(loginUrl);
    });

    await test.step('3) Enter invalid credentials and submit', async () => {
        await loginPage.login(invalidEmail, invalidPassword);
    });

    await test.step('4) Verify authentication fails with warning message', async () => {
        const hasWarning = await loginPage.isWarningMessageExists();
        expect(hasWarning).toBeTruthy();

        const warningText = await loginPage.getWarningMessage();
        expect(warningText).toContain('Warning: No match for E-Mail Address and/or Password.');
    });

    await test.step('5) Verify the customer is not authenticated', async () => {
        const isMyAccount = await myAccountPage.isMyAccountPageExists();
        expect(isMyAccount).toBeFalsy();
    });

    console.log('✅ Invalid Login completed successfully!');
});