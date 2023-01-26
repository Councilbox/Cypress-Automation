import { capitalize } from "lodash"

class usersPage {
	

	elements = { 
		add_user_button: () => cy.get('#add-user-button'),
		search: () => cy.get('#company-document-search-input'),
		name: () => cy.get('#user-settings-name'),
		surname: () => cy.get('#user-settings-surname'),
		email: () => cy.get('#user-settings-email'),
		language_menu: () => cy.get('#user-settings-language'),
		language_option_english: () => cy.get('#language-en'),
		language_option_catala: () => cy.get('#language-cat'),
		language_option_spanish: () => cy.get('#language-es'),
		language_option_italiano : () => cy.get('#language-it'),
		language_option_euskera : () => cy.get('#language-eu'),
		return: () => cy.get('[class="material-icons MuiIcon-root ri-arrow-left-line text-2xl flex items-center "]'),
		error: () => cy.get('[class="MuiFormHelperText-root error-text Mui-error"]'),

		create_user: () => cy.get('#create-user-button'),
		phone: () => cy.get('#user-settings-phone'),
		phone_code: () => cy.get('#user-phone-code'),
		tin: () => cy.get('#user-id-card-type'),
		continue: () => cy.get('[class="MuiButtonBase-root MuiButton-root MuiButton-text"]').eq(0),
		finalize: () => cy.get('#root > div > div:nth-child(3) > div > div:nth-child(2) > div > div:nth-child(1) > div > div:nth-child(2) > div > button'),
		users_table_row: () => cy.get('[class="MuiTableRow-root cursor-pointer MuiTableRow-hover"]').eq(0),
		action_button: () => cy.get('.ri-more-2-fill').eq(0),
		edit_button: () => cy.get('.ri-pencil-line')
	
		}

	click_add_user() {
		this.elements.add_user_button()
			.should('be.visible')
			.click()
	}

	click_on_edit() {
		this.elements.action_button()
			.should('be.visible')
			.click()
		this.elements.edit_button()
			.should('be.visible')
			.click()
	}

	verify_error() {
		this.elements.error()
			.should('be.visible')
	}

	click_return() {
		this.elements.return()
			.should('be.visible')
			.click()
	}

	verify_user(user) {
		this.elements.users_table_row()
			.contains(user)
			.should('be.visible')
	}

	search_for_user(user) {
		cy.wait(2000)
		this.elements.search()
			.should('be.visible')
			.clear()
			.type(user)
			.should('have.value', user)
	}

	enter_phone_code(phone_code) {
		this.elements.phone_code()
			.should('be.visible')
			.clear()
			.type(phone_code)
			.should('have.value', phone_code)
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
		cy.wait(3000)
		this.elements.finalize()
			.should('be.visible')
			.click()
		cy.wait(5000)
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

	click_language_menu() {
		this.elements.language_menu()
			.should('be.visible')
			.click()
	}

	select_calego_language() {
		this.elements.language_option_catala()
			.should('be.visible')
			.click()
	}

	select_italiano_language() {
		this.elements.language_option_italiano()
			.should('be.visible')
			.click()
	}

	select_euskera_language() {
		this.elements.language_option_euskera()
			.should('be.visible')
			.click()
	}

	select_spanish_language() {
		this.elements.language_option_spanish()
			.should('be.visible')
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