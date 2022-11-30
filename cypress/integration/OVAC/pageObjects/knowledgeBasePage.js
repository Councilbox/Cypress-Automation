let docFile = 'testDocument.txt';

class knowledgeBasePage {

	elements = {
		add_button: () => cy.xpath('//*[@class="MuiButtonBase-root MuiFab-root MuiFab-primary"]'),
		upload_file: () => cy.get('#company-document-upload-file'),
		new_folder: () => cy.get('#company-document-create-folder'),
		title: () => cy.get('#titleDraft'),
		search: () => cy.get('#company-document-search-input'),
		folder_table_row_first: () => cy.xpath('(//*[@class="MuiTableCell-root MuiTableCell-body"])[1]'),
		delete: () => cy.get('#delete-folder-0'),
		delete_file: () => cy.get('#delete-file-0'),
		edit_file: () => cy.get('#edit-file-0'),
		edit: () => cy.get('#edit-folder-0'),
		delete: () => cy.xpath('/html/body/div[4]/div[3]/div/ul/div[2]'),

		value_error: () => cy.xpath('//*[@id="panel-confirm"]/div[3]/div/div/div/div/div/div[2]/div/div/p'),
		code_error: () => cy.xpath('//*[@id="panel-confirm"]/div[3]/div/div/div/div/div/div[1]/div/div/p'),


		//alert
		alert_confirm: () => cy.get('#alert-confirm-button-accept'),

		action_button: () => cy.xpath('//*[@id="root"]/div/div[3]/div/div[2]/div/div/div/div[1]/div/div/div[2]/div/table/tbody/tr/td[5]/div/div/button'),

		actioning: () => cy.get('.ri-more-2-fill'),

		folder_icon: () => cy.get('#dss'),
		download: () => cy.get('#download-file-0'),
	}

	click_add_button() {
		this.elements.add_button()
			.should('be.visible')
			.click()
	}

	download_visible() {
		this.elements.download()
			.should('be.visible')
	}

	open_folder() {
		this.elements.folder_icon()
			.should('be.visible')
			.click()
	}

	action_button_not_exist() {
		this.elements.actioning()
			.should('not.exist')
	}

	verify_code_error() {
		this.elements.code_error()
			.should('be.visible')
	}

	verify_value_error() {
		this.elements.value_error()
			.should('be.visible')
	}

	click_on_delete() {
		this.elements.delete()
			.should('be.visible')
			.click()
	}

	click_on_edit_file() {
		this.elements.edit_file()
			.should('be.visible')
			.click()
	}

	click_on_delete_file() {
		this.elements.delete_file()
			.should('be.visible')
			.click()
	}

	click_on_edit() {
		this.elements.edit()
			.should('be.visible')
			.click()
	}

	click_on_delete() {
		this.elements.delete()
			.should('be.visible')
			.click()
	}

	verify_folder_deleted() {
		this.elements.folder_table_row_first()
			.should('not.exist')
	}

	click_on_action_menu() {
		this.elements.action_button()
			.should('be.visible')
			.click()
	}

	verify_folder(title) {
		cy.wait(2000)
		this.elements.folder_table_row_first()
			.contains(title)
			.should('be.visible')
	}

	click_on_first_folder() {
		this.elements.folder_table_row_first()
			.should('be.visible')
			.click()
			.wait(2000)
	}

	search_for_folder(title) {
		this.elements.search()
			.should('be.visible')
			.clear()
			.type(title)
			.should('have.value', title)
			.wait(2000)
	} 

	click_alert_confirm() {
		this.elements.alert_confirm()
			.should('be.visible')
			.click()
	}

	enter_folder_title(title) {
		this.elements.title()
			.should('be.visible')
			.clear()
			.type(title)
			.should('have.value', title)
	}

	click_on_new_folder() {
		this.elements.new_folder()
			.should('be.visible')
			.click()
	}

	upload_file() {
		cy.get('input[type=file]')
			.attachFile(docFile)
	}
}

export default knowledgeBasePage