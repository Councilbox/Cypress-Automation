
const login_url = Cypress.env("baseUrl");


class newMeetingPreview {

	elements = {


        invite_and_notify: () => cy.get('#council-editor-convene-notify'),
        prepare_room: () => cy.get('#prepararSalaNew'),
        open_room: () => cy.get('#abrirSalaEnReunion'),
        start_meeting: () => cy.get('#start-council-button'),

        alert_confirm: () => cy.get('#alert-confirm-button-accept'),

        president_select: () => cy.get('#council-president-select'),
        secretary_select: () => cy.get('#council-secretary-select'),
        quality_select: () => cy.get('#council-quality-vote-select'),

        participant_select: () => cy.get('#participant-selector-0'),


        agenda_tab: () => cy.get('#council-live-tab-agenda'),
        agenda_open_item: () => cy.get('#open-agenda-point-button'),

        activate_voting:() => cy.get('#open-point-votings-button'),

        close_voting: () => cy.get('#close-point-votings-button'),
        close_item: () => cy.get('#close-agenda-point-button'),

        finalize_button: () => cy.get('#finalizarReunionEnReunion'),

       
    


	}

    click_on_finalize() {
        this.elements.finalize_button()
            .should('be.visible')
            .click()
    }

    click_on_close_item() {
        this.elements.close_item()
            .should('be.visible')
            .click()
    }

    click_on_close_voting() {
        this.elements.close_voting()
            .should('be.visible')
            .click()
    }

    click_activate_voting() {
        this.elements.activate_voting()
            .should('be.visible')
            .click()
    }

    click_open_item() {
        this.elements.agenda_open_item()
            .should('be.visible')
            .click()
    }

    click_on_agenda() {
        this.elements.agenda_tab() 
            .should('be.visible')
            .click()
    }

    select_president() {
        this.elements.president_select()
            .should('be.visible')
            .click()
        this.elements.participant_select()
            .should('be.visible')
            .click()
    }
    select_secreatary() {
        this.elements.secretary_select()
            .should('be.visible')
            .click()
        this.elements.participant_select()
            .should('be.visible')
            .click()
    }
    select_quality() {
        this.elements.quality_select()
            .should('be.visible')
            .click()
        this.elements.participant_select()
            .should('be.visible')
            .click()
    }

    click_on_start_meeting() {
        this.elements.start_meeting()
            .should('be.visible')
            .click()
    }

    alert_confirm() {
        this.elements.alert_confirm()
            .should('be.visible')
            .click()
    }

    click_on_invite_and_notify() {
        this.elements.invite_and_notify()
            .should('be.visible')
            .click()
    }

    click_on_prepare_room() {
        this.elements.prepare_room()
            .should('be.visible')
            .click()
    }

    click_open_room() {
        this.elements.open_room()
            .should('be.visible')
            .click()
    }


  
  


}

export default newMeetingPreview