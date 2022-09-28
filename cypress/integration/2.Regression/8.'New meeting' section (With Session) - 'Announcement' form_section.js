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
            .type('Mostar123!test')    
            .should("have.value", 'Mostar123!test')
    });

    it("Clicks login button", function() {
        cy.get("#login-button").click();
        
    });

});




describe("The user is able to select 'Meeting type' in the 'Announcement' section in the 'New meeting with session' type of meeting", function() {

        it("Click on the 'New Meeting' button", function() {
            cy.get('#create-council-block').click()
            
        });

        it("Click on the 'With session' buttonn", function() {
            cy.get('#create-council-with-session').click()
            
        });

        it("Navigate to the 'Meeting Type' section and click on it", function() {
            cy.get('#council-notice-type-select').click()
            
        });

        it("Click on the Meeting type you want", function() {
            cy.get('#council-notice-type-2')
            
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
            
        });


    });


describe("The user is able to select 'Meeting type' in the 'Announcement' section in the 'New meeting with session' type of meeting", function() {

        it("Click on the 'New Meeting' button", function() {
            cy.get('#create-council-block').click()
            
        });

        it("Click on the 'With session' buttonn", function() {
            cy.get('#create-council-with-session').click()
            
        });

        it("Navigate to the 'Meeting Type' section and click on it", function() {
            cy.get('#council-notice-type-select').click()
            
        });

        it("Click on the Meeting type you want", function() {
            cy.get('#council-notice-type-2')
            
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
            
        });


    });

describe("The user is able to view the details of the council in the 'Announcement' section in the 'New meeting' section", function() {

        it("Click on the 'New Meeting' button", function() {
            cy.get('#create-council-block').click()
            
        });

        it("Click on the 'With session' buttonn", function() {
            cy.get('#create-council-with-session').click()
            
        });

        it("Navigate to upper left corner and click on the “See Details” button", function() {
            cy.get('#council-editor-check-statute').click()
            
        });

        it("The details of council is successfully displayed", function() {
            cy.get('#modal-title')
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
            
        });


    });

describe("The user is able to change meeting date in the 'Announcement' section in the 'New meeting with session' type of meeting", function() {

        it("Click on the 'New Meeting' button", function() {
            cy.get('#create-council-block').click()
            
        });

        it("Click on the 'With session' buttonn", function() {
            cy.get('#create-council-with-session').click()
            
        });

        it("Navigate to the 'Date 1st call' section and click on the 'Calendar' icon", function() {
            cy.get('#council-notice-date-start-icon').click()
            
        });

        it("Select the time and date you want and click on the 'OK' button", function() {
            cy.get('#calendar-accept-button')
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
            
        });


    });


describe("The user is able to change meeting date in the 'Announcement' section in the 'New meeting with session' type of meeting", function() {

        it("Click on the 'New Meeting' button", function() {
            cy.get('#create-council-block').click()
            
        });

        it("Click on the 'With session' buttonn", function() {
            cy.get('#create-council-with-session').click()
            
        });

        it("Navigate to the 'Date 1st call' section and click on the 'Calendar' icon", function() {
            cy.get('#council-notice-date-start-icon').click()
            
        });

        it("Select the time and date you want and click on the 'OK' button", function() {
            cy.get('#calendar-accept-button')
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
            
        });


    });

describe("The user is able to change meeting title in the 'Announcement' section in the 'New meeting with session' type of meeting", function() {

        it("Click on the 'New Meeting' button", function() {
            cy.get('#create-council-block').click()
            
        });

        it("Click on the 'With session' buttonn", function() {
            cy.get('#create-council-with-session').click()
            
        });

        it("Navigated to the 'Meeting title' section", function() {
            cy.get('#council-notice-title')
        });

        it("Change the title name with the name you want", function() {
            cy.get('#council-notice-title').clear()
                .type('AutomationTest'+Cypress.config('UniqueNumber'))
        });

        it("Click on the “Save” button", function() {
            cy.get('#council-editor-save')
        })

        it("Back to Home page", function() {
            cy.visit(login_url);
            
        });


    });

describe("The user is able to change location to celebrate in remote through the platform Councilbox", function() {

        it("Click on the 'New Meeting' button", function() {
            cy.get('#create-council-block').click()
            
        });

        it("Click on the 'With session' buttonn", function() {
            cy.get('#create-council-with-session').click()
            
        });

        it("Click on the 'Change location' button", function() {
            cy.get('#council-notice-place').click()
            
        });

        it("Click on the checkbox to “Held remotely” option", function() {
            cy.get('#council-place-remote').click()
            
        });

        it("Click on the “Save” button", function() {
            cy.get('#accept-button')
        })

        it("Back to Home page", function() {
            cy.visit(login_url);
            
        });


    });

describe("The user is not able to create a meeting without populating 'Meeting title' field in the 'Announcement' section in the 'New meeting with session' type of the meeting", function() {

        it("Click on the 'New Meeting' button", function() {
            cy.get('#create-council-block').click()
            
        });

        it("Click on the 'With session' buttonn", function() {
            cy.get('#create-council-with-session').click()
            
        });

        it("Navigate to the 'Meeting title' section and delete an already written title", function() {
            cy.get('#council-notice-title').clear()
            
        });

        it("Populate all other required fields and click on the 'Next' button", function() {
            cy.get('#council-notice-convene-intro')
                .type('Test')
            cy.get('#council-editor-next').click()
            
        });

        it("A pop-up window with the “Review the form. There are errors or blank fields” message is displayed", function() {
            cy.get('#error-alert-title')
            
            cy.get('#error-alert-button').click()

        })

        it("Back to Home page", function() {
            cy.visit(login_url);
            
        });


    });

describe("The user is not able to change location in the 'Announcement' section in the 'New meeting with session' type of meeting without populating required fields", function() {

        it("Click on the 'New Meeting' button", function() {
            cy.get('#create-council-block').click()
            
        });

        it("Click on the 'With session' buttonn", function() {
            cy.get('#create-council-with-session').click()
            
        });

        it("Navigate to the 'Location' section and click on the 'Change location' button", function() {
            cy.get('#council-notice-place').click()
            
        });

        it("Remove the data from populated fields", function() {
            cy.get('#council-place-country').clear()
            
        });

        it("Click on the 'OK' button", function() {
            cy.get('#accept-button').click()
            

        })

        it("'This field is required' message is displayed beyond the required fields and the user is not able to change location without populating the fields", function() {
            cy.get('#council-place-country-error-text')
        })

        it("Back to Home page", function() {
            cy.visit(login_url);
            
        });


    });

describe("The user is able to select the 'Province' tag in the 'Information on the announcement*' field in the 'New meeting' section", function() {

        it("Click on the 'New Meeting' button", function() {
            cy.get('#create-council-block').click()
            
        });

        it("Click on the 'With session' buttonn", function() {
            cy.get('#create-council-with-session').click()
            
        });

        it("Navigate to the “Information on the announcement*” section and click on the 'tags' button", function() {
            cy.get('#custom-tags-council-notice-convene-footer').click()
            
        });

        it("Click on the “Province” button", function() {
            cy.get('#tag-4').click()
            
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
            
        });


    });

describe("The user is able to select the 'Country' tag in the 'Information on the announcement*'' field in the 'New meeting' section", function() {

        it("Click on the 'New Meeting' button", function() {
            cy.get('#create-council-block').click()
            
        });

        it("Click on the 'With session' buttonn", function() {
            cy.get('#create-council-with-session').click()
            
        });

        it("Navigate to the “Information on the announcement*” section and click on the 'tags' button", function() {
            cy.get('#custom-tags-council-notice-convene-footer').click()
            
        });

        it("Click on the “Country” button", function() {
            cy.get('#tag-3').click()
            
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
            
        });


    });

describe("The user is able to select the 'Business name' tag in the 'Information on the announcement*'' field in the 'New meeting' section", function() {

        it("Click on the 'New Meeting' button", function() {
            cy.get('#create-council-block').click()
            
        });

        it("Click on the 'With session' buttonn", function() {
            cy.get('#create-council-with-session').click()
            
        });

        it("Navigate to the “Information on the announcement*” section and click on the 'tags' button", function() {
            cy.get('#custom-tags-council-notice-convene-footer').click()
            
        });

        it("Click on the Business name button", function() {
            cy.get('#tag-1').click()
            
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
            
        });


    });

describe("The user is able to select the 'Place held' tag in the 'Information on the announcement*'' field in the 'New meeting' section", function() {

        it("Click on the 'New Meeting' button", function() {
            cy.get('#create-council-block').click()
            
        });

        it("Click on the 'With session' buttonn", function() {
            cy.get('#create-council-with-session').click()
            
        });

        it("Navigate to the “Information on the announcement*” section and click on the 'tags' button", function() {
            cy.get('#custom-tags-council-notice-convene-footer').click()
            
        });

        it("Click on the “Place held” button", function() {
            cy.get('#tag-2').click()
            
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
            
        });


    });

describe("The user is able to select the 'Date' tag in the 'Information on the announcement*'' field in the 'New meeting' section", function() {

        it("Click on the 'New Meeting' button", function() {
            cy.get('#create-council-block').click()
            
        });

        it("Click on the 'With session' buttonn", function() {
            cy.get('#create-council-with-session').click()
            
        });

        it("Navigate to the “Information on the announcement*” section and click on the 'tags' button", function() {
            cy.get('#custom-tags-council-notice-convene-footer').click()
            
        });

        it("Click on the “Date” button", function() {
            cy.get('#tag-0').click()
            
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
            
        });


    });

describe("The user is not able to create a 'New meeting with session' type of meeting without populating 'Information on the announcement*'' field", function() {

        it("Click on the 'New Meeting' button", function() {
            cy.get('#create-council-block').click()
            
        });

        it("Click on the 'With session' buttonn", function() {
            cy.get('#create-council-with-session').click()
            
        });

        it("Click on the 'Next' button without populating the 'Information on the announcement*' field", function() {
            cy.get('#council-editor-next').click()
            
        });

        it("Error “Review the form. There are errors or blank fields” message is displayed in the pop-up window", function() {
            cy.get('#error-alert-title').click()
            
            cy.get('#error-alert-button').click()
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
            
        });


    });

describe("The user is able to change location of meeting in the 'New meeting' section", function() {

        it("Click on the 'New Meeting' button", function() {
            cy.get('#create-council-block').click()
            
        });

        it("Click on the 'With session' buttonn", function() {
            cy.get('#create-council-with-session').click()
            
        });

        it("Click on the 'Change location' button", function() {
            cy.get('#council-notice-place').click()
            
        });

        it("Modify fields with changes you want and click on the 'OK' button", function() {
            cy.get('#council-place-remote').click()
            
            cy.get('#accept-button').click()
            
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
            
        });


    });