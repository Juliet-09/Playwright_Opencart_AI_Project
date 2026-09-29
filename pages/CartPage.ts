import { Page, Locator } from '@playwright/test';

export class CartPage {
    private readonly page: Page;

    // Locators
    private readonly headingShoppingCart: Locator;
    private readonly cartEmptyMessage: Locator;
    private readonly cartTable: Locator;
    private readonly productRows: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators
        this.headingShoppingCart = page.locator('h1', { hasText: 'Shopping Cart' });
        this.cartEmptyMessage = page.locator('p', { hasText: 'Your shopping cart is empty!' });
        this.cartTable = page.locator('.table-bordered');
        this.productRows = page.locator('.table-bordered tbody tr');
    }

    /**
     * Checks if the shopping cart page is displayed
     * @returns Promise<boolean> - true if the heading is visible
     */
    async isCartPageExists(): Promise<boolean> {
        try {
            return await this.headingShoppingCart.isVisible();
        } catch (error) {
            return false;
        }
    }

    /**
     * Checks if the cart is empty
     * @returns Promise<boolean> - true if empty message is visible
     */
    async isCartEmpty(): Promise<boolean> {
        try {
            return await this.cartEmptyMessage.isVisible();
        } catch (error) {
            return false;
        }
    }

    /**
     * Checks if a specific product is in the cart
     * @param productName - The product name to look for
     * @returns Promise<boolean> - true if the product is found in the cart
     */
    async isProductInCart(productName: string): Promise<boolean> {
        try {
            const productLink = this.page.locator('.table-bordered td a', { hasText: productName });
            return await productLink.isVisible();
        } catch (error) {
            return false;
        }
    }

    /**
     * Gets the quantity of a product in the cart
     * @param productName - The product name
     * @returns Promise<string | null> - The quantity value
     */
    async getProductQuantity(productName: string): Promise<string | null> {
        try {
            const row = this.page.locator('.table-bordered tbody tr').filter({ hasText: productName });
            const qtyInput = row.locator('input[name^="quantity"]');
            return await qtyInput.inputValue();
        } catch (error) {
            return null;
        }
    }

    /**
     * Gets the total price displayed in the cart
     * @returns Promise<string | null> - The total text
     */
    async getCartTotal(): Promise<string | null> {
        try {
            const totalElement = this.page.locator('.table-bordered tfoot tr:last-child td:last-child');
            return await totalElement.textContent();
        } catch (error) {
            return null;
        }
    }

    /**
     * Gets the unit price of a product in the cart
     * @param productName - The product name
     * @returns Promise<string | null> - The unit price text
     */
    async getProductUnitPrice(productName: string): Promise<string | null> {
        try {
            const row = this.page.locator('.table-bordered tbody tr').filter({ hasText: productName });
            const priceCell = row.locator('td').nth(1);
            return await priceCell.textContent();
        } catch (error) {
            return null;
        }
    }
}