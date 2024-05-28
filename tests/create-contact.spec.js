const { test } = require('@playwright/test');
const { ContactListPage } = require("../page-objects/contact-list-page");
const { Common } = require("../page-objects/common");

const userData = require('../playwright/.auth/user.json');
test.use({ storageState: 'playwright/.auth/user.json', extraHTTPHeaders: {'Authorization': `Bearer ${userData.cookies[0].value}`} });

test.beforeEach(async ({ page }) => {
    const contactListPage = new ContactListPage(page);
    await contactListPage.goto();

});

test.describe('Creating contacts', () => {
    test('Add contact with only mandatory fields - UI', async ({ page }) => {
        const contactListPage = new ContactListPage(page);
        await contactListPage.addNewContactWithMandatoryFields('pepe', 'potas');
    })

    test('Add contact with all fields - UI', { tag: ['@regression', '@task'] }, async ({ page }) => {
        const contactListPage = new ContactListPage(page);
        const common = new Common(page);

        await contactListPage.addContact(1);
        await common.checkPageTitle('Contact List');
    })

    test('Add contact with all fields - API', async ({ page }) => {
        const contactListPage = new ContactListPage(page);
        await contactListPage.AddContactAPI(1);
    })
})