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



describe("The user is able to choose and select the tag in the 'tags' section in the 'Voting letter' form in the 'Document' section in the 'Types of meetings' section", function() {

        it("Click on the 'Council types' button", function() {
            cy.get('#edit-statutes-block').click()
            cy.wait(1000)
        });

        it("Scroll down the page and navigate to the 'Documents' section", function() {
            cy.get('#council-type-vote-letter').scrollIntoView()
            cy.wait(1000)
        });

        it("Navigate to the 'Voting letter' section and click on the 'tags' button and click on it then choose and select the tag you want and click on the 'Save' button", function() {
            cy.get('.ql-editor').eq(4).clear()
                .type('{{')
                    .type('business_name')
                        .type('}}')
            cy.wait(1000)
            cy.get('#council-statute-save-button').click()

        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });


describe("The user is able to choose and select the tag in the 'tags' section in the 'Vote letter right column' form in the 'Documents' section in the 'Types of meetings' section", function() {

        it("Click on the 'Council types' button", function() {
            cy.get('#edit-statutes-block').click()
            cy.wait(1000)
        });

        it("Scroll down the page and navigate to the 'Documents' section", function() {
            cy.get('#council-type-vote-letter-secondary').scrollIntoView()
            cy.wait(1000)
        });

        it("Navigate to the 'Vote letter right column' section and click on the 'tags' button and click on it then choose and select the tag you want and click on the 'Save' button", function() {
            cy.get('.ql-editor').eq(5).clear()
                .type('{{')
                    .type('business_name')
                        .type('}}')
            cy.wait(1000)
            cy.get('#council-statute-save-button').click()

        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to choose and select the tag in the 'tags' section in the 'Voting letter with voting directions' form in the 'Documents' section in the 'Types of meetings' section", function() {

        it("Click on the 'Council types' button", function() {
            cy.get('#edit-statutes-block').click()
            cy.wait(1000)
        });

        it("Scroll down the page and navigate to the 'Documents' section", function() {
            cy.get('#council-type-vote-letter-with-sense').scrollIntoView()
            cy.wait(1000)
        });

        it("Navigate to the 'Voting letter with voting directions' section and click on the 'tags' button and click on it then choose and select the tag you want and click on the 'Save' button", function() {
            cy.get('.ql-editor').eq(6).clear()
                .type('{{')
                    .type('business_name')
                        .type('}}')
            cy.wait(1000)
            cy.get('#council-statute-save-button').click()

        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to choose and select the tag in the 'tags' section in the 'Right column vote letter with voting directions' form in the 'Documents' section in the 'Types of meetings' section", function() {

        it("Click on the 'Council types' button", function() {
            cy.get('#edit-statutes-block').click()
            cy.wait(1000)
        });

        it("Scroll down the page and navigate to the 'Documents' section", function() {
            cy.get('#council-type-vote-letter-with-sense-secondary').scrollIntoView()
            cy.wait(1000)
        });

        it("Navigate to the 'Right column vote letter with voting directions' section and click on the 'tags' button and click on it then choose and select the tag you want and click on the 'Save' button", function() {
            cy.get('.ql-editor').eq(7).clear()
                .type('{{')
                    .type('business_name')
                        .type('}}')
            cy.wait(1000)
            cy.get('#council-statute-save-button').click()

        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });










