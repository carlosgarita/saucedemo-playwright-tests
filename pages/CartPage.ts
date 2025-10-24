import { Page, Locator } from "@playwright/test";

export class CartPage {
  readonly page: Page;

  // Locators
  readonly pageTitle: Locator;
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;
  readonly removeButtons: Locator;

  constructor(page: Page) {
    this.page = page;

    this.pageTitle = page.locator(".title");
    this.cartItems = page.locator(".cart_item");
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator(
      '[data-test="continue-shopping"]'
    );
    this.removeButtons = page.locator('[class*="cart_button"]');
  }

  // Verifies that we are on the cart page
  async isLoaded(): Promise<boolean> {
    return await this.pageTitle.isVisible();
  }

  // Gets the number of items in the cart
  async getCartItemsCount(): Promise<number> {
    return await this.cartItems.count();
  }

  // Gets the names of all products in the cart
  async getCartItemNames(): Promise<string[]> {
    const items = await this.cartItems.all();
    const names: string[] = [];

    for (const item of items) {
      const nameElement = item.locator(".inventory_item_name");
      const name = await nameElement.textContent();
      if (name) {
        names.push(name);
      }
    }

    return names;
  }

  /**
   * Removes a product from the cart by its name
   * @param productName - name of the product to remove
   */
  async removeProduct(productName: string) {
    const removeButton = this.page.locator(
      `[data-test="remove-${this.formatProductName(productName)}"]`
    );
    await removeButton.click();
  }

  // Proceeds to checkout
  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  // Returns to the products page
  async continueShopping() {
    await this.continueShoppingButton.click();
  }

  // Formats the product name for the selector
  private formatProductName(productName: string): string {
    return productName.toLowerCase().replace(/\s+/g, "-");
  }
}
