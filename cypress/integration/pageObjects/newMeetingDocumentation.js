
const login_url = Cypress.env("baseUrl");


class newMeetingDocumentation {

	elements = {



        next_button: () => cy.get('#attachmentSiguienteNew'),
       
 
      


	}



    click_on_next() {
        this.elements.next_button()
            .should('be.visible')
            .click()
    }




}

export default newMeetingDocumentation