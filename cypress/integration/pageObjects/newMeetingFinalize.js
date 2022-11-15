
const login_url = Cypress.env("baseUrl");


class newMeetingFinalize {

	elements = {


        finalize_and_approve_tab: () => cy.get('#council-act-approve-button'),

        sending_minutes_tab: () => cy.get('#tab-1'),
        send_minutes_button: () => cy.get('#send-act-button'),
        send_to_all_invited_option: () => cy.get('#send-act-all-convened-option'),

        modal_title: () => cy.get('#mui-11'),

        alert_cancel: () => cy.get('#alert-confirm-button-cancel'),
    


	}

    click_finalize_and_approve() {
        this.elements.finalize_and_approve_tab()
            .should('be.visible')
            .click()
           .wait(2000)
    }

    

    alert_cancel() {
        this.elements.alert_cancel()
            .should('be.visible')
            .click()
    }

    select_send_to_all_invited() {
        this.elements.send_to_all_invited_option()
            .should('be.visible')
            .click()
    }

    click_to_send_minutes() {
        this.elements.send_minutes_button()
            .should('be.visible')
            .click()
    }

    click_sending_minutes_tab() {
        this.elements.sending_minutes_tab()
            .should('be.visible')
            .click()
    }

    verify_modal_title() {
        this.elements.modal_title()
            .should('contain', 'Finalize and approve minutes')
    }

  
  


}

export default newMeetingFinalize