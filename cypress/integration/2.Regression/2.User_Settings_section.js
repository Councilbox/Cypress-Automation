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







describe("The user is able to change the 'Name' in the  'User settings' in the Councilbox", function() {
    
        it("Open the browser and enter the URL of the staging environment", function() {
            cy.visit(login_url);
            cy.wait(1000);
        });

        it("On the upper right corner click on 'User' icon", function() {
            cy.get('#user-menu-trigger').click()
        });

        it("From the drop down menu click on the 'Edit user' button", function() {
            cy.xpath('//*[@class="fa fa-edit"]').click()
        });

        it("Modify the 'Name' field", function() {
            cy.get('#user-settings-name')
                .clear()
                .type('Balla')
        });

        it("User should be able to save changes", function() {
            cy.get('#user-settings-save-button').click()
        });



    });

describe("The user is able to change the 'Surname' in the  'User settings' in the Councilbox", function() {
    
        it("Open the browser and enter the URL of the staging environment", function() {
            cy.visit(login_url);
            cy.wait(1000);
        });

        it("On the upper right corner click on 'User' icon", function() {
            cy.get('#user-menu-trigger').click()
        });

        it("From the drop down menu click on the 'Edit user' button", function() {
            cy.xpath('//*[@class="fa fa-edit"]').click()
        });

        it("Modify the 'Surname' field", function() {
            cy.get('#user-settings-surname')
                .clear()
                .type('Balic')
        });

        it("User should be able to save changes", function() {
            cy.get('#user-settings-save-button').click()
        });

    });

describe("The user is able to change the 'Telephone No' in the  'User settings' in the Councilbox", function() {
    
        it("Open the browser and enter the URL of the staging environment", function() {
            cy.visit(login_url);
            cy.wait(1000);
        });

        it("On the upper right corner click on 'User' icon", function() {
            cy.get('#user-menu-trigger').click()
        });

        it("From the drop down menu click on the 'Edit user' button", function() {
            cy.xpath('//*[@class="fa fa-edit"]').click()
        });

        it("Modify the 'Telephone No' field", function() {
            cy.get('#user-settings-phone')
                .clear()
                .type(Cypress.config('UniqueNumber'))
        });

        it("User should be able to save changes", function() {
            cy.get('#user-settings-save-button').click()
        });

    });

describe("The user is able to change the 'Email' in the  'User settings' in the Councilbox", function() {
    
        it("Open the browser and enter the URL of the staging environment", function() {
            cy.visit(login_url);
            cy.wait(1000);
        });

        it("On the upper right corner click on 'User' icon", function() {
            cy.get('#user-menu-trigger').click()
        });

        it("From the drop down menu click on the 'Edit user' button", function() {
            cy.xpath('//*[@class="fa fa-edit"]').click()
        });

        it("Modify the 'Email' field", function() {
            cy.get('#user-settings-email')
                .clear()
                .type('alem@qaengineers.net')
            cy.wait(1000)
        });

        it("User should be able to save changes", function() {
            cy.get('#user-settings-save-button').click()
        });

    });


describe("The user is able to select the 'Español' language in the  'User settings' in the Councilbox", function() {
    
        it("Open the browser and enter the URL of the staging environment", function() {
            cy.visit(login_url);
            cy.wait(1000);
        });
        
        it("On the upper right corner click on 'User' icon", function() {
            cy.get('#user-menu-trigger').click()
        });

        it("From the drop down menu click on the 'Edit user' button", function() {
            cy.xpath('//*[@class="fa fa-edit"]').click()
        });

        it("Navigate to the 'Language' section and select the 'English' language and click on the “Save” button", function() {
            cy.get('#user-settings-language').click()
            cy.get('#language-es').click()
        });

        it("User should be able to save changes", function() {
            cy.get('#user-settings-save-button').click()
        });

    });

describe("The user is able to select the 'Català' language in the  'User settings' in the Councilbox", function() {
    
        it("Open the browser and enter the URL of the staging environment", function() {
            cy.visit(login_url);
            cy.wait(1000);
        });
        
        it("On the upper right corner click on 'User' icon", function() {
            cy.get('#user-menu-trigger').click()
        });

        it("From the drop down menu click on the 'Edit user' button", function() {
            cy.xpath('//*[@class="fa fa-edit"]').click()
        });

        it("Navigate to the 'Language' section and select the 'English' language and click on the “Save” button", function() {
            cy.get('#user-settings-language').click()
            cy.get('#language-cat').click()
        });

        it("User should be able to save changes", function() {
            cy.get('#user-settings-save-button').click()
        });

    });

describe("The user is able to select the 'Português' language in the  'User settings' in the Councilbox", function() {
    
        it("Open the browser and enter the URL of the staging environment", function() {
            cy.visit(login_url);
            cy.wait(1000);
        });
        
        it("On the upper right corner click on 'User' icon", function() {
            cy.get('#user-menu-trigger').click()
        });

        it("From the drop down menu click on the 'Edit user' button", function() {
            cy.xpath('//*[@class="fa fa-edit"]').click()
        });

        it("Navigate to the 'Language' section and select the 'English' language and click on the “Save” button", function() {
            cy.get('#user-settings-language').click()
            cy.get('#language-pt').click()
        });

        it("User should be able to save changes", function() {
            cy.get('#user-settings-save-button').click()
        });

    });

describe("The user is able to select the 'Galego' language in the  'User settings' in the Councilbox", function() {
    
        it("Open the browser and enter the URL of the staging environment", function() {
            cy.visit(login_url);
            cy.wait(1000);
        });
        
        it("On the upper right corner click on 'User' icon", function() {
            cy.get('#user-menu-trigger').click()
        });

        it("From the drop down menu click on the 'Edit user' button", function() {
            cy.xpath('//*[@class="fa fa-edit"]').click()
        });

        it("Navigate to the 'Language' section and select the 'English' language and click on the “Save” button", function() {
            cy.get('#user-settings-language').click()
            cy.get('#language-gal').click()
        });

        it("User should be able to save changes", function() {
            cy.get('#user-settings-save-button').click()
        });

    });


describe("The user is able to select the 'Polsku' language in the  'User settings' in the Councilbox", function() {
    
        it("Open the browser and enter the URL of the staging environment", function() {
            cy.visit(login_url);
            cy.wait(1000);
        });
        
        it("On the upper right corner click on 'User' icon", function() {
            cy.get('#user-menu-trigger').click()
        });

        it("From the drop down menu click on the 'Edit user' button", function() {
            cy.xpath('//*[@class="fa fa-edit"]').click()
        });

        it("Navigate to the 'Language' section and select the 'English' language and click on the “Save” button", function() {
            cy.get('#user-settings-language').click()
            cy.get('#language-pl').click()
        });

        it("User should be able to save changes", function() {
            cy.get('#user-settings-save-button').click()
        });

    });


describe("The user is able to select the 'Euskera' language in the  'User settings' in the Councilbox", function() {
    
        it("Open the browser and enter the URL of the staging environment", function() {
            cy.visit(login_url);
            cy.wait(1000);
        });
        
        it("On the upper right corner click on 'User' icon", function() {
            cy.get('#user-menu-trigger').click()
        });

        it("From the drop down menu click on the 'Edit user' button", function() {
            cy.xpath('//*[@class="fa fa-edit"]').click()
        });

        it("Navigate to the 'Language' section and select the 'English' language and click on the “Save” button", function() {
            cy.get('#user-settings-language').click()
            cy.get('#language-eu').click()
        });

        it("User should be able to save changes", function() {
            cy.get('#user-settings-save-button').click()
        });

    });


describe("The user is able to select the 'Français' language in the  'User settings' in the Councilbox", function() {
    
        it("Open the browser and enter the URL of the staging environment", function() {
            cy.visit(login_url);
            cy.wait(1000);
        });
        
        it("On the upper right corner click on 'User' icon", function() {
            cy.get('#user-menu-trigger').click()
        });

        it("From the drop down menu click on the 'Edit user' button", function() {
            cy.xpath('//*[@class="fa fa-edit"]').click()
        });

        it("Navigate to the 'Language' section and select the 'English' language and click on the “Save” button", function() {
            cy.get('#user-settings-language').click()
            cy.get('#language-fr').click()
        });

        it("User should be able to save changes", function() {
            cy.get('#user-settings-save-button').click()
        });

    });

describe("The user is able to select the 'English' language in the  'User settings' in the Councilbox", function() {
    
        it("Open the browser and enter the URL of the staging environment", function() {
            cy.visit(login_url);
            cy.wait(1000);
        });
        
        it("On the upper right corner click on 'User' icon", function() {
            cy.get('#user-menu-trigger').click()
        });

        it("From the drop down menu click on the 'Edit user' button", function() {
            cy.xpath('//*[@class="fa fa-edit"]').click()
        });

        it("Navigate to the 'Language' section and select the 'English' language and click on the “Save” button", function() {
            cy.get('#user-settings-language').click()
            cy.get('#language-en').click()
        });

        it("User should be able to save changes", function() {
            cy.get('#user-settings-save-button').click()
        });

        it("Refresh the Web App", function() {
            cy.visit(login_url);
        })

    });


describe("The user is able to change password in the Councilbox", function() {
    
        it("On the upper right corner click on 'User' icon", function() {
            cy.get('#user-menu-trigger').click()
        });

        it("From the drop down menu click on the 'Edit user' button", function() {
            cy.xpath('//*[@class="fa fa-edit"]').click()
        });

        it("Click on the 'Change password' button", function() {
            cy.get('#user-change-password-button').click()
            cy.wait(1000)
        });


        it("Populate all required fields and click on the 'Save' button", function() {
            cy.get('#user-current-password')
                .type('Mostar123!')
            cy.get('#user-password')
                .type('Mostar123!')
            cy.get('#user-password-check')
                .type('Mostar123!')
            cy.get('#user-password-save').click()
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });

    });

describe("The user is not able to change password without populating the 'Current password' field", function() {
    
        it("On the upper right corner click on 'User' icon", function() {
            cy.get('#user-menu-trigger').click()
        });

        it("From the drop down menu click on the 'Edit user' button", function() {
            cy.xpath('//*[@class="fa fa-edit"]').click()
        });

        it("Click on the 'Change password' button", function() {
            cy.get('#user-change-password-button').click()
            cy.wait(1000)
        });

        it("Skip the “Current password” field", function() {
            cy.get('#user-current-password').clear()
            cy.wait(1000)
        });

        it("Populate the “New password” field", function() {
            cy.get('#user-password').clear()
                .type('Mostar123!')
            cy.wait(1000)
        });

        it("Populate the “Confirm” field", function() {
            cy.get('#user-password-check').clear()
                .type('Mostar123!')
            cy.wait(1000)
        });

        it("Click on the 'Save' button", function() {
            cy.get('#user-password-save').click()
            cy.wait(1000)
        });

        it("“The password cannot be empty” message is displayed", function() {
            cy.get('#user-current-password-error-text')
            cy.wait(1000)
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });

    });

describe("The user is not able to change password without populating the 'New password' field", function() {
    
        it("On the upper right corner click on 'User' icon", function() {
            cy.get('#user-menu-trigger').click()
        });

        it("From the drop down menu click on the 'Edit user' button", function() {
            cy.xpath('//*[@class="fa fa-edit"]').click()
        });

        it("Click on the 'Change password' button", function() {
            cy.get('#user-change-password-button').click()
            cy.wait(1000)
        });

        it("Populate the “Current password” field", function() {
            cy.get('#user-current-password').clear()
                .type('Mostar123!')
            cy.wait(1000)
        });

        it("Skip the “New password” field", function() {
            cy.get('#user-password').clear()
            cy.wait(1000)
        });

        it("Populate the “Confirm” field", function() {
            cy.get('#user-password-check').clear()
                .type('Mostar123!')
            cy.wait(1000)
        });

        it("Click on the 'Save' button", function() {
            cy.get('#user-password-save').click()
            cy.wait(1000)
        });

        it("“The password cannot be empty” alert message is displayed beyond the “New password” field", function() {
            cy.get('#user-password-error-text')
            cy.wait(1000)
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });

    });

describe("The user is not able to change password without populating the 'Confirm' field", function() {
    
        it("On the upper right corner click on 'User' icon", function() {
            cy.get('#user-menu-trigger').click()
        });

        it("From the drop down menu click on the 'Edit user' button", function() {
            cy.xpath('//*[@class="fa fa-edit"]').click()
        });

        it("Click on the 'Change password' button", function() {
            cy.get('#user-change-password-button').click()
            cy.wait(1000)
        });

        it("Populate the “Current password” field", function() {
            cy.get('#user-current-password').clear()
                .type('Mostar123!')
            cy.wait(1000)
        });

        it("Populate the “New password” field", function() {
            cy.get('#user-password').clear()
                .type('Mostar123!')
            cy.wait(1000)
        });

        it("Skip the “Confirm” field", function() {
            cy.get('#user-password-check').clear()
            cy.wait(1000)
        });

        it("Click on the 'Save' button", function() {
            cy.get('#user-password-save').click()
            cy.wait(1000)
        });

        it("“The passwords do not match” alert message is displayed beyond the “Confirm” field", function() {
            cy.get('#user-password-check-error-text')
            cy.wait(1000)
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });

    });

describe("The user is not able to change password without populating the 'Confirm' field", function() {
    
        it("On the upper right corner click on 'User' icon", function() {
            cy.get('#user-menu-trigger').click()
        });

        it("From the drop down menu click on the 'Edit user' button", function() {
            cy.xpath('//*[@class="fa fa-edit"]').click()
        });

        it("Click on the 'Change password' button", function() {
            cy.get('#user-change-password-button').click()
            cy.wait(1000)
        });

        it("Populate the “Current password” field with invalid inputs", function() {
            cy.get('#user-current-password').clear()
                .type('Starmo123!')
            cy.wait(1000)
        });

        it("Populate the “New password” field", function() {
            cy.get('#user-password').clear()
                .type('Mostar123!')
            cy.wait(1000)
        });

        it("Populate the “Confirm” field", function() {
            cy.get('#user-password-check').clear()
                .type('Mostar123!')
            cy.wait(1000)
        });

        it("Click on the 'Save' button", function() {
            cy.get('#user-password-save').click()
            cy.wait(1000)
        });

        it("“Incorrect current password” alert message is displayed beyond the “Current password field” field", function() {
            cy.get('#user-current-password-error-text')
            cy.wait(1000)
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });

    });

describe("The user is not able to change Email with invalid inputs", function() {
    
        it("On the upper right corner click on 'User' icon", function() {
            cy.get('#user-menu-trigger').click()
        });

        it("From the drop down menu click on the 'Edit user' button", function() {
            cy.xpath('//*[@class="fa fa-edit"]').click()
        });

        it("Populate the 'Name' field", function() {
            cy.get('#user-settings-name').clear()
                .type('Balla')
            cy.wait(1000)
        });

        it("Populate the 'Last Name' field", function() {
            cy.get('#user-settings-surname').clear()
                .type('Alem')
            cy.wait(1000)
        });

        it("Populate the “Email” field with invalid inputs", function() {
            cy.get('#user-settings-email').clear()
                .type('sfdafasdf')
            cy.wait(1000)
        });

        it("Populate the 'Telephone No' field", function() {
            cy.get('#user-settings-phone').clear()
                .type('123456')
            cy.wait(1000)
        });

        it("Click on the “Save” button", function() {
            cy.get('#user-settings-save-button').click()
            cy.wait(1000)
        });

        it("Observe the “Save” button and observe the message beyond the “Email” field - “Invalid field”", function() {
            cy.get('#user-settings-email-error-text')
            cy.wait(1000)
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });

    });

describe("The user is not able to save changes without populating the 'Last Name' field", function() {
    
        it("On the upper right corner click on 'User' icon", function() {
            cy.get('#user-menu-trigger').click()
        });

        it("From the drop down menu click on the 'Edit user' button", function() {
            cy.xpath('//*[@class="fa fa-edit"]').click()
        });

        it("Populate the 'Name' field", function() {
            cy.get('#user-settings-name').clear()
                .type('Balla')
            cy.wait(1000)
        });

        it("Skip the 'Last Name' field", function() {
            cy.get('#user-settings-surname').clear()
            cy.wait(1000)
        });

        it("Populate the “Email” field", function() {
            cy.get('#user-settings-email').clear()
                .type('alem@qaengineers.net')
            cy.wait(1000)
        });

        it("Populate the 'Telephone No' field", function() {
            cy.get('#user-settings-phone').clear()
                .type('123456')
            cy.wait(1000)
        });

        it("Click on the “Save” button", function() {
            cy.get('#user-settings-save-button').click()
            cy.wait(1000)
        })

        it("Observe the “Save” button and observe the message beyond the “Last Name” field - “This field is required.”", function() {
            cy.get('#user-settings-surname-error-text')
            cy.wait(1000)
        })

        it("Back to Home page", function() {
            cy.visit(login_url);
        });

    });

describe("The user is not able to save changes without populating the 'Email' field", function() {
    
        it("On the upper right corner click on 'User' icon", function() {
            cy.get('#user-menu-trigger').click()
        });

        it("From the drop down menu click on the 'Edit user' button", function() {
            cy.xpath('//*[@class="fa fa-edit"]').click()
        });

        it("Populate the 'Name' field", function() {
            cy.get('#user-settings-name').clear()
                .type('Balla')
            cy.wait(1000)
        });

        it("Skip the 'Last Name' field", function() {
            cy.get('#user-settings-surname').clear()
                .type('Alem')
            cy.wait(1000)
        });

        it("Skip the “Email” field", function() {
            cy.get('#user-settings-email').clear()
            cy.wait(1000)
        });

        it("Populate the 'Telephone No' field", function() {
            cy.get('#user-settings-phone').clear()
                .type('123456')
            cy.wait(1000)
        });

        it("Click on the “Save” button", function() {
            cy.get('#user-settings-save-button').click()
            cy.wait(1000)
        })

        it("Observe the “Save” button and observe the message beyond the “Email” field - “Invalid field”", function() {
            cy.get('#user-settings-email-error-text')
            cy.wait(1000)
        })

        it("Back to Home page", function() {
            cy.visit(login_url);
        });

    });

describe("The user is not able to save changes without populating the 'First Name' field", function() {
    
        it("On the upper right corner click on 'User' icon", function() {
            cy.get('#user-menu-trigger').click()
        });

        it("From the drop down menu click on the 'Edit user' button", function() {
            cy.xpath('//*[@class="fa fa-edit"]').click()
        });

        it("Populate the 'Name' field", function() {
            cy.get('#user-settings-name').clear()
            cy.wait(1000)
        });

        it("Skip the 'Last Name' field", function() {
            cy.get('#user-settings-surname').clear()
                .type('Alem')
            cy.wait(1000)
        });

        it("Skip the “Email” field", function() {
            cy.get('#user-settings-email').clear()
                .type('alem@qaengineers.net')
            cy.wait(1000)
        });

        it("Populate the 'Telephone No' field", function() {
            cy.get('#user-settings-phone').clear()
                .type('123456')
            cy.wait(1000)
        });

        it("Click on the “Save” button", function() {
            cy.get('#user-settings-save-button').click()
            cy.wait(1000)
        })

        it("Observe the “Save” button and observe the message beyond the “Name” field - “This field is required.”", function() {
            cy.get('#user-settings-name-error-text')
            cy.wait(1000)
        })

        it("Back to Home page", function() {
            cy.visit(login_url);
        });

    });