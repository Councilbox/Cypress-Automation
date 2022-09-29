
const login_url = Cypress.env("baseUrl");


class newMeetingAgenda {

	elements = {


        add_item_to_agenda_button: () => cy.get('#newPuntoDelDiaOrdenDelDiaNew'),
        yes_no_item: () => cy.get('#puntoSiNoAbstencion'),

        alert_confirm: () => cy.get('#alert-confirm-button-accept'),

        next_button: () => cy.get('#ordenDelDiaNext'),

        agenda_title: () => cy.get('#agenda-editor-title-input'),

        agenda_dropmenu: () => cy.get('#agenda-editor-type-select'),
        roll_call_vote: () => cy.get('#agenda-editor-type-1'),
       
 
      


	}

    select_agenda_roll_call() {
        this.elements.agenda_dropmenu()
            .should('be.visible')
            .click()
        this.elements.roll_call_vote()
            .should('be.visible')
            .click()
        
    }

    click_on_add_agenda() {
        this.elements.add_item_to_agenda_button()
            .should('be.visible')
            .click()
    }

    click_on_next() {
        this.elements.next_button()
            .should('be.visible')
            .click()
    }

    alert_confirm() {
        this.elements.alert_confirm()
            .should('be.visible')
            .click()
            .wait(2000)
    }
    
    click_on_yes_no_item() {
        this.elements.yes_no_item()
            .should('be.visible')
            .click()
    }

    enter_agenda_title(title) {
        this.elements.agenda_title()
            .should('be.visible')
            .clear()
            .type(title)
            .should('have.value', title)
    }
    
  


}

export default newMeetingAgenda