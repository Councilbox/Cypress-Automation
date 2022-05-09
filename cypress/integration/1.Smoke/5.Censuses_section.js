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

    });

});



describe("The user is able to add census in the 'Censos' section [tipo Assistentes]", function() {

    it("From the menu choose and click on the 'Censos' button", function() {

        cy.get('#edit-censuses-block').click()


    });


    it("Click on 'Anadir censo+' button", function() {
        cy.get('#add-census-button').click()

    });

    it("Populate “Nombre” field", function() {
        cy.get('#census-name').clear()
            .type('AutomationTest'+Cypress.config('UniqueNumber'))    
            .should("have.value", 'AutomationTest'+Cypress.config('UniqueNumber'))
    });


    it("“Select the “Assistentes” tipo de census", function() {
        cy.get('#census-type').click()
        cy.get('#census-type-social-capital').click()

    });

    it("Populate “Descripcion” field", function() {
        cy.get('#census-description').clear()
            .type('TestAutomation')    
            .should("have.value", 'TestAutomation')
    });

    it("Click on the 'Aceptar' button", function() {
        cy.get('#alert-confirm-button-accept').click()
    });

    it("Back to Home page", function() {
            cy.visit(login_url);
     
        });



    
});
