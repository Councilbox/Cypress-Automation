const invalid_emails = ["andrej@qa", "andrej.qa", "andrej@majl.234"];
const login_url = Cypress.env("baseUrl");
const valid_password = Cypress.env("login_password");
const valid_email = Cypress.env("login_email");

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


function userID_Alpha() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    for (var i = 0; i < 10; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }










describe("Councilbox login - valid username and password E2E", function() {

     before(function() {
        
    });


    it("Visits the Councilbox web page", function() {
        cy.visit(login_url);
    });

    it("Enters email address", function() {
        cy.get('input').eq(0)
            .type('alem@qaengineers.net')    
            .should("have.value", 'alem@qaengineers.net')
    });

    it("Enters password", function() {
        cy.get('input').eq(1)
            .type('Mostar123!')    
            .should("have.value", 'Mostar123!')
    });

    it("Clicks login button", function() {
        cy.get("#login-button").click();
        cy.wait(1000)
    });

});


describe("The user is able to delete participant in the 'Manage participants' form in the 'Censuses' section", function() {

        it("From the menu choose and click on the 'Censuses' form", function() {
            
            cy.get('#edit-censuses-block').click()
            cy.wait(1000)
        });

        it("Set the cursor on already added census and navigate to the 'Manage participants' button and then click on it", function() {
            cy.get('#census_row_0').trigger('mouseover')
            cy.wait(1000)
            cy.get('#census-manage-participants-button').click()

        });

        it("Click on the 'Add participant+'' button", function() {
            cy.wait(1000)
            cy.get('#add-census-participant-button').click()
            cy.wait(1000)
        });

        it("Populate all required fields", function() {
            cy.get('#participant-name-input').clear()
                .type('Test')
            cy.get('#participant-surname-input').clear()
                .type('Automation')
            cy.get('#participant-email-input').clear()
                .type("test2"+Cypress.config('UniqueNumber')+"@test.test")

        });

        it("Click on the 'Save' button", function() {
            cy.get('#alert-confirm-button-accept').click()
            cy.wait(1000)
        });

        it("Navigate to the already added participant and click on the 'X' button", function() {
            cy.get('#participant-row-0').trigger('mouseover')
            cy.get('MISSING_ID').click()
            cy.wait(1000)
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
            cy.wait(3000)
        });


    });