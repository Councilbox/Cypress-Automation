const companyName = "AutomationTesting"
const companyAddress = "Majkl Dzordana 23"
const entityTown = "Cikago"

class entitiesPage {

	institituionButton() {
		cy.get('#MISSING_ID')
			.should('be.visible')
			.click()
	}

	addButton() {
		cy.get('#MISSING_ID')
			.should('be.visible')
			.click()
	}

	enterName() {
		cy.get('#company-name-input')
			.should('be.visible')
			.clear()
			.type(companyName)
			.should('have.value', companyName)
	}

	enterTAXid() {
		cy.get('#company-id-input')
			.should('be.visible')
			.clear()
			.type(Cypress.config('UniqueNumber'))
			.should('have.value', Cypress.config('UniqueNumber'))
	}

	enterEntityAddress() {
		cy.get('#company-address-input')
			.should('be.visible')
			.clear()
			.type(companyAddress)
			.should('have.value', companyAddress)
	}

	enterTownCity() {
		cy.get('#company-city-input')
			.should('be.visible')
			.clear()
			.type(entityTown)
			.should('have.value', entityTown)
	}

	selectProvinceEntity() {
		cy.get('#country-state-select')
			.should('be.visible')
			.click()
		cy.get('#company-country-state-Albacete')
			.click()
		cy.get('#country-state-select')
			.should('have.value', 'Albacete')
	}

	submitEntityAdd() {
		cy.get('#company-add-button')
			.should('be.visible')
			.click()
	}




}


export default entitiesPage