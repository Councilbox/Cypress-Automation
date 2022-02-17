class appointmentsPage {

	addButton() {
		cy.get('#MISSING_ID')
			.should('be.visible')
			.click()
		cy.url().should('include', '/council/')
	}

	enterDescription() {
		cy.get('#council-notice-convene-intro')
			.should('be.visible')
			.clear()
			.type('Test')
			.should('have.value', 'Test')
	}

	nextButtonDetails() {
		cy.get('#council-editor-next')
			.should('be.visible')
			.click()			
	}

	addParticipant() {
		cy.get('#anadirParticipanteEnCensoNewReunion')
			.should('be.visible')
			.click()
		cy.get('#alert-confirm > div.MuiDialog-container.MuiDialog-scrollPaper > div')
			.should('be.visible')
	}

	inputParticipantData() {
		cy.get('#MISSING_ID')
			.should('be.visible')
			.clear()
			.type('Automation')
			.should('have.value', 'Automation')
		cy.get('#MISSING_ID')
			.should('be.visible')
			.clear()
			.type('Test')
			.should('have.value', 'Test')
		cy.get('#MISSING_ID')
			.should('be.visible')
			.clear()
			.type('test@test.test')
			.should('have.value', 'test@test.test')
	}

	nextButtonParticipants() {
		cy.get('#censoSiguienteNew')
			.should(be.visible)
			.click()
	}

	consentsButton() {
		cy.get('#MISSING_ID')
			.should('be.visible')
			.click()
	}

	consentsTitle() {
		cy.get('#agenda-editor-title-input')
			.should('be.visible')
			.clear()
			.type('Test')
			.should('have.value', 'Test')
	}

	nextButtonConsents() {
		cy.get('#ordenDelDiaNext')
			.should('be.visible')
			.click()
	}

	nextButtonDocumentation() {
		cy.get('#attachmentSiguienteNew')
			.should('be.visible')
			.click()
	}

	nextButtonConfiguration() {
		cy.get('#optionsNewSiguiente')
			.should('be.visible')
			.click()
	}

	sendButton() {
		cy.get('#council-editor-convene-notify')
			.should('be.visible')
			.click()
		cy.wait(1000)
	}

	prepareRoomButton() {
		cy.get('#prepararSalaNew')
			.should('be.visible')
			.click()
	}

	openRoomButton() {
		cy.get('#abrirSalaEnReunion')
			.should('be.visible')
			.click()
	}

	startAppointmentButton() {
		cy.get('#start-council-button')
			.should('be.visible')
			.click()
	}




}

export default appointmentsPage