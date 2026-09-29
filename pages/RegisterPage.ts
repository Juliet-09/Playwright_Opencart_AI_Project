import { Page, Locator } from '@playwright/test';

export class RegisterPage {
    private readonly page: Page;

    // Locators
    private readonly headingRegisterAccount: Locator;
    private readonly inputFirstname: Locator;
    private readonly inputLastname: Locator;
    private readonly inputEmail: Locator;
    private readonly inputTelephone: Locator;
    private readonly inputPassword: Locator;
    private readonly inputConfirm: Locator;
    private readonly checkboxAgree: Locator;
    private readonly btnContinue: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators
        this.headingRegisterAccount = page.locator('h1', { hasText: 'Register Account' });
        this.inputFirstname = page.locator('input[name="firstname"]');
        this.inputLastname = page.locator('input[name="lastname"]');
        this.inputEmail = page.locator('input[name="email"]');
        this.inputTelephone = page.locator('input[name="telephone"]');
        this.inputPassword = page.locator('input[name="password"]');
        this.inputConfirm = page.locator('input[name="confirm"]');
        this.checkboxAgree = page.locator('input[name="agree"]');
        this.btnContinue = page.locator('input[value="Continue"]');
    }

    /**
     * Checks if the Register Account page is displayed
     * @returns Promise<boolean> - true if the heading is visible
     */
    async isRegisterPageExists(): Promise<boolean> {
        try {
            return await this.headingRegisterAccount.isVisible();
        } catch (error) {
            return false;
        }
    }

    /**
     * Sets the first name field
     * @param firstName - First name value
     */
    async setFirstname(firstName: string): Promise<void> {
        await this.inputFirstname.fill(firstName);
    }

    /**
     * Sets the last name field
     * @param lastName - Last name value
     */
    async setLastname(lastName: string): Promise<void> {
        await this.inputLastname.fill(lastName);
    }

    /**
     * Sets the email field
     * @param email - Email value
     */
    async setEmail(email: string): Promise<void> {
        await this.inputEmail.fill(email);
    }

    /**
     * Sets the telephone field
     * @param telephone - Telephone value
     */
    async setTelephone(telephone: string): Promise<void> {
        await this.inputTelephone.fill(telephone);
    }

    /**
     * Sets the password field
     * @param password - Password value
     */
    async setPassword(password: string): Promise<void> {
        await this.inputPassword.fill(password);
    }

    /**
     * Sets the password confirmation field
     * @param confirmPassword - Password confirmation value
     */
    async setConfirmPassword(confirmPassword: string): Promise<void> {
        await this.inputConfirm.fill(confirmPassword);
    }

    /**
     * Checks the Privacy Policy agreement checkbox
     */
    async agreeToPrivacyPolicy(): Promise<void> {
        await this.checkboxAgree.check();
    }

    /**
     * Clicks the Continue button to submit the registration form
     */
    async clickContinue(): Promise<void> {
        await this.btnContinue.click();
    }

    /**
     * Completes the full registration form with provided data
     * @param data - Object containing firstname, lastname, email, telephone, password
     */
    async completeRegistration(data: { firstname: string; lastname: string; email: string; telephone: string; password: string }): Promise<void> {
        await this.setFirstname(data.firstname);
        await this.setLastname(data.lastname);
        await this.setEmail(data.email);
        await this.setTelephone(data.telephone);
        await this.setPassword(data.password);
        await this.setConfirmPassword(data.password);
        await this.agreeToPrivacyPolicy();
        await this.clickContinue();
    }
}