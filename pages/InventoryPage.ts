import { Page, Locator } from "@playwright/test";

export class InventoryPage {
  readonly page: Page;

  // Locators
  readonly pageTitle: Locator;
  readonly shoppingCartBadge: Locator;
  readonly shoppingCartLink: Locator;
  readonly inventoryItems: Locator;

  constructor(page: Page) {
    this.page = page;

    this.pageTitle = page.locator(".title");
    this.shoppingCartBadge = page.locator(".shopping_cart_badge");
    this.shoppingCartLink = page.locator(".shopping_cart_link");
    this.inventoryItems = page.locator(".inventory_item");
  }

  // Verifies that we are on the inventory page
  async isLoaded(): Promise<boolean> {
    return await this.pageTitle.isVisible();
  }

  // Adds a product to the cart by its name
  async addProductToCart(productName: string) {
    // Searches for the "Add to cart" button of the specific product
    const addButton = this.page.locator(
      `[data-test="add-to-cart-${this.formatProductName(productName)}"]`
    );
    await addButton.click();
  }

  /**
   * Adds multiple products to the cart
   * @param productNames - array of product names
   */
  async addMultipleProductsToCart(productNames: string[]) {
    for (const productName of productNames) {
      await this.addProductToCart(productName);
    }
  }

  // Gets the number of items in the cart from the badge
  async getCartItemCount(): Promise<number> {
    const badgeText = await this.shoppingCartBadge.textContent();
    return badgeText ? parseInt(badgeText) : 0;
  }

  // Navigates to the cart page
  async goToCart() {
    await this.shoppingCartLink.click();
  }

  // Formats product name to match data-test attribute format
  // Example: "Sauce Labs Backpack" -> "sauce-labs-backpack"
  private formatProductName(productName: string): string {
    return productName.toLowerCase().replace(/\s+/g, "-");
  }
}
