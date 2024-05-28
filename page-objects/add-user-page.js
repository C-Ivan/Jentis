const { expect } = require("@playwright/test");
const authFile = 'playwright/.auth/user.json';
const fs = require('fs');

exports.AddUserPage = class AddUserPage {
  /**
   * @param {import('@playwright/test').Page} page
   */

  constructor(page) {
    this.page = page;
    this.firstName = page.getByPlaceholder('First Name');
    this.lastName = page.getByPlaceholder('Last Name');
    this.email = page.getByPlaceholder('Email');
    this.password = page.getByPlaceholder('Password');
    this.submitButton = page.getByRole('button', { name: 'Submit' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    this.logoutButton = page.getByRole('button', { name: 'Logout' });

  }

  async goto() {
    try {
      await this.page.goto('/addUser');
    } catch (error) {
      console.error('Error occurred while navigating to /addUser:', error);
      throw error;
    }
  }

  async createEmail() {
    try {
      return Date.now() + '@someemail.com';
    } catch (error) {
      console.error('Error occurred while creating email:', error);
      throw error;
    }
  }

  async createNewUserUI(firstName, lastName, email, password) {
    try {
      await this.firstName.fill(firstName);
      await this.lastName.fill(lastName);
      await this.email.fill(email);
      await this.password.fill(password);
      await this.submitButton.click();

      // Update user.json
      const user = { firstName, lastName, email, password };
      const userJsonPath = './playwright/credentials.json'
      fs.writeFileSync(userJsonPath, JSON.stringify(user, null, 2));
    } catch (error) {
      console.error('Error occurred while creating new user:', error);
      throw error;
    }
  }

  async createNewUserAPI(firstName, lastName, email, password) {
    try {
      const newUser = await this.page.request.post('/users', {
        data: { firstName, lastName, email, password }
      });
      expect(newUser.status()).toBe(201);
      return newUser;
    } catch (error) {
      console.error('Error occurred while creating new user API:', error);
      throw error;
    }
  }

  async login(email, password) {
    try {
      await this.page.goto('/');
      await this.email.fill(email);
      await this.password.fill(password);
      await this.submitButton.click();
      await expect(this.page.locator('h1', { hasText: 'Contact List' })).toBeVisible();
    } catch (error) {
      console.error('Error occurred while logging in:', error);
      throw error;
    }
  }

  async loginAPI(email, password) {
    try {
      const login = await this.page.request.post('/users/login', {
        data: { email, password }
      });
      expect(login.status()).toBe(200);
      return login;
    } catch (error) {
      console.error('Error occurred while logging in API:', error);
      throw error;
    }
  }

  async logout() {
    try {
      await this.page.goto('/contactList');
      await this.logoutButton.click();
      await expect(this.page.locator('h1', { hasText: 'Contact List App' })).toBeVisible();
    } catch (error) {
      console.error('Error occurred while logging out:', error);
      throw error;
    }
  }

  async logoutAPI() {
    try {
      const logout = await this.page.request.post('/users/logout');
      expect(logout.status()).toBe(200);
      return logout;
    } catch (error) {
      console.error('Error occurred while logging out API:', error);
      throw error;
    }
  }

};