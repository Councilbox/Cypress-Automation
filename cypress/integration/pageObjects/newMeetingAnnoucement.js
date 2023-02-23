
const login_url = Cypress.env("baseUrl");


class newMeetingPage {

	elements = {
        //new meeting modal

		with_session: () => cy.get('#create-council-with-session'),
        without_session: () => cy.get('#create-council-without-session'),

        //announcement page

        meeting_type_dropmenu: () => cy.get('#council-notice-type-select'),
        second_option_meeting_type: () => cy.get('#council-notice-type-2'),
        meeting_title: () => cy.get('#council-notice-title'),
        information_on_the_announcement: () => cy.get('#council-notice-convene-intro'),
        announcement_next: () => cy.get('#council-editor-next'),


        //census page

        add_participant_census_dropmenu: () => cy.get('#add-participant-dropdown-trigger'),
        add_participant_census_option: () => cy.get('#add-participant-button'),

        //without session

        start_date: () => cy.get('#date-time-picker-date-start'),
        end_date: () => cy.get('#date-time-picker-date-end'),
        accept_button: () => cy.get('#calendar-accept-button'),

        alert_confirm: () => cy.get('#alert-confirm-button-accept'),
     
 
      


	}

    alert_confirm() {
        this.elements.alert_confirm()
            .should('be.visible')
            .click()
    }

    click_on_accept_button() {
        this.elements.accept_button()
            .should('be.visible')
            .click()
    }

    select_end_date() {
        cy.contains('2023').click()
        cy.contains('2024').click()
    }

    click_on_end_date_calendar() {
        this.elements.end_date()
            .should('be.visible')
            .click()
    }

    click_on_start_date_calendar() {
        this.elements.start_date()
            .should('be.visible')
            .click()
    }

    click_on_new_meeting_without_session() {
        this.elements.without_session()
            .should('be.visible')
            .click()
    }

    click_on_add_participant_census_dropmenu() {
        this.elements.add_participant_census_dropmenu()
            .should('be.visible')
            .click()
    }

    enter_information_on_the_announcement(description) {
        this.elements.information_on_the_announcement()
            .should('be.visible')
            .type(description)
    }

    click_next_announcement() {
        this.elements.announcement_next()
            .should('be.visible')
            .click()
    }

    enter_meeting_title(title) {
        this.elements.meeting_title()
            .should('be.visible')
            .clear()
            .type(title)
            .should('have.value', title)
    }

	click_on_add_button(modal_title) {
        this.elements.add_button()
            .should('be.visible')
            .click()
        this.elements.modal_title()
            .should('contain', modal_title)
    }

    select_meeting_type() {
        this.elements.meeting_type_dropmenu()
            .should('be.visible')
            .click()
        this.elements.second_option_meeting_type()
            .should('be.visible')
            .click()
    }

    click_on_with_session() {
        this.elements.with_session()
            .should('be.visible')
            .click()
    }





}

export default newMeetingPage