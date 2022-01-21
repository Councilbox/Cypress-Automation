const invalid_emails = ["andrej@qa", "andrej.qa", "andrej@majl.234"];
const login_url = Cypress.env("baseUrl");
const valid_password = Cypress.env("login_password");
const valid_email = Cypress.env("login_email");



describe("Councilbox login - valid username and password", function() {

     before(function() {
        
    });


    it("Visits the Councilbox web page", function() {
        cy.visit(login_url);
    });

    it("Change language to Spanish", function() {
        cy.get('#language-selector').click();
        cy.get('#language-es').click();
    });

    it("Enters email address", function() {
        cy.get('#username').clear()
            .type('alem@qaengineers.net')    
            .should("have.value", 'alem@qaengineers.net')
    });

    it("Enters password", function() {
        cy.get('#password').clear()
            .type('Mostar123!')    
            .should("have.value", 'Mostar123!')
    });

    it("Clicks login button", function() {
        cy.get("#login-button").click();
        cy.wait(2000)
    });

});



describe("The user is able to add a new type of meeting in the 'Tipos de reunion' section", function() {

    it("From the menu choose and click on the 'Tipos de reunion' button", function() {
 
        cy.get('#edit-statutes-block').click()

    });


    it("On the upper left corner click on the 'Anadir tipo de reunion+'' button", function() {
        cy.get('#company-statute-create-button').click()

    });

    it("Populate required field and click on the 'Aceptar' button", function() {
        cy.get('#new-council-type-input').type('Test'+Cypress.config('UniqueNumber'))
        cy.get('#alert-confirm-button-accept').click()
    });

    it("Back to Home page", function() {
            cy.visit(login_url);
            cy.wait(3000)
        });

});
