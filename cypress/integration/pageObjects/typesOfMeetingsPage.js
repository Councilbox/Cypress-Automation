
const login_url = Cypress.env("baseUrl");


class typeOfMeetingsPage {

	elements = {

		add_button: () => cy.get('#company-statute-create-button'),
        modal_title: () => cy.get('#modal-title'),
        title: () => cy.get('#new-council-type-input'),

        types_table_row: () => cy.get('.jss2952'),

        //alert
        alert_confirm: () => cy.get('#alert-confirm-button-accept'),
        save_button: () => cy.get('#council-statute-save-button'),
        
 
      


	}

	click_on_add_button(modal_title) {
        this.elements.add_button()
            .should('be.visible')
            .click()
        this.elements.modal_title()
            .should('contain', modal_title)
    }

    click_on_save() {
        this.elements.save_button()
            .should('be.visible')
            .click()
            .wait(1000)
    }

    verify_type_is_created(title) {
        cy.contains(title)
            .scrollIntoView()
            .should('be.visible')
    }

    enter_title(title) {
        this.elements.title()
            .should('be.visible')
            .clear()
            .type(title)
            .should('have.value', title)
    }

    alert_confirm() {
        this.elements.alert_confirm()
            .should('be.visible')
            .click()
            .wait(1000)
    }

    




}

export default typeOfMeetingsPage