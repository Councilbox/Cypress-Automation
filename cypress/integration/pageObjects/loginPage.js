
const login_url = Cypress.env("baseUrl");


class loginPage {

	elements = {

		email: () => cy.get('#username'),
        password: () => cy.get('#password'),
        login_button: () => cy.get('#login-button'),
      


	}

	enter_email(email) {
        this.elements.email()
            .should('be.visible')
            .clear()
            .type(email)
            .should('have.value', email)
    }

    enter_password(password) {
        this.elements.password()
            .should('be.visible')
            .clear()
            .type(password)
            .should('have.value', password)
    }

    click_login() {
        this.elements.login_button()
            .should('be.visible')
            .click()
        cy.url()
            .should('include', '/company')
    }

    login(email, password) {
        cy.clearLocalStorage()
        cy.visit(login_url)
        this.elements.email()
            .should('be.visible')
            .clear()
            .type(email)
            .should('have.value', email)
        this.elements.password()
            .should('be.visible')
            .clear()
            .type(password)
            .should('have.value', password)
        this.elements.login_button()
            .should('be.visible')
            .click()
        cy.url()
            .should('include', '/company')
    }




}

export default loginPage