
const login_url = Cypress.env("baseUrl");


class loginPage {

	elements = {

		email: () => cy.get('#username'),
        password: () => cy.get('#password'),
        login_button: () => cy.get('#login-button'),

        //homepage
        sign_up_button: () => cy.get('#sign-up-button'),

        //signup
        send_button: () => cy.get('#create-user-button'),
        signup_name: () => cy.get('#signup-name'),
        signup_surname: () => cy.get('#signup-surname'),
        signup_phone : () => cy.get('#signup-phone'),
        signup_email: () => cy.get('#signup-email'),
        signup_email_confirm: () => cy.get('#signup-email-check'),
        signup_password: () => cy.get('#signup-password'),
        signup_password_confirm: () => cy.get('#signup-password-check'),
        signup_legal_terms: () => cy.get('#accept-legal-checkbox'),
        //erros
        name_error: () => cy.get('#create-account-name-error'),
        surname_error: () => cy.get('#create-account-surname-error'),
        phone_error: () => cy.get('#create-account-phone-error'),
        email_error: () => cy.get('#create-account-mail-error'),
        password_error: () => cy.get('#create-account-password-error'),
        legal_terms_error: () => cy.get('#legal-terms-error-text'),
        email_confirm_error: () => cy.get('#create-account-repeat-mail-error'),
        password_confirm_error: () => cy.get('#create-account-repeat-password-error'),
 
      


	}

	enter_email(email) {
        this.elements.email()
            .should('be.visible')
            .clear()
            .type(email)
            .should('have.value', email)
    }

    verify_existing_password_confirm_error() {
        this.elements.password_confirm_error()
            .should('be.visible')
    }

    verify_existing_email_confirm_error() {
        this.elements.email_confirm_error()
            .should('be.visible')
    }

    enter_signup_password(password) {
        this.elements.signup_password()
            .should('be.visible')
            .clear()
            .type(password)
            .should('have.value', password)
    }

    enter_signup_password_confirm(password_confirm) {
        this.elements.signup_password_confirm()
            .should('be.visible')
            .clear()
            .type(password_confirm)
            .should('have.value', password_confirm)
    }

    enter_signup_name(name) {
        this.elements.signup_name()
            .should('be.visible')
            .clear()
            .type(name)
            .should('have.value', name)
    }

    enter_signup_surname(surname) {
        this.elements.signup_surname()
            .should('be.visible')
            .clear()
            .type(surname)
            .should('have.value', surname)
    }

    enter_signup_phone(phone) {
        this.elements.signup_phone()
            .should('be.visible')
            .clear()
            .type(phone)
            .should('have.value', phone)
    }

    enter_signup_email_and_confirm_it(email) {
        this.elements.signup_email()
            .should('be.visible')
            .clear()
            .type(email)
        this.elements.signup_email_confirm()
            .should('be.visible')
            .clear()
            .type(email)
            .should('have.value', email)
    }

    enter_signup_email(email) {
        this.elements.signup_email()
            .should('be.visible')
            .clear()
            .type(email)
    }

    enter_signup_email_confirm(email_confirm) {
        this.elements.signup_email_confirm()
            .should('be.visible')
            .clear()
            .type(email_confirm)
            .should('have.value', email_confirm)
    }

    enter_signup_password_and_confirm_it(password) {
        this.elements.signup_password()
            .should('be.visible')
            .clear()
            .type(password)
            .should('have.value', password)
        this.elements.signup_password_confirm()
            .should('be.visible')
            .clear()
            .type(password)
            .should('have.value', password)
    }

    accept_terms() {
        this.elements.signup_legal_terms()
            .should('be.visible')
            .check()
            .should('be.checked')
    }


    verify_existing_name_error() {
        this.elements.name_error()
            .should('be.visible')
    }

    verify_existing_surname_error() {
        this.elements.surname_error()
            .should('be.visible')
    }

    verify_existing_phone_error() {
        this.elements.phone_error()
            .should('be.visible')
    }

    verify_existing_email_error() {
        this.elements.email_error()
            .should('be.visible')
    }

    verify_existing_password_error() {
        this.elements.password_error()
            .should('be.visible')
    }

    verify_existing_legal_terms_error() {
        this.elements.legal_terms_error()
            .should('be.visible')
    }

    click_on_send() {
        this.elements.send_button()
            .should('be.visible')
            .click()
    }

    click_on_sign_up_button() {
        this.elements.sign_up_button()
            .should('be.visible')
            .click()
        cy.url()
            .should('include', '/signup')
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