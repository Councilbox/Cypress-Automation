const invalid_emails = ["andrej@qa", "andrej.qa", "andrej@majl.234"];
const login_url = Cypress.env("baseUrl");
const valid_password = Cypress.env("login_password");
const valid_email = Cypress.env("login_email");


/*
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

*/



/*
describe("The user is able to start conference", function() {

    it("Click on the 'Iniciar conferencia' button", function() {
        cy.contains('dashboard').click({ force: true })
        cy.get('#init-meeting-block').click()
        cy.wait(10000)

    });


    it("Populate required field and click on the 'Join' button", function() {

        cy.get('#meeting-iframe').then($iframe => {
  const $body = $iframe.contents().find('body');  cy.wrap($body)

    .get('#participant-name-input')
    .type('AutomationTest')
    cy.contains('Join').click()
    cy.wait(10000)

   
});

        });

    });

    
*/
    











describe("Councilbox login - valid username and password", function() {

     before(function() {
        
    });


    it("Visits the Councilbox web page", function() {
        cy.visit(login_url);
    });

    it("Change language to Spanish", function() {
        cy.contains('EN').click();
        cy.contains('ES').click();
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

































  

/*

describe("The user is able to create a new document signature in the 'Signatures' section", function() {

    it("On the left side of the page find the menu and click on the 'Firmas' button", function() {
        cy.contains('Firmas').click()

    });

     it("Click on the 'Nueva firma de documentos' button", function() {
        cy.contains('Nueva firma de documentos').click()

    });

     it("Populate all required fields", function() {
        cy.contains('Nueva firma de documentos').click()

    });

  */  


