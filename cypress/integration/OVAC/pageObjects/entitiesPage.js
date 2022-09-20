
const companyName = "AutomationTesting"
const companyAddress = "Majkl Dzordana 23"
const entityTown = "Cikago"

let docFile = 'testDocument.txt';
let imageFile = 'testimage.png'

class entitiesPage {

	elements = {
		search_for_entity: () => cy.xpath('//*[@id="root"]/div/div[3]/div/div[2]/div/div[1]/div[2]/div/div/div/div[1]/div[2]/div/div/div/div/input'),
		add_button: () => cy.get('#create-company-button'),
		name: () => cy.get('#business-name'),
		tax_id: () => cy.get('#addSociedadCIF'),
		address: () => cy.get('#addSociedadDireccion'),
		town_city: () => cy.get('#addSociedadLocalidad'),
		province: () => cy.get('#country-state-select'),
		institution_search: () => cy.get('#institutions-search-input'), 
		province_option : () => cy.get('[role="menuitem"]').eq(25),
		zip_code: () => cy.get('#addSociedadCP'),
		submit: () => cy.get('#layout-top > div > div:nth-child(2) > div > button'),
		search: () => cy.xpath('//*[@class="MuiInputBase-input MuiInput-input MuiInputBase-inputAdornedStart"]'),
		action_button: () => cy.xpath('(//*[@class="MuiButtonBase-root MuiButton-root MuiButton-text"])[1]'),
		edit_option: () => cy.get('body > div.MuiPopover-root > div.MuiPaper-root.MuiPopover-paper.MuiPaper-elevation8.MuiPaper-rounded > div > ul > div:nth-child(1)'),
		organisation_logo_upload: () => cy.get('input[type=file]'),

		entity_button: () => cy.xpath('//*[@class="ri-government-line"]'),
		see_more_entities: () => cy.xpath('//*[@class="MuiButtonBase-root MuiButton-root MuiButton-contained"]'),
		manage_entity: () => cy.xpath('//*[@id="root"]/div/div[3]/div/div[2]/div/div[1]/div[2]/div/div/div/div[2]/div/div[1]/div/div[1]/div/table/tr[2]/td[4]/div/button'),

		manage_appointment:() => cy.get('#root > div > div:nth-child(3) > div > div:nth-child(2) > div > div:nth-child(1) > div.MuiPaper-root.MuiPaper-elevation0.MuiPaper-rounded > div > div > div > div:nth-child(2) > div > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.MuiGrid-grid-md-12.MuiGrid-grid-lg-12 > div > div:nth-child(1) > table > tr:nth-child(2) > td:nth-child(4) > div > button'),

		entity_name_error: () => cy.xpath('//*[@id="root"]/div/div[3]/div/div[2]/div/div[1]/div[2]/div/div/div[1]/div/div/div/div[1]/div[1]/div[1]/div/div[1]/div/div/p'),
		ban_button: () => cy.xpath('//*[@id="institutions-dropdown-1249"]/div[3]/div/ul/div[2]/div[2]/span'),
		alert_accept: () => cy.get('#alert-confirm-button-accept'),
		delete_button: () => cy.xpath('//*[@id="institutions-dropdown-1108"]/div[3]/div/ul/div[3]/div[2]/span'),
		edit_button: () => cy.xpath('//*[@id="institutions-dropdown-1187"]/div[3]/div/ul/div[1]/div[2]/span'),
		save_entity: () => cy.get('#save-button'),
		next_page: () => cy.xpath('//*[@id="root"]/div/div[3]/div/div[2]/div/div[2]/div/div[1]/div/div/div[2]/div/div/div[2]/div/div[2]/span/i'),

	}


	click_add_button() {
		this.elements.add_button()
			.should('be.visible')
			.click()
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
			.should('have.text', 'Albacete')
		this.elements.zip_code()
			.should('be.visible')
			.clear()
			.type(zip)
			.should('have.value', zip)

	}




}


export default entitiesPage