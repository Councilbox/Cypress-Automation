class documentationPage {

	elements = {
		search_field: () => cy.get('#company-document-search-input'),
		download_button: () => cy.get('#download-file-0'),
	}

	search_documentation(search_data) {
		this.elements.search_field()
			.should('be.visible')
			.clear()
			.type(search_data)
			.should('have.value', search_data)
            .wait(1000)
	}

	click_download() {
		this.elements.download_button()
			.should('be.visible')
			.click()
	}

    verify_download() {
        cy.verifyDownload('Test document1.pdf')
    }
	
}

export default documentationPage