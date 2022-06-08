import { capitalize } from "lodash"

class usersPage {
	

	elements = { 
		add_user_button: () => cy.get('#add-user-button'),
		name: () => cy.get('#user-settings-name'),
		surname: () => cy.get('#user-settings-surname'),
		email: () => cy.get('#user-settings-email'),
		language_menu: () => cy.get('#user-settings-language'),
		language_option_english: () => cy.get('#language-en'),
		create_user: () => cy.get('#create-user-button'),
		phone: () => cy.get('#user-settings-phone'),
		tin: () => cy.get('#user-id-card-type'),
		continue: () => cy.xpath('//*[@class="MuiButtonBase-root MuiButton-root MuiButton-text"]'),
		finalize: () => cy.get('#root > div > div:nth-child(3) > div > div:nth-child(2) > div > div:nth-child(1) > div > div:nth-child(2) > div > button'),
	
		}

	click_add_user() {
		this.elements.add_user_button()
			.should('be.visible')
			.click()
	}

	enter_phone(phone) {
		this.elements.phone()
			.type(phone)
			.should('have.value', phone)
	}

	enter_tin(tin) {
		this.elements.tin()
			.type(tin)
			.should('have.value', tin)
	}

	click_on_finalize() {
		this.elements.finalize()
			.should('be.visible')
			.click()
	}

	enter_name(name) {
		this.elements.name()
			.should('be.visible')
			.clear()
			.type(name)
			.should('have.value', name)
	}

	enter_surname(surname) {
		this.elements.surname()
			.should('be.visible')
			.clear()
			.type(surname)
			.should('have.value', surname)
	}

	enter_email(email) {
		this.elements.email()
			.should('be.visible')
			.type(email)
			.wait(1000)
			.should('have.value', email)
	}

	change_language_english() {
		this.elements.language_menu()
			.should('be.visible')
			.click()
		cy.wait(1000)
		this.elements.language_option_english()
			.click()
	}

	click_save_user() {
		this.elements.create_user()
			.should('be.visible')
			.click()
	}

	click_continue() {
		this.elements.continue()
			.should('be.visible')
			.click()
	}


}

export default usersPage