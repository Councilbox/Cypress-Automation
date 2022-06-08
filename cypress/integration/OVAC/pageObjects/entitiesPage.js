import { capitalize } from "lodash"

const companyName = "AutomationTesting"
const companyAddress = "Majkl Dzordana 23"
const entityTown = "Cikago"

let docFile = 'testDocument.txt';

class entitiesPage {

	elements = {
		add_button: () => cy.get('#create-company-button'),
		name: () => cy.get('#company-name-input'),
		tax_id: () => cy.get('#company-id-input'),
		address: () => cy.get('#company-address-input'),
		town_city: () => cy.get('#company-city-input'),
		province: () => cy.get('#country-state-select'),
		province_option : () => cy.get('#company-country-state-Albacete'),
		zip_code: () => cy.get('#company-zipcode-input'),
		submit: () => cy.get('#company-add-button'),
		search: () => cy.xpath('//*[@class="MuiInputBase-input MuiInput-input MuiInputBase-inputAdornedStart"]'),
		action_button: () => cy.xpath('(//*[@class="MuiButtonBase-root MuiButton-root MuiButton-text"])[1]'),
		edit_option: () => cy.get('body > div.MuiPopover-root > div.MuiPaper-root.MuiPopover-paper.MuiPaper-elevation8.MuiPaper-rounded > div > ul > div:nth-child(1)'),
		organisation_logo_upload: () => cy.get('#root > div > div:nth-child(3) > div > div:nth-child(2) > div > div > div:nth-child(1) > div.MuiPaper-root.MuiPaper-elevation0.MuiPaper-rounded > div > div > div:nth-child(1) > div > div > div:nth-child(1) > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.MuiGrid-grid-md-3.MuiGrid-grid-lg-3 > div:nth-child(2) > label > span'),

	}


	click_add_button() {
		this.elements.add_button()
			.should('be.visible')
			.click()
	}

	upload_organisation_logo() {
        this.elements.organisation_logo_upload()
			.attachFile(docFile)
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
		this.elements.province()
			.should('have.text', 'Albacete')
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




}


export default entitiesPage