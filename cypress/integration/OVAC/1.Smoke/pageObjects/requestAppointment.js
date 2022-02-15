const name = "Automation"
const surname = "Test"
const TIN = "12345678Z"
const countryCode = "387"
const telephoneNo = "62123456"
const email = "c0ddabd9-b148-4a0e-86b6-5f00a0497fa5@mailslurp.com"

class requestAppointment {

	requestPriorAppointmentButton() {
		cy.get('#create-appointment-button')
			.should('be.visible')
			.click()
		cy.url().should('include', '/newAppointment')
	}

	navigateToDateAndTime() {
		cy.contains('Date and time of the appointment.')
			.should('be.visible')
	}

	selectAppointmentDate() {
		cy.get('#date-0')
			.should('be.visible')
			.click()
	}

	enterName() {
		cy.get('#appointment-participant-name')
			.should('be.visible')
			.clear()
			.type(name)
			.should('have.value', name)
	}

	enterSurname() {
		cy.get('#appointment-participant-surname')
			.should('be.visible')
			.clear()
			.type(surname)
			.should('have.value', surname)
	}

	enterTIN() {
		cy.get('#appointment-participant-document')
			.should('be.visible')
			.clear()
			.type(TIN)
			.should('have.value', TIN)
	}

	enterCountryCode() {
		cy.get('#appointment-participant-phone-code')
			.should('be.visible')
			.clear()
			.type(countryCode)
			.should('have.value', countryCode)
	}

	enterTelephoneNo() {
		cy.get('#appointment-participant-phone')
			.should('be.visible')
			.clear()
			.type(telephoneNo)
			.should('have.value', telephoneNo)
	}

	enterEmail() {
		cy.get('#appointment-participant-email')	
			.should('be.visible')
			.clear()
			.type(email)
			.should('have.value', email)
	}

	privacyButton() {
		cy.get('#appointment-participant-legal-check')
			.should('be.visible')
			.click()
		cy.contains('Legal notice')
			.should('be.visible')
	}

	alertConfirmButton() {
		cy.get('#alert-confirm-button-accept')
			.should('be.visible')
			.click()
	}

	requestAppointmentSubmit() {
		cy.get('#appointment-create-button')
			.should('be.visible')
			.click()
	}

	confirmAppointmentRequest() {
		cy.contains('Prior appointment confirmed')
			.should('be.visible')
	}

	rescheduleAppointmentButton()
	{
		cy.get('#reschedule-appointment-button')
			.should('be.visible')
			.click()
	}

	rescheduleConfirm() {
		cy.contains('Su cita se ha reagendado con éxito.')
			.should('be.visible')
	}

	cancelAppointmentButton() {
		cy.get('#cancel-appointment-button')
			.should('be.visible')
			.click()
	}

	cancelConfirm() {
		cy.contains('Su cita se ha cancelado con éxito.')
			.should('be.visible')
	}

	myDocumentationButton() {
		cy.get('#documentation-appointment-button')
			.should('be.visible')
			.click()
	}


}


export default requestAppointment