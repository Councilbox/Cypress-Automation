class knowledgeBase {
	elements = {
		my_docs_menu: () => cy.get("#company-documents-drowpdown"),
		templates: () => cy.get("#tab-1"),
		new_template_button: () => cy.get("#draft-create-button")
	};
	click_on_new_template_button() {
		this.elements.new_template_button().click();
	}
	click_on_templates() {
		this.elements.templates().click();
	}
	attach_new_file(docFile) {
		this.elements.my_docs_menu().attachFile(docFile);
	}

	click_on_my_docs_menu() {
		this.elements.my_docs_menu().click();
	}
}

export default knowledgeBase;
