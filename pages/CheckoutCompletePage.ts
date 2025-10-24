import { Page, Locator } from "@playwright/test";

export class CheckoutCompletePage {
  readonly page: Page;

  // Locators
  readonly pageTitle: Locator;
  readonly completeHeader: Locator;
  readonly completeText: Locator;
  readonly ponyExpressImage: Locator;
  readonly backHomeButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.pageTitle = page.locator(".title");
    this.completeHeader = page.locator(".complete-header");
    this.completeText = page.locator(".complete-text");
    this.ponyExpressImage = page.locator(".pony_express");
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
  }

  // Verifies that we are on the checkout complete page
  async isLoaded(): Promise<boolean> {
    return await this.pageTitle.isVisible();
  }

  // Gets the confirmation header message
  async getConfirmationHeader(): Promise<string> {
    return (await this.completeHeader.textContent()) || "";
  }

  // Gets the confirmation text
  async getConfirmationText(): Promise<string> {
    return (await this.completeText.textContent()) || "";
  }

  // Checks if the confirmation image is visible
  async isConfirmationImageVisible(): Promise<boolean> {
    return await this.ponyExpressImage.isVisible();
  }

  // Returns to the products/inventory page
  async backToProducts() {
    await this.backHomeButton.click();
  }

  // Checks if the order was successful
  // Checks that all confirmation elements are present
  async isOrderSuccessful(): Promise<boolean> {
    const headerVisible = await this.completeHeader.isVisible();
    const textVisible = await this.completeText.isVisible();
    const imageVisible = await this.ponyExpressImage.isVisible();

    return headerVisible && textVisible && imageVisible;
  }

  // Gets all confirmation details
  async getConfirmationDetails() {
    return {
      header: await this.getConfirmationHeader(),
      text: await this.getConfirmationText(),
      imageVisible: await this.isConfirmationImageVisible(),
      isSuccessful: await this.isOrderSuccessful(),
    };
  }
}
