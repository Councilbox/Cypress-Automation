class tagsPage {

	elements = { 
		add_button: () => cy.xpath('//*[@title="Add tag"]'),
		code: () => cy.get('#company-tag-key'),
		value: () => cy.get('#company-tag-value'),
		alert_confirm: () => cy.get('#alert-confirm-button-accept'),
		save: () => cy.get('#panel-confirm-button-accept')
	
	
		}

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

	click_save() {
		this.elements.save()
			.should('be.visible')
			.click()
	}
}


export default tagsPage