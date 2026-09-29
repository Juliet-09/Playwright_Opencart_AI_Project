import { Page, Locator } from '@playwright/test';

export class AdminCustomerPage {
    private readonly page: Page;

    // Locators
    private readonly customersMenu: Locator;
    private readonly customersSubmenu: Locator;
    private readonly filterEmailInput: Locator;
    private readonly filterButton: Locator;
    private readonly customerTable: Locator;
    private readonly customerTableRows: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators
        this.customersMenu = page.locator('#menu-customer a.parent');
        this.customersSubmenu = page.locator('#collapse5 a', { hasText: 'Customers' });
        this.filterEmailInput = page.locator('input[name="filter_email"]');
        this.filterButton = page.locator('button', { hasText: 'Filter' });
        this.customerTable = page.locator('.table-bordered');
        this.customerTableRows = page.locator('.table-bordered tbody tr');
    }

    /**
     * Navigates to the Customers section in the Admin Portal
     */
    async navigateToCustomers(): Promise<void> {
        // Dismiss any security modal if present
        await this.dismissSecurityModal();

        await this.customersMenu.click();
        await this.page.waitForTimeout(300);
        await this.customersSubmenu.click();
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Dismisses the security modal if it appears
     */
    private async dismissSecurityModal(): Promise<void> {
        try {
            const modal = this.page.locator('#modal-security');
            if (await modal.isVisible({ timeout: 1000 }).catch(() => false)) {
                await this.page.evaluate(() => {
                    const m = document.getElementById('modal-security');
                    if (m) {
                        m.classList.remove('in');
                        m.style.display = 'none';
                    }
                    const b = document.querySelector('.modal-backdrop');
                    if (b) b.remove();
                });
                await this.page.waitForTimeout(300);
            }
        } catch {
            // Modal not present, continue
        }
    }

    /**
     * Searches for a customer by email
     * @param email - The email to search for
     */
    async searchByEmail(email: string): Promise<void> {
        await this.filterEmailInput.fill(email);
        await this.filterButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Gets the number of customer rows in the table
     * @returns Promise<number> - Row count
     */
    async getCustomerRowCount(): Promise<number> {
        return await this.customerTableRows.count();
    }

    /**
     * Checks if a customer with the given email exists in the table
     * @param email - The email to look for
     * @returns Promise<boolean> - true if found
     */
    async isCustomerInTable(email: string): Promise<boolean> {
        try {
            const rows = this.customerTableRows;
            const count = await rows.count();
            for (let i = 0; i < count; i++) {
                const rowText = await rows.nth(i).textContent();
                if (rowText && rowText.includes(email)) {
                    return true;
                }
            }
            return false;
        } catch (error) {
            return false;
        }
    }

    /**
     * Gets the customer name from the first matching row
     * @returns Promise<string | null> - The customer name
     */
    async getFirstCustomerName(): Promise<string | null> {
        try {
            const firstRow = this.customerTableRows.first();
            const nameCell = firstRow.locator('td').nth(1);
            return await nameCell.textContent();
        } catch (error) {
            return null;
        }
    }

    /**
     * Gets the customer email from the first matching row
     * @returns Promise<string | null> - The email
     */
    async getFirstCustomerEmail(): Promise<string | null> {
        try {
            const firstRow = this.customerTableRows.first();
            const emailCell = firstRow.locator('td').nth(2);
            return await emailCell.textContent();
        } catch (error) {
            return null;
        }
    }

    /**
     * Gets the customer status from the first matching row
     * @returns Promise<string | null> - The status text
     */
    async getFirstCustomerStatus(): Promise<string | null> {
        try {
            const firstRow = this.customerTableRows.first();
            const statusCell = firstRow.locator('td').nth(4);
            return await statusCell.textContent();
        } catch (error) {
            return null;
        }
    }

    /**
     * Clicks the View/Edit button for the first customer in the table
     */
    async clickFirstCustomerEdit(): Promise<void> {
        const firstRow = this.customerTableRows.first();
        const editLink = firstRow.locator('a[data-toggle="tooltip"]').first();
        await editLink.click();
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Gets the value of a specific form field on the customer edit page
     * @param fieldName - The name attribute of the input field
     * @returns Promise<string | null> - The field value
     */
    async getCustomerFieldValue(fieldName: string): Promise<string | null> {
        try {
            const input = this.page.locator(`#tab-general input[name="${fieldName}"]`);
            return await input.inputValue();
        } catch (error) {
            return null;
        }
    }

    /**
     * Gets the selected status value from the customer edit page
     * @returns Promise<string | null> - '1' for Enabled, '0' for Disabled
     */
    async getCustomerStatus(): Promise<string | null> {
        try {
            const statusSelect = this.page.locator('#tab-general select[name="status"]');
            return await statusSelect.inputValue();
        } catch (error) {
            return null;
        }
    }
}