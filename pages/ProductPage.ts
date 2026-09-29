import { Page, Locator } from '@playwright/test';

export class ProductPage {
    private readonly page: Page;

    // Locators
    private readonly headingProductName: Locator;
    private readonly inputQuantity: Locator;
    private readonly btnAddToCart: Locator;
    private readonly alertSuccess: Locator;
    private readonly productPrice: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators
        this.headingProductName = page.locator('h1');
        this.inputQuantity = page.locator('input[name="quantity"]');
        this.btnAddToCart = page.locator('button', { hasText: 'Add to Cart' });
        this.alertSuccess = page.locator('.alert-success');
        this.productPrice = page.locator('h2');
    }

    /**
     * Checks if the product details page is displayed
     * @returns Promise<boolean> - true if the product heading is visible
     */
    async isProductPageExists(): Promise<boolean> {
        try {
            return await this.headingProductName.isVisible();
        } catch (error) {
            return false;
        }
    }

    /**
     * Gets the product name from the heading
     * @returns Promise<string | null> - The product name
     */
    async getProductName(): Promise<string | null> {
        try {
            return await this.headingProductName.textContent();
        } catch (error) {
            return null;
        }
    }

    /**
     * Gets the product price text
     * @returns Promise<string | null> - The price text
     */
    async getProductPrice(): Promise<string | null> {
        try {
            return await this.productPrice.first().textContent();
        } catch (error) {
            return null;
        }
    }

    /**
     * Sets the quantity for the product
     * @param quantity - Quantity value
     */
    async setQuantity(quantity: string): Promise<void> {
        await this.inputQuantity.clear();
        await this.inputQuantity.fill(quantity);
    }

    /**
     * Clicks the Add to Cart button and waits for the success alert
     */
    async clickAddToCart(): Promise<void> {
        await this.btnAddToCart.click();
        await this.alertSuccess.waitFor({ state: 'visible', timeout: 5000 });
    }

    /**
     * Gets the success message after adding to cart
     * @returns Promise<string | null> - The success message text
     */
    async getSuccessMessage(): Promise<string | null> {
        try {
            if (await this.alertSuccess.isVisible()) {
                return await this.alertSuccess.textContent();
            }
            return null;
        } catch (error) {
            return null;
        }
    }

    /**
     * Checks if the success alert is displayed
     * @returns Promise<boolean> - true if success alert is visible
     */
    async isSuccessAlertExists(): Promise<boolean> {
        try {
            return await this.alertSuccess.isVisible();
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