const { test } = require('@playwright/test');
const { AddUserPage } = require("../page-objects/add-user-page");
const credentials = require('../playwright/credentials.json');
const userData = require('../playwright/.auth/user.json');
test.use({ storageState: 'playwright/.auth/user.json', extraHTTPHeaders: {'Authorization': `Bearer ${userData.cookies[0].value}`} });




test.describe('Login', () => {
    test('Login', { tag: ['@regression', '@smoke', '@task'] }, async ({ page }) => {
      const addUserPage = new AddUserPage(page);
      const email = credentials.email;
      const password = credentials.password;
      await addUserPage.login(email, password);
  
    })
  
    test('Login - API', async ({ page }) => {
      const addUserPage = new AddUserPage(page);
      const email = credentials.email;
      const password = credentials.password;
      await addUserPage.loginAPI(email, password);
    })
  
  });
  
  test.describe('Logout', () => {
    test('Logout', { tag: ['@regression', '@smoke'] }, async ({ page }) => {
      const addUserPage = new AddUserPage(page);
      const email = credentials.email;
      const password = credentials.password;
      await addUserPage.login(email, password);
      await addUserPage.logout();
    })
  
    test('Logout - API', async ({ page }) => {
      const addUserPage = new AddUserPage(page);
      await addUserPage.loginAPI(credentials.email, credentials.password);
      await addUserPage.logoutAPI();
    });
  });