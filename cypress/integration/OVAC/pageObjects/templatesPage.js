class templatesPage {


	elements = { 
		add_button: () => cy.get('#add-procedure-button'),
		new: () => cy.get('#company-document-create-folder').eq(0),
		title: () => cy.get('#draft-editor-title'),
		save: () => cy.get('#draft-editor-save'),
		title_error: () => cy.xpath('//*[@id="root"]/div/div[3]/div/div[2]/div/div[1]/div[2]/div/div/div/div[1]/div/div[1]/div/div/div/div/div[1]/div[2]/span'),
		next_page_button: () => cy.get('.ri-arrow-right-s-line'),
		search: () => cy.get('#company-document-search-input'),
		action_menu: () => cy.get('[class="ri-more-2-fill"]'),
		action_options: () => cy.xpath('//*[@class="MuiList-root MuiList-padding"]'),	
		alert_confirm: () => cy.get('#alert-confirm-button-accept'),
		template_table_row: () => cy.get('[class="MuiTableRow-root cursor-pointer MuiTableRow-hover"]'),
		procedure_type_filter: () => cy.get('#procedure-type-filter').eq(0)
		}

    click_add_button() {
        this.elements.add_button()
            .should('be.visible')
            .click()
    }

	search_for_procedure(procedure) {
		this.elements.procedure_type_filter()
			.should('be.visible')
			.clear()
			.type(procedure)
			.should('have.value', procedure)
			.wait(1000)
	}

	verify_template() {
		this.elements.template_table_row()
			.should('be.visible')
	}

	verify_template_deleted() {
		cy.wait(1000)
		this.elements.template_table_row()
			.should('not.exist')
	}

	alert_confirm() {
		this.elements.alert_confirm()
			.should('be.visible')
			.click()
	}

	select_action_option(option) {
		this.elements.action_options()
			.contains(option)
			.should('be.visible')
			.click()
	}

	click_on_action_menu() {
		this.elements.action_menu()
			.should('be.visible')
			.click()
	}

	search_for_template(title) {
		this.elements.search()
			.should('be.visible')
			.clear()
			.type(title)
			.should('have.value', title)
			.wait(1000)
	}

	click_next_page() {
		this.elements.next_page_button()
			.scrollIntoView()
			.should('be.visible')
			.click()
	}

    click_new() {
        this.elements.new()
            .should('be.visible')
            .click()
    }

	verify_title_error() {
		this.elements.title_error()
			.should('be.visible')
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