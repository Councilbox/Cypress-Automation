
const login_url = Cypress.env("baseUrl");


class newMeetingOptions {

	elements = {


        contact_email: () => cy.get('#council-options-contact-email'),
        next_button: () => cy.get('#optionsNewSiguiente'),
    


	}

    scroll_to_contact_email() {
        this.elements.contact_email()
            .scrollIntoView()
            .should('be.visible')
    }

    enter_contact_email(email) {
        this.elements.contact_email()
            .should('be.visible')
            .clear()
            .type(email)
            .should('have.value', email)
    }

    click_on_next() {
        this.elements.next_button()
            .should('be.visible')
            .click()
    }

  
  


}

export default newMeetingOptions