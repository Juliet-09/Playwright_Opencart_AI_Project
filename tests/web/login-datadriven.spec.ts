/**
 * Test Case: Login Flow (Data Driven using External File)
 *
 * Tags: @master @datadriven @regression @web
 *
 * Steps:
 * For each data row from the external test data file:
 * 1) Open the OpenCart login page
 * 2) Enter the email and password
 * 3) Submit the login form
 * 4) Validate the result based on expected value
 */

import { test, expect } from '../../fixtures/pageFixtures';
import { DataProvider } from '../../utils/DataReader';
import path from 'path';

const loginData = DataProvider.readJson(path.resolve(__dirname, '../../testdata/opencart_logindata.json'));

for (const [index, data] of loginData.entries()) {
    test(`Login Data Driven - ${data.testName} #${index + 1} @master @datadriven @regression @web`, async ({ homePage, loginPage, myAccountPage }) => {

        await test.step('1) Open the application and navigate to login', async () => {
            const loginUrl = (process.env.WEB_APP_URL || 'http://localhost/opencart/upload/') + 'index.php?route=account/login';
            await homePage.getPage().goto(loginUrl);
        });

        await test.step('2) Enter credentials', async () => {
            const email = data.email.trim();
            const password = data.password.trim();
            if (email) {
                await loginPage.setEmail(email);
            }
            if (password) {
                await loginPage.setPassword(password);
            }
        });

        await test.step('3) Submit the login form', async () => {
            await loginPage.clickLogin();
        });

        await test.step('4) Validate the result', async () => {
            if (data.expected === 'success') {
                const isMyAccount = await myAccountPage.isMyAccountPageExists();
                expect(isMyAccount).toBeTruthy();
            } else {
                const hasWarning = await loginPage.isWarningMessageExists();
                expect(hasWarning).toBeTruthy();
            }
        });

        console.log(`✅ Login Data Driven - ${data.testName} completed successfully!`);
    });
}