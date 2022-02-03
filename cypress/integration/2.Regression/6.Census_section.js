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
            cy.get('#census-name-error-text')
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


describe("The user is able to edit already added census in the 'Censuses' section", function() {

        it("From the menu choose and click on the 'Censuses' form", function() {
            
            cy.get('#edit-censuses-block').click()
            cy.wait(1000)
        });

        it("Set the cursor on already added census and navigate to the 'Edit' button and then click on it", function() {
            cy.get('#census_row_0').trigger('mouseover')
            cy.wait(1000)
            cy.get('#census-edit-button').click()

        });

        it("Change the data in the fields you want and click on the 'OK' button", function() {
            cy.get('#census-name').clear()
                .type('Test')
            cy.get('#alert-confirm-button-accept').click()
            cy.wait(1000)
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
            cy.wait(3000)
        });


    });

describe("The user is able to add 'Shares' type of census in the 'Censuses' section", function() {

        it("From the menu choose and click on the 'Censuses' form", function() {
            cy.wait(3000)
            cy.get('#edit-censuses-block').click()
            cy.wait(1000)
        });

        it("Click on the 'Add census+'' button", function() {
            cy.get('#add-census-button').click()
            cy.wait(1000)

        });

        it("Populate the 'Name' field", function() {
            cy.get('#census-name').clear()
                .type('SharesTest')
        });

        it("Navigate to the 'Census type' button and click on the it", function() {
            cy.get('#census-type').click()
            cy.wait(1000)
        });

        it("Click on the “Shares” button then click on the “OK” button", function() {
            cy.get('#census-type-social-capital').click()
            cy.get('#alert-confirm-button-accept').click()
            cy.wait(1000)
        });
        
        it("Back to Home page", function() {
            cy.visit(login_url);
            cy.wait(3000)
        });


    });

describe("The user is able to use filter search in the 'Censuses' section", function() {

        it("From the menu choose and click on the 'Censuses' form", function() {
            cy.wait(3000)
            cy.get('#edit-censuses-block').click()
            cy.wait(1000)
        });

        it("Navigate to the upper right corner to the filter search", function() {
            cy.get('#undefined-search-input')

        });

        it("On the 'Filter search' field enter the name of the census", function() {
            cy.get('#undefined-search-input').clear()
                .type('Test')
        });

        it("Census is successfully displayed in the 'List of censuses' by the filter", function() {
            cy.get('#census_row_0')
        });
        
        it("Back to Home page", function() {
            cy.visit(login_url);
            cy.wait(3000)
        });


    });


describe("The user is able to add participant in the 'Manage participants' in the 'Censuses' section", function() {

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
                .type("test1"+Cypress.config('UniqueNumber')+"@test.test")

        });

        it("Click on the 'Save' button", function() {
            cy.get('#alert-confirm-button-accept').click()
            cy.wait(1000)
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
            cy.wait(3000)
        });


    });

    

describe("The user is able to edit participants in the 'Manage participants' form in the 'Censuses' section", function() {

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
                .type("test"+Cypress.config('UniqueNumber')+"@test.test")
            cy.get('#participant-phone-input').clear()
                .type('123456')
        });

        it("Click on the 'Save' button", function() {
            cy.get('#alert-confirm-button-accept').click()
            cy.wait(1000)
        });

        it("Navigate to the already added participant and click on it", function() {
            cy.get('#participant-row-0').click()
            cy.wait(1000)
        });

        it("Modify the fields you want and click on the 'OK' button", function() {
            cy.get('#participant-phone-input').clear()
                .type('123456')
            cy.get('#alert-confirm-button-accept').click()
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
            cy.wait(3000)
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
            cy.get('#participant-phone-input').clear()
                .type('123456')

        });

        it("Click on the 'Save' button", function() {
            cy.get('#alert-confirm-button-accept').click()
            cy.wait(1000)
        });

        it("Navigate to the already added participant and click on the 'X' button", function() {
            cy.get('#participant-row-0').trigger('mouseover')
            cy.xpath('(//*[@type="button"])[6]').click()
            cy.wait(1000)
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
            cy.wait(3000)
        });


    });





describe("The user is able to search partner by 'Position' filter in the 'Manage participants' in the 'Censuses' section", function() {

        it("From the menu choose and click on the 'Censuses' form", function() {
            
            cy.get('#edit-censuses-block').click()
            cy.wait(1000)
        });

        it("Set the cursor on already added census and navigate to the 'Manage participants' button and then click on it", function() {
            cy.get('#undefined-search-input').clear()
                .type('testtest')
            cy.wait(1000)
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
                .type("test3"+Cypress.config('UniqueNumber')+"@test.test")
            cy.get('#participant-phone-input').clear()
                .type('123456')

        });

        it("Click on the 'Save' button", function() {
            cy.get('#alert-confirm-button-accept').click()
            cy.wait(1000)
        });

        it("Navigate to the filter search and click on the filter by 'Position' button", function() {
            cy.get('#filter-by-select').click()
            cy.get('#filter-option-position').click()
            cy.wait(1000)
        });

        it("On the field write the word you want", function() {
            cy.get('#undefined-search-input').clear()
                .type('test')
            cy.wait(4000)
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
            cy.wait(3000)
        });


    });

describe("The user is able to search partner by 'Participant data' filter in the 'Manage participants' in the 'Censuses' section", function() {

        it("From the menu choose and click on the 'Censuses' form", function() {
            
            cy.get('#edit-censuses-block').click()
            cy.wait(1000)
        });

        it("Set the cursor on already added census and navigate to the 'Manage participants' button and then click on it", function() {
            cy.get('#undefined-search-input').clear()
                .type('testtest')
            cy.wait(1000)
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
                .type("test4"+Cypress.config('UniqueNumber')+"@test.test")
            cy.get('#participant-phone-input').clear()
                .type('123456')

        });

        it("Click on the 'Save' button", function() {
            cy.get('#alert-confirm-button-accept').click()
            cy.wait(1000)
        });

        it("Navigate to the filter search and click on the filter by 'Participant data' button", function() {
            cy.get('#filter-by-select').click()
            cy.get('#filter-option-fullName').click()
            cy.wait(1000)
        });

        it("On the field write the word you want", function() {
            cy.get('#undefined-search-input').clear()
                .type('aaaa')
            cy.wait(4000)
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
            cy.wait(3000)
        });


    });

describe("The user is able to search partner by 'TIN' filter in the 'Manage participants' in the 'Censuses' section", function() {

        it("From the menu choose and click on the 'Censuses' form", function() {
            
            cy.get('#edit-censuses-block').click()
            cy.wait(1000)
        });

        it("Set the cursor on already added census and navigate to the 'Manage participants' button and then click on it", function() {
            cy.get('#undefined-search-input').clear()
                .type('testtest')
            cy.wait(1000)
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
                .type("test5"+Cypress.config('UniqueNumber')+"@test.test")
            cy.get('#participant-phone-input').clear()
                .type('123456')

        });

        it("Click on the 'Save' button", function() {
            cy.get('#alert-confirm-button-accept').click()
            cy.wait(1000)
        });

        it("Navigate to the filter search and click on the filter by 'TIN' button", function() {
            cy.get('#filter-by-select').click()
            cy.get('#filter-option-dni').click()
            cy.wait(1000)
        });

        it("On the field write the word you want", function() {
            cy.get('#undefined-search-input').clear()
                .type('12345')
            cy.wait(4000)
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
            cy.wait(3000)
        });


    });