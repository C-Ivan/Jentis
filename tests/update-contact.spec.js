const { test } = require('@playwright/test');
const { ContactListPage } = require("../page-objects/contact-list-page");

const userData = require('../playwright/.auth/user.json');
test.use({ storageState: 'playwright/.auth/user.json', extraHTTPHeaders: { 'Authorization': `Bearer ${userData.cookies[0].value}` } });


test.describe('Editing contacts', () => {
    test('Edit a contact from the table - UI ', { tag: ['@regression', '@smoke', '@task'] }, async ({ page }) => {
        const contactListPage = new ContactListPage(page);
        await contactListPage.goto();
        await contactListPage.addContact(1);
        await contactListPage.updateContact('test', 'update');
    })

    test('Edit a contact from the table - API', async ({ page }) => {
        const contactListPage = new ContactListPage(page);
        const contactName = await contactListPage.AddContactAPI(1);
        await contactListPage.updateContactAPI(contactName[0], 'Update', 'Test');
    })
})