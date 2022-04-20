class usersPage {

	addUser() {
		cy.get('#MISSING_ID')
			.should('be.visible')
			.click()
	}

	enterName() {
		cy.get('#user-settings-name')
			.should('be.visible')
			.clear()
			.type('Automation')
			.should('have.value', 'Automation')
	}

	enterSurname() {
		cy.get('#user-settings-surname')
			.should('be.visible')
			.clear()
			.type(userID_Alpha())
			.should('have.value', userID_Alpha())
	}

	enterEmail() {
		cy.get('#user-settings-email')
			.should('be.visible')
			.clear()
			.type('test'+Cypress.config('UniqueNumber')+'@test.com')
			.should('have.value', "'test'+Cypress.config('UniqueNumber')+'@test.com'")
	}

	changeLanguageEnglish() {
		cy.get('#user-settings-language')
			.should('be.visible')
			.click()
		cy.wait(1000)
		cy.get('#language-en')
			.click()
	}

	saveUser() {
		cy.get('#create-user-button')
			.should('be.visible')
			.click()
	}


}

export default usersPage