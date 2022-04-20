const companyName = "AutomationTesting"
const companyAddress = "Majkl Dzordana 23"
const entityTown = "Cikago"

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
	}


	click_add_button() {
		this.elements.add_button()
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

	enter_TAX_id(tax_id) {
		this.elements.tax_id()
			.should('be.visible')
			.clear()
			.type(tax_id)
			.should('have.value', tax_id)
	}

	enter_entity_address() {
		this.elements.address()
			.should('be.visible')
			.clear()
			.type(companyAddress)
			.should('have.value', companyAddress)
	}

	enter_town_city() {
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
		this.elements.province
			.should('have.value', 'Albacete')
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