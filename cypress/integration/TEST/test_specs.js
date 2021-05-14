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



describe("The alert message is successfully displayed when the user clicks on the 'Cancel' button without saving changes in the 'Edit tag' section", function() {

        it("From the menu choose and click on the 'Knowledge base' option", function() {
            cy.get('#edit-drafts-block').click()
            cy.wait(1000)
        });

        it("Click on the 'Tags' button", function() {
            cy.get('#tab-2').click()
            cy.wait(1000)
        });

        it("Navigate to the template you want to edit and hover it then click on the 'Edit' button", function() {
            cy.get('#tag-0').trigger('mouseover')
            cy.wait(1000)
            cy.get('#MISSING_ID').click()
            cy.wait(1000)
        });

        it("Populate all required fields and click on the 'Cancel' button", function() {
            cy.get('#company-tag-description').clear()
                .type(Cypress.config('UniqueNumber'))
            cy.wait(1000)
            cy.get('#alert-confirm-button-cancel').click()
            cy.wait(1000)
        });

        it("'Has changes without saving' alert message is successfully displayed", function() {
            cy.get('#unsaved-changes-discard').click()
            cy.wait(1000)
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
            cy.wait(3000)
        });


    });





