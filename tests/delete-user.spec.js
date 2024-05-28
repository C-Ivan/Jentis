const { test } = require('@playwright/test');
const { ContactListPage } = require("../page-objects/contact-list-page");

const userData = require('../playwright/.auth/user.json');
test.use({ storageState: 'playwright/.auth/user.json', extraHTTPHeaders: {'Authorization': `Bearer ${userData.cookies[0].value}`} });

