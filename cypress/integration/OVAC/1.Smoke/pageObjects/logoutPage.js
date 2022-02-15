class logoutPage {

	accountButton() {
		cy.get('#user-menu-trigger')
            .should('be.visible')
            .click()
	}

	logoutButton() {
		cy.get('#user-menu-logout')
            .should('be.visible')
            .click()
	}

	logoutConfirm() {
		cy.url()
            .should('include', '/admin')
	}

}


export default logoutPage