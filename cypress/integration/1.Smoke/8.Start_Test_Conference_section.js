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


describe("The user is able to start conference", function() {

    it("Click on the 'Iniciar conferencia' button", function() {
        cy.contains('dashboard').click({ force: true })
        cy.get('#init-meeting-block').click()
        

    });


    it("Populate required field and click on the 'Join' button", function() {
/*
        cy.get('#meeting-iframe').then($iframe => {
  const $body = $iframe.contents().find('body') ; cy.wrap($body)


    cy.get('#participant-name-input').type('AutomationTest')


    cy.contains('Join').click()


    cy.wait(15000)
    
});

*/

        });




});