const { expect } = require('@playwright/test');

exports.Common = class Common {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
    };
    async checkPageTitle(title) {
        await expect(this.page.locator('h1', { hasText: title })).toBeVisible();
    }
};