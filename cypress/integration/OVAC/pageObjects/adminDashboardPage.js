
class adminDashboard {

	elements = {
		appointments: () => cy.get('#council-link'),
		procedures: () => cy.get('#procedures-link'),
		templates: () => cy.get('#draft-link'),
		tags: () => cy.get('#tags-link'),
		documentation: () => cy.get('#documentation-link'),
		users: () => cy.get('#user-link'),
		institutions: () => cy.get('#companies-link'),
		dashboard: () => cy.get('#dashboard-link'),

		user_icon: () =>cy.get('.ri-user-3-line'),
		logout: () => cy.get('#user-menu-logout'),

		government: () => cy.xpath('//*[@class="ri-government-line"]'),

		institution_option: () => cy.xpath('//*[@title="OVAC Demo"]'),
		month_back: () => cy.get('.ri-arrow-left-s-line'),







		//dashboard

		institutions_dropmenu: () => cy.get('#company-entities-filter'),
		procedures_filter: () => cy.get('#procedures-filter'),

	}

	click_on_dashboard() {
		this.elements.dashboard()
			.should('be.visible')
			.click()
		cy.url()
			.should('include', '/dashboard')
	}

	click_on_month_back() {
		this.elements.month_back()
			.should('be.visible')
			.click()
	}

	click_on_institituions_dropmenu() {
		this.elements.institutions_dropmenu()
			.should('be.visible')
			.click()
	}

	click_on_procedures_filter() {
		this.elements.procedures_filter()
			.should('be.visible')
			.click()
	}

	click_on_appointments() {
		this.elements.appointments()
			.should('be.visible')
			.click()
	}

	click_on_government() {
		this.elements.government()
			.should('be.visible')
			.click()
	}

	select_institution() {
		this.elements.institution_option()
			.should('be.visible')
			.click({force:true})
			.wait(1000)
	}

	click_user_icon() {
		this.elements.user_icon()
			.should('be.visible')
			.click()
	}

	click_logout() {
		this.elements.logout()
			.should('be.visible')
			.click()
	}

	confirm_logout() {
		cy.url().should('include', '/admin')
	}

	click_on_istitutions() {
		this.elements.institutions()
			.should('be.visible')
			.click()
		cy.url()
			.should('include', '/companies')		
	}

	click_on_procedures() {
		this.elements.procedures()
			.should('be.visible')
			.click()
		cy.url()
			.should('include', '/procedures')	
	}

	click_on_templates() {
		this.elements.templates()
			.should('be.visible')
			.click()
		cy.url()
			.should('include', '/drafts')
	}

	click_on_tags() {
		this.elements.tags()
			.should('be.visible')
			.click()
		cy.url()
			.should('include', '/tags')	
	}

	click_on_documentation() {
		this.elements.documentation()
			.should('be.visible')
			.click()
	}

	click_on_users() {
		this.elements.users()
			.should('be.visible')
			.click()
	}


}

export default adminDashboard