import { Page, Locator } from "@playwright/test";

export class CheckoutStepTwoPage {
  readonly page: Page;

  // Locators
  readonly pageTitle: Locator;
  readonly cartItems: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly finishButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.pageTitle = page.locator(".title");
    this.cartItems = page.locator(".cart_item");
    this.subtotalLabel = page.locator(".summary_subtotal_label");
    this.taxLabel = page.locator(".summary_tax_label");
    this.totalLabel = page.locator(".summary_total_label");
    this.finishButton = page.locator('[data-test="finish"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
  }

  // Verifies that we are on the checkout step 2 page
  async isLoaded(): Promise<boolean> {
    return await this.pageTitle.isVisible();
  }

  // Gets the number of items in the summary
  async getCartItemsCount(): Promise<number> {
    return await this.cartItems.count();
  }

  // Gets the subtotal (price without tax)
  async getSubtotal(): Promise<number> {
    const text = await this.subtotalLabel.textContent();
    // Extracts the number from the text "Item total: $29.99"
    const match = text?.match(/\$(\d+\.?\d*)/);
    return match ? parseFloat(match[1]) : 0;
  }

  // Gets the tax amount
  async getTax(): Promise<number> {
    const text = await this.taxLabel.textContent();
    // Extracts the number from the text "Tax: $2.40"
    const match = text?.match(/\$(\d+\.?\d*)/);
    return match ? parseFloat(match[1]) : 0;
  }

  // Gets the total amount (subtotal + tax)
  async getTotal(): Promise<number> {
    const text = await this.totalLabel.textContent();
    // Extracts the number from the text "Total: $32.39"
    const match = text?.match(/\$(\d+\.?\d*)/);
    return match ? parseFloat(match[1]) : 0;
  }

  // Gets the names of all products in the summary
  async getProductNames(): Promise<string[]> {
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

  // Finishes the purchase
  async finish() {
    await this.finishButton.click();
  }

  // Cancels and returns to the cart
  async cancel() {
    await this.cancelButton.click();
  }

  // Gets a summary of the order details
  async getOrderSummary() {
    return {
      itemCount: await this.getCartItemsCount(),
      productNames: await this.getProductNames(),
      subtotal: await this.getSubtotal(),
      tax: await this.getTax(),
      total: await this.getTotal(),
    };
  }
}
