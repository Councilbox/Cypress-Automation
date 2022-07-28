import knowledgeBasePage from "../pageObjects/knowledgeBasePage";
import loginPage from "../pageObjects/loginPage";

const login_url = Cypress.env("baseUrl");

let knowledge = new knowledgeBasePage()
let login = new loginPage()

beforeEach(function() {
    cy.restoreLocalStorage();
});

afterEach(function() {
    cy.saveLocalStorage();
});

before(function() {
    cy.clearLocalStorage();
    cy.saveLocalStorage();
});

function userID_Alpha() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    for (var i = 0; i < 10; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

describe("Knowledge Base - Regression", function() {

   it("Login", function() { 
        const email = "alem@qaengineers.net"
        const password = "Mostar123!"
        login.login(email, password)
    })

    it("The user is able to create a new folder in the 'Knowledge base' section",function() {
        const title = "Folder"+Cypress.config('UniqueNumber')
        cy.log("Back to Home page")
        cy.visit(login_url);
        cy.log("From the menu choose and click on the 'Knowledge base' option")
            knowledge.click_on_knowledge_base()
        cy.log("Click on the 'My docs' button")
            knowledge.click_on_my_docs()
        cy.log("From the drop down menu choose and click on the 'New folder' button")
            knowledge.click_on_new_folder()
        cy.log("Add a title of the new folder and click on the 'OK' button")
            knowledge.enter_folder_title(title)
            knowledge.click_on_alert_accept()
        cy.log("Verify that New Folder is created")
            knowledge.search_for_documentation(title)
            knowledge.verify_existing_documentation(title)
    });

    it("The user is able to edit a folder name in the 'Knowledge base' section", function() {
        const modal_title = "New folder"
        const modal_title_2 = "Edit folder"
        const title = "ToEdit"+Cypress.config('UniqueNumber')
        const new_title = "Edited"+Cypress.config('UniqueNumber')
        cy.log("Back to Home page")
        cy.visit(login_url);
        cy.log("From the menu choose and click on the 'Knowledge base' option")
            knowledge.click_on_knowledge_base()
        cy.log("Click on the 'My docs' button")
            knowledge.click_on_my_docs()
        cy.log("From the drop down menu choose and click on the 'New folder' button")
            knowledge.click_on_new_folder()
            knowledge.verify_modal_title(modal_title)
        cy.log("Add a title of the new folder and click on the 'OK' button")
            knowledge.enter_folder_title(title)
            knowledge.click_on_alert_accept()
        cy.log("Navigate to the already added folder and click on the 'Edit' button")
            knowledge.search_for_documentation(title)
            knowledge.click_on_edit_folder()
            knowledge.verify_modal_title(modal_title_2)
        cy.log("Populate the field with changes you want and click 'OK' button")
            knowledge.edit_folder_title(new_title) 
            knowledge.click_on_alert_accept()
        cy.log("Verify that Folder is edited")
            knowledge.search_for_documentation(new_title)
            knowledge.verify_existing_documentation(new_title)
    });

    it("The user is able to delete already added folder in the 'Knowledge base' section", function() {
        const modal_title = "New folder"
        const modal_title2 = "Warning"
        const title = "ToDelete"+Cypress.config('UniqueNumber')
        cy.log("Back to Home page")
        cy.visit(login_url);
        cy.log("From the menu choose and click on the 'Knowledge base' option")
            knowledge.click_on_knowledge_base()
        cy.log("Click on the 'My docs' button")
            knowledge.click_on_my_docs()
        cy.log("From the drop down menu choose and click on the 'New folder' button")
            knowledge.click_on_new_folder()
            knowledge.verify_modal_title(modal_title)
        cy.log("Add a title of the new folder and click on the 'OK' button")
            knowledge.enter_folder_title(title)
            knowledge.click_on_alert_accept()
        cy.log("Verify that Folder is edited")
            knowledge.search_for_documentation(title)
            knowledge.verify_existing_documentation(title)
        cy.log("Navigate to already created folder and click on the 'Delete' button")
            knowledge.click_on_delete_folder()
        cy.log("'Are you sure you want to delete the folder and all its contents?'' alert message is displayed")
            knowledge.verify_modal_title(modal_title2)
        cy.log("Click on the 'OK' button")
            knowledge.click_on_alert_accept()
        cy.log("Verify that Folder is deleted")
            knowledge.search_for_documentation(title)
            knowledge.verify_folder_is_deleted()
    });

    it("The alert message is displayed when the user clicks on the 'Back' button without saving changes in the 'New template' section", function() {
        const title = "Template"+Cypress.config('UniqueNumber')
        const modal_title = "Warning"
        const unsaved_changes = "Has unsaved changes"
        cy.log("Back to Home page")
        cy.visit(login_url);
        cy.log("From the menu choose and click on the 'Knowledge base' option")
            knowledge.click_on_knowledge_base()
        cy.log("Click on the 'Templates' button")
            knowledge.click_on_templates_tab()
        cy.log("Click on the 'New template' button")
            knowledge.click_on_new_template_button()
        cy.log("Populate all required fields and click on the 'Back' button")
            knowledge.enter_template_title(title)
            knowledge.click_on_back_template()
        cy.log("'Has unsaved changes' alert message is successfully displayed")
            knowledge.verify_modal_title(modal_title)
            knowledge.verify_unsaved_changes_modal(unsaved_changes)
    });

    it("The user is able to download template in the 'Knowledge base' section",function() {
        const template = "Aprobación de la gestión del órgano de administración durante el ejercicio cerrado el 31 de diciembre de 2016"
        cy.log("Back to Home page")
        cy.visit(login_url);
        cy.log("From the menu choose and click on the 'Knowledge base' option")
            knowledge.click_on_knowledge_base()
        cy.log("Click on the 'Templates' button")
            knowledge.click_on_templates_tab()
        cy.log("Click on the 'Download templates' button")
            knowledge.click_on_download_template()
        cy.log("From the list of templates choose and click on the checkbox to select a template you want to download")
            knowledge.click_on_templates_checkbox()
        cy.log("Click on the “Download 1 Template to “My Drafts” +” section")
            knowledge.click_on_download_template_to_drafts()
        cy.log("Verify Downloaded Template")
            knowledge.verify_downloaded_template(template)
            
    });


    it("The user is able to delete template in the 'Knowledge base' section", function() {
        const modal_title = "Warning"
        const title = "ToDelete"+Cypress.config('UniqueNumber')
        cy.log("Back to Home page")
        cy.visit(login_url);
        cy.log("From the menu choose and click on the 'Knowledge base' option")
            knowledge.click_on_knowledge_base()
        cy.log("Click on the 'Templates' button")
            knowledge.click_on_templates_tab()
        cy.log("Create new Template")
            knowledge.click_on_new_template_button()
            knowledge.enter_template_title(title)
            knowledge.click_on_save_template()
        cy.log("Search for created template")
            knowledge.search_for_template(title)
        cy.log("Navigate to the template you want to delete and hover cy.log then click on the “X” button")
            knowledge.mouseover_on_templates_table_row_first_item()
        cy.log("Click on the 'Delete' button")
            knowledge.click_on_templates_delete_button()
            knowledge.verify_modal_title(modal_title)     
            knowledge.click_on_alert_accept()     
        cy.log("Verify that Template is deleted")
            knowledge.search_for_template(title)
            knowledge.verify_template_is_deleted()
    });

    it("The user is able to use filter search in the 'Templates' section", function() {
        const search = "Test"
        const searched = "Test5402685753729"
        cy.log("Back to Home page")
        cy.visit(login_url);
        cy.log("From the menu choose and click on the 'Knowledge base' option")
            knowledge.click_on_knowledge_base()
        cy.log("Click on the 'Templates' button")
            knowledge.click_on_templates_tab()
        cy.log("Navigate to the filter search in the upper right corner and click on cy.log")
            knowledge.click_on_templates_filter_by()
        cy.log("Populate the field with the template name you want to find")
            knowledge.search_for_tags(search)
        cy.log("The searched template is successfully displayed in the template list")
            knowledge.click_on_searched_tag(searched) 
    });

    it("The user is able to edit already added tag in the 'Knowledge base' section", function() {
        const modal_title2 = "Edit tag"
        const description = "TestAutomation"
        const modal_title = "Add tag"
        const value = "value"+Cypress.config('UniqueNumber')
        const code = "code"+Cypress.config('UniqueNumber')
        const code_new = "new"+Cypress.config('UniqueNumber')
        cy.log("Back to Home page")
        cy.visit(login_url);
        cy.log("From the menu choose and click on the 'Knowledge base' option")
            knowledge.click_on_knowledge_base()   
        cy.log("Click on the 'Tags' button")
            knowledge.click_on_tags_tab()
        cy.log("Add new Tag")
            knowledge.click_on_add_tag()
            knowledge.verify_modal_title(modal_title)
            knowledge.enter_tag_code(code)
            knowledge.enter_tag_value(value)
            knowledge.click_on_alert_accept()
        cy.log("Search for Tag")
                knowledge.search_for_tag(code)
        cy.log("Navigate to the tag you want to edit and hover cy.log then click on the 'edit' button")
            knowledge.mouseover_on_tag_table_row_first_item()
            knowledge.click_on_tags_edit_button()
            knowledge.verify_modal_title(modal_title2)
        cy.log("Modify tag with changes you want and click on the 'Save' button")
            knowledge.enter_tag_code(code_new)
            knowledge.click_on_alert_accept()
        cy.reload()
        cy.log("Verify that Tag is Edited")
            knowledge.search_for_tag(code_new)
            knowledge.verify_existing_tag(code_new)
    });

    it("The user is able to edit already existing template in the 'Templates' section", function() {

        const title = "ToEdit"+Cypress.config('UniqueNumber')
        const title_new = "Edited"+Cypress.config('UniqueNumber')
        cy.log("Back to Home page")
        cy.visit(login_url);
        cy.log("From the menu choose and click on the 'Knowledge base' option")
            knowledge.click_on_knowledge_base()
        cy.log("Click on the 'Templates' button")
            knowledge.click_on_templates_tab()
        cy.log("Add new Template")
            knowledge.click_on_new_template_button()
            knowledge.enter_template_title(title)
            knowledge.click_on_save_template()
        cy.log("Search for a Template")
            knowledge.search_for_template(title)
        cy.log("Navigate to the template you want to edit and hover cy.log then click on the 'edit' button")
            knowledge.mouseover_on_templates_table_row_first_item() 
            knowledge.click_on_templates_edit_button()
        cy.log("Modify tag with changes you want and click on the 'Save' button")
            knowledge.enter_template_title(title_new)                      
            knowledge.click_on_save_template()
        cy.log("Verify that Template is edited")
            knowledge.search_for_template(title_new)
            knowledge.verify_existing_templated(title_new)
    });


    it("The alert message is successfully displayed when the user clicks on the 'Cancel' button without saving changes in the 'Edit tag' section", function() {
        const description = Cypress.config('UniqueNumber')
        const modal_title = "Edit tag"
        const modal_title2 = "Warning"
        const unsaved_changes = "Has unsaved changes"
        cy.log("Back to Home page")
        cy.visit(login_url);
        cy.log("From the menu choose and click on the 'Knowledge base' option")
            knowledge.click_on_knowledge_base()
        cy.log("Click on the 'Tags' button")
            knowledge.click_on_tags_tab()
        cy.log("Navigate to the template you want to edit and hover cy.log then click on the 'Edit' button")
            knowledge.mouseover_on_tag_table_row_first_item()      
            knowledge.click_on_tags_edit_button()
            knowledge.verify_modal_title(modal_title)
        cy.log("Populate all required fields and click on the 'Cancel' button")
            knowledge.enter_tag_description(description)      
            knowledge.click_on_alert_cancel()
        cy.log("'Has changes without saving' alert message is successfully displayed")
            knowledge.verify_unsaved_changes_modal(unsaved_changes)
            knowledge.click_on_discard_changes()
    });

    it("The user is able to delete already added tag in the 'Knowledge base' section", function() {
        const description = Cypress.config('UniqueNumber')
        const modal_title2 = "Add tag"
        const modal_title = "Delete tag"
        const code = "ToDelete"+Cypress.config('UniqueNumber')
        const value = "Delete"+Cypress.config('UniqueNumber')
        cy.log("Back to Home page")
        cy.visit(login_url);
        cy.log("From the menu choose and click on the 'Knowledge base' option")
            knowledge.click_on_knowledge_base()
        cy.log("Click on the 'Tags' button")
            knowledge.click_on_tags_tab()
        cy.log("Add new Tag")
            knowledge.click_on_add_tag()
            knowledge.verify_modal_title(modal_title2)
            knowledge.enter_tag_code(code)
            knowledge.enter_tag_value(value)
            knowledge.click_on_alert_accept()
        cy.log("Search for Tag")
            knowledge.search_for_tag(code)
        cy.log("Navigate to tag you want to delete and then click on the 'Delete' button")
            knowledge.mouseover_on_tag_table_row_first_item()          
            knowledge.click_on_tags_delete_button()
            knowledge.verify_modal_title(modal_title)          
        cy.log("Click on the 'Accept' button")
            knowledge.click_on_alert_accept()
            cy.reload()
        cy.log("Verify that Tag is Deleted")
            knowledge.search_for_tag(code)
            knowledge.verify_tag_is_deleted(code)
    });

    it("The user is able to use filter search in the 'Templates' section", function() { 
        const search = "Test"
        const searched = "Test5402685753729"
        cy.log("Back to Home page")
        cy.visit(login_url);
        cy.log("From the menu choose and click on the 'Knowledge base' option")
            knowledge.click_on_knowledge_base()
        cy.log("Click on the 'Templates' button")
            knowledge.click_on_templates_tab()           
        cy.log("Navigate to the filter search in the upper right corner and click on cy.log")
            knowledge.click_on_templates_filter_by()          
        cy.log("Populate the field with the template name you want to find")
            knowledge.search_for_tags(search)
        cy.log("The searched template is successfully displayed in the template list")
            knowledge.click_on_searched_tag(searched) 
    });
});