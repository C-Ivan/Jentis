const { test: setup } = require('@playwright/test');
const credentials = require('../playwright/credentials.json');


const authFile = 'playwright/.auth/user.json';


setup('authenticate', async ({ request }) => {
    await request.post('/users/login', {
        data: {
            'email': credentials.email,
            'password': credentials.password
        }
    });

    await request.storageState({ path: authFile });
});