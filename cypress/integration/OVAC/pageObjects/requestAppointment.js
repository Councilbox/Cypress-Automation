//const TIN = "12345678Z"
//const countryCode = "387"
//const telephoneNo = "62123456"
//const email = "58867653-57ca-4d58-9d84-45b60ac48434@mailslurp.com"

let docFile = 'testDocument.txt';

class requestAppointment {

	elements = {
	
		request_prior_appointment: () => cy.get('#access-room-button'),
	
		appointment_date: () => cy.get('.react-calendar__month-view__days__day').contains('28'),
		appointment_time: () => cy.get('#date-0'),
		secure_continue: () => cy.get('[class="MuiButtonBase-root MuiButton-root MuiButton-contained"]'),
		tin_continue: () => cy.get('#id-login-button'),

		confirm: () => cy.xpath('//*[@class="MuiButtonBase-root MuiButton-root MuiButton-contained" ]'),
		required_field: () => cy.xpath('(//*[@class="MuiFormHelperText-root error-text Mui-error"])'),
		terms_error: () => cy.xpath('//*[@class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-12 MuiGrid-grid-md-11"]'),
		company_select: () => cy.get('.MuiInputBase-inputAdornedEnd').first(),
	
		name: () => cy.get('#appointment-participant-name'),
		surname: () => cy.get('#appointment-participant-surname'),
		TIN: () => cy.get('#appointment-participant-document'),
		country_code: () => cy.get('#appointment-participant-phone-code'),
		telephone_no: () => cy.get('#appointment-participant-phone'),
		phone_code: () => cy.get('#appointment-participant-phone-code'),
		email: () => cy.get('#appointment-participant-email'),
		privacy_button: () => cy.get('#appointment-participant-legal-check'),
		next_month: () => cy.get('.ri-arrow-right-s-line').last(),
		alert_cofirm: () => cy.get('#alert-confirm-button-accept'),
	
		submit: () => cy.get('#appointment-create-button'),
	
		reschedule_appointment: () => cy.get('#reschedule-appointment-button'),
		cancel_appointment: () => cy.get('#cancel-appointment-button'),
		my_documentation: () => cy.get('#documentation-appointment-button'),
		doc_option:() => cy.get('#document-1'),
		upload_1: () => cy.get('#document-1-upload'),

		continue: () => cy.xpath('//*[@class="MuiButtonBase-root MuiButton-root MuiButton-contained"]'),

		alert: () => cy.xpath('//*[@role="alert"]'),

		service_requested_dropmenu: () => cy.get('#appointment-service-select'),
		service_requeted_select_first: () => cy.get('#appointment-service-select-popup'),

		checkboxes: () => cy.xpath('//*[@type="checkbox"]'),

		last_day: () => cy.xpath('//*[@class="react-calendar__tile react-calendar__month-view__days__day"]'),

		ok_reschedule: () => cy.get('#panel-confirm-button-accept'),

		secure_id: () => cy.get('[class="MuiInputBase-input MuiInput-input"]'),

		access_portal: () => cy.get('.css-38xk5c')
	
		}

	request_prior_appointment_button() {
		this.elements.request_prior_appointment()
			.should('be.visible')
			.click()
		cy.url().should('include', '/newAppointment')
	}

	select_company(company) {
		this.elements.company_select()
			.should('be.visible')
			.type(company)
			.wait(3000)
		cy.get('#appointment-entity-select-option-0')
			.click()
		

	}

	click_access_portal() {
		this.elements.access_portal()
			.should('be.visible')
			.click()
	}

	click_ok() {
		this.elements.ok_reschedule()
			.should('be.visible')
			.click()
	}

	click_next_month() {
		this.elements.next_month()
			.click()
	}

	enter_secure_TIN(tin) {
		this.elements.secure_id()
			.type(tin)
			.should('have.value', tin)
	}

	select_last_day() {
		this.elements.last_day()
			.last()
			.click()
	}

	click_continue_id() {
		this.elements.tin_continue()
			.should('be.visible')
			.click()
	}

	click_continue_secure() {
		this.elements.secure_continue()
			.should('be.visible')
			.click()
	}

	verify_accept_terms_error_message() {
		this.elements.terms_error()
			.should('be.visible')
	}

	verify_required_field_message() {
		this.elements.required_field()
			.should('be.visible')
	}

	accept_everything() {
		this.elements.checkboxes()
			.click({ multiple: true })		
	}

	select_service_requested(procedure) {
		this.elements.service_requested_dropmenu()
			.should('be.visible')
			.click()
		this.elements.service_requeted_select_first()
			.contains(procedure)
			.scrollIntoView()
			.should('be.visible')
			.click()
	}

	click_confirm() {
		this.elements.confirm()
			.should('be.visible')
			.click()
	}

	enter_appointment_time() {
		this.elements.appointment_time()
			.should('be.visible')
			.click()
	}

	verify_existing_alert() {
		this.elements.alert()
			.should('be.visible')
	}

	navigate_to_date_and_time() {
		cy.contains('Date and time of the appointment.')
			.should('be.visible')
	}

	click_continue() {
		this.elements.continue()
			.should('be.visible')
			.click()
	}

	select_appointment_date() {
		cy.wait(2000)
		this.elements.next_month()
			.click()
		this.elements.appointment_date()
			.last()
			.should('be.visible')
			.click()
		this.elements.appointment_time()
			.last()
			.should('be.visible')
			.click()
	}

	select_time() {
		this.elements.appointment_time()
			.last()
			.click()
	}

	enter_name(name) {
		this.elements.name()
			.should('be.visible')
			.clear()
			.type(name)
			.should('have.value', name)
	}

	enter_surname(surname) {
		this.elements.surname()
			.should('be.visible')
			.clear()
			.type(surname)
			.should('have.value', surname)
	}

	enter_TIN(tin) {
		this.elements.TIN()
			.should('be.visible')
			.clear()
			.type(tin)
			.should('have.value', tin)
	}

	enter_country_code(country_code) {
		this.elements.country_code()
			.should('be.visible')
			.clear()
			.type(country_code)
			.should('have.value', country_code)
	}

	enter_telephone_no(phone_code, phone) {
		this.elements.country_code()
			.should('be.visible')
			.clear()
			.type(phone_code)
			.should('have.value', phone_code)
		this.elements.telephone_no()
			.should('be.visible')
			.clear()
			.type(phone)
			.should('have.value', phone)
	}

	enter_email(email) {
		this.elements.email()
			.should('be.visible')
			.clear()
			.type(email)
			.should('have.value', email)
	}

	click_privacy_button() {
		this.elements.privacy_button()
			.should('be.visible')
			.click()
		cy.contains('Legal notice')
			.should('be.visible')
	}

	accept_privacy() {
		this.elements.alert_cofirm()
			.should('be.visible')
			.click()
	}

	request_appointment_submit() {
		this.elements.submit()
			.should('be.visible')
			.click()
	}

	confirm_appointment_request() {
		cy.contains('Prior appointment confirmed')
			.should('be.visible')
	}

	reschedule_appointment_button() {
		this.elements.reschedule_appointment()
			.should('be.visible')
			.click()
	}

	reschedule_confirm(reschedule_message) {
		cy.contains(reschedule_message)
			.should('be.visible')
	}

	cancel_appointment_button() {
		this.elements.cancel_appointment()
			.should('be.visible')
			.click()
	}

	alert_message(message) {
		cy.contains(message)
			.should('be.visible')
	}

	my_documentation_button() {
		this.elements.my_documentation()
			.should('be.visible')
			.click()
	}

	upload_document() {
		this.elements.doc_option()
			.click()
		this.elements.upload_1()
			.attachFile(docFile)
	}


}


export default requestAppointment