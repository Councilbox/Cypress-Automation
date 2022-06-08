class templatesPage {


	elements = { 
		add_button: () => cy.get('#add-procedure-button'),
		new: () => cy.get('#company-document-create-folder'),
		title: () => cy.get('#draft-editor-title'),
		save: () => cy.get('#draft-editor-save'),
	
		}

    click_add_button() {
        this.elements.add_button()
            .should('be.visible')
            .click()
    }

    click_new() {
        this.elements.new()
            .should('be.visible')
            .click()
    }

	enter_title(title) {
		this.elements.title()
			.should('be.visible')
			.clear()
			.type(title)
			.should('have.value', title)
	}

	click_save() {
		this.elements.save()
			.should('be.visible')
			.click()
	}

}


export default templatesPage