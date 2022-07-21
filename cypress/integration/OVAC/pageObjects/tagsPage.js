import { Search } from "material-ui-icons"

class tagsPage {

	elements = { 
		add_button: () => cy.xpath('//*[@title="Add tag"]'),
		code: () => cy.get('#company-tag-key'),
		value: () => cy.get('#company-tag-value'),
		alert_confirm: () => cy.get('#alert-confirm-button-accept'),
		save: () => cy.get('#panel-confirm-button-accept'),
		search: () => cy.get('#company-tag-search-input'),
		edit: () => cy.xpath('/html/body/div[4]/div[3]/div/ul/div[1]'),
		action_menu: () => cy.xpath('(//*[@class="MuiButtonBase-root MuiButton-root MuiButton-text"])[1]'),
		tags_table_row_first: () => cy.xpath('//*[@id="root"]/div/div[3]/div/div[2]/div/div/div/div[1]/div/div/div[2]/div[2]/div/table/tbody/tr[1]/td[1]'),	
	
		}

    alert_confirm() {
        this.elements.alert_confirm()
            .should('be.visible')
            .click()
    }

	verify_tag(code) {
		this.elements.tags_table_row_first()
			.contains(code)
			.should('be.visible')
	}

	verify_tag_deleted() {
		this.elements.tags_table_row_first()
			.should('not.exist')
	}

	click_on_action_menu() {
		this.elements.action_menu()
			.should('be.visible')
			.click()
	}

	click_on_edit() {
		this.elements.edit()
			.should('be.visible')
			.click()
	}

	search_for_tag(code) {
		this.elements.search()
			.should('be.visible')
			.clear()
			.type(code)
			.should('have.value', code)
			.wait(2000)
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