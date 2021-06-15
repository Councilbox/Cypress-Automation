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













describe("The user is able to edit member information in the 'Shareholder register' section", function() {

        it("From the menu choose and click on the 'Shareholders register' button", function() {
            cy.get('#edit-company-block').click()
            cy.wait(1000)
        });

        it("Click on the 'Add member' button", function() {
            cy.get('#add-partner-button').click()
            cy.wait(1000)

        });

        it("Click on the 'Save changes' button", function() {
            cy.get('#guardarAnadirSocio').click()
            cy.wait(1000)
        });

        it("The error message 'Required field' is displayed above the required fields and the new member isn't added to the partner list", function() {
            cy.get('#add-partner-name-error-text')
            cy.get('#add-partner-surname-error-text')
            cy.get('#add-partner-email-error-text')
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is not able to add a member with invalid inputs in the 'Name' field in the 'Personal details' 'Shareholders register' section", function() {

        it("From the menu choose and click on the 'Shareholders register' button", function() {
            cy.get('#edit-company-block').click()
            cy.wait(1000)
        });

        it("Click on the 'Add member' button", function() {
            cy.get('#add-partner-button').click()
            cy.wait(1000)

        });

        it("Populate the 'Name' fields just by pressing the backspace button on the keyboard and all other required fields with valid inputs", function() {
            cy.get('#add-partner-name').clear()
                .type('!!!!!')
            cy.get('#add-partner-surname').clear()
                .type('Test')
            cy.get('#add-partner-email').clear()
                .type('test@test.test')
            cy.wait(1000)

        });

        it("Click on the 'Save changes' button", function() {
            cy.get('#guardarAnadirSocio').click()
            cy.wait(1000)
        });

        it("The “Invalid field” message is displayed beyond the “Name” field", function() {
            cy.get('#add-partner-name-error-text')
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is not able to add a member with invalid inputs in the 'Surname' field in the 'Personal details' 'Shareholders register' section", function() {

        it("From the menu choose and click on the 'Shareholders register' button", function() {
            cy.get('#edit-company-block').click()
            cy.wait(1000)
        });

        it("Click on the 'Add member' button", function() {
            cy.get('#add-partner-button').click()
            cy.wait(1000)

        });

        it("Populate the 'Surname' fields just by pressing the backspace button on the keyboard and all other required fields with valid inputs", function() {
            cy.get('#add-partner-name').clear()
                .type('Test')
            cy.get('#add-partner-surname').clear()
                .type('!!!!!')
            cy.get('#add-partner-email').clear()
                .type('test@test.test')
            cy.wait(1000)

        });

        it("Click on the 'Save changes' button", function() {
            cy.get('#guardarAnadirSocio').click()
            cy.wait(1000)
        });

        it("The “Invalid field” message is displayed beyond the “Surname” field", function() {
            cy.get('#add-partner-surname-error-text')
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to add 'Legal person' type of member in the 'Shareholders register' section", function() {

        it("From the menu choose and click on the 'Shareholders register' button", function() {
            cy.get('#edit-company-block').click()
            cy.wait(1000)
        });

        it("Click on the 'Add member' button", function() {
            cy.get('#add-partner-button').click()
            cy.wait(1000)

        });

        it("Navigate to the 'Legal person' button and click on it", function() {
            cy.get('#radio-entity').click()
            cy.wait(1000)
        });

        it("Populate all required fields and click on the 'Save changes' button", function() {
            cy.get('#add-partner-entity-name').clear()
                .type(userID_Alpha())
            cy.get('#add-partner-email').clear()
                .type(userID_Alpha()+'@test.com')

        });

        it("Click on the 'Save changes' button", function() {
            cy.get('#guardarAnadirSocio').click()
            cy.wait(1000)
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
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


describe("The alert message is successfully displayed when the user clicks on the 'Back' button without saving changes in the 'Add member' form", function() {

        it("From the menu choose and click on the 'Shareholders register' form", function() {
            cy.wait(1000)
            cy.get('#edit-company-block').click()
            cy.wait(1000)
        });

        it("Click on the 'Add member' button", function() {
            cy.get('#add-partner-button').click()
            cy.wait(1000)

        });

        it("Populate all required fields and click on the 'Back' button", function() {
            cy.get('#add-partner-name').clear()
                .type('Automation')
            cy.get('#add-partner-surname').clear()
                .type('Test')
            cy.get('#add-partner-email').clear()
                .type('test@test.test')
            cy.wait(1000)
            cy.get('#edit-partner-back-button').click()
        });
        
        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });