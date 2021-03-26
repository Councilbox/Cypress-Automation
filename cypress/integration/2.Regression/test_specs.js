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


describe("The user is able to choose and select 'There is minimum notice to call notice' option for the call in the 'Convene' section in the 'Council types' section", function() {

        it("Click on the 'Council types' button", function() {
            cy.get('#edit-statutes-block').click()
            cy.wait(1000)
        });

        it("Navigate to the 'Convene' section", function() {
            cy.contains('Announcement:')
            cy.wait(1000)
        });

        it("Click on the 'There is a minimum notice to call notice' checkbox and click on the 'Save' button", function() {
            cy.get('#council-type-advance-notice-days').click()
            cy.wait(1000)
            cy.get('#council-statute-save-button').click()

        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to choose and select 'Second call' option for the call in the 'Convene' section in the 'Council types' section", function() {

        it("Click on the 'Council types' button", function() {
            cy.get('#edit-statutes-block').click()
            cy.wait(1000)
        });

        it("Navigate to the 'Convene' section", function() {
            cy.contains('Announcement:')
        });

        it("Click on the 'There is second call' checkbox and click on the 'Save' button", function() {
            cy.get('#council-type-has-second-call').click()
            cy.wait(1000)
            cy.get('#council-statute-save-button').click()

        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });


describe("The user is able to choose and select 'Attendees' type of quorum for the call in the 'Attendance' section in the 'Council types' form", function() {

        it("Click on the 'Council types' button", function() {
            cy.get('#edit-statutes-block').click()
            cy.wait(1000)
        });

        it("Navigate to the 'Attendance' section", function() {
            cy.contains('Attendance')
        });

        it("Navigate to the 'Type of Quorum' and click on the 'Attendees' button and click on the 'Save' button", function() {
            cy.get('#council-type-quorum-type').click()
            cy.wait(1000)
            cy.get('#quorum-type-attendants').click()
            cy.wait(1000)
            cy.get('#council-statute-save-button').click()

        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });


describe("The user is able to choose and select 'Shares' type of quorum for the call in the 'Attendance' section in the 'Council types' form", function() {

        it("Click on the 'Council types' button", function() {
            cy.get('#edit-statutes-block').click()
            cy.wait(1000)
        });

        it("Navigate to the 'Attendance' section", function() {
            cy.contains('Attendance')
        });

        it("Navigate to the 'Type of quorum' and click on it and from the dropdown menu choose and click on the 'Shares' button and click on the 'Save' button", function() {
            cy.get('#council-type-quorum-type').click()
            cy.wait(1000)
            cy.get('#quorum-type-social-capital').click()
            cy.wait(1000)
            cy.get('#council-statute-save-button').click()

        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to choose and select 'Percentage' in the 'Quorum attendance 1st call' field in the 'Council types' form", function() {

        it("Click on the 'Council types' button", function() {
            cy.get('#edit-statutes-block').click()
            cy.wait(1000)
        });

        it("Navigate to the 'Attendance' section", function() {
            cy.contains('Attendance')
        });

        it("Navigate to the 'Quorum attendance 1st call' and click on the 'Percentage' button and enter the number then click on the 'Save' button", function() {
            cy.get('#council-type-quorum-first-call').click()
            cy.wait(1000)
            cy.get('#quorum-first-call-0').click()
            cy.wait(1000)
            cy.get('#quorum-first-call-percentage').clear()
                .type('20')
            cy.get('#council-statute-save-button').click()

        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to choose and select 'Half plus one' in the 'Quorum attendance 1st call' field in the 'Council types' form", function() {

        it("Click on the 'Council types' button", function() {
            cy.get('#edit-statutes-block').click()
            cy.wait(1000)
        });

        it("Navigate to the 'Attendance' section", function() {
            cy.contains('Attendance')
        });

        it("Navigate to the 'Quorum attendance 1st call' and click on the 'Half plus one' button and enter the number then click on the 'Save' button", function() {
            cy.get('#council-type-quorum-first-call').click()
            cy.wait(1000)
            cy.get('#quorum-first-call-1').click()
            cy.wait(1000)
            cy.get('#council-statute-save-button').click()

        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });


describe("The user is able to edit 'Business name*'' in the Company settings in the Councilbox", function() {

        it("On the upper right corner click on the 'User icon' button", function() {
            cy.wait(5000)
            cy.get('#user-menu-trigger').click()
        });

        it("From the drop down menu click on 'Company' button", function() {
            cy.xpath('(//*[@role="menuitem"])[9]').click()
        });


        it("Modify the 'Business name*' field and click on the 'Save' button", function() {
            cy.get('#business-name').clear().type(userID_Alpha()+Cypress.config('UniqueNumber'))
            cy.get('#save-button').click()
        });

        it("'The changes have been saved successfully.' message is displayed", function() {
            cy.contains('The changes have been saved successfully.')
        });


        

    });





describe("The user is able to add the 'Sole administrator' in the 'Company settings' section", function() {

        it("On the upper right corner click on the 'User icon' button", function() {
            cy.wait(5000)
            cy.get('#user-menu-trigger').click()
        });

        it("From the drop down menu click on 'Company' button", function() {
            cy.xpath('(//*[@role="menuitem"])[9]').click()
        });


        it("Navigate to the 'None' button and click on it", function() {
            cy.get('#company-governing-body-select').click()
        });

        it("From the dropdown menu choose and click on the 'Sole administrator' button and after that populate all required fields", function() {
            cy.get('#governing-body-1').click()
            cy.wait(1000)
            cy.get('#single-admin-name').clear().type(userID_Alpha())
            cy.get('#single-admin-dni').clear().type(Cypress.config('UniqueNumber'))
            cy.get('#single-admin-email').clear().type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com')
            cy.get('#single-admin-phone').clear().type(Cypress.config('UniqueNumber'))


        });

        it("Click on the “Save” button", function() {
            cy.get('#save-button').click()
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });


describe("The user is able to add the 'Boards of directors' in the 'Company Settings' section", function() {

        it("On the upper right corner click on the 'User icon' button", function() {
            cy.wait(5000)
            cy.get('#user-menu-trigger').click()
        });

        it("From the drop down menu click on 'Company' button", function() {
            cy.xpath('(//*[@role="menuitem"])[9]').click()
        });


        it("Navigate to the 'None' button and click on it", function() {
            cy.get('#company-governing-body-select').click()
        });

        it("From the dropdown menu choose and click on the 'Boards of directors' button and after that populate all required fields - MISSING IDs", function() {
            cy.get('#governing-body-5').click()
            cy.wait(1000)
            cy.get('#list-admin-add-button').click()
            cy.get('#list-admin-name').clear().type(userID_Alpha())
            cy.get('#list-admin-surname').clear().type(userID_Alpha())
            cy.get('#list-admin-dni').clear().type(Cypress.config('UniqueNumber'))
            cy.get('#list-admin-email').clear().type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com')
            cy.get('#list-admin-position').clear().type(userID_Alpha())
            cy.get('#list-admin-date').clear().type(Cypress.config('UniqueNumber'))
            cy.get('#list-admin-length').clear().type(Cypress.config('UniqueNumber'))
        });

        it("Click on the “Save” button", function() {
            cy.get('#save-button').click()
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to add the 'Solidarity administrators' in the 'Company Settings' section - MISSING IDs", function() {

        it("On the upper right corner click on the 'User icon' button", function() {
            cy.wait(5000)
            cy.get('#user-menu-trigger').click()
        });

        it("From the drop down menu click on 'Company' button", function() {
            cy.xpath('(//*[@role="menuitem"])[9]').click()
        });


        it("Navigate to the 'None' button and click on it", function() {
            cy.get('#company-governing-body-select').click()
        });

        it("From the dropdown menu choose and click on the 'Solidarity administrators' button and after that populate all required fields", function() {
            cy.get('#governing-body-4').click()
            cy.wait(1000)
            cy.get('#list-admin-add-button').click()
            cy.get('#list-admin-name').clear().type(userID_Alpha())
            cy.get('#list-admin-surname').clear().type(userID_Alpha())
            cy.get('#list-admin-dni').clear().type(Cypress.config('UniqueNumber'))
            cy.get('#list-admin-email').clear().type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com')
            cy.get('#list-admin-position').clear().type(userID_Alpha())
            cy.get('#list-admin-date').clear().type(Cypress.config('UniqueNumber'))
            cy.get('#list-admin-length').clear().type(Cypress.config('UniqueNumber'))
        });

        it("Click on the “Save” button", function() {
            cy.get('#save-button').click()
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to add the 'Joint administrators' in the 'Add company' section - MISSING IDs", function() {

        it("On the upper right corner click on the 'User icon' button", function() {
            cy.wait(5000)
            cy.get('#user-menu-trigger').click()
        });

        it("From the drop down menu click on 'Company' button", function() {
            cy.xpath('(//*[@role="menuitem"])[9]').click()
        });


        it("Navigate to the 'None' button and click on it", function() {
            cy.get('#company-governing-body-select').click()
        });

        it("From the dropdown menu choose and click on the 'Joint administrators' button and after that populate all required fields", function() {
            cy.get('#governing-body-3').click()
            cy.wait(1000)
            cy.get('#list-admin-add-button').click()
            cy.get('#list-admin-name').clear().type(userID_Alpha())
            cy.get('#list-admin-surname').clear().type(userID_Alpha())
            cy.get('#list-admin-dni').clear().type(Cypress.config('UniqueNumber'))
            cy.get('#list-admin-email').clear().type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com')
            cy.get('#list-admin-position').clear().type(userID_Alpha())
            cy.get('#list-admin-date').clear().type(Cypress.config('UniqueNumber'))
            cy.get('#list-admin-length').clear().type(Cypress.config('UniqueNumber'))
        });

        it("Click on the “Save” button", function() {
            cy.get('#save-button').click()
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to add the 'Sole administrator, legal entity' in the 'Add company' section - MISSING IDs", function() {

        it("On the upper right corner click on the 'User icon' button", function() {
            cy.wait(5000)
            cy.get('#user-menu-trigger').click()
        });

        it("From the drop down menu click on 'Company' button", function() {
            cy.xpath('(//*[@role="menuitem"])[9]').click()
        });


        it("Navigate to the 'None' button and click on it", function() {
            cy.get('#company-governing-body-select').click()
        });

        it("From the dropdown menu choose and click on the 'Sole administrator, legal entity' button and after that populate all required fields", function() {
            cy.get('#governing-body-2').click()
            cy.wait(1000)
            cy.get('#entity-admin-entity-name').clear().type(userID_Alpha())
            cy.get('#entity-admin-name').clear().type(userID_Alpha())
            cy.get('#entity-admin-dni').clear().type(Cypress.config('UniqueNumber'))
            cy.get('#entity-admin-email').clear().type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com')
            cy.get('#entity-admin-phone').clear().type(Cypress.config('UniqueNumber'))
        });

        it("Click on the “Save” button", function() {
            cy.get('#save-button').click()
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });


describe("The alert message is displayed when the user tries to switch to other type without saving changes", function() {

        it("Click on the 'Council types' button", function() {
            cy.get('#edit-statutes-block').click()
            cy.wait(1000)
        });

        it("Scroll down the page and populate some fields", function() {
            cy.contains('Email notification of the start of voting').click()
        });


        it("Navigate to the other type of meeting and click on it", function() {
            cy.contains('Extraordinary General Meeting').click()
            cy.wait(1000)
        });

        it("The alert message is successfully displayed", function() {
            cy.contains('Has unsaved changes')
        });

        it("Click on the “Save” button", function() {
            cy.contains('Save').click()
            cy.wait(1000)
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });


describe("The alert message is displayed when the user tries to switch to other type without saving changes", function() {

        it("Click on the 'Council types' button", function() {
            cy.get('#edit-statutes-block').click()
            cy.wait(1000)
        });

        it("Scroll down the page and populate some fields", function() {
            cy.contains('Email notification of the start of voting').click()
        });


        it("Navigate to the other type of meeting and click on it", function() {
            cy.contains('Extraordinary General Meeting').click()
            cy.wait(1000)
        });

        it("The alert message is successfully displayed", function() {
            cy.contains('Has unsaved changes')
        });

        it("Click on the “Save” button - MISSING ID", function() {
            cy.contains('Save').click()
            cy.wait(1000)
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to undo all changes in the 'Council Types' section", function() {

        it("Click on the 'Council types' button", function() {
            cy.get('#edit-statutes-block').click()
            cy.wait(1000)
        });

        it("Click on the “checkbox” in front of some fields", function() {
            cy.contains('Email notification of the start of voting').click()
        });


        it("Navigate to the other type of meeting and click on it", function() {
            cy.contains('Extraordinary General Meeting').click()
            cy.wait(1000)
        });

        it("Click on the “Undo Changes” button - MISSING ID", function() {
            cy.get('#MISSING_ID').click()
            cy.wait(1000)
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to edit a type of meeting in the 'Council types' section", function() {

        it("Click on the 'Council types' button", function() {
            cy.get('#edit-statutes-block').click()
            cy.wait(1000)
        });

        it("Click on the “checkbox” in front of some fields", function() {
            cy.contains('Email notification of the start of voting').click()
        });


        it("Populate fields with new data and click on the 'Save' button", function() {
            cy.contains('Extraordinary General Meeting').click()
            cy.wait(1000)
            cy.get('#MISSING_ID').click()
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });




