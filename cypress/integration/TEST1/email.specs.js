/// <reference types="cypress" />

const invalid_emails = ["andrej@qa", "andrej.qa", "andrej@majl.234"];
const login_url = Cypress.env("baseUrl");
const valid_password = Cypress.env("login_password");
const valid_email = Cypress.env("login_email");





  describe("The user is able to create a new account in Councilbox", function() {

    before(function() {
      
    });
    
    it("Open the browser and enter the URL: https://app.councilbox.com/", function() {       
        cy.readFile('cypress/integration/TEST/versions.csv').then(json => JSON.stringify(json)).should('eq',JSON.stringify(tableValues1));
    });



 })

  