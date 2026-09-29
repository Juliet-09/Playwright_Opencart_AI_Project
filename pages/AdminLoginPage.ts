import { Page, Locator } from '@playwright/test';

export class AdminLoginPage {
    private readonly page: Page;

    // Locators
    private readonly inputUsername: Locator;
    private readonly inputPassword: Locator;
    private readonly btnLogin: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators
        this.inputUsername = page.locator('input[name="username"]');
        this.inputPassword = page.locator('input[name="password"]');
        this.btnLogin = page.locator('button[type="submit"]');
    }

    /**
     * Navigates to the Admin Portal login page
     */
    async navigateTo(): Promise<void> {
        const adminUrl = (process.env.WEB_APP_URL || 'http://localhost/opencart/upload/') + 'admin/index.php';
        await this.page.goto(adminUrl);
    }

    /**
     * Logs into the Admin Portal
     * @param username - Admin username
     * @param password - Admin password
     */
    async login(username: string, password: string): Promise<void> {
        await this.inputUsername.fill(username);
        await this.inputPassword.fill(password);
        await this.btnLogin.click();
    }

    /**
     * Checks if the login page is displayed
     * @returns Promise<boolean> - true if the login form is visible
     */
    async isLoginPageExists(): Promise<boolean> {
        try {
            return await this.btnLogin.isVisible();
        } catch (error) {
            return false;
        }
    }
}