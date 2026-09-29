/**
 * Test Case: Product Search Flow
 *
 * Tags: @master @sanity @regression @web
 *
 * Steps:
 * 1) Open the application
 * 2) Locate the search field
 * 3) Enter a valid known product name
 * 4) Submit the search
 * 5) Verify search results page is displayed
 * 6) Verify the expected product appears
 * 7) Verify the product name matches the search criteria
 */

import { test, expect } from '../../fixtures/pageFixtures';
import { Helper } from '../../utils/helper';

test('Product Search Flow @master @sanity @regression @web', async ({ homePage, searchResultsPage }) => {
    const { productName } = Helper.getProductDetails();

    await test.step('1) Open the application', async () => {
        await homePage.navigateTo();
    });

    await test.step('2) Search for a valid known product', async () => {
        await homePage.searchProduct(productName);
    });

    await test.step('3) Verify search results page is displayed', async () => {
        const hasResults = await searchResultsPage.isSearchResultsPageExists();
        expect(hasResults).toBeTruthy();
    });

    await test.step('4) Verify the expected product appears in results', async () => {
        const isProductFound = await searchResultsPage.isProductInResults(productName);
        expect(isProductFound).toBeTruthy();
    });

    await test.step('5) Verify the displayed product name matches search criteria', async () => {
        const firstProductName = await searchResultsPage.getFirstProductName();
        expect(firstProductName?.trim()).toBe(productName);
    });

    console.log('✅ Product Search completed successfully!');
});