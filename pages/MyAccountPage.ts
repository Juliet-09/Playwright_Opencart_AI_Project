import { Page, Locator } from '@playwright/test';

export class MyAccountPage {
    private readonly page: Page;

    // Locators
    private readonly headingMyAccount: Locator;
    private readonly accountLinks: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators
        this.headingMyAccount = page.locator('h2', { hasText: 'My Account' });
        this.accountLinks = page.locator('#column-right a');
    }

    /**
     * Checks if the My Account page is displayed
     * @returns Promise<boolean> - true if the My Account heading is visible
     */
    async isMyAccountPageExists(): Promise<boolean> {
        try {
            return await this.headingMyAccount.isVisible();
        } catch (error) {
            return false;
        }
    }

    /**
     * Gets the page URL to verify navigation
     * @returns Promise<string> - Current page URL
     */
    async getPageUrl(): Promise<string> {
        return this.page.url();
    }
}