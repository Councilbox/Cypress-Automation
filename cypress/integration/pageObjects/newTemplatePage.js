class newTemplatePage {
	elements = {
		template_title: () => cy.get("#draft-editor-title"),
		save_button: () => cy.get("#draft-editor-save")
	};
	click_on_save_button() {
		this.elements.save_button().click();
	}
	type_template_title(title) {
		this.elements
			.template_title()
			.clear()
			.type(title);
	}
}
export default newTemplatePage;
