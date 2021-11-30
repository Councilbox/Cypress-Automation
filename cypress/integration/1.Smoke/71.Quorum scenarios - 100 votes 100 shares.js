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


describe("Quorum numbers (current/initial) scenario (test case 1) - current quorum 80/initial quorum 70 - 100 votes - 100 shares", function() {
    
    it("Click on the “Censuses” button", function() {
        cy.get('#edit-censuses-block').click()
    });

    it("Click on the “Add census” button and populate all required fields then click on the “OK” button", function() {
        cy.get('#add-census-button').click()
        cy.get('#census-name').clear()
            .type('Qourum'+Cypress.config('UniqueNumber'))
        cy.get('#census-type').click()
        cy.get('#census-type-social-capital').click()
        cy.wait(1000)
        cy.get('#alert-confirm-button-accept').click()
    });

    it("Navigate to the already added census and hover it then click on the “Manage participants” icon", function() {
        cy.get('#undefined-search-input').clear()
            .type('Qourum'+Cypress.config('UniqueNumber'))
        cy.wait(3000)
        cy.get('#census_row_0').trigger('mouseover')
        cy.get('#census-manage-participants-button').click()

    });

    it("Add participant A with 20 votes and 20 shares", function() {
        cy.get('#add-census-participant-button').click()
        cy.wait(1000)
        cy.get('#participant-name-input').clear()
            .type('Participant')
        cy.get('#participant-surname-input').clear()
            .type('A')
        cy.get('#participant-email-input').clear()
            .type('test@test.test')
        cy.get('#participant-votes-input').clear()
            .type('20')
        cy.get('#participant-social-capital-input').clear()
            .type('20')
        cy.get('#alert-confirm-button-accept').click()
        cy.wait(1000)
        
    });

    it("Add participant B with 10 votes and 10 shares", function() {
        cy.get('#add-census-participant-button').click()
        cy.wait(1000)
        cy.get('#participant-name-input').clear()
            .type('Participant')
        cy.get('#participant-surname-input').clear()
            .type('B')
        cy.get('#participant-email-input').clear()
            .type('test@test.test')
        cy.get('#participant-votes-input').clear()
            .type('10')
        cy.get('#participant-social-capital-input').clear()
            .type('10')
        cy.get('#alert-confirm-button-accept').click()
        cy.wait(1000)
    });

    it("Add participant C with 10 votes and 10 shares", function() {
        cy.get('#add-census-participant-button').click()
        cy.wait(1000)
        cy.get('#participant-name-input').clear()
            .type('Participant')
        cy.get('#participant-surname-input').clear()
            .type('C')
        cy.get('#participant-email-input').clear()
            .type('test@test.test')
        cy.get('#participant-votes-input').clear()
            .type('10')
        cy.get('#participant-social-capital-input').clear()
            .type('10')
        cy.get('#alert-confirm-button-accept').click()
        cy.wait(1000)
    });

    it("Add participant D with 20 votes and 20 shares", function() {
        cy.get('#add-census-participant-button').click()
        cy.wait(1000)
        cy.get('#participant-name-input').clear()
            .type('Participant')
        cy.get('#participant-surname-input').clear()
            .type('D')
        cy.get('#participant-email-input').clear()
            .type('test@test.test')
        cy.get('#participant-votes-input').clear()
            .type('20')
        cy.get('#participant-social-capital-input').clear()
            .type('20')
        cy.get('#alert-confirm-button-accept').click()
        cy.wait(1000)
    });
 
    it("Add participant E with 10 votes and 10 shares", function() {
        cy.get('#add-census-participant-button').click()
        cy.wait(1000)
        cy.get('#participant-name-input').clear()
            .type('Participant')
        cy.get('#participant-surname-input').clear()
            .type('E')
        cy.get('#participant-email-input').clear()
            .type('test@test.test')
        cy.get('#participant-votes-input').clear()
            .type('10')
        cy.get('#participant-social-capital-input').clear()
            .type('10')
        cy.get('#alert-confirm-button-accept').click()
        cy.wait(1000)
    });

    it("Add participant F with 10 votes and 10 shares”", function() {
        cy.get('#add-census-participant-button').click()
        cy.wait(1000)
        cy.get('#participant-name-input').clear()
            .type('Participant')
        cy.get('#participant-surname-input').clear()
            .type('F')
        cy.get('#participant-email-input').clear()
            .type('test@test.test')
        cy.get('#participant-votes-input').clear()
            .type('10')
        cy.get('#participant-social-capital-input').clear()
            .type('10')
        cy.get('#alert-confirm-button-accept').click()
        cy.wait(1000)
    });

    it("Add participant G with 5 votes and 5 shares", function() {
        cy.get('#add-census-participant-button').click()
        cy.wait(1000)
        cy.get('#participant-name-input').clear()
            .type('Participant')
        cy.get('#participant-surname-input').clear()
            .type('G')
        cy.get('#participant-email-input').clear()
            .type('test@test.test')
        cy.get('#participant-votes-input').clear()
            .type('5')
        cy.get('#participant-social-capital-input').clear()
            .type('5')
        cy.get('#alert-confirm-button-accept').click()
        cy.wait(1000)
    });

    it("Add participant H with 5 votes and 5 shares", function() {
        cy.get('#add-census-participant-button').click()
        cy.wait(1000)
        cy.get('#participant-name-input').clear()
            .type('Participant')
        cy.get('#participant-surname-input').clear()
            .type('H')
        cy.get('#participant-email-input').clear()
            .type('test@test.test')
        cy.get('#participant-votes-input').clear()
            .type('5')
        cy.get('#participant-social-capital-input').clear()
            .type('5')
        cy.get('#alert-confirm-button-accept').click()
        cy.wait(1000)
    });

    it("Add participant I with 10 votes and 10 shares", function() {
        cy.get('#add-census-participant-button').click()
        cy.wait(1000)
        cy.get('#participant-name-input').clear()
            .type('Participant')
        cy.get('#participant-surname-input').clear()
            .type('I')
        cy.get('#participant-email-input').clear()
            .type('test@test.test')
        cy.get('#participant-votes-input').clear()
            .type('10')
        cy.get('#participant-social-capital-input').clear()
            .type('10')
        cy.get('#alert-confirm-button-accept').click()
        cy.wait(1000)
    });

    it("Close the “Census” section and navigate to the landing page", function() {
        cy.visit(login_url)
    });

    it("Click on the “New meeting” button the select the “With session” type of meeting", function() {
        cy.get('#create-council-block').click()
        cy.wait(3000)
    });

    it("Click on the “New meeting” button the select the “With session” type of meeting", function() {
        cy.visit(login_url)
    });
    
    it("Click on the “New meeting” button the select the “With session” type of meeting", function() {
        cy.visit(login_url)
    });
    
    it("Click on the “New meeting” button the select the “With session” type of meeting", function() {
        cy.visit(login_url)
    });
    
    it("Click on the “New meeting” button the select the “With session” type of meeting", function() {
        cy.visit(login_url)
    });
   
    it("Click on the “New meeting” button the select the “With session” type of meeting", function() {
        cy.visit(login_url)
    });
   
   
});