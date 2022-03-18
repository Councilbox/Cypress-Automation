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



describe("Councilbox login - valid username and password", function() {

     before(function() {
        
    });


    it("Visits the Councilbox web page", function() {
        cy.visit(url);
        cy.url().should('eq', "https://app.dev.councilbox.com/")

    });

    it("Enters email address", function() {
        cy.get('#username')
            .type(email)    
            .should("have.value", email)
    });

    it("Enters password", function() {
        cy.get('#password')
            .type(password)    
            .should("have.value", password)
    });

    it("Clicks login button", function() {
        cy.get("#login-button").click();
        cy.wait(1000)
    });

    it("User should be successfully logged in", function() {
        cy.url().should('include', '/company/')
    })

});


