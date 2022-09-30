class censusPage {
	elements = {
		add_new_census: () => cy.get("#add-census-button"),
		census_name: () => cy.get("#census-name"),
		census_type: () => cy.get("#census-type"),
		shares_census_type: () => cy.get("#census-type-social-capital"),
		census_description: () => cy.get("#census-description"),
		search_bar: () => cy.get("#undefined-search-input"),
		frist_row_in_census_table: () => cy.get("#census_row_0"),
		manage_participant: () => cy.get('#census-manage-participants-button'),


		//mnager part
		add_participant: () => cy.get('#add-census-participant-button'),
		participant_name: () => cy.get('#participant-name-input'),
		participant_surname: () => cy.get('#participant-surname-input'),
		participant_email: () => cy.get('#participant-email-input'),
		participant_phone: () => cy.get('#participant-phone-input'),
		participant_votes: () => cy.get('#participant-votes-input'),
		participant_shares: () => cy.get('#participant-social-capital-input'),

		total_votes: () => cy.get('#census-total-votes'),
		total_shares: () => cy.get('#census-total-social-capital'),
		


		alert_confirm: () => cy.get('#alert-confirm-button-accept'),
	};

	input_participant_data(name, surname, email, phone, votes, shares) {
		this.elements.participant_name()
			.should('be.visible')
			.clear()
			.type(name)
			.should('have.value', name)
		this.elements.participant_surname()
			.should('be.visible')
			.clear()
			.type(surname)
			.should('have.value', surname)
		this.elements.participant_email()
			.should('be.visible')
			.clear()
			.type(email)
			.should('have.value', email)
		this.elements.participant_phone()
			.should('be.visible')
			.clear()
			.type(phone)
			.should('have.value', phone)
		this.elements.participant_votes()
			.should('be.visible')
			.clear()
			.type(votes)
			.should('have.value', votes)
		this.elements.participant_shares()
			.should('be.visible')
			.clear()
			.type(shares)
			.should('have.value', shares)
	}

	verify_total_votes(total_votes) {
		this.elements.total_votes()
			.should('have.text', total_votes)
	}

	verify_total_shares(total_shares) {
		this.elements.total_shares()
			.should('have.text', total_shares)
	}

	alert_confirm() {
		this.elements.alert_confirm()
			.should('be.visible')
			.click()
	}

	click_add_participant() {
		this.elements.add_participant()
			.should('be.visible')
	}

	click_manage_participants() {
		this.elements.frist_row_in_census_table()
			.should('be.visible')
			.trigger('mouseover')
		this.elements.manage_participant()
			.should('be.visible')
			.click()
	}

	verify_new_census(title) {
		cy.wait(3000)
	 	this.elements.frist_row_in_census_table()
	 		.contains(title)
			.should("be.visible");
	 }
	type_in_search_bar(search) {
		this.elements
			.search_bar()
			.should("be.visible")
			.clear()
			.type(search)
			.should("have.value", search);
		cy.wait(4000)
	}

	type_census_description(description) {
		this.elements
			.census_description()
			.clear()
			.type(description)
			.should("have.value", description);
	}
	select_shares_census_type() {
		this.elements.shares_census_type().click();
	}
	click_on_drop_census_type() {
		this.elements.census_type().click();
	}
	type_census_name(name) {
		this.elements
			.census_name()
			.clear()
			.type(name)
			.should(
				"have.value",
				name
			);
	}
	click_on_add_new_census() {
		this.elements
			.add_new_census()
			.should("be.visible")
			.click();
	}
}

export default censusPage;
