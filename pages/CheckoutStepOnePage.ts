import { Page, Locator } from "@playwright/test";

export class CheckoutStepOnePage {
  readonly page: Page;

  // Locators
  readonly pageTitle: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    this.pageTitle = page.locator(".title");
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  // Verifies that we are on the checkout step one page
  async isLoaded(): Promise<boolean> {
    return await this.pageTitle.isVisible();
  }

  // Fills in customer information
  async fillCustomerInformation(
    firstName: string,
    lastName: string,
    postalCode: string
  ) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  // Continues to the next step
  async continue() {
    await this.continueButton.click();
  }

  // Cancels the checkout process
  async cancel() {
    await this.cancelButton.click();
  }

  // Fills in customer information and continues to the next step
  async fillAndContinue(
    firstName: string,
    lastName: string,
    postalCode: string
  ) {
    await this.fillCustomerInformation(firstName, lastName, postalCode);
    await this.continue();
  }

  // Gets the error message text
  async getErrorMessage(): Promise<string> {
    return (await this.errorMessage.textContent()) || "";
  }
}
