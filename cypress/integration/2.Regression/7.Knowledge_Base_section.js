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
            cy.get('#create-folder-name').clear()
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
            cy.get('#create-folder-name').clear()
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
            cy.get('#modal-title')
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
            cy.get('#tab-1').click()
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
            cy.get('#modal-title')
            cy.get('#unsaved-changes-discard').click()
            cy.wait(1000)
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
            cy.wait(3000)
        });

    });

describe("The user is able to download template in the 'Knowledge base' section", function() {

        it("From the menu choose and click on the 'Knowledge base' option", function() {
            cy.get('#edit-drafts-block').click()
            cy.wait(1000)
        });

        it("Click on the 'Templates' button", function() {
            cy.get('#tab-1').click()
            cy.wait(1000)
        });

        it("Click on the 'Download templates' button", function() {
            cy.get('#drafts-download-organization-drafts').click()
        });

        it("From the list of templates choose and click on the checkbox to select a template you want to download", function() {
            cy.get('#delete-checkbox-0').click()
            cy.wait(1000)
        });

        it("Click on the “Download 1 Template to “My Drafts” +” section", function() {
            cy.get('#download-platform-drafts-button').click()
            cy.wait(1000)
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
            cy.wait(3000)
        });


    });


describe("The user is able to delete template in the 'Knowledge base' section", function() {

        it("From the menu choose and click on the 'Knowledge base' option", function() {
            cy.get('#edit-drafts-block').click()
            cy.wait(1000)
        });

        it("Click on the 'Templates' button", function() {
            cy.get('#tab-1').click()
            cy.wait(1000)
        });

        it("Navigate to the template you want to delete and hover it then click on the “X” button", function() {
            cy.get('#participant-row-0').trigger('mouseover')
            cy.wait(1000)
        });

        it("Click on the 'Delete' button", function() {
            cy.get('#delete-draft-0').click()
            cy.wait(1000)
            cy.get('#alert-confirm-button-accept').click()
            cy.wait(1000)
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
            cy.wait(3000)
        });


    });

describe("The user is able to use filter search in the 'Templates' section", function() {

        it("From the menu choose and click on the 'Knowledge base' option", function() {
            cy.get('#edit-drafts-block').click()
            cy.wait(1000)
        });

        it("Click on the 'Templates' button", function() {
            cy.get('#tab-1').click()
            cy.wait(1000)
        });

        it("Navigate to the filter search in the upper right corner and click on it", function() {
            cy.get('#drafts-tag-filter-selector').click()
            cy.wait(1000)
        });

        it("Populate the field with the template name you want to find", function() {
            cy.get('#tag-search-input').clear()
                .type('Test')
            cy.wait(1000)
        });

        it("The searched template is successfully displayed in the template list", function() {
            cy.get('#add-tag-statute_2530')
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
            cy.wait(3000)
        });


    });

describe("The user is able to edit already added tag in the 'Knowledge base' section", function() {

        it("From the menu choose and click on the 'Knowledge base' option", function() {
            cy.get('#edit-drafts-block').click()
            cy.wait(1000)
        });

        it("Click on the 'Tags' button", function() {
            cy.get('#tab-2').click()
            cy.wait(1000)
        });

        it("Navigate to the tag you want to edit and hover it then click on the 'edit' button", function() {
            cy.get('#tag-0').trigger('mouseover')
            cy.wait(1000)
            cy.get('#tag-0-edit-button').click()
            cy.wait(1000)
        });

        it("Modify tag with changes you want and click on the 'Save' button", function() {
            cy.get('#company-tag-description').clear()
                .type('TestAutomation')
            cy.wait(1000)
            cy.get('#alert-confirm-button-accept').click()
            cy.wait(1000)
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
            cy.wait(3000)
        });


    });

describe("The user is able to edit already existing template in the 'Templates' section", function() {

        it("From the menu choose and click on the 'Knowledge base' option", function() {
            cy.get('#edit-drafts-block').click()
            cy.wait(1000)
        });

        it("Click on the 'Templates' button", function() {
            cy.get('#tab-1').click()
            cy.wait(1000)
        });

        it("Navigate to the template you want to edit and hover it then click on the 'edit' button", function() {
            cy.get('#participant-row-0').trigger('mouseover')
            cy.wait(1000)
            cy.get('#edit-draft-0').click()
            cy.wait(1000)
        });

        it("Modify tag with changes you want and click on the 'Save' button", function() {
            cy.get('#draft-editor-title').clear()
                .type('TestAutomation')
            cy.wait(1000)
            cy.get('#draft-editor-save').click()
            cy.wait(1000)
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
            cy.wait(3000)
        });


    });

describe("The user is able to delete already added tag in the 'Knowledge base' section", function() {

        it("From the menu choose and click on the 'Knowledge base' option", function() {
            cy.get('#edit-drafts-block').click()
            cy.wait(1000)
        });

        it("Click on the 'Tags' button", function() {
            cy.get('#tab-2').click()
            cy.wait(1000)
        });

        it("Navigate to the template you want to edit and hover it then click on the 'Delete' button", function() {
            cy.get('#tag-0').trigger('mouseover')
            cy.wait(1000)
            cy.get('#tag-0-edit-button').click()
            cy.wait(1000)
        });

        it("Modify tag with changes you want and click on the 'Save' button", function() {
            cy.get('#company-tag-key').clear()
                .type('test'+Cypress.config('UniqueNumber'))
            cy.get('#alert-confirm-button-accept').click()
            cy.wait(1000)
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
            cy.wait(3000)
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
            cy.get('#tag-0-edit-button').click()
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

