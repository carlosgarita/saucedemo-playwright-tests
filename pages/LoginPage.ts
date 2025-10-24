import { Page, Locator } from "@playwright/test";

export class LoginPage {
  // Reference to the Playwright page
  readonly page: Page;

  // Locators -  login page elements
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  // Constructor - runs when creating an instance of LoginPage
  constructor(page: Page) {
    this.page = page;

    // Defines the selectors for each element
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  // Methods - actions that can be performed on this page

  // Navigates to the login page
  async goto() {
    await this.page.goto("https://www.saucedemo.com/");
  }

  // Performs login with given username and password
  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  // Gets the error message text
  async getErrorMessage(): Promise<string> {
    return (await this.errorMessage.textContent()) || "";
  }
}
