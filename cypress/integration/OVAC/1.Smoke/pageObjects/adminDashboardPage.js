class adminDashboard {

	appointmentsButton() {
		cy.get('#MISSING_ID')
			.should('be.visible')
			.click()
	}

	knowledgeBaseButton() {
		cy.get('#MISSING_ID')
			.should('be.visible')
			.click()
		cy.url().should('include', '/documentation')
	}

	usersButton() {
		cy.get('#MISSING_ID')
			.should('be.visible')
			.click()
		cy.url().should('include', '/users')
	}

	institituionButton() {
		cy.get('#MISSING_ID')
			.should('be.visible')
			.click()
		cy.url().should('include', '/companies')
	}


}

export default adminDashboard