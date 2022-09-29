
const login_url = Cypress.env("baseUrl");


class newMeetingCensus {

	elements = {


        add_participant_dropmenu: () => cy.get('#add-participant-dropdown-trigger'),
        add_participant_option: () => cy.get('#add-participant-button'),

        shareholder_name: () => cy.get('#participant-name-input'),
        shareholder_surname: () => cy.get('#participant-surname-input'),
        shareholder_TIN: () => cy.get('#participant-dni-input'),
        shareholder_phone: () => cy.get('#participant-phone-input'),
        shareholder_email: () => cy.get('#participant-email-input'),
        shareholder_administrative_email: () => cy.get('#participant-administrative-email-input'),

        alert_confirm: () => cy.get('#alert-confirm-button-accept'),

        next_census: () => cy.get('#censoSiguienteNew'),
     
 
      


	}

    click_on_next() {
        this.elements.next_census()
            .should('be.visible')
            .click()
    }
    
    alert_confirm() {
        this.elements.alert_confirm()
            .should('be.visible')
            .click()
        cy.wait(2000)
    }

    enter_shareholder_name(name) {
        this.elements.shareholder_name()
            .should('be.visible')
            .clear()
            .type(name)
            .should('have.value', name)
    }
    enter_shareholder_surname(surname) {
        this.elements.shareholder_surname()
            .should('be.visible')
            .clear()
            .type(surname)
            .should('have.value', surname)
    }
    enter_shareholder_TIN(TIN) {
        this.elements.shareholder_TIN()
            .should('be.visible')
            .clear()
            .type(TIN)
            .should('have.value', TIN)
    }
    enter_shareholder_phone(phone) {
        this.elements.shareholder_phone()
            .should('be.visible')
            .clear()
            .type(phone)
            .should('have.value', phone)
    }
    enter_shareholder_email(email) {
        this.elements.shareholder_email()
            .should('be.visible')
            .clear()
            .type(email)
            .should('have.value', email)
    }
    enter_shareholder_administrative_email(email) {
        this.elements.shareholder_administrative_email()
            .should('be.visible')
            .clear()
            .type(email)
            .should('have.value', email)
    }

    click_on_add_participant() {
        this.elements.add_participant_option()
            .should('be.visible')
            .click()
    }

    click_on_add_participant_census_dropmenu() {
        this.elements.add_participant_dropmenu()
            .should('be.visible')
            .click()
    }



}

export default newMeetingCensus