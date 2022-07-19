import knowledgeBasePage from "../pageObjects/knowledgeBasePage";
import loginPage from "../pageObjects/loginPage";

const url = "app.dev.councilbox.com"
const email = "alem@qaengineers.net"
const password = "Mostar123!"
const login_url = Cypress.env("baseUrl");


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


let knowledge = new knowledgeBasePage()
let login = new loginPage()


describe("Councilbox login - valid username and password", function() {

     before(function() {
        
    });

it("Login", function() {
    const email = "alem@qaengineers.net"
    const password = "Mostar123!"
    login.login(email, password)
})


it("The user is able to delete already added tag in the 'Knowledge base' section", function() {

    const description = Cypress.config('UniqueNumber')
    const modal_title = "Delete tag"
    const modal_title2 = "Add tag"
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


});


