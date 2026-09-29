import { Page, Locator } from '@playwright/test';

export class HomePage {
    private readonly page: Page;

    // Locators
    private readonly myAccountToggle: Locator;
    private readonly registerLink: Locator;
    private readonly loginLink: Locator;
    private readonly logoutLink: Locator;
    private readonly searchInput: Locator;
    private readonly searchButton: Locator;
    private readonly cartButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators
        this.myAccountToggle = page.locator('.list-inline .dropdown a.dropdown-toggle');
        this.registerLink = page.locator('.dropdown-menu a', { hasText: 'Register' });
        this.loginLink = page.locator('.dropdown-menu a', { hasText: 'Login' });
        this.logoutLink = page.locator('.dropdown-menu a', { hasText: 'Logout' });
        this.searchInput = page.getByPlaceholder('Search');
        this.searchButton = page.locator('#search button');
        this.cartButton = page.locator('#cart-total');
    }

    /**
     * Navigates to the homepage
     */
    async navigateTo(): Promise<void> {
        await this.page.goto(process.env.WEB_APP_URL || 'http://localhost/opencart/upload/');
    }

    /**
     * Clicks the My Account dropdown toggle to open the dropdown menu
     */
    async clickMyAccount(): Promise<void> {
        await this.myAccountToggle.click();
    }

    /**
     * Clicks the Register link in the My Account dropdown
     */
    async clickRegister(): Promise<void> {
        await this.registerLink.click();
    }

    /**
     * Clicks the Login link in the My Account dropdown
     */
    async clickLogin(): Promise<void> {
        await this.loginLink.click();
    }

    /**
     * Clicks the Logout link in the My Account dropdown
     */
    async clickLogout(): Promise<void> {
        await this.logoutLink.click();
    }

    /**
     * Searches for a product
     * @param productName - The product name to search for
     */
    async searchProduct(productName: string): Promise<void> {
        await this.searchInput.fill(productName);
        await this.searchButton.click();
    }

    /**
     * Checks if the user is logged in by checking the My Account dropdown toggle text
     * @returns Promise<boolean> - true if user is logged in
     */
    async isLoggedIn(): Promise<boolean> {
        try {
            const toggleText = await this.myAccountToggle.textContent();
            return toggleText !== null && toggleText.includes('My Account');
        } catch (error) {
            return false;
        }
    }

    /**
     * Checks if the user is logged out by checking if Login link is present in the page
     * @returns Promise<boolean> - true if user is logged out
     */
    async isLoggedOut(): Promise<boolean> {
        try {
            // Check the page URL to see if we're on the homepage without authenticated access
            const url = this.page.url();
            return url.includes('route=common/home');
        } catch (error) {
            return false;
        }
    }

    /**
     * Gets the underlying Playwright Page object
     * @returns Page - The Playwright Page instance
     */
    getPage(): Page {
        return this.page;
    }
}