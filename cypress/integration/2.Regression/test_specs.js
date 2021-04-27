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










describe("Councilbox login - valid username and password", function() {

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


describe("The user is not able to add census in the 'Censuses' section without populating 'Name' field", function() {

        it("From the menu choose and click on the 'Censuses' form", function() {
            cy.wait(3000)
            cy.get('#edit-censuses-block').click()
            cy.wait(1000)
        });

        it("Click on the 'Add census+'' button", function() {
            cy.get('#add-census-button').click()
            cy.wait(1000)

        });

        it("Click on the 'OK' button without populating the “Name” field", function() {
            cy.get('#alert-confirm-button-accept').click()
        });

        it("The alert message 'Required field' is displayed beyond the “Name” field", function() {
            cy.contains('Required field')
        });
        
        it("Back to Home page", function() {
            cy.visit(login_url);
            cy.wait(3000)
        });


    });

    

describe("The user is able to clone already added census in the 'Censues' section", function() {

        it("From the menu choose and click on the 'Censuses' form", function() {
           
            cy.get('#edit-censuses-block').click()
            cy.wait(1000)
        });

        it("Set the cursor on the already added census and navigate to the 'Clone census' button and then click on it", function() {
            cy.get('#census_row_0').trigger('mouseover')
            cy.wait(1000)
            cy.get('#census-clone-button').click()

        });

        it("Populate all required fields and click on the 'OK' button", function() {
            cy.get('#alert-confirm-button-accept').click()
            cy.wait(1000)
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
            cy.wait(3000)
        });


    });

describe("The user is able to delete already added census in the 'Censuses' section", function() {

        it("From the menu choose and click on the 'Censuses' form", function() {
            
            cy.get('#edit-censuses-block').click()
            cy.wait(1000)
        });

        it("Set the cursor on already added census and navigate to the 'Delete' button and then click on it", function() {
            cy.get('#census_row_0').trigger('mouseover')
            cy.wait(1000)
            cy.get('#census-delete-button').click()

        });

        it("Click on the 'Send to recycle bin' button", function() {
            cy.get('#alert-confirm-button-accept').click()
            cy.wait(1000)
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
            cy.wait(3000)
        });


    });














