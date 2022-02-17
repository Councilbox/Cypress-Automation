class knowledgeBasePage {

	myDocsDropMenu() {
		cy.get('#company-documents-drowpdown')
			.should('be.visible')
			.click()
	}

	uploadFile() {
		cy.get('#company-document-upload-file')
			.should('be.visible')
		const docFile = 'testDocument.txt';
        cy.get('#upload-file-participant-button').attachFile(docFile)
	}

	templatesTab() {
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

	templateTitle() {
		cy.get('#draft-editor-title')
			.should('be.visible')
			.clear()
			.type('Test')
			.should('have.value', 'Test')
	}

	templateSaveButton() {
		cy.get('#draft-editor-save')
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

export default knowledgeBasePage