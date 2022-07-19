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
        
    });

});












describe("The user is not able to Link company with invalid inputs in the 'Master code' field", function() {
    
        it("From the dashboard click on the 'Link company' button", function() {
            cy.get('#entidadesSideBar').click({ force: true})
           
            cy.get('#company-link-nav-button').click({ force: true})

        });

        it("Populate the 'TIN of the organization*'' field", function() {
            cy.get('input').eq(0)
                .type("automationtest")
                .should("have.value", "automationtest")
        });

        it("Populate  'Master code' field with invalid input", function() {
            cy.get('input').eq(1)
                .type("123")
                .should("have.value", "123")
            cy.get('#company-link-button').click()
        });

        it("'Incorrect master key' message is displayed", function() {
            cy.get('#company-link-key-error-text')
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });

    });


describe("The user is not able to Link company with invalid inputs in the 'CIF of the entity*' field", function() {

        it("From the dashboard click on the 'Link company' button", function() {
            cy.get('#entidadesSideBar').click({ force: true})
          
            cy.get('#company-link-nav-button').click({ force: true})

        });

        it("Populate 'CIF of the entity*'' field", function() {
            cy.get('input').eq(0).clear()
                .type("123111111111111")
                .should("have.value", "123111111111111")
        });

        it("Populate 'Master key' field with invalid input", function() {
            cy.get('input').eq(1).clear()
                .type("123")
                .should("have.value", "123")
            cy.get('#company-link-button').click()
        });

        it("'COMPANY DOES NOT EXIST' message is displayed", function() {
            cy.get('#company-link-key-error-text')
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });



    });

describe("The user is able to Link Company", function() {

        it("From the dashboard click on the 'Link company' button", function() {
            cy.get('#entidadesSideBar').click({ force: true})
      
            cy.get('#company-link-nav-button').click({ force: true})

        });

        it("Populate 'TIN of the organization*' field", function() {
            cy.get('input').eq(0).clear()
                .type("automationtest1")
                .should("have.value", "automationtest1")
        });

        it("Populate 'Master key' field with invalid input", function() {
            cy.get('input').eq(1).clear()
                .type("automation")
                .should("have.value", "automation")
            cy.get('#company-link-button').click()
           
        });

        it("'Company linked correctly' message should be displayed ", function() {
            cy.get('#success-toast')
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });



    });
    /*

describe("The user is able to unlink the company", function() {


        it("On the upper left corner above 'Dashboard' click on 'Basic data' button", function() {
            cy.wait(2000)
            cy.get('#entidadesSideBar').click({ force: true})
            cy.xpath('(//*[@role="menuitem"])[2]').click()
            cy.get('#user-menu-trigger').click()
            cy.get('#user-settings-edit-company').click({ force: true })

        });

        it("Scroll down the page and in the right corner click on the 'Unlink' button", function() {
            cy.get('#company-unlink-button').click()
           
        });

        it("Click on the 'OK' button", function() {
            cy.get('#unlink-modal-button-accept').click()
           
        })

        it("Back to Home page", function() {
            cy.visit(login_url);
        });

    });

*/
describe("The user is able to edit 'Business name*'' in the Company settings in the Councilbox", function() {

        it("On the upper right corner click on the 'User icon' button", function() {
         
            cy.get('#user-menu-trigger').click()
        });

        it("From the drop down menu click on 'Company' button", function() {
            cy.get('#user-settings-edit-company').click({ force: true })
        });

        it("Modify the 'Business name*' field and click on the 'Save' button", function() {
            cy.get('#business-name').clear()
                .type(userID_Alpha()+Cypress.config('UniqueNumber'))
            cy.get('#save-button').click()
        });

        it("'The changes have been saved successfully.' message is displayed", function() {
            cy.get('#success-toast')
        });  

        it("Back to Home page", function() {
            cy.visit(login_url);
        });     

    });

describe("The user is able to edit 'TIN of the organization*' in the Company settings in the Councilbox", function() {

        it("On the upper right corner click on the 'User icon' button", function() {
           
            cy.get('#user-menu-trigger').click()
        });

        it("From the drop down menu click on 'Company' button", function() {
            cy.get('#user-settings-edit-company').click({ force: true })
        });

        it("Modify the 'TIN of the organization*'' field and click on the 'Save' button", function() {
            cy.get('#addSociedadCIF').clear()
                .type(userID_Alpha()+Cypress.config('UniqueNumber'))
            cy.get('#save-button').click()
        });

        it("'The changes have been saved successfully.' message is displayed", function() {
            cy.get('#success-toast')
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });

    });


describe("The user is able to edit 'Domain' in the 'Company settings' in the Councilbox", function() {

        it("On the upper right corner click on the 'User icon' button", function() {
            
            cy.get('#user-menu-trigger').click()
        });

        it("From the drop down menu click on 'Company' button", function() {
            cy.get('#user-settings-edit-company').click({ force: true })
        });

        it("Modify the 'Domain' field and click on the 'Save' button", function() {
            cy.get('#addSociedadDominio').clear()
                .type(userID_Alpha()+Cypress.config('UniqueNumber'))
            cy.get('#save-button').click()
        });

        it("'The changes have been saved successfully.' message is displayed", function() {
            cy.get('#success-toast')
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });

    });

describe("The user is able to edit 'Master code' in the 'Company settings' in the Councilbox", function() {

        it("On the upper right corner click on the 'User icon' button", function() {
           
            cy.get('#user-menu-trigger').click()
        });

        it("From the drop down menu click on 'Company' button", function() {
            cy.get('#user-settings-edit-company').click({ force: true })
        });

        it("Modify the 'Master code' field and click on the 'Save' button", function() {
            cy.get('#addSociedadClaveMaestra').clear()
                .type(userID_Alpha()+Cypress.config('UniqueNumber'))
            cy.get('#save-button').click()
        });

        it("'The changes have been saved successfully.' message is displayed", function() {
            cy.get('#success-toast')
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });

    });


describe("The user is able to edit 'Contact email' in the 'Company settings' in the Councilbox", function() {

        it("On the upper right corner click on the 'User icon' button", function() {
            
            cy.get('#user-menu-trigger').click()
        });

        it("From the drop down menu click on 'Company' button", function() {
            cy.get('#user-settings-edit-company').click({ force: true })
        });

        it("Modify the 'Contact email' field and click on the 'Save' button", function() {
            cy.get('#company-settings-contact-email').clear()
                .type('test@test.test')
            cy.get('#save-button').click()
        });

        it("'The changes have been saved successfully.' message is displayed", function() {
            cy.get('#success-toast')
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });

    });

describe("The user is able to edit 'Address' in the 'Contact details' in the Company settings in the Councilbox", function() {

        it("On the upper right corner click on the 'User icon' button", function() {
            
            cy.get('#user-menu-trigger').click()
        });

        it("From the drop down menu click on 'Company' button", function() {
            cy.get('#user-settings-edit-company').click({ force: true })
        });

        it("Modify the 'Address' field and click on the 'Save' button", function() {
            cy.get('#addSociedadDireccion').clear()
                .type(userID_Alpha()+Cypress.config('UniqueNumber'))
            cy.get('#save-button').click()
        });

        it("'The changes have been saved successfully.' message is displayed", function() {
            cy.get('#success-toast')
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });

    });

describe("The user is able to edit 'Town/City' in the 'Contact details' in the Company settings in the Councilbox", function() {

        it("On the upper right corner click on the 'User icon' button", function() {
            
            cy.get('#user-menu-trigger').click()
        });

        it("From the drop down menu click on 'Company' button", function() {
            cy.get('#user-settings-edit-company').click({ force: true })
        });

        it("Modify the 'Town/City' field and click on the 'Save' button", function() {
            cy.get('#addSociedadLocalidad').clear()
                .type(userID_Alpha()+Cypress.config('UniqueNumber'))
            cy.get('#save-button').click()
        });

        it("'The changes have been saved successfully.' message is displayed", function() {
            cy.get('#success-toast')
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });

    });

describe("The user is able to edit 'Country' in the 'Contact details' in the Company settings in the Councilbox", function() {

        it("On the upper right corner click on the 'User icon' button", function() {
          
            cy.get('#user-menu-trigger').click()
        });

        it("From the drop down menu click on 'Company' button", function() {
            cy.get('#user-settings-edit-company').click({ force: true })
        });

        it("Modify the 'Country' field and click on the 'Save' button", function() {
            cy.get('#company-country').click()
           
            cy.xpath('(//*[@role="option"])[1]').click()
            cy.get('#save-button').click()
        });

        it("'The changes have been saved successfully.' message is displayed", function() {
            cy.get('#success-toast')
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to edit 'Province' in the 'Contact details' in the Company settings in the Councilbox", function() {

        it("On the upper right corner click on the 'User icon' button", function() {
            
            cy.get('#user-menu-trigger').click()
        });

        it("From the drop down menu click on 'Company' button", function() {
            cy.get('#user-settings-edit-company').click({ force: true })
        });


        it("Modify the 'Province' field and click on the 'Save' button", function() {
            cy.get('#country-state-select').click()
           
            cy.xpath('(//*[@role="option"])[1]').click()
            cy.get('#save-button').click()
        });

        it("'The changes have been saved successfully.' message is displayed", function() {
            cy.get('#success-toast')
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to edit 'Zipcode' in the 'Contact details' in the Company settings in the Councilbox", function() {

        it("On the upper right corner click on the 'User icon' button", function() {
          
            cy.get('#user-menu-trigger').click()
        });

        it("From the drop down menu click on 'Company' button", function() {
            cy.get('#user-settings-edit-company').click({ force: true })
        });

        it("Modify the 'Zipcodce' field and click on the 'Save' button", function() {
            cy.get('#addSociedadCP').clear()
                .type(Cypress.config('UniqueNumber'))
            cy.get('#save-button').click()
        });

        it("'The changes have been saved successfully.' message is displayed", function() {
            cy.get('#success-toast')
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });

    });

describe("The user is able to edit 'Language' in the 'Contact details' in the Company settings in the Councilbox", function() {

        it("On the upper right corner click on the 'User icon' button", function() {
            
            cy.get('#user-menu-trigger').click()
        });

        it("From the drop down menu click on 'Company' button", function() {
            cy.get('#user-settings-edit-company').click({ force: true })
        });

        it("Modify the 'Language' field and click on the 'Save' button", function() {
            cy.get('#company-language-select').click()
           
            cy.xpath('(//*[@role="option"])[1]').click()
            cy.get('#save-button').click()
        });

        it("'The changes have been saved successfully.' message is displayed", function() {
            cy.get('#success-toast')
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });

    });


/*
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
            cy.get('#single-admin-name').clear()
                .type(userID_Alpha())
            cy.get('#single-admin-dni').clear()
                .type(Cypress.config('UniqueNumber'))
            cy.get('#single-admin-email').clear()
                .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com')
            cy.get('#single-admin-phone').clear()
                .type(Cypress.config('UniqueNumber'))
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

        it("From the dropdown menu choose and click on the 'Boards of directors' button and after that populate all required fields", function() {
            cy.get('#governing-body-5').click()
            cy.wait(1000)
            cy.get('#list-admin-add-button').click()
            cy.get('#list-admin-name').clear()
                .type(userID_Alpha())
            cy.get('#list-admin-surname').clear()
                .type(userID_Alpha())
            cy.get('#list-admin-dni').clear()
                .type(Cypress.config('UniqueNumber'))
            cy.get('#list-admin-email').clear()
                .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com')
            cy.get('#list-admin-position').clear()
                .type(userID_Alpha())
            cy.get('#list-admin-date').clear()
                .type(Cypress.config('UniqueNumber'))
            cy.get('#list-admin-length').clear()
                .type(Cypress.config('UniqueNumber'))
        });

        it("Click on the “Save” button", function() {
            cy.get('#save-button').click()
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to add the 'Solidarity administrators' in the 'Company Settings' section", function() {

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
            cy.get('#list-admin-name').clear()
                .type(userID_Alpha())
            cy.get('#list-admin-surname').clear()
                .type(userID_Alpha())
            cy.get('#list-admin-dni').clear()
                .type(Cypress.config('UniqueNumber'))
            cy.get('#list-admin-email').clear()
                .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com')
            cy.get('#list-admin-position').clear()
                .type(userID_Alpha())
            cy.get('#list-admin-date').clear()
                .type(Cypress.config('UniqueNumber'))
            cy.get('#list-admin-length').clear()
                .type(Cypress.config('UniqueNumber'))
        });

        it("Click on the “Save” button", function() {
            cy.get('#save-button').click()
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to add the 'Joint administrators' in the 'Add company' section", function() {

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
            cy.get('#list-admin-name').clear()
                .type(userID_Alpha())
            cy.get('#list-admin-surname').clear().type(userID_Alpha())
            cy.get('#list-admin-dni').clear()
                .type(Cypress.config('UniqueNumber'))
            cy.get('#list-admin-email').clear()
                .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com')
            cy.get('#list-admin-position').clear()
                .type(userID_Alpha())
            cy.get('#list-admin-date').clear()
                .type(Cypress.config('UniqueNumber'))
            cy.get('#list-admin-length').clear()
                .type(Cypress.config('UniqueNumber'))
        });

        it("Click on the “Save” button", function() {
            cy.get('#save-button').click()
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to add the 'Sole administrator, legal entity' in the 'Add company' section", function() {

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
            cy.get('#entity-admin-entity-name').clear()
                .type(userID_Alpha())
            cy.get('#entity-admin-name').clear()
                .type(userID_Alpha())
            cy.get('#entity-admin-dni').clear()
                .type(Cypress.config('UniqueNumber'))
            cy.get('#entity-admin-email').clear()
                .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com')
            cy.get('#entity-admin-phone').clear()
                .type(Cypress.config('UniqueNumber'))
        });

        it("Click on the “Save” button", function() {
            cy.get('#save-button').click()
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

*/