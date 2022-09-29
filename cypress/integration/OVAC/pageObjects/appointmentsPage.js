
let docFile = 'testDocument.txt';

class appointmentsPage {

	elements = {
		add_button: () => cy.get('#appointment-create-button'),
		description: () => cy.get('#council-notice-convene-intro'),
		next_details: () => cy.get('#council-editor-next'),
		search_bar: () => cy.xpath('//*[@id="root"]/div/div[3]/div/div[2]/div/div[2]/div/div[1]/div[2]/div/div/div/input'),
		action_button: () => cy.get('#appointment-menu'),
		action_participant: () => cy.get('#appointment-participants-action-49226'),
		menu_participant: () => cy.xpath('//*[@id="panel-confirm"]/div[3]/div/div/div/div/div/div[1]/div/div/div[2]/div/div[1]/table/tbody/tr/td[6]/button/span[1]/i'),
		edit_participanth: () => cy.xpath('/html/body/div[5]/div[3]/div/ul/div[1]/div[2]/span'),
		participant_table_row: () => cy.xpath('//*[@id="panel-confirm"]/div[3]/div/div/div/div/div/div[1]/div/div/div[2]/div/div[1]/table/tbody/tr/td[1]'),

		add_participant: () => cy.get('#council-add-participant-button'),
		participant_name: () => cy.get('#participant-name'),
		participant_surname: () => cy.get('#participant-surname'),
		participant_dni: () => cy.xpath('(//*[@class="MuiInputBase-input MuiInput-input"])[4]'),
		participant_position: () => cy.get('#participant-position'),
		participant_email: () => cy.get('#participant-email'),
		participant_phone_code: () => cy.get('#participant-phone-code'),
		participant_phone: () => cy.get('#participant-phone'),
		participant_language: () => cy.get('#participant-language'),
		next_participants: () => cy.get('#censoSiguienteNew'),

		reorced_button: () => cy.get('[class="MuiButtonBase-root MuiButton-root MuiButton-contained"]').eq(3),
		add_consents: () => cy.get('#default-page-button'),


		procedure_select: () => cy.get('[class="ant-checkbox-wrapper"]').eq(0),

		save_participant: () => cy.xpath('(//*[@id="panel-confirm-button-accept"])[2]'),

		consents_add_button: () => cy.get('#add-appointment-agenda-point'),
		consents_title: () => cy.get('#agenda-editor-title-input'),
		consents_save: () => cy.get('#panel-confirm-button-accept'),

		next_participants: () => cy.get('#censoSiguienteNew'),

		next_consents: () => cy.get('#ordenDelDiaNext'),

		next_documentation: () => cy.get('#attachmentSiguienteNew'),

		next_configuration: () => cy.get('#optionsNewSiguiente'),

		send_button: () => cy.get('#council-editor-convene-notify'),

		prepare_room: () => cy.get('#prepararSalaNew'),

		open_room: () => cy.get('#abrirSalaEnReunion'),

		start_appointment: () => cy.get('#start-council-button'),

		upload: () => cy.get('#upload-file-participant-button'),


		first_appointment: () => cy.get('#appointment-row-0'),

		accept_modal: () => cy.get('#alert-confirm-button-accept'),

		consents_first: () => cy.xpath('//*[@id="alert-confirm"]/div[3]/div/div[2]/div/div[1]'),
		

	}


	click_on_add_button() {
		this.elements.add_button()
			.should('be.visible')
			.click()
	}

	click_on_reorder() {
		this.elements.reorced_button()
			.should('be.visible')
			.click()
	}

	drag_first_consent() {
		this.elements.consents_first()
			.trigger("mousemove")
			.trigger("mousedown")
	}

	select_procedure() {
		this.elements.procedure_select()
			.click({force:true})
			cy.wait(2000)

	}

	click_on_add_consents() {
		this.elements.add_consents()
			.should('be.visible')
			.click()
	}

	click_on_save_participanth() {
		this.elements.save_participant()
			.should('be.visible')
			.click()
	}

	click_on_edit_participanth() {
		this.elements.edit_participanth()
			.should('be.visible')
			.click()
	}

	verify_participant_is_saved(name) {
		this.elements.participant_table_row()
			.should('contain', name)
	}

	click_on_participants_menu() {
		this.elements.action_participant()
			.should('be.visible')
			.click()
	}

	click_on_menu_participant() {
		this.elements.menu_participant()
			.should('be.visible')
			.click()
	}

	enter_participant_name(name) {
		this.elements.participant_name()
			.should('be.visible')
			.clear()
			.type(name)
			.should('have.value', name)
	}

	click_on_action_menu() {
		this.elements.action_button()
			.should('be.visible')
			.click()
	}
	
	accept_modal() {
		this.elements.accept_modal()
			.should('be.visible')
			.click()
	}

	enter_description(description) {
		this.elements.description()
			.should('be.visible')
			.type(description)
	}

	open_first_appointment() {
		this.elements.first_appointment()
			.should('be.visible')
			.click()
	}

	search_for_participant(name) {
		this.elements.search_bar()
			.should('be.visible')
			.clear()
			.type(name)
			.should('have.value', name)
			.wait(2000)
	}

	click_next_details() {
		this.elements.next_details()
			.should('be.visible')
			.click()		
	}

	click_add_participant_button() {
		this.elements.add_participant()
			.should('be.visible')
			.click()
	}

	enter_participant_data(name, surname, dni, email, phone_code, phone) {
		this.elements.participant_name()
			.should('be.visible')
			.type(name)
			.should('have.value', name)
		this.elements.participant_surname()
			.should('be.visible')
			.type(surname)
			.should('have.value', surname)
		this.elements.participant_dni()
			.should('be.visible')
			.type(dni)
			.should('have.value', dni)
		this.elements.participant_email()
			.should('be.visible')
			.type(email)
			.should('have.value', email)
		this.elements.participant_phone_code()
			.should('be.visible')
			.clear()
			.type(phone_code)
			.should('have.value', phone_code)
		this.elements.participant_phone()
			.should('be.visible')
			.type(phone)
			.should('have.value', phone)
		}

	click_next_participants() {
		this.elements.next_participants()
			.should('be.visible')
			.click()
			.wait(500)
	}

	click_add_consents() {
		this.elements.consents_add_button()
			.should('be.visible')
			.click()
			.wait(500)
	}

	enter_consent_title(consents_title) {
		this.elements.consents_title()
			.should('be.visible')
			.clear()
			.type(consents_title)
			.should('have.value', consents_title)
	}

	click_consent_save_button() {
		this.elements.consents_save()
			.should('be.visible')
			.click()
	}

	click_next_consents() {
		this.elements.next_consents()
			.should('be.visible')
			.click()
			.wait(500)
	}

	click_next_documentation() {
		this.elements.next_documentation()
			.should('be.visible')
			.click()
			.wait(500)
	}

	click_next_configuration() {
		this.elements.next_configuration()
			.should('be.visible')
			.click()
	}

	click_send() {
		this.elements.send_button()
			.should('be.visible')
			.click()
		cy.wait(1000)
	}

	click_prepare_room() {
		cy.wait(1000)
		this.elements.prepare_room()
			.should('be.visible')
			.click()
	}

	click_open_room() {
		this.elements.open_room()
			.should('be.visible')
			.click()
	}

	click_start_appointment() {
		this.elements.start_appointment()
			.should('be.visible')
			.click()
	}

	upload_document() {
		this.elements.upload()
			.attachFile(docFile)
	}

}

export default appointmentsPage