
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


        participants_tab: () => cy.get('#council-live-tab-participants'),
        delegate_vote: () => cy.get('#participant-editor-delegate-vote-button'),
        participant_vote_search: () => cy.get('[placeholder="Search"]'),
        participant_table_row: () => cy.get('#participant-row-0'),

        alert_close: () => cy.get('#alert-confirm-close'),

        owned_votes: () => cy.get('#owned-votes-total'),
        owned_shares: () => cy.get('#owned-delegated-social-capital'),

        paerticipants_search: () => cy.get('#input-search-live'),

        participant_b: () => cy.get('#state-selector-participant-item-1'),
        first_participanth: () => cy.get('#state-selector-participant-item-0'),

        attending_in_person: () => cy.get('[role="menuitem"]').contains('Attending in person'),

        current_quoeum_number: () => cy.get('#live-current-quorum'),

        vote_early: () => cy.get('#participant-early-voting-button'),
        in_favor: () => cy.get('#early-vote-option-1-point-0'),

        alert_close_second: () => cy.get('(//*[@id="alert-confirm-close"])[2]'),

        add_participant: () => cy.get('#add-participant-dropdown-trigger'),
        add_guest: () => cy.get('#add-guest-button'),

        guest_name: () => cy.get('#participant-form-name'),
        guest_surname: () =>('#participant-form-surname'),
        guest_id: () => cy.get('#participant-form-card-id'),
        guest_email: () => cy.get('#participant-form-email'),
       
    


	}

    alert_close_second() {
        this.elements.alert_close_second()
            .should('be.visible')
            .click()
    }

    enter_guest_inputs(name, surname, id, email) {
        this.elements.guest_name()
            .should('be.visible')
            .clear()
            .type(name)
            .should('have.value', name)
        this.elements.guest_surname()
            .should('be.visible')
            .clear()
            .type(surname)
            .should('have.value', surname)
        this.elements.guest_id()
            .should('be.visible')
            .clear()
            .type(id)
            .should('have.value', id)
        this.elements.guest_email()
            .should('be.visible')
            .clear()
            .type(email)
            .should('have.value', email)
    }

    click_on_add_guest() {
        this.elements.add_guest()
            .should('be.visible')
            .click()
    }

    click_on_add_participant() {
        this.elements.add_participant()
            .should('be.visible')
            .click()
    }

    click_on_vote_early() {
        this.elements.vote_early()
            .should('be.visible')
            .click()
        this.elements.in_favor()
            .should('be.visible')
            .click()
    }

    verify_owned_votes(votes) {
        this.elements.owned_votes()
            .should('have.text', votes)
    }

    verify_current_quorum(quorum) {
        this.elements.current_quoeum_number()
            .should('have.text', quorum)
    }

    click_on_attending_in_person() {
        this.elements.attending_in_person()
            .should('be.visible')
            .click()
    }

    click_on_second_participant() {
        this.elements.participant_b()
            .should('be.visible')
            .click()
    }

    click_on_first_participant() {
        this.elements.first_participanth()
            .should('be.visible')
            .click()
    }

    search_for_participant(participant) {
        this.elements.paerticipants_search()
            .should('be.visible')
            .clear()
            .type(participant)
            .should('have.value', participant)
            .wait(1000)
    }

    verify_owned(shares) {
        this.elements.owned_shares()
            .should('have.text', shares)
    }

    click_on_finalize() {
        this.elements.finalize_button()
            .should('be.visible')
            .click()
    }

    alert_close() {
        this.elements.alert_close()
            .should('be.visible')
            .click()
    }

    delegate_vote_to_participant(participant) {
        this.elements.participant_vote_search()
            .should('be.visible')
            .clear()
            .type(participant)
            .should('have.value', participant)
            .wait(2000)
        this.elements.participant_table_row()
            .should('be.visible')
            .click()
    }

    click_on_delegate_vote() {
        this.elements.delegate_vote()
            .should('be.visible')
            .click()
    }

    click_on_participants_tab() {
        this.elements.participants_tab()
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