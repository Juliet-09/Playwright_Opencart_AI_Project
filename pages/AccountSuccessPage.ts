import { Page, Locator } from '@playwright/test';

export class AccountSuccessPage {
    private readonly page: Page;

    // Locators
    private readonly headingSuccess: Locator;
    private readonly btnContinue: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators
        this.headingSuccess = page.locator('h1', { hasText: 'Your Account Has Been Created!' });
        this.btnContinue = page.locator('a', { hasText: 'Continue' });
    }

    /**
     * Checks if the account created success page is displayed
     * @returns Promise<boolean> - true if the success heading is visible
     */
    async isAccountSuccessPageExists(): Promise<boolean> {
        try {
            return await this.headingSuccess.isVisible();
        } catch (error) {
            return false;
        }
    }

    /**
     * Gets the success heading text
     * @returns Promise<string | null> - The heading text
     */
    async getSuccessHeading(): Promise<string | null> {
        try {
            return await this.headingSuccess.textContent();
        } catch (error) {
            return null;
        }
    }

    /**
     * Clicks the Continue button to proceed to My Account
     */
    async clickContinue(): Promise<void> {
        await this.btnContinue.click();
    }
}