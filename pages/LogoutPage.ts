import { Page, Locator } from '@playwright/test';

export class LogoutPage {
    private readonly page: Page;

    // Locators
    private readonly headingAccountLogout: Locator;
    private readonly btnContinue: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators
        this.headingAccountLogout = page.locator('h1', { hasText: 'Account Logout' });
        this.btnContinue = page.locator('a', { hasText: 'Continue' });
    }

    /**
     * Checks if the logout confirmation page is displayed
     * @returns Promise<boolean> - true if the Account Logout heading is visible
     */
    async isLogoutPageExists(): Promise<boolean> {
        try {
            return await this.headingAccountLogout.isVisible();
        } catch (error) {
            return false;
        }
    }

    /**
     * Gets the logout heading text
     * @returns Promise<string | null> - The heading text
     */
    async getLogoutHeading(): Promise<string | null> {
        try {
            return await this.headingAccountLogout.textContent();
        } catch (error) {
            return null;
        }
    }

    /**
     * Clicks the Continue button to return to homepage
     */
    async clickContinue(): Promise<void> {
        await this.btnContinue.click();
    }
}