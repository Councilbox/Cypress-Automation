/// <reference types="cypress" />

const invalid_emails = ["andrej@qa", "andrej.qa", "andrej@majl.234"];
const login_url = Cypress.env("baseUrl");
const valid_password = Cypress.env("login_password");
const valid_email = Cypress.env("login_email");





  describe("The user is able to create a new account in Councilbox", function() {

    before(function() {
      
    });
    
    it("Open the browser and enter the URL: https://app.councilbox.com/", function() {       
        cy.visit(login_url);
        cy.wait(5000);
    });


    it("Click on the 'Registarse' button", function() {
        cy.get("#sign-up-button").click();
    });

    it("Populate all required fields", function() {
        cy.get('#signup-name').clear()
            .type("Automation")
            .should("have.value", "Automation")
        cy.get('#signup-surname').clear()
            .type("Test")
            .should("have.value", "Test")
        cy.get('#signup-phone').clear()
            .type("123123123")
            .should("have.value", "123123123")
        cy.get('#signup-email').clear()
            .type("alem"+Cypress.config('UniqueNumber')+"@yopmail.com")            
        cy.get('#signup-email-check').clear()
            .type("alem"+Cypress.config('UniqueNumber')+"@yopmail.com")
        cy.get('#signup-password').clear()
            .type("Test12345")
        cy.get('#signup-password-check').clear()
            .type("Test12345")    
    });

    it("Click on the checkbox button to accept the 'términos y condiciones de councilbox'", function() {
        cy.get('#accept-legal-checkbox').click();
    });

    it("Click on the 'Enviar button'", function() {
        cy.get('#create-user-button').click();
        cy.wait(50000)
    });

    it("User should be registered successfully", function() {
        cy.contains('Alta de usuario')
        cy.wait(1000)
    });


  	it('Should be possible to request a reset', () => {
    cy.visit('https://yopmail.com/en')

    

    cy.get('#login').type('testste123')
    cy.get('#refreshbut').click()
    cy.wait(1000)

    cy.get('#ifmail').then($iframe => {
  const $body = $iframe.contents().find('body') ; cy.wrap($body)


    cy.contains('Verify account').click()

    cy.wait(10000)
})


})

 })

  