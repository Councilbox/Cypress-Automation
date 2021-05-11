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
















describe("The user is able to create a new folder in the 'Knowledge base' section", function() {

        it("From the menu choose and click on the 'Knowledge base' option", function() {
            cy.get('#edit-drafts-block').click()
            cy.wait(1000)
        });

        it("Click on the 'My docs' button", function() {
            cy.get('#company-documents-drowpdown').click()
            cy.wait(1000)
        });

        it("From the drop down menu choose and click on the 'New folder' button", function() {
            cy.get('#company-document-create-folder').click()
            cy.wait(1000)
        });

        it("Add a title of the new folder and click on the 'OK' button", function() {
            cy.get('#titleDraft').clear()
                .type('Test'+Cypress.config('UniqueNumber'))
            cy.get('#alert-confirm-button-accept').click()
            cy.wait(1000)
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
            cy.wait(3000)
        });


    });


describe("The user is able to edit a folder name in the 'Knowledge base' section", function() {

        it("From the menu choose and click on the 'Knowledge base' option", function() {
            cy.get('#edit-drafts-block').click()
            cy.wait(1000)
        });

        it("Click on the 'My docs' button", function() {
            cy.get('#company-documents-drowpdown').click()
            cy.wait(1000)
        });

        it("From the drop down menu choose and click on the 'New folder' button", function() {
            cy.get('#company-document-create-folder').click()
            cy.wait(1000)
        });

        it("Add a title of the new folder and click on the 'OK' button", function() {
            cy.get('#titleDraft').clear()
                .type('Test'+Cypress.config('UniqueNumber'))
            cy.get('#alert-confirm-button-accept').click()
            cy.wait(1000)
        });

        it("Navigate to the already added folder and click on the 'Edit' button", function() {
            cy.get('#edit-folder-0').click()
            cy.wait(1000)
        });

        it("Populate the field with changes you want and click 'OK' button", function() {
            cy.get('#titleDraft').clear()
                .type('Test'+Cypress.config('UniqueNumber'))
            cy.get('#alert-confirm-button-accept').click()
            cy.wait(1000)
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
            cy.wait(3000)
        });


    });

describe("The user is able to delete already added folder in the 'Knowledge base' section", function() {

        it("From the menu choose and click on the 'Knowledge base' option", function() {
            cy.get('#edit-drafts-block').click()
            cy.wait(1000)
        });

        it("Navigate to already created folder and click on the 'Delete' button", function() {
            cy.get('#delete-folder-0').click()
            cy.wait(1000)
        });

        it("'Are you sure you want to delete the folder and all its contents?'' alert message is displayed", function() {
            cy.contains('Warning')
        });

        it("Click on the 'OK' button", function() {
            cy.get('#alert-confirm-button-accept').click()
            cy.wait(1000)
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
            cy.wait(3000)
        });


    });


describe("The alert message is displayed when the user clicks on the 'Back' button without saving changes in the 'New template' section", function() {

        it("From the menu choose and click on the 'Knowledge base' option", function() {
            cy.get('#edit-drafts-block').click()
            cy.wait(1000)
        });

        it("Click on the 'Templates' button", function() {
            cy.contains('Templates').click()
            cy.wait(1000)
        });

        it("Click on the 'New template' button", function() {
            cy.get('#draft-create-button').click()
        });

        it("Populate all required fields and click on the 'Back' button", function() {
            cy.get('#draft-editor-title').clear()
                .type('Test')
            cy.get('#draft-editor-back').click()
            cy.wait(1000)
        });

        it("'Has unsaved changes' alert message is successfully displayed", function() {
            cy.contains('Has unsaved changes')
            cy.get('#unsaved-changes-discard').click()
            cy.wait(1000)
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
            cy.wait(3000)
        });


    });