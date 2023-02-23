let docFile = 'qaengineers.txt';


class knowledgeBasePage {

	elements = {

		knowledge_base: () => cy.get('#edit-drafts-block'),
        //documentation
        my_docs: () => cy.get('#company-documents-drowpdown'),
        new_folder: () => cy.get('#company-document-create-folder'),
        folder_title: () => cy.get('#create-folder-name'),
        edit_button: () => cy.get('#edit-folder-0'),
        delete_button: () => cy.get('#delete-folder-0'),
        folder_title_draft: () => cy.get('#titleDraft'),
        documentation_search: () => cy.get('#company-document-search-input'),
        documentation_table_row_first_item: () => cy.get('#folder-0'),
        upload_file: () => cy.get('input[type=file]'),
        delete_file: () => cy.get('#delete-file-0'),
        file_table_row: () => cy.get('#file-0'),

        //modal
        modal_title: () => cy.get('#modal-title'),
        discard_changes: () => cy.get('#unsaved-changes-discard'),
        unsaved_changes: () => cy.xpath('//*[@id="unsaved-changes-modal"]/div[2]/div[2]'),

        //alert
        alert_accept: () => cy.get('#alert-confirm-button-accept'),
        alert_cancel: () => cy.get('#alert-confirm-button-cancel'),
        //templates
        templates_tab: () => cy.get('#tab-1'),
        search_templates: () => cy.get('#drafts-search-input'),
        new_template_button: () => cy.get('#draft-create-button'),
        template_title: () => cy.get('#draft-editor-title'),
        save_template: () => cy.get('#draft-editor-save'),
        back_template: () => cy.get('#draft-editor-back'),
        download_template_button: () => cy.get('#drafts-download-organization-drafts'),
        templates_checkbox: () => cy.get('#delete-checkbox-0'),
        download_to_drafts_button: () => cy.get('#download-platform-drafts-button'),
        templates_table_row_first: () => cy.get('#participant-row-0'),
        templates_delete_button: () => cy.get('#delete-draft-0'),
        templates_edit_button: () => cy.get('#edit-draft-0'),
        templates_filter: () => cy.get('#drafts-tag-filter-selector'),
        search_tags: () => cy.get('#tag-search-input'),
        searched_tag: () => cy.get('#add-tag-statute_2531'),

        //tags
        tags_tab: () => cy.get('#tab-2'),
        add_tag: () => cy.get('#company-tag-add-button'),
        tag_value: () => cy.get('#company-tag-value'),
        tag_code: () => cy.get('#company-tag-key'),
        tags_table_row_first: () => cy.get('#tag-0'),
        tags_edit_button: () => cy.get('#tag-0-edit-button'),
        tags_search: () => cy.get('#company-tag-search-input'),
        tags_description: () => cy.get('#company-tag-description'),
        tags_delete_button: () => cy.get('#tag-0-delete-icon'),


	}

	click_on_knowledge_base() {
        this.elements.knowledge_base()
            .should('be.visible')
            .click()
        cy.url()
            .should('include', 'drafts/documentation')
    }

    delete_file() {
        this.elements.delete_file()
            .should('be.visible')
            .click()
        this.elements.alert_accept()
            .should('be.visible')
            .click()
    }

    search_for_tag(code) {
        this.elements.tags_search()
            .should('be.visible')
            .clear()
            .type(code)
            .should('have.value', code)
            .wait(2000)
    }

    verify_tag_is_deleted(code) {
        this.elements.tags_table_row_first()
            .should('not.exist')
    }

    enter_tag_value(value) {
        this.elements.tag_value()
            .should('be.visible')
            .clear()
            .type(value)
            .should('have.value', value)
    }

    upload_file() {
        this.elements.upload_file()
            .attachFile(docFile)
            .wait(5000)
    }

    verify_existing_tag(code) {
        this.elements.tags_table_row_first()
            .contains(code)
            .should('be.visible')
    }

    enter_tag_code(code) {
        this.elements.tag_code()
            .should('be.visible')
            .clear()
            .type(code)
            .should('have.value', code)
    }

    click_on_add_tag() {
        this.elements.add_tag() 
            .should('be.visible')
            .click()
    }

    verify_template_is_deleted() {
        this.elements.templates_table_row_first()
            .should('not.exist')
    }

    verify_file_is_deleted() {
        this.elements.file_table_row()
            .should('not.exist')
    }

    search_for_template(title) {
        this.elements.search_templates()
            .should('be.visible')
            .clear()
            .type(title)
            .should('have.value', title)
            .wait(2000)
    }

    verify_downloaded_template(template) {
        this.elements.templates_table_row_first()
            .contains(template)
            .should('be.visible')
    }

    verify_unsaved_changes_modal(unsaved_changes) {
        this.elements.unsaved_changes()
            .should('have.text', unsaved_changes)
    }

    verify_folder_is_deleted() {
        this.elements.documentation_table_row_first_item()
            .should('not.exist')
    }

    search_for_documentation(title) {
        this.elements.documentation_search()
            .should('be.visible')
            .clear()
            .type(title)
            .should('have.value', title)
            .wait(2000)
    }

    verify_existing_documentation(title) {
        this.elements.documentation_table_row_first_item()
            .contains(title)
            .should('be.visible')
    }

    verify_existing_file(title) {
        this.elements.file_table_row()
            .contains(title)
            .should('be.visible')
    }

    click_on_discard_changes() {
        this.elements.discard_changes()
            .should('be.visible')
            .click()
    }

    click_on_tags_delete_button() {
        this.elements.tags_delete_button()
            .should('be.visible')
            .click()
    }

    click_on_alert_cancel() {
        this.elements.alert_cancel()
            .should('be.visible')
            .click()
    }

    click_on_templates_edit_button() {
        this.elements.templates_edit_button()
            .should('be.visible')
            .click()
    }

    enter_tag_description(description) {
        this.elements.tags_description()
            .should('be.visible')
            .clear()
            .type(description)
            .should('have.value', description)
    }

    click_on_tags_edit_button() {
        this.elements.tags_edit_button()
            .should('be.visible')
            .click()
    }

    mouseover_on_tag_table_row_first_item() {
        this.elements.tags_table_row_first()
            .should('be.visible')
            .trigger('mouseover')
    }

    click_on_searched_tag(searched) {
        this.elements.searched_tag()
            .contains(searched)
            .should('be.visible')
            .click()
    }

    verify_modal_over_modal_title(title) {
        this.elements.modal_title()
            .first()
            .should('be.visible')
            .should('have.text', title)
    }

    click_on_tags_tab() {
        this.elements.tags_tab()
            .should('be.visible')
            .click()
        cy.url()
            .should('include', '/tags')
    }

    search_for_tags(search) {
        this.elements.search_tags()
            .should('be.visible')
            .clear()
            .type(search)
            .should('have.value', search)
            .wait(1000)
    }

    click_on_templates_filter_by() {
        this.elements.templates_filter()
            .should('be.visible')
            .click()
    }

    click_on_templates_delete_button() {
        this.elements.templates_delete_button()
            .should('be.visible')
            .click()
    }

    click_on_download_template_to_drafts() {
        this.elements.download_to_drafts_button()
            .should('be.visible')
            .click()
    }

    mouseover_on_templates_table_row_first_item() {
        this.elements.templates_table_row_first()
            .should('be.visible')
            .trigger('mouseover')
    }

    click_on_templates_checkbox() {
        this.elements.templates_checkbox()
            .check()
            .should('be.checked')
    }

    click_on_download_template() {
        this.elements.download_template_button()
            .should('be.visible')
            .click()
        cy.url()
            .should('include', '/platform/drafts/')
    }

    click_on_back_template() {
        this.elements.back_template()
            .should('be.visible')
            .click()
    }

    click_on_save_template() {
        this.elements.save_template()
            .should('be.visible')
            .click()
    }

    enter_template_title(title) {
        this.elements.template_title()
            .should('be.visible')
            .clear()
            .type(title)
            .should('have.value', title)
    }

    click_on_new_template_button() {
        this.elements.new_template_button()
            .should('be.visible')
            .click()
        cy.url()
            .should('include', '/draft/new')
    }

    verify_existing_templated(title) {
        this.elements.templates_table_row_first()
            .contains(title)
            .should('be.visible')
    }

    click_on_templates_tab() {
        this.elements.templates_tab()
            .should('be.visible')
            .click()
        cy.url()
            .should('include', '/drafts/drafts')
    }

    edit_folder_title(new_title) {
        this.elements.folder_title_draft()
            .should('be.visible')
            .clear()
            .type(new_title)
            .should('have.value', new_title)
    }

    click_on_delete_folder() {
        this.elements.delete_button()
            .should('be.visible')
            .click()
    }

    click_on_edit_folder() {
        this.elements.edit_button()
            .should('be.visible')
            .click()
        
    }

    enter_folder_title(title) {
        this.elements.folder_title()
            .should('be.visible')
            .clear()
            .type(title)
            .should('have.value', title)
    }

    click_on_alert_accept() {
        this.elements.alert_accept()
            .should('be.visible')
            .click()
    }

    click_on_my_docs() {
        this.elements.my_docs()

            .click({force:true})
        cy.url()
            .should('include', '/documentation')
    }

    click_on_new_folder() {
        this.elements.new_folder()
            .should('be.visible')
            .click()
        
    }

    verify_modal_title(modal_title) {
        this.elements.modal_title()
            .should('have.text', modal_title)
    }


}

export default knowledgeBasePage