const ovac_admin_url = Cypress.env("ovacAdminUrl");
const ovac_url = Cypress.env("ovacUrl");

const emailAlem = "alem@qaengineers.net";
const emailTest = "5ebc694c-dd33-4b25-883a-33c7da04304d@mailslurp.com";
const password = "Mostar123!";


class loginPage {

	navigateUser() {
		cy.visit(ovac_url)
		cy.url().should('eq', ovac_url)
	}

	navigateAdmin() {
		cy.visit(ovac_admin_url)
		cy.url().should('eq', ovac_admin_url)
	}

	enterEmailValid() {
		cy.get('#username')
            .type(emailTest)
            .should('have.value', emailTest)  
	}

	enterPasswordValid() {
		cy.get('#password')
            .type(password)
            .should('have.value', password)
	}

	loginSubmit() {
		cy.get('#login-button')
            .should('be.visible')
            .click() 
	}

	confirmLogin() {
		cy.url()
            .should('include', '/company/')
	}

}


export default loginPage