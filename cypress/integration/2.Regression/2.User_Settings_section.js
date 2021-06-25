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