const { test } = require('@playwright/test');
const { AddUserPage } = require("../page-objects/add-user-page");
const { Common } = require("../page-objects/common");
const fs = require('fs');

const userData = require('../playwright/.auth/user.json');
test.use({ storageState: 'playwright/.auth/user.json', extraHTTPHeaders: {'Authorization': `Bearer ${userData.cookies[0].value}`} });


test.describe('Creating a new user', () => {

    test('Create a new user - UI', { tag: ['@regression', '@smoke', '@task'] }, async ({ page }) => {
        const addUserPage = new AddUserPage(page);
        const credentialsFile = './playwright/credentials.json'
        await addUserPage.goto();
        const common = new Common(page);
        const email = await addUserPage.createEmail();
        const password = '1234567';

        await addUserPage.createNewUserUI('Iván', 'Cañete', email, password);
        await common.checkPageTitle('Contact List');

        // Update credentials.json
        const credentials = { email, password };
        fs.writeFileSync(credentialsFile, JSON.stringify(credentials, null, 2));
    });


test('Create a new user - API', async ({ page }) => {
    const addUserPage = new AddUserPage(page);
    const email = await addUserPage.createEmail();
    const password = '1234567';

    await addUserPage.createNewUserAPI('Iván', 'Cañete', email, password);
});

});