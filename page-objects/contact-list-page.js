const { faker } = require('@faker-js/faker');
const { expect } = require('@playwright/test');


exports.ContactListPage = class ContactListPage {
    /**
     * @param {import('@playwright/test').Page} page
     */

    constructor(page) {
        this.page = page;
        this.newContactButton = page.getByRole('button', { name: 'Add a New Contact' });
        this.firstName = page.getByPlaceholder('First Name');
        this.lastName = page.getByPlaceholder('Last Name');
        this.birthdate = page.getByPlaceholder('yyyy-MM-dd');
        this.email = page.getByPlaceholder('example@email.com');
        this.phone = page.getByPlaceholder('8005551234');
        this.address1 = page.getByPlaceholder('Address 1');
        this.address2 = page.getByPlaceholder('Address 2');
        this.city = page.getByPlaceholder('City');
        this.state = page.getByPlaceholder('State or Province');
        this.postalCode = page.getByPlaceholder('Postal Code');
        this.country = page.getByPlaceholder('Country');
        this.submitButton = page.getByRole('button', { name: 'Submit' });
        this.cancelButton = page.getByRole('button', { name: 'Cancel' });

        // Locators for the contact details
        this.allContacts = page.locator("xpath=//tr[@class='contactTableBodyRow']");
        this.firstNameSpan = page.locator("xpath=//span[@id='firstName']");
        this.lastNameSpan = page.locator("xpath=//span[@id='lastName']");
        this.editButton = page.getByRole("button", { name: "Edit Contact" });
        this.deleteButton = page.getByRole("button", { name: "Delete Contact" });
        this.returnButton = page.getByRole("button", { name: "Return to Contact List" });

        // Locators for edit contact
        this.firstNameEdit = page.getByLabel('First Name:');
        this.lastNameEdit = page.getByLabel('Last Name:');


    };

    async goto() {
        try {
            await this.page.goto('/contactList');
        } catch (error) {
            console.error('Error occurred while navigating to contact list:', error);
            throw error;
        }
    };

    async addNewContactWithMandatoryFields(firstName, lastName) {
        try {
            await this.newContactButton.click();
            await this.firstName.fill(firstName);
            await this.lastName.fill(lastName);
            await this.submitButton.click();
        } catch (error) {
            console.error('Error occurred while adding new contact:', error);
            throw error;
        }
    };

    async createRandomUser() {
        try {
            const firstName = faker.person.firstName();
            const lastName = faker.person.lastName();
            const birthday = faker.date.birthdate().toISOString().split('T')[0];
            const email = faker.internet.email({ firstName, lastName });
            const phone = faker.string.numeric(7);
            const address1 = faker.location.streetAddress(false);
            const address2 = faker.location.secondaryAddress();
            const city = faker.location.city();
            const state = faker.location.state();
            const zipCode = faker.location.zipCode();
            const country = faker.location.country();

            return {
                firstName,
                lastName,
                birthday,
                email,
                phone,
                address1,
                address2,
                city,
                state,
                zipCode,
                country,
            };
        } catch (error) {
            console.error('Error occurred while creating random user:', error);
            throw error;
        }
    };

    async addContact(num) {
        try {
            let contactNames = [];
            for (let i = 0; i < num; i++) {
                const newContact = await this.createRandomUser();
                await this.newContactButton.isVisible();
                await this.newContactButton.click();
                await this.fillContactForm(newContact);
                await this.submitButton.click();
                contactNames.push(newContact.firstName + ' ' + newContact.lastName);
            }
            return contactNames;
        } catch (error) {
            console.error('Error occurred while adding contacts:', error);
            throw error;
        }
    };

    async AddContactAPI(num) {
        let contactNames = [];
        try {
            for (let i = 0; i < num; i++) {
                const newContact = await this.createRandomUser();
                const addContact = await this.page.request.post('/contacts', {
                    data: newContact,
                });
                expect(addContact.status()).toBe(201);
                if (addContact.ok()) {
                    const newContactFullName = newContact.firstName + ' ' + newContact.lastName;
                    contactNames.push(newContactFullName);
                }
            }
        } catch (error) {
            console.error('Error occurred while adding contacts:', error);
            throw error;
        }
        
        return contactNames;
    };

    async fillContactForm(newContact) {
        try {
            await this.firstName.fill(newContact.firstName);
            await this.lastName.fill(newContact.lastName);
            await this.birthdate.fill(newContact.birthday);
            await this.email.fill(newContact.email);
            await this.phone.fill(newContact.phone);
            await this.address1.fill(newContact.address1);
            await this.address2.fill(newContact.address2);
            await this.city.fill(newContact.city);
            await this.state.fill(newContact.state);
            await this.postalCode.fill(newContact.zipCode);
            await this.country.fill(newContact.country);
        } catch (error) {
            console.error('Error occurred while filling contact form:', error);
            throw error;
        }
    };

    async createNewUserAPI(firstName, lastName, email, password) {
        try {
            const newUser = await this.page.request.post('/users', {
                data: { firstName, lastName, email, password }
            });
            expect(newUser.status()).toBe(201);
            return newUser;
        } catch (error) {
            console.error('Error occurred while creating new user:', error);
            throw error;
        }
    };



    async searchContact(searchQuery) {
        try {
            const contact = this.page.getByRole('cell', { name: searchQuery });
            await expect(contact).toBeVisible();
        } catch (error) {
            console.error('Error occurred while searching contact:', error);
            throw error;
        }
    };

    async searchAllContactsAPI() {
        try {
            let response = await this.page.request.get('/contacts');
            expect(response.status()).toBe(200);
            return response;
        } catch (error) {
            console.error('Error occurred while searching all contacts:', error);
            throw error;
        }
    };

    async searchContactAPI(searchQuery) {
        try {
            let contactID;
            let response = await this.page.request.get('/contacts');
            const allContactsJson = await response.json();
            for (const contact of allContactsJson) {
                if (`${contact.firstName} ${contact.lastName}` === searchQuery) {
                    contactID = contact._id;
                    break;
                }
            }
            if (!contactID) {
                console.error('Contact not found:', searchQuery);
                return;
            }
            const searchContact = await this.page.request.get(`/contacts/${contactID}`);
            expect(searchContact.status()).toBe(200);
            return searchContact;
        } catch (error) {
            console.error('Error occurred while searching contact:', error);
            throw error;
        }
    };



    async updateContact(newFirstName, newLastName) {
        try {
            const firstContact = this.allContacts.first();
            await firstContact.click();
            await expect(this.page.getByRole('img')).toBeVisible();
            await this.editButton.isVisible();
            await this.editButton.click();
            await expect(this.page.getByRole('img')).toBeVisible();
            await this.firstNameEdit.clear();
            await this.firstNameEdit.fill(newFirstName);
            await this.lastNameEdit.clear();
            await this.lastNameEdit.fill(newLastName);
            await this.submitButton.click();
            const updatedFirstName = this.page.getByText(newFirstName, { exact: true });
            const updatedLastName = this.page.getByText(newLastName, { exact: true });
            await expect(updatedFirstName).toBeVisible();
            await expect(updatedLastName).toBeVisible();
        } catch (error) {
            console.error('Error occurred while updating contact:', error);
            throw error;
        }
    };

    async updateContactAPI(searchQuery, newFirstName, newLastName) {
        try {
            let contactID;
            let response = await this.page.request.get('/contacts');
            const allContactsJson = await response.json();
            for (const contact of allContactsJson) {
                if (contact.firstName + ' ' + contact.lastName === searchQuery) {
                    contactID = contact._id;
                    break;
                }
            }
            const updateContact = await this.page.request.patch(`/contacts/${contactID}`, {
                data: {
                    firstName: newFirstName,
                    lastName: newLastName
                }
            });
            expect(updateContact.status()).toBe(200);
            return updateContact;
        } catch (error) {
            console.error('Error occurred while updating contact API:', error);
            throw error;
        }
    };

    async deleteAllContacts() {
        try {
            let contactNameList = [];
            await expect.poll(async () => this.allContacts.count()).toBeGreaterThan(0);
            const num = await this.allContacts.count();
            this.page.on('dialog', async dialog => {
                console.log(dialog.message());
                await dialog.accept();
            });
            for (let i = 0; i < num; i++) {
                await this.newContactButton.isVisible();
                await this.allContacts.first().click();
                await expect.poll(async () => this.lastNameSpan.innerText()).toBeTruthy();
                const firstName = await this.firstNameSpan.innerText();
                const lastName = await this.lastNameSpan.innerText();
                const contactName = firstName + ' ' + lastName;
                contactNameList.push(contactName);
                await this.deleteButton.focus();
                await this.deleteButton.click();
            }
            return contactNameList;
        } catch (error) {
            console.error('Error occurred while deleting all contacts:', error);
            throw error;
        }
    };

    async deleteFirstContact() {
        try {
            const deletedNames = [];
            const firstContact = this.allContacts.first();
            await firstContact.click();
            await expect.poll(async () => this.lastNameSpan.innerText()).toBeTruthy();
            const firstName = await this.firstNameSpan.textContent();
            const lastName = await this.lastNameSpan.textContent();
            deletedNames.push(`${firstName} ${lastName}`);
            this.page.on('dialog', async dialog => {
                await dialog.accept();
            });
            await this.deleteButton.focus();
            await this.deleteButton.click();
            return deletedNames;
            
        } catch (error) {
            console.error('Error occurred while deleting contact:', error);
            throw error;
        }
    };
    async deleteContactAPI(num) {
        try {
            const deletedNames = [];
            let response = await this.page.request.get(`/contacts`);
            const allEntitiesJson = await response.json();
            for (let i = 0; i < num; i++) {
                const entityID = allEntitiesJson[i]._id;
                const entityFullName = allEntitiesJson[i].firstName + ' ' + allEntitiesJson[i].lastName;
                response = await this.page.request.delete(`/contacts/` + entityID);
                expect(response.status()).toBe(200);
                if (response.ok()) {
                    deletedNames.push(entityFullName);
                }
            }

            return deletedNames;
        } catch (error) {
            console.error('Error occurred while deleting contact:', error);
            throw error;
        }
    };

};