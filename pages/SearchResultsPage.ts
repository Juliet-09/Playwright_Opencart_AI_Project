import { Page, Locator } from '@playwright/test';

export class SearchResultsPage {
    private readonly page: Page;

    // Locators
    private readonly headingSearch: Locator;
    private readonly productThumbs: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators
        this.headingSearch = page.locator('h1');
        this.productThumbs = page.locator('.product-thumb');
    }

    /**
     * Checks if the search results page is displayed
     * @returns Promise<boolean> - true if product thumbs are visible
     */
    async isSearchResultsPageExists(): Promise<boolean> {
        try {
            return (await this.productThumbs.count()) > 0;
        } catch (error) {
            return false;
        }
    }

    /**
     * Gets the search results heading text
     * @returns Promise<string | null> - The heading text
     */
    async getSearchHeading(): Promise<string | null> {
        try {
            return await this.headingSearch.textContent();
        } catch (error) {
            return null;
        }
    }

    /**
     * Checks if a specific product appears in the search results
     * @param productName - The product name to look for
     * @returns Promise<boolean> - true if the product is found
     */
    async isProductInResults(productName: string): Promise<boolean> {
        try {
            const productLinks = this.page.locator('.product-thumb .caption h4 a');
            const count = await productLinks.count();
            for (let i = 0; i < count; i++) {
                const text = await productLinks.nth(i).textContent();
                if (text?.trim() === productName) {
                    return true;
                }
            }
            return false;
        } catch (error) {
            return false;
        }
    }

    /**
     * Gets the product name from the first result
     * @returns Promise<string | null> - The product name
     */
    async getFirstProductName(): Promise<string | null> {
        try {
            const firstProduct = this.page.locator('.product-thumb .caption h4 a').first();
            return await firstProduct.textContent();
        } catch (error) {
            return null;
        }
    }

    /**
     * Clicks on a product in the search results to open its details page
     * @param productName - The exact product name to click
     */
    async clickProduct(productName: string): Promise<void> {
        const productLink = this.page.getByRole('link', { name: productName, exact: true }).first();
        await productLink.click();
    }
}