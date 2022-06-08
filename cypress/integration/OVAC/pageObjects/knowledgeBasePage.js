let docFile = 'testDocument.txt';

class knowledgeBasePage {

	elements = {
		add_button: () => cy.xpath('//*[@class="MuiButtonBase-root MuiFab-root MuiFab-primary"]'),
		upload_file: () => cy.get('#company-document-upload-file'),
	}

	click_add_button() {
		this.elements.add_button()
			.should('be.visible')
			.click()
	}

	upload_file() {
		this.elements.upload_file()
			.attachFile(docFile)
	}
}

export default knowledgeBasePage