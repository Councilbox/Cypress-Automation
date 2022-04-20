elements = { 
	add_button: () => cy.get('#add-procedure-button'),
    new: () => cy.get('#company-document-create-folder'),
    title: () => cy.get('#draft-editor-title'),
	save: () => cy.get('#draft-editor-save'),

	}

class templatesPage {

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

	templates_tab() {
		cy.get('#tab-1')
			.should('be.visible')
			.click()
		cy.url().should('include', '/drafts')
	}

	newTemplateButton() {
		cy.get('#draft-create-button')
			.should('be.visible')
			.click()
		cy.url().should('include', '/draft/new')
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
		cy.url().should('include', '/drafts/drafts')
	}

	tagsTab() {
		cy.get('#tab-2')
			.should('be.visible')
			.click()
		cy.url().should('include', '/tags')
	}

	addTagButton() {
		cy.get('#company-tag-add-button')
			.should('be.visible')
			.click()
	}

	tagCode() {
		cy.get('#company-tag-key')
			.should('be.visible')
			.clear()
			.type('12345')
			.should('have.value', '12345')
	}

	tagValue() {
		cy.get('#company-tag-value')
			.should('be.visible')
			.clear()
			.type('321')
			.should('have.value', '321')
	}

	searchDocumentation() {
		cy.get('#company-document-search-input')
			.should('be.visible')
			.clear()
			.type('Test document')
			.should('have.value', 'Test document')
	}

	downloadDocument() {
		cy.get('#download-file-0')
			.should('be.visible')
			.click()
	}
	


}


export default templatesPage