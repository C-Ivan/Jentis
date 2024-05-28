const { test } = require('@playwright/test');
const { ContactListPage } = require("../page-objects/contact-list-page");

const userData = require('../playwright/.auth/user.json');
test.use({ storageState: 'playwright/.auth/user.json', extraHTTPHeaders: {'Authorization': `Bearer ${userData.cookies[0].value}`} });


test.beforeEach(async ({ page }) => {
    const contactListPage = new ContactListPage(page);
    await contactListPage.goto();

});

test.describe('Searching contacts', () => {
    test("Search for a contact - UI", async ({ page }) => {
        const contactListPage = new ContactListPage(page);
        await contactListPage.searchContact('Anderson Brekke');
    })

    test("Search for a contact - API", async ({ page }) => {
        const contactListPage = new ContactListPage(page);
        await contactListPage.searchContactAPI('Jace Sipes');
    })

    test("Search for all contacts - API", async ({ page }) => {
        const contactListPage = new ContactListPage(page);
        await contactListPage.searchAllContactsAPI();
    })
})