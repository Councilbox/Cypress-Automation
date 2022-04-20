class knowledgeBasePage {

	elements = {
		add_button: () => cy.get('#add-procedure-button'),
		upload_file: () => cy.get('#company-document-upload-file'),
	}

	click_add_button() {
		this.elements.add_button
			.should('be.visible')
			.click()
	}

	upload_file() {
		this.elements.upload_file()
			.should('be.visible')
		const docFile = 'testDocument.txt';
        cy.get('#upload-file-participant-button').attachFile(docFile)
	}
}

export default knowledgeBasePage