
const companyName = "AutomationTesting"
const companyAddress = "Majkl Dzordana 23"
const entityTown = "Cikago"

let docFile = 'testDocument.txt';
let imageFile = 'almir.png'

class entitiesPage {

	elements = {
		search_for_entity: () => cy.xpath('//*[@id="institutions-search-input"]'),
		add_button: () => cy.get('#create-company-button'),
		name: () => cy.get('#business-name'),
		tax_id: () => cy.get('#addSociedadCIF'),
		address: () => cy.get('#addSociedadDireccion'),
		town_city: () => cy.get('#addSociedadLocalidad'),
		province: () => cy.get('#country-state-select'),
		institution_search: () => cy.get('#institutions-search-input'), 
		contact_email: () => cy.xpath('(//*[@class="MuiInputBase-input MuiInput-input"])[3]'),
		province_option : () => cy.get('[role="menuitem"]').eq(25),
		zip_code: () => cy.get('#addSociedadCP'),
		submit: () => cy.get('#layout-top > div > div:nth-child(2) > div > button'),
		search: () => cy.xpath('//*[@class="MuiInputBase-input MuiInput-input MuiInputBase-inputAdornedStart"]'),
		action_button: () => cy.xpath('(//*[@class="MuiButtonBase-root MuiButton-root MuiButton-text"])[1]'),
		edit_option: () => cy.get('body > div.MuiPopover-root > div.MuiPaper-root.MuiPopover-paper.MuiPaper-elevation8.MuiPaper-rounded > div > ul > div:nth-child(1)'),
		organisation_logo_upload: () => cy.get('input[type=file]'),

		entity_button: () => cy.xpath('//*[@class="ri-government-line"]'),
		see_more_entities: () => cy.xpath('//*[@class="MuiButtonBase-root MuiButton-root MuiButton-contained"]'),
		manage_entity: () => cy.get('.MuiButton-contained').last(),

		manage_appointment:() => cy.get('#root > div > div:nth-child(3) > div > div:nth-child(2) > div > div:nth-child(1) > div.MuiPaper-root.MuiPaper-elevation0.MuiPaper-rounded > div > div > div > div:nth-child(2) > div > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.MuiGrid-grid-md-12.MuiGrid-grid-lg-12 > div > div:nth-child(1) > div > table > tr:nth-child(2) > td:nth-child(4) > div > button > span.MuiButton-label'),

		entity_name_error: () => cy.get('[class="MuiFormHelperText-root error-text Mui-error"]'),
		ban_button: () => cy.get('[class="MuiButtonBase-root MuiListItem-root MuiListItem-gutters MuiListItem-button"]').contains('Ban'),
		alert_accept: () => cy.get('#alert-confirm-button-accept'),
		delete_button: () => cy.get('[class="MuiButtonBase-root MuiListItem-root MuiListItem-gutters MuiListItem-button"]').contains('Delete'),
		edit_button: () => cy.get('[class="MuiButtonBase-root MuiListItem-root MuiListItem-gutters MuiListItem-button"]').contains('Edit'),
		save_entity: () => cy.get('[class="MuiButtonBase-root MuiButton-root MuiButton-text"]'),
		next_page: () => cy.get('.ri-arrow-right-s-line'),
		current_entity: () => cy.get('[class="MuiButtonBase-root MuiListItem-root MuiMenuItem-root Mui-selected MuiMenuItem-gutters MuiListItem-gutters MuiListItem-button Mui-selected"]'),
		all_entity: () => cy.get('.ri-government-line'),

		main_language: () => cy.get('#company-language-select'),
		select_language: () => cy.get('[class="MuiList-root MuiMenu-list MuiList-padding"]'),

		all_types: () => cy.get('#entity-categories-select'),
		types_list: () => cy.get('[class="MuiPaper-root MuiMenu-paper MuiPopover-paper MuiPaper-elevation8 MuiPaper-rounded"]'),

		save_on_entity: () => cy.get('[class="MuiButtonBase-root MuiButton-root MuiButton-text"]').eq(0),
	}


	click_add_button() {
		this.elements.add_button()
			.should('be.visible')
			.click()
	}

	verify_types() {
		this.elements.types_list()
			.should('be.visible')
	}

	saving() {
		this.elements.save_on_entity()
			.should('be.visible')
			.click()
	}

	click_on_all_entites_filter() {
		this.elements.all_types()
			.should('be.visible')
			.click()
	}

	verify_language(language) {
		this.elements.main_language()
			.should('have.text', language)
	}

	select_company_language(language) {
		this.elements.main_language()
			.should('be.visible')
			.click()
		this.elements.select_language()
			.contains(language)
			.should('be.visible')
			.click()
	}

	enter_contact_email(contact_email) {
		this.elements.contact_email()
			.should('be.visible')
			.clear()
			.type(contact_email)
			.should('have.value', contact_email)
	}

	new_entity_switch(name) {
		this.elements.current_entity().then(($btn) => {
			if($btn.text().includes(name)) {
				this.elements.all_entity()
					.click()
			} else {
				cy.wait(1000)
				this.elements.see_more_entities()
					.click()
				this.elements.search_for_entity()
					.should('be.visible')
					.clear()
					.type(name)
					.should('have.value', name)
				cy.wait(5000)
				this.elements.manage_entity()
					.should('be.visible')
					.click()
					.wait(10000)
			}

		})
	}

	if_entity() {
		this.elements.current_entity().then(($btn) => {
			if($btn.text().includes('OVAC DEMO')) {
				this.elements.all_entity()
					.click()
			} else {
				cy.wait(1000)
				this.elements.see_more_entities()
					.click()
				this.elements.search_for_entity()
					.should('be.visible')
					.clear()
					.type('OVAC DEMO')
					.should('have.value', 'OVAC DEMO')
					.wait(3000)
				this.elements.manage_entity()
					.should('be.visible')
					.click()
					.wait(10000)
			}

		})
	}

	go_to_next_page() {
		this.elements.next_page()
			.scrollIntoView()
			.should('be.visible')
			.click()
	}

	click_on_save() {
		this.elements.save_entity()
			.should('be.visible')
			.click()
	}

	click_on_edit() {
		this.elements.edit_button()
			.should('be.visible')
			.click()
	}

	verify_name_error() {
		this.elements.entity_name_error()
			.should('be.visible')
	}

	verify_name(name) {
		this.elements.name()
			.should('have.value', name)
	}

	verify_contact_email(contact_email) {
		this.elements.contact_email()
			.should('have.value', contact_email)
	}

	verify_tax(tax) {
		this.elements.tax_id()
			.should('have.value', tax)
	}

	click_on_delete() {
		this.elements.delete_button()
			.should('be.visible')
			.click()
	}

	click_alert_accept() {
		this.elements.alert_accept()
			.should('be.visible')
			.click()
	}

	click_on_ban() {
		this.elements.ban_button()
			.should('be.visible')
			.click()
	}

	search_for_inst(name) {
		this.elements.institution_search()
			.should('be.visible')
			.clear()
			.type(name)
			.should('have.value', name)
			.wait(2000)
	}
	
	click_on_manage() {
		this.elements.manage_entity()
			.should('be.visible')
			.click()
	}

	search_for_entity(entity) {
		this.elements.search_for_entity()
			.should('be.visible')
			.clear()
			.type(entity)
			.should('have.value', entity)
	}

	click_manage_appointments() {
		this.elements.manage_appointment()
			.should('be.visible')
			.click()
			.wait(3000)
	}

	click_on_see_more_entites() {
		this.elements.see_more_entities()
			.should('be.visible')
			.click()
		cy.url()
			.should('include', '/myCompanies')
	}

	click_on_entity() {
		cy.wait(3000)
		this.elements.entity_button()
			.should('be.visible')
			.click()
	}

	upload_organisation_logo() {
        this.elements.organisation_logo_upload()
			.attachFile(imageFile)
	}

	click_action_button() {
		cy.wait(1000)
		this.elements.action_button()
			.should('be.visible')
			.click()
	}

	click_edit_option() {
		this.elements.edit_option()
			.should('be.visible')
			.click()
		cy.url().should('include', '/edit/')
	}

	search_for_institution(name) {
		this.elements.search()
			.should('be.visible')
			.type(name)
	}

	enter_name(name) {
		this.elements.name()
			.should('be.visible')
			.clear()
			.type(name)
			.should('have.value', name)
	}

	enter_TAX_id(tax_id) {
		this.elements.tax_id()
			.should('be.visible')
			.clear()
			.type(tax_id)
			.should('have.value', tax_id)
	}

	enter_entity_address(companyAddress) {
		this.elements.address()
			.should('be.visible')
			.clear()
			.type(companyAddress)
			.should('have.value', companyAddress)
	}

	enter_town_city(town) {
		this.elements.town_city()
			.should('be.visible')
			.clear()
			.type(town)
			.should('have.value', town)
	}

	select_province_entity() {
		this.elements.province()
			.should('be.visible')
			.click()
		this.elements.province_option()
			.click()
	}

	enter_zip_code(zip) {
		this.elements.zip_code()
			.should('be.visible')
			.clear()
			.type(zip)
			.should('have.value', zip)
	}

	click_submit_entity() {
		this.elements.submit()
			.should('be.visible')
			.click()
	}

	populate_all_fields(name, tax_id, companyAddress, town, zip) {
		this.elements.name()
			.should('be.visible')
			.clear()
			.type(name)
			.should('have.value', name)
		this.elements.tax_id()
			.should('be.visible')
			.clear()
			.type(tax_id)
			.should('have.value', tax_id)
		this.elements.address()
			.should('be.visible')
			.clear()
			.type(companyAddress)
			.should('have.value', companyAddress)
		this.elements.town_city()
			.should('be.visible')
			.clear()
			.type(town)
			.should('have.value', town)
		this.elements.province()
			.should('be.visible')
			.click()
		this.elements.province_option()
			.click()
		this.elements.province()
			.should('have.text', 'Ceuta')
		this.elements.zip_code()
			.should('be.visible')
			.clear()
			.type(zip)
			.should('have.value', zip)

	}




}


export default entitiesPage