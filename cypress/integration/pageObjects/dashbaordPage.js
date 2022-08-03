class dashboardPage {

	elements = {

		types_of_meetings: () => cy.get('#edit-statutes-block'),
        shareholders_register: () => cy.get('#edit-company-block'),
       
    
	}

	click_on_type_of_meetings() {
        this.elements.types_of_meetings()
            .should('be.visible')
            .click()
        cy.url()
            .should('include', '/statutes')
    }

    click_on_shareholders_register() {
        this.elements.shareholders_register()
            .should('be.visible')
            .click()
        cy.url()
            .should('include', '/book')
    }





}

export default dashboardPage