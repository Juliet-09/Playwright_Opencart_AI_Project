/**
 * Test Case: OpenCart UI + Admin + MySQL End-to-End Validation
 *
 * Tags: @master @end-to-end @db @web
 *
 * Steps:
 * 1) Register a new customer through the frontend with dynamically generated data
 * 2) Verify the customer exists in the Admin Portal
 * 3) Verify the customer record exists in the MySQL oc_customer table
 */

import { test, expect } from '../../fixtures/pageFixtures';
import { Helper } from '../../utils/helper';
import { AdminLoginPage } from '../../pages/AdminLoginPage';
import { AdminCustomerPage } from '../../pages/AdminCustomerPage';
import { executeQuery } from '../../utils/dbClient';
import dotenv from 'dotenv';

dotenv.config();

test('OpenCart UI + Admin + MySQL End-to-End @master @end-to-end @db @web', async ({ page, homePage, registerPage, accountSuccessPage }) => {
    const userData = Helper.getRegistrationData();
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin';

    // ---------------------------------------------------------
    // Step 1: Register Customer Through Frontend
    // ---------------------------------------------------------

    await test.step('1) Register a new customer through the frontend', async () => {
        await homePage.navigateTo();
        const registerUrl = (process.env.WEB_APP_URL || 'http://localhost/opencart/upload/') + 'index.php?route=account/register';
        await homePage.getPage().goto(registerUrl);

        const isRegisterPage = await registerPage.isRegisterPageExists();
        expect(isRegisterPage, 'Registration page should be displayed').toBeTruthy();

        await registerPage.completeRegistration(userData);

        const isSuccess = await accountSuccessPage.isAccountSuccessPageExists();
        expect(isSuccess, 'Account success page should be displayed after registration').toBeTruthy();

        const successHeading = await accountSuccessPage.getSuccessHeading();
        expect(successHeading, 'Success heading should contain confirmation text').toContain('Your Account Has Been Created!');
    });

    // ---------------------------------------------------------
    // Step 2: Verify Customer in Admin Portal
    // ---------------------------------------------------------

    await test.step('2) Verify the customer in the Admin Portal', async () => {
        const adminLoginPage = new AdminLoginPage(page);
        const adminCustomerPage = new AdminCustomerPage(page);

        // Log in to Admin Portal
        await adminLoginPage.navigateTo();
        await adminLoginPage.login(adminUsername, adminPassword);

        // Navigate to Customers section
        await adminCustomerPage.navigateToCustomers();

        // Search for the customer by email
        await adminCustomerPage.searchByEmail(userData.email);

        // Verify the customer exists in the table
        const rowCount = await adminCustomerPage.getCustomerRowCount();
        expect(rowCount, 'At least one customer row should be found').toBeGreaterThanOrEqual(1);

        const isCustomerFound = await adminCustomerPage.isCustomerInTable(userData.email);
        expect(isCustomerFound, `Customer with email ${userData.email} should be found in Admin`).toBeTruthy();

        // Open the customer record to verify details
        await adminCustomerPage.clickFirstCustomerEdit();

        // Verify first name
        const firstname = await adminCustomerPage.getCustomerFieldValue('firstname');
        expect(firstname, 'First name should match').toBe(userData.firstname);

        // Verify last name
        const lastname = await adminCustomerPage.getCustomerFieldValue('lastname');
        expect(lastname, 'Last name should match').toBe(userData.lastname);

        // Verify email
        const email = await adminCustomerPage.getCustomerFieldValue('email');
        expect(email, 'Email should match').toBe(userData.email);

        // Verify status is Enabled (value '1')
        const status = await adminCustomerPage.getCustomerStatus();
        expect(status, 'Customer status should be Enabled').toBe('1');
    });

    // ---------------------------------------------------------
    // Step 3: Verify Customer in MySQL
    // ---------------------------------------------------------

    await test.step('3) Verify the customer in the MySQL database', async () => {
        let rows: any;

        try {
            rows = await executeQuery(
                'SELECT customer_id, firstname, lastname, email, status, date_added FROM oc_customer WHERE email = ?',
                [userData.email]
            ) as any[];
        } catch (error) {
            console.log(`Database query error: ${error}`);
            throw new Error(`Failed to query oc_customer table: ${error}`);
        }

        // Verify exactly one customer record is found
        expect(Array.isArray(rows)).toBeTruthy();
        expect(rows.length, 'Exactly one customer record should be found in the database').toBe(1);

        const customer = rows[0];

        // Validate firstname
        expect(customer.firstname, 'Database firstname should match').toBe(userData.firstname);

        // Validate lastname
        expect(customer.lastname, 'Database lastname should match').toBe(userData.lastname);

        // Validate email
        expect(customer.email, 'Database email should match').toBe(userData.email);

        // Validate status (1 = Enabled)
        expect(customer.status, 'Database status should be 1 (Enabled)').toBe(1);

        // Validate date_added exists
        expect(customer.date_added, 'date_added should exist').toBeTruthy();
    });

    console.log('✅ OpenCart UI + Admin + MySQL End-to-End completed successfully!');
});