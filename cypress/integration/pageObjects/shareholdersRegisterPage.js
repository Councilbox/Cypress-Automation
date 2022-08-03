class shareholdersRegisterPage {

	elements = {

		add_member: () => cy.get('#add-partner-button'),
        search_input: () => cy.get('#partners-search-input'),
        shareholder_table_row_first: () => cy.get('#participant-0'),

        //add_member
        //personal_data
        name: () => cy.get('#add-partner-name'),
        surname: () => cy.get('#add-partner-surname'),
        email: () => cy.get('#add-partner-email'),
        tin: () => cy.get('#add-partner-dni'),
        nacionality: () => cy.get('#add-partner-nationality'),
        phone: () => cy.get('#add-partner-phone'),
        landline_phone: () => cy.get('#add-partner-landline-phone'),
        type_of_member: () => cy.get('#add-partner-type'),
        status: () => cy.get('#add-partner-state'),
        status_cancelation: () => cy.get('#add-partner-unsubscribed'),
        votes: () => cy.get('#add-partner-votes'),
        shares: () => cy.get('#add-partner-social-capital'),

        //file
        registration_record: () => cy.get('#add-partner-subscribe-number'),
        cancelation_record: () => cy.get('#add-partner-unsubscribe-number'),

        date_file_opened_calendar: () => cy.get('#add-partner-open-date-icon'),
        registration_date_calendar: () => cy.get('#add-partner-open-subscribe-icon'),
        record_of_registration_date_calendar: () => cy.get('#add-partner-open-subscribe-act-icon'),
        cancelation_date_calendar: () => cy.get('#add-partner-open-unsubscribe-icon'),
        record_of_cancelation_date_calendar: () => cy.get('#add-partner-open-unsubscribe-act-icon'),


        //calendar
        calendar_accept: () => cy.get('#calendar-accept-button'),

        //aditional_data
        address: () => cy.get('#add-partner-address'),
        town: () => cy.get('#add-partner-locality'),
        province: () => cy.get('#add-partner-country_state'),
        zipcode: () => cy.get('#add-partner-zipcode'),
        language_dropmenu: () => cy.get('#add-partner-language-select'),
        language_en: () => cy.get('#add-partner-language-select-en'),


        save_changes: () => cy.get('#guardarAnadirSocio'),

	}

    verify_member(name) {
        this.elements.shareholder_table_row_first()
            .contains(name)
            .should('be.visible')
    }

    enter_search_data(search) {
        this.elements.search_input()
            .should('be.visible')
            .clear()
            .type(search)
            .should('have.value', search)
            .wait(2000)
    }

    click_on_registration_date_calendar() {
        this.elements.registration_date_calendar()
            .should('be.visible')
            .click()
    }

    click_on_record_of_registration_date_calendar() {
        this.elements.record_of_registration_date_calendar()
            .should('be.visible')
            .click()
    }

    click_on_cancelation_date_calendar() {
        this.elements.cancelation_date_calendar()
            .should('be.visible')
            .click()
    }

    click_on_record_of_cancelation_date_calendar() {
        this.elements.record_of_cancelation_date_calendar()
            .should('be.visible')
            .click()
    }

    click_on_langauge_dropmenu() {
        this.elements.language_dropmenu()
            .should('be.visible')
            .click()
    }

    click_on_save_button() {
        this.elements.save_changes()
            .should('be.visible')
            .click()
    }

    select_english_language() {
        this.elements.language_en()
            .should('be.visible')
            .click()
    }

    click_on_date_file_opened_calendar() {
        this.elements.date_file_opened_calendar()
            .should('be.visible')
            .click()
    }

    click_on_calendar_accept() {
        this.elements.calendar_accept()
            .should('be.visible')
            .click()
    }

    enter_registration_record(registration_record) {
        this.elements.registration_record()
            .should('be.visible')
            .clear()
            .type(registration_record)
            .should('have.value', registration_record)
    }

    enter_cancelation_record(cancelation_record) {
        this.elements.cancelation_record()
            .should('be.visible')
            .clear()
            .type(cancelation_record)
            .should('have.value', cancelation_record)
    }

    click_on_status_dropmenu() {
        this.elements.status()
            .should('be.visible')
            .click()
    }

    select_status_option() {
        this.elements.status_cancelation()
            .should('be.visible')
            .click()
    }

	click_on_add_member() {
        this.elements.add_member()
            .should('be.visible')
            .click()
        cy.url()
            .should('include', '/book/new')
    }

    enter_partner_type_of_member(type_of_member) {
        this.elements.type_of_member()
            .should('be.visible')
            .clear()
            .type(type_of_member)
            .should('have.value', type_of_member)
    }

    enter_partner_town(town) {
        this.elements.town()
            .should('be.visible')
            .clear()
            .type(town)
            .should('have.value', town)
    }

    enter_partner_province(province) {
        this.elements.province()
            .should('be.visible')
            .clear()
            .type(province)
            .should('have.value', province)
    }

    enter_partner_zipcode(zipcode) {
        this.elements.zipcode()
            .should('be.visible')
            .clear()
            .type(zipcode)
            .should('have.value', zipcode)
    }

    enter_partner_votes(votes) {
        this.elements.votes()
            .should('be.visible')
            .clear()
            .type(votes)
            .should('have.value', votes)
    }

    enter_partner_shares(shares) {
        this.elements.shares()
            .should('be.visible')
            .clear()
            .type(shares)
            .should('have.value', shares)
    }

    enter_partner_address(address) {
        this.elements.address()
            .should('be.visible')
            .clear()
            .type(address)
            .should('have.value', address)
    }

    enter_partner_name(name) {
        this.elements.name()
            .should('be.visible')
            .clear()
            .type(name)
            .should('have.value', name)
    }

    enter_partner_surname(surname) {
        this.elements.surname()
            .should('be.visible')
            .clear()
            .type(surname)
            .should('have.value', surname)
    }

    enter_partner_email(email) {
        this.elements.email()
            .should('be.visible')
            .clear()
            .type(email)
            .should('have.value', email)
    }

    enter_partner_tin(tin) {
        this.elements.tin()
            .should('be.visible')
            .clear()
            .type(tin)
            .should('have.value', tin)
    }

    enter_partner_nacionality(nacionality) {
        this.elements.nacionality()
            .should('be.visible')
            .clear()
            .type(nacionality)
            .should('have.value', nacionality)
    }

    enter_partner_phone(phone) {
        this.elements.phone()
            .should('be.visible')
            .clear()
            .type(phone)
            .should('have.value', phone)
    }

    enter_partner_landline_phone(landline_phone) {
        this.elements.landline_phone()
            .should('be.visible')
            .clear()
            .type(landline_phone)
            .should('have.value', landline_phone)
    }

    

}

export default shareholdersRegisterPage