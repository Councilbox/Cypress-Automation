class addCompanyPage {
	elements = {
		business_name: () => cy.get("#company-name-input"),
		tin_organization: () => cy.get("#company-id-input"),
		company_domain: () => cy.get("#company-domain-input"),
		master_code: () => cy.get("#company-key-input"),
		company_address: () => cy.get("#company-address-input"),
		company_town: () => cy.get("#company-city-input"),
		company_country: () => cy.get("#company-country-select"),
		portugal_language: () => cy.get("#company-country-Portugal"),
		company_zip_code: () => cy.get("#company-zipcode-input"),
		membership_code: () => cy.get("#company-code-input"),
		tin_comapny_link: () => cy.get("#company-link-cif"),
		master_code_company_link: () => cy.get("#company-link-key"),
		company_link_button: () => cy.get("#company-link-button"),
		unlink_button: () => cy.get("#company-unlink-button"),
		ok_button_unlink_window: () => cy.get("#unlink-modal-button-accept")
	};
	click_on_ok_button_unlink_window() {
		this.elements.ok_button_unlink_window().click();
	}

	click_on_unlink_button() {
		this.elements
			.unlink_button()
			.should("be.visible")
			.click();
	}

	click_on_company_link_button() {
		this.elements
			.company_link_button()
			.should("be.visible")
			.click();
	}

	type_master_code_company_link(masterCode) {
		this.elements
			.master_code_company_link()
			.clear()
			.type(masterCode)
			.should("have.value", masterCode);
	}
	type_tin_company_link(tinCompany) {
		this.elements
			.tin_comapny_link()
			.clear()
			.type(tinCompany)
			.should("have.value", tinCompany);
	}

	type_membership_code(membership) {
		this.elements
			.membership_code()
			.should("be.visible")
			.clear()
			.type(membership);
	}

	type_company_zip_code(zip) {
		this.elements
			.company_zip_code()
			.should("be.visible")
			.clear()
			.type(zip);
	}
	select_portugal_language() {
		this.elements.portugal_language().click();
	}
	click_on_country_drop_menu() {
		this.elements.company_country().click();
	}
	type_company_town(town) {
		this.elements
			.company_town()
			.should("be.visible")
			.clear()
			.type(town);
	}
	type_company_address(address) {
		this.elements
			.company_address()
			.should("be.visible")
			.clear()
			.type(address);
	}
	type_master_code(master) {
		this.elements
			.master_code()
			.should("be.visible")
			.clear()
			.type(master);
	}
	type_company_domain(domain) {
		this.elements
			.company_domain()
			.should("be.visible")
			.clear()
			.type(domain);
	}
	type_tin_organization(tin) {
		this.elements
			.tin_organization()
			.should("be.visible")
			.clear()
			.type(tin);
	}

	type_business_name(name) {
		this.elements
			.business_name()
			.should("be.visible")
			.clear()
			.type(name);
	}
}
export default addCompanyPage;
