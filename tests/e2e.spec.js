const { test } = require('@playwright/test');
const { AddUserPage } = require("../page-objects/add-user-page");
const { ContactListPage } = require("../page-objects/contact-list-page");
const { Common } = require("../page-objects/common");

test.describe('e2e flow', () => {

    test('e2e flow', { tag: ['@regression', '@task'] }, async ({ page }) => {
        const addUserPage = new AddUserPage(page);
        const contactListPage = new ContactListPage(page);
        await addUserPage.goto();
        const common = new Common(page);
        const email = await addUserPage.createEmail();
        // Create a new user
        await addUserPage.createNewUserUI('Iván', 'Cañete', email, '1234567');
        await common.checkPageTitle('Contact List');
        // Add new contact
        await contactListPage.addContact(2);
        await common.checkPageTitle('Contact List');
        // Edit contact
        await contactListPage.updateContact('Edited', 'Name');
        // Delete first contact
        await contactListPage.goto();
        await contactListPage.deleteFirstContact();
        // Logout
        await addUserPage.logout();
    });
});