elements = { 
	add_button: () => cy.get('#company-tag-add-button'),
    code: () => cy.get('#company-tag-key'),
    value: () => cy.get('#company-tag-value'),
    alert_confirm: () => cy.get('#alert-confirm-button-accept'),


	}

class tagsPage {

    alert_confirm() {
        this.elements.alert_confirm()
            .should('be.visible')
            .click()
    }

	click_add_button() {
		this.elements.add_button()
			.should('be.visible')
			.click()
	}

	enter_code(code) {
		this.elements.code()
			.should('be.visible')
			.clear()
			.type(code)
			.should('have.value', code)
	}

	enter_value(value) {
		this.elements.value()
			.should('be.visible')
			.clear()
			.type(value)
			.should('have.value', value)
	}
}


export default tagsPage