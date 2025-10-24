import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { InventoryPage } from "../pages/InventoryPage";
import { CartPage } from "../pages/CartPage";
import { CheckoutStepOnePage } from "../pages/CheckoutStepOnePage";
import { CheckoutStepTwoPage } from "../pages/CheckoutStepTwoPage";
import { CheckoutCompletePage } from "../pages/CheckoutCompletePage";

test.describe("Purchase Flow - E2E Test", () => {
  test("Complete purchase flow: login, add item, checkout, and verify success", async ({
    page,
  }) => {
    // Initialize all Page Objects
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutStepOne = new CheckoutStepOnePage(page);
    const checkoutStepTwo = new CheckoutStepTwoPage(page);
    const checkoutComplete = new CheckoutCompletePage(page);

    // Step 1: Navigate to site and log in
    await loginPage.goto();
    await loginPage.login("standard_user", "secret_sauce");

    // Verify login was successful
    await expect(inventoryPage.pageTitle).toBeVisible();
    await expect(inventoryPage.pageTitle).toHaveText("Products");

    // Step 2: Add a product to cart
    await inventoryPage.addProductToCart("Sauce Labs Backpack");

    // Verify the cart badge shows 1 item
    await expect(inventoryPage.shoppingCartBadge).toHaveText("1");

    // Step 3: Go to cart
    await inventoryPage.goToCart();

    // Verify we are on the cart page and there is 1 item
    await expect(cartPage.pageTitle).toHaveText("Your Cart");
    const cartItemsCount = await cartPage.getCartItemsCount();
    expect(cartItemsCount).toBe(1);

    // Verify the correct product is in the cart
    const cartItemNames = await cartPage.getCartItemNames();
    expect(cartItemNames).toContain("Sauce Labs Backpack");

    // Step 4: Proceed to checkout
    await cartPage.proceedToCheckout();

    // Verify we are on checkout step 1
    await expect(checkoutStepOne.pageTitle).toHaveText(
      "Checkout: Your Information"
    );

    // Step 5: Fill in customer information
    await checkoutStepOne.fillAndContinue("John", "Doe", "12345");

    // Verify we are on checkout step 2 (overview)
    await expect(checkoutStepTwo.pageTitle).toHaveText("Checkout: Overview");

    // Step 6: Verify the order summary
    const orderSummary = await checkoutStepTwo.getOrderSummary();
    expect(orderSummary.itemCount).toBe(1);
    expect(orderSummary.productNames).toContain("Sauce Labs Backpack");
    expect(orderSummary.subtotal).toBeGreaterThan(0);
    expect(orderSummary.total).toBeGreaterThan(orderSummary.subtotal); // Total includes taxes

    // Step 7: Finish the purchase
    await checkoutStepTwo.finish();

    // Step 8: Verify the order was successful
    await expect(checkoutComplete.pageTitle).toHaveText("Checkout: Complete!");

    const isSuccessful = await checkoutComplete.isOrderSuccessful();
    expect(isSuccessful).toBe(true);

    const confirmationHeader = await checkoutComplete.getConfirmationHeader();
    expect(confirmationHeader).toContain("Thank you for your order");

    // Verify the confirmation image is visible
    await expect(checkoutComplete.ponyExpressImage).toBeVisible();
  });
});
