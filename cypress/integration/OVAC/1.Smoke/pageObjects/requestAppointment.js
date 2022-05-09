//const TIN = "12345678Z"
//const countryCode = "387"
//const telephoneNo = "62123456"
//const email = "58867653-57ca-4d58-9d84-45b60ac48434@mailslurp.com"

let docFile = 'testDocument.txt';

class requestAppointment {

	elements = {
	
		request_prior_appointment: () => cy.get('#create-appointment-button'),
	
		appointment_date: () => cy.get('#root > div > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div > div:nth-child(1) > div:nth-child(2) > div.MuiGrid-root.MuiGrid-container > div:nth-child(1) > div > div.react-calendar__viewContainer > div > div > div > div.react-calendar__month-view__days > button'),
		appointment_time: () => cy.get('#root > div > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div > div:nth-child(1) > div:nth-child(2) > div.MuiGrid-root.MuiGrid-container > div:nth-child(2) > div > div:nth-child(1) > div > div'),

	
		name: () => cy.get('#appointment-participant-name'),
		surname: () => cy.get('#appointment-participant-surname'),
		TIN: () => cy.get('#appointment-participant-document'),
		country_code: () => cy.get('#appointment-participant-phone-code'),
		telephone_no: () => cy.get('#appointment-participant-phone'),
		email: () => cy.get('#appointment-participant-email'),
		privacy_button: () => cy.get('#appointment-participant-legal-check'),
	
		alert_cofirm: () => cy.get('#alert-confirm-button-accept'),
	
		submit: () => cy.get('#appointment-create-button'),
	
		reschedule_appointment: () => cy.get('#reschedule-appointment-button'),
		cancel_appointment: () => cy.get('#cancel-appointment-button'),
		my_documentation: () => cy.get('#documentation-appointment-button'),
		doc_option:() => cy.get('#document-1'),
		upload_1: () => cy.get('#document-1-upload'),
	
		}

	request_prior_appointment_button() {
		this.elements.request_prior_appointment()
			.should('be.visible')
			.click()
		cy.url().should('include', '/newAppointment')
	}

	navigate_to_date_and_time() {
		cy.contains('Date and time of the appointment.')
			.should('be.visible')
	}

	select_appointment_date() {
		this.elements.appointment_date()
			.last()
			.should('be.visible')
			.click()
		this.elements.appointment_time()
			.last()
			.should('be.visible')
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

	enter_telephone_no(phone) {
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