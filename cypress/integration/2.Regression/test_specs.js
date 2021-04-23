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



describe("The user is able to filter members by position in the 'Shareholders register' section", function() {

        it("Click on the 'Shareholders register' button", function() {
            cy.get('#edit-company-block').click()
            cy.wait(1000)
        });

        it("Navigate to the upper right corner and click on the filter button", function() {
            cy.get('#filter-by-select').click()
            cy.wait(1000)

        });

        it("From the menu choose and click on the 'Position' button", function() {
            cy.get('#filter-option-position').click()
            cy.wait(1000)
        });

        it("On the filter search field write the position you want to search", function() {
            cy.get('#partners-search-input').clear()
                .type('Test')
            cy.wait(3000)
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to filter members by participant data in the 'Shareholders register' section", function() {

        it("Click on the 'Shareholders register' button", function() {
            cy.get('#edit-company-block').click()
            cy.wait(1000)
        });

        it("Navigate to the upper right corner and click on the filter button", function() {
            cy.get('#filter-by-select').click()
            cy.wait(1000)

        });

        it("From the menu choose and click on the 'Participant data' button", function() {
            cy.get('#filter-option-fullName').click()
            cy.wait(1000)
        });

        it("On the filter search field write the Participant data you want to search", function() {
            cy.get('#partners-search-input').clear()
                .type('Test')
            cy.wait(3000)
        });
        
        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to filter members by TIN in the 'Shareholders register' section", function() {

        it("Click on the 'Shareholders register' button", function() {
            cy.get('#edit-company-block').click()
            cy.wait(1000)
        });

        it("Navigate to the upper right corner and click on the filter button", function() {
            cy.get('#filter-by-select').click()
            cy.wait(1000)

        });

        it("From the menu choose and click on the 'TIN' button", function() {
            cy.get('#filter-option-dni').click()
            cy.wait(1000)
        });

        it("On the filter search field write the TIN you want to search", function() {
            cy.get('#partners-search-input').clear()
                .type('12345')
            cy.wait(3000)
        });
        
        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to filter members by Number de acta in the 'Shareholders register' section", function() {

        it("Click on the 'Shareholders register' button", function() {
            cy.get('#edit-company-block').click()
            cy.wait(1000)
        });

        it("Navigate to the upper right corner and click on the filter button", function() {
            cy.get('#filter-by-select').click()
            cy.wait(1000)

        });

        it("From the menu choose and click on the 'Number de acta' button", function() {
            cy.get('#filter-option-subscribeActNumber').click()
            cy.wait(1000)
        });

        it("On the filter search field write the Number de acta you want to search", function() {
            cy.get('#partners-search-input').clear()
                .type('12345')
            cy.wait(3000)
        });
        
        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });


describe("The user is able to filter members by 'Registrations' status type in the 'Shareholders section' section", function() {

        it("Click on the 'Shareholders register' button", function() {
            cy.get('#edit-company-block').click()
            cy.wait(1000)
        });

        it("Navigate to the button left to the 'Add member' button and click on it", function() {
            cy.get('#category-filter-select').click()
            cy.wait(1000)

        });

        it("Click on the 'Registrations' button", function() {
            cy.get('#category-1').click()
            cy.wait(1000)
        });
        
        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });


describe("The user is able to filter members by 'Cancellation' status type in the 'Shareholders section' section", function() {

        it("Click on the 'Shareholders register' button", function() {
            cy.get('#edit-company-block').click()
            cy.wait(1000)
        });

        it("Navigate to the button left to the 'Add member' button and click on it", function() {
            cy.get('#category-filter-select').click()
            cy.wait(1000)

        });

        it("Click on the 'Cancellation' button", function() {
            cy.get('#category-0').click()
            cy.wait(1000)
        });
        
        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to filter members by 'Other' status type in the 'Shareholders section' section", function() {

        it("Click on the 'Shareholders register' button", function() {
            cy.get('#edit-company-block').click()
            cy.wait(1000)
        });

        it("Navigate to the button left to the 'Add member' button and click on it", function() {
            cy.get('#category-filter-select').click()
            cy.wait(1000)

        });

        it("Click on the 'Other' button", function() {
            cy.get('#category-2').click()
            cy.wait(1000)
        });
        
        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });













