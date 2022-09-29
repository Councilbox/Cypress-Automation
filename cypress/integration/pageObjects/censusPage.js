class censusPage {
	elements = {
		add_new_census: () => cy.get("#add-census-button"),
		census_name: () => cy.get("#census-name"),
		census_type: () => cy.get("#census-type"),
		shares_census_type: () => cy.get("#census-type-social-capital"),
		census_description: () => cy.get("#census-description"),
		search_bar: () => cy.get("#undefined-search-input"),
		frist_row_in_census_table: () => cy.get("#census_row_0")
	};
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
