const ovac_admin_url = Cypress.env("ovacAdminUrl");
const ovac_url = Cypress.env("ovacUrl");

const emailAlem = "alem@qaengineers.net";
const emailTest = "5ebc694c-dd33-4b25-883a-33c7da04304d@mailslurp.com";



class loginPage {

	navigate_user() {
		cy.visit(ovac_url)
		cy.url().should('eq', ovac_url)
	}

	navigate_admin() {
		cy.visit(ovac_admin_url)
		cy.url().should('eq', ovac_admin_url)
	}

	enter_email(email) {
		cy.get('#username')
            .type(email)
            .should('have.value', email)  
	}

	enter_password(password) {
		cy.get('#password')
            .type(password)
            .should('have.value', password)
	}

	login_submit() {
		cy.get('#login-button')
            .should('be.visible')
            .click() 
	}

	confirm_login() {
		cy.url()
            .should('include', '/company/')
	}

}


export default loginPage