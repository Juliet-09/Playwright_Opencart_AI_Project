import { Page, Locator } from '@playwright/test';

export class LoginPage {
    private readonly page: Page;

    // Locators
    private readonly headingReturningCustomer: Locator;
    private readonly inputEmail: Locator;
    private readonly inputPassword: Locator;
    private readonly btnLogin: Locator;
    private readonly alertWarning: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators
        this.headingReturningCustomer = page.locator('h2', { hasText: 'Returning Customer' });
        this.inputEmail = page.locator('input[name="email"]');
        this.inputPassword = page.locator('input[name="password"]');
        this.btnLogin = page.locator('input[value="Login"]');
        this.alertWarning = page.locator('.alert-danger');
    }

    /**
     * Checks if the login page is displayed
     * @returns Promise<boolean> - true if the Returning Customer heading is visible
     */
    async isLoginPageExists(): Promise<boolean> {
        try {
            return await this.headingReturningCustomer.isVisible();
        } catch (error) {
            return false;
        }
    }

    /**
     * Sets the email field
     * @param email - Email address
     */
    async setEmail(email: string): Promise<void> {
        await this.inputEmail.fill(email);
    }

    /**
     * Sets the password field
     * @param password - Password value
     */
    async setPassword(password: string): Promise<void> {
        await this.inputPassword.fill(password);
    }

    /**
     * Clicks the Login button
     */
    async clickLogin(): Promise<void> {
        await this.btnLogin.click();
    }

    /**
     * Performs login with email and password
     * @param email - Email address
     * @param password - Password value
     */
    async login(email: string, password: string): Promise<void> {
        await this.setEmail(email);
        await this.setPassword(password);
        await this.clickLogin();
    }

    /**
     * Gets the warning/error message text
     * @returns Promise<string | null> - The warning text or null if not visible
     */
    async getWarningMessage(): Promise<string | null> {
        try {
            if (await this.alertWarning.isVisible()) {
                return await this.alertWarning.textContent();
            }
            return null;
        } catch (error) {
            return null;
        }
    }

    /**
     * Checks if the warning message is displayed
     * @returns Promise<boolean> - true if warning is visible
     */
    async isWarningMessageExists(): Promise<boolean> {
        try {
            return await this.alertWarning.isVisible();
        } catch (error) {
            return false;
        }
    }
}