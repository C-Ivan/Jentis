const { test } = require('@playwright/test');
const { ContactListPage } = require("../page-objects/contact-list-page");

const userData = require('../playwright/.auth/user.json');
test.use({ storageState: 'playwright/.auth/user.json', extraHTTPHeaders: { 'Authorization': `Bearer ${userData.cookies[0].value}` } });

test.describe('Deleting contacts', () => {
    test('Delete all contacts - UI', { tag: ['@regression', '@smoke', '@task'] }, async ({ page }) => {
        test.slow();
        const contactListPage = new ContactListPage(page);
        await contactListPage.goto();
        await contactListPage.addContact(1);
        await contactListPage.deleteAllContacts();
    })

    test('Delete a contact from the table - API', async ({ page }) => {
        const contactListPage = new ContactListPage(page);
        await contactListPage.AddContactAPI(1);
        await contactListPage.deleteContactAPI(1)
    })
})