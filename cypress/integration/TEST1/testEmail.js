/// <reference types="cypress" />


describe("The user is able to create a new account in Councilbox", function() {

    const password = "test-password";
    let inboxId;
    let emailAddress;

    before(function() {
      
    });
    
/*
    
      
    });
    
    it("Open the browser and enter the URL: https://app.councilbox.com/", function() {       
        cy.visit('app.dev.councilbox.com');
        cy.wait(5000);
    });

    it("Change language to Spanish", function() {
        cy.get('#language-selector').click();
        cy.get('#language-es').click();
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
            .type("random@mailslupr.com")            
        cy.get('#signup-email-check').clear()
            .type("random@mailslupr.com")
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
    });

    it("User should be registered successfully", function() {
        cy.contains('Alta de usuario')
        cy.wait(1000)
        cy.wait(15000)
    });
    */
    

    
    it("Get email", function() {
        cy.waitForLatestEmailTEST().then((inbox) => {
            cy.state('document').write(inbox.body);

            cy.wait(3000)

            cy.get('body > table:nth-child(5) > tbody > tr:nth-child(1) > td > div > a').click()

            
           cy.wait(15000)

            cy.contains('The account was already activated.').should('have.text', 'The account was already activated.')

        })
    
    });

    



it("can generate a new email address and sign up", () => {
  // see commands.js custom commands
  cy.createInbox().then((inbox) => {
    // verify a new inbox was created
    assert.isDefined(inbox);

    // save the inboxId for later checking the emails
    inboxId = inbox.id;
    emailAddress = inbox.emailAddress;


     cy.visit('https://app.dev.councilbox.com/')
    cy.get('#sign-up-button').click()
    cy.get('#signup-name').type('Alem')
    cy.get('#signup-surname').type('Test')
    cy.get('#signup-phone').type('123456')
    cy.get('#signup-email').type(emailAddress)
    cy.get('#signup-email-check').type(emailAddress)
    cy.get('#signup-password').type(password)
    cy.get('#signup-password-check').type(password)
    cy.get('#accept-legal-checkbox').click()
    cy.get('#create-user-button').click()
    cy.wait(2000)
    cy.contains('Your user has been created correctly. An email has been sent to you to finish activating your account.Back').should('have.text', 'Your user has been created correctly. An email has been sent to you to finish activating your account.Back')

  })

});


    it("Get email", function() {
        cy.waitForLatestEmail(inboxId).then((inbox) => {
            cy.state('document').write(inbox.body);

            cy.wait(5000)

            cy.get('body > table:nth-child(5) > tbody > tr:nth-child(1) > td > div > a').invoke('attr', 'href').then(myLink => {
    cy.visit(myLink);
})

            cy.wait(1000)
            cy.wait(1000)
            cy.wait(30000)

            cy.contains('The account was activated successfully.').should('have.text', 'The account was activated successfully.')

        })
        });

   


});