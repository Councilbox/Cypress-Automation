class dashboardPage {
	elements = {
		types_of_meetings: () => cy.get("#edit-statutes-block"),
		shareholders_register: () => cy.get("#edit-company-block"),
		institutions_button_on_top_page: () => cy.get("#cbx-header-first-button-left"),
		add_company_button: () => cy.get("#entidadesAddSociedad"),
		link_company: () => cy.get("#company-link-nav-button"),
		list_of_companies: () => cy.get('[class="hoverCompanySelector"]'),
		user_menu: () => cy.get("#cbx-header-third-button-user"),
		company_user_menu: () => cy.get("#user-settings-edit-company"),
		censuses: () => cy.get("#edit-censuses-block"),
		knowledge_base: () => cy.get("#edit-drafts-block"),
		new_meeting: () => cy.get('#create-council-block')
	};
	click_on_knowledge_base() {
		this.elements
			.knowledge_base()
			.should("be.visible")
			.click();
	}

	click_on_new_meeting() {
		this.elements.new_meeting()
			.should('be.visible')
			.click()
		cy.url()
			.should('include', '/council/new')
	}
	click_on_census() {
		this.elements
			.censuses()
			.should("be.visible")
			.click();
	}
	click_on_the_company_user_menu() {
		this.elements.company_user_menu().click({ force: true });
	}
	click_on_the_user_menu() {
		this.elements.user_menu().click();
	}
	click_on_company_from_list_of_companies() {
		this.elements
			.list_of_companies()
			.contains("automationtest")
			.should("be.visible")
			.click();
	}
	click_on_link_company_button() {
		this.elements
			.link_company()
			.should("be.visible")
			.click();
	}
	click_on_add_company_button() {
		this.elements
			.add_company_button()
			.should("be.visible")
			.click();
	}

	click_on_institutions_button_on_top_page() {
		this.elements
			.institutions_button_on_top_page()
			.should("be.visible")
			.click();
	}

	click_on_type_of_meetings() {
		this.elements
			.types_of_meetings()
			.should("be.visible")
			.click();
		cy.url().should("include", "/statutes");
	}

	click_on_shareholders_register() {
		this.elements
			.shareholders_register()
			.should("be.visible")
			.click();
		cy.url().should("include", "/book");
	}
}

export default dashboardPage;
