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

/*
describe("Switcing back to English language", function() {
    
        it("Open the browser and enter the URL of the staging environment", function() {
            cy.visit(login_url);
            cy.wait(1000);
        });
    
        it("Navigate to the 'Sign in' form", function() {
            cy.contains('Sign in to Councilbox')
        });

        it("Populate all required fields and click on 'To enter' button", function() {
            cy.get('#username').type('alem@qaengineers.net')
            cy.get('#password').type('Mostar123!')
            cy.get('#login-button').click()
        });

        it("On the upper right corner click on 'User' icon", function() {
            cy.get('#user-menu-trigger').click()
        });

        it("From the drop down menu select English language", function() {
            cy.xpath('//*[@class="fa fa-edit"]').click()
        });

        it("Modify the 'Name' field", function() {
            cy.contains('Español').click()
            cy.contains('English').click()
        });

        it("Modify the 'Name' field", function() {
            cy.contains('Guardar').click()
        });

    });

*/



describe("The user is not able to register to the Councilbox without populating required fields", function() {
    
        it("Open the browser and enter the URL of the staging environment", function() {
            cy.visit(login_url);
            cy.wait(1000);
        });
    
        it("Click on the 'Sign Up' button", function() {
            cy.get('#sign-up-button').click()
            cy.wait(1000)
        });

        it("Click on the “Sign up” button without populating required fields", function() {
            cy.get('#create-user-button').click()
        });

        it("An alert message is displayed beyond the fields", function() {
            cy.contains('Please enter a valid first name')
            cy.contains('Please enter valid last names')
            cy.contains('This field is required.')
            cy.contains('This field is required.')
            cy.contains('The password cannot be empty')
            cy.contains('I accept the terms and conditions.')
        })
    });


describe("The user is not able to create a new account in Councilbox with invalid inputs in the 'Name' field", function() {
    
        it("Open the browser and enter the URL of the staging environment", function() {
            cy.visit(login_url);
            cy.wait(1000);
        });
    
        it("Click on the 'Sign Up' button", function() {
            cy.get('#sign-up-button').click()
            cy.wait(1000)
        });

        it("Populate the 'Name' field with invalid inputs (with number)", function() {
            cy.get('#signup-name').clear()
                .type("12345")        
        });

        it("Populate the 'Surname' field", function() {
            cy.get('#signup-surname').clear()
                .type("Test")
                .should("have.value", "Test")
        });

        it("Populate the 'Phone' field", function() {
            cy.get('#signup-phone').clear()
                .type("123123123")
                .should("have.value", "123123123")
        });

        it("Populate the 'Email' and the 'Repeat email' fields", function() {
            cy.get('#signup-email').clear()
                .type("alem"+Cypress.config('UniqueNumber')+"@yopmail.com")
            
            cy.get('#signup-email-check').clear()
                .type("alem"+Cypress.config('UniqueNumber')+"@yopmail.com")
        });

        it("Populate the 'Password' and the 'Confirm password' fields", function() {
            cy.get('#signup-password').clear()
                .type("Mostar123!")
            cy.get('#signup-password-check').clear()
                .type("Mostar123!") 
        });

        it("Click on the checkbox to confirm terms and conditions of councilbox", function() {
            cy.get('#accept-legal-checkbox').click()
        });

        it("Click on 'Send' button", function() {
            cy.get('#create-user-button').click() 
        });

        it("Should display 'Please enter a valid first name'", function() {
            cy.contains('Please enter a valid first name')
        })
    });


describe("The user is not able to create a new account in Councilbox with invalid inputs in the 'Phone' field", function() {
    
        it("Open the browser and enter the URL of the staging environment", function() {
            cy.visit(login_url);
            cy.wait(1000);
        });
    
        it("Click on the 'Sign Up' button", function() {
            cy.get('#sign-up-button').click()
            cy.wait(1000)
        });

        it("Populate the 'Name' field with invalid inputs (with number)", function() {
            cy.get('#signup-name').clear()
                .type("Automation")           
        });

        it("Populate the 'Surname' field", function() {
            cy.get('#signup-surname').clear()
                .type("Test")
                .should("have.value", "Test")
        });

        it("Populate the 'Phone' field", function() {
            cy.get('#signup-phone').clear()
                .type("test")
                .should("have.value", "test")
        });

        it("Populate the 'Email' and the 'Repeat email' fields", function() {
            cy.get('#signup-email').clear()
                .type("alem"+Cypress.config('UniqueNumber')+"@yopmail.com")
            cy.get('#signup-email-check').clear()
                .type("alem"+Cypress.config('UniqueNumber')+"@yopmail.com")
        });

        it("Populate the 'Password' and the 'Confirm password' fields", function() {
             cy.get('#signup-password').clear()
                .type("Mostar123!")

             cy.get('#signup-password-check').clear()
                .type("Mostar123!") 
        });

        it("Click on the checkbox to confirm terms and conditions of councilbox", function() {
            cy.get('#accept-legal-checkbox').click()
        });

        it("Click on 'Send' button", function() {
            cy.get('#create-user-button').click()
        });

        it("Should display 'Please enter a valid phone number'", function() {
            cy.contains('Please enter a valid phone number')
        });
    });


describe("The user is not able to create a new account in Councilbox with invalid inputs in the 'Surname' field", function() {
    
        it("Open the browser and enter the URL of the staging environment", function() {
            cy.visit(login_url);
            cy.wait(1000);
        });
    
        it("Click on the 'Sign Up' button", function() {
            cy.get('#sign-up-button').click()
            cy.wait(1000)
        });

        it("Populate the 'Name' field with invalid inputs (with number)", function() {
            cy.get('#signup-name').clear()
                .type("Automation")
        });

        it("Populate the 'Surname' field", function() {
            cy.get('#signup-surname').clear()
                .type("12345")
                .should("have.value", "12345")
        });

        it("Populate the 'Phone' field", function() {
            cy.get('#signup-phone').clear()
                .type("123123123")
                .should("have.value", "123123123")
        }); 

        it("Populate the 'Email' and the 'Repeat email' fields", function() {
            cy.get('#signup-email').clear()
                .type("alem"+Cypress.config('UniqueNumber')+"@yopmail.com")
            cy.get('#signup-email-check').clear()
                .type("alem"+Cypress.config('UniqueNumber')+"@yopmail.com")
        });

        it("Populate the 'Password' and the 'Confirm password' fields", function() {
             cy.get('#signup-password').clear()
                .type("Mostar123!")
             cy.get('#signup-password-check').clear()
                .type("Mostar123!") 
        });

        it("Click on the checkbox to confirm terms and conditions of councilbox", function() {
            cy.get('#accept-legal-checkbox').click()
        });

        it("Click on 'Send' button", function() {
            cy.get('#create-user-button').click()
        });

        it("Please enter valid last names", function() {
            cy.contains('Please enter valid last names')
        })
    });


describe("The user is not able to register to the Councilbox with the E-mail already used", function() {
    
        it("Open the browser and enter the URL of the staging environment", function() {
            cy.visit(login_url);
            cy.wait(1000);
        });
    
        it("Click on the 'Sign Up' button", function() {
            cy.get('#sign-up-button').click()
            cy.wait(1000)
        });

        it("Populate the 'Name' field with invalid inputs (with number)", function() {
            cy.get('#signup-name').clear()
                .type("Automation")
        });

        it("Populate the 'Surname' field", function() {
            cy.get('#signup-surname').clear()
                .type("Test")
                .should("have.value", "Test")
        });


        it("Populate the 'Phone' field", function() {
            cy.get('#signup-phone').clear()
                .type("123123123")
                .should("have.value", "123123123")
        });

        it("Populate the 'Email' and the 'Repeat email' fields", function() {
            cy.get('#signup-email').clear()
                .type("alem@qaengineers.net")
            cy.get('#signup-email-check').clear()
                .type("alem@qaengineers.net")
        });

        it("Populate the 'Password' and the 'Confirm password' fields", function() {
            cy.get('#signup-password').clear()
                .type("Mostar123!")

            cy.get('#signup-password-check').clear()
                .type("Mostar123!") 
        });

        it("Click on the checkbox to confirm terms and conditions of councilbox", function() {
            cy.get('#accept-legal-checkbox').click()
        });

        it("Click on 'Send' button", function() {
            cy.get('#create-user-button').click()
        });

        it("'This email is already registered.'' message is displayed beyond the “Email” field", function() {
            cy.contains('This email is already registered.')
        });
    });


describe("The user is not able to register to the Councilbox with the invalid inputs in the 'Repeat Email' field", function() {
    
        it("Open the browser and enter the URL of the staging environment", function() {
            cy.visit(login_url);
            cy.wait(1000);
        });
    
        it("Click on the 'Sign Up' button", function() {
            cy.get('#sign-up-button').click()
            cy.wait(1000)
        });

        it("Populate the 'Name' field with invalid inputs (with number)", function() {
            cy.get('#signup-name').clear()
                .type("Automation")
        });

        it("Populate the 'Surname' field", function() {
            cy.get('#signup-surname').clear()
                .type("Test")
                .should("have.value", "Test")
        });

        it("Populate the 'Phone' field", function() {
            cy.get('#signup-phone').clear()
                .type("123123123")
                .should("have.value", "123123123")
        });

        it("Populate the 'Email' and the 'Repeat email' fields", function() {
            cy.get('#signup-email').clear()
                .type("alem"+Cypress.config('UniqueNumber')+"@yopmail.com")
            cy.get('#signup-email-check').clear()
                .type("alem123@test.test")
        });

        it("Populate the 'Password' and the 'Confirm password' fields", function() {
             cy.get('#signup-password').clear()
                .type("Mostar123!")
             cy.get('#signup-password-check').clear()
                .type("Mostar123!") 
        });

        it("Click on the checkbox to confirm terms and conditions of councilbox", function() {
            cy.get('#accept-legal-checkbox').click()
        });

        it("Click on 'Send' button", function() {
            cy.get('#create-user-button').click()
        });

        it("'The email does not match.'' message is displayed beyond the “Repeat Email” field", function() {
            cy.contains('The email does not match.')
        });
    });


describe("The user is not able to register to the Councilbox with the invalid inputs in the 'Confirm Password' field", function() {
    
        it("Open the browser and enter the URL of the staging environment", function() {
            cy.visit(login_url);
            cy.wait(1000);
        });
    
        it("Click on the 'Sign Up' button", function() {
            cy.get('#sign-up-button').click()
            cy.wait(1000)
        });

        it("Populate the 'Name' field with invalid inputs (with number)", function() {
            cy.get('#signup-name').clear()
            .type("Automation")
        });

        it("Populate the 'Surname' field", function() {
            cy.get('#signup-surname').clear()
                .type("Test")
                .should("have.value", "Test")
        });

        it("Populate the 'Phone' field", function() {
            cy.get('#signup-phone').clear()
                .type("123123123")
                .should("have.value", "123123123")
        });

        it("Populate the 'Email' and the 'Repeat email' fields", function() {
            cy.get('#signup-email').clear()
                .type("alem"+Cypress.config('UniqueNumber')+"@yopmail.com")
            cy.get('#signup-email-check').clear()
                .type("alem"+Cypress.config('UniqueNumber')+"@yopmail.com")
        });

        it("Populate the 'Password' and the 'Confirm password' fields", function() {
            cy.get('#signup-password').clear()
                .type("Mostar123!")
            cy.get('#signup-password-check').clear()
                .type("123456") 
        });

        it("Click on the checkbox to confirm terms and conditions of councilbox", function() {
            cy.get('#accept-legal-checkbox').click()
        });

        it("Click on 'Send' button", function() {
            cy.get('#create-user-button').click()
        });

        it("'The passwords do not match' message is displayed beyond the “Confirm Password” field", function() {
            cy.contains('The passwords do not match.')
        });
    });


describe("The user is not able to register without accepting terms and conditions", function() {
    
        it("Open the browser and enter the URL of the staging environment", function() {
            cy.visit(login_url);
            cy.wait(1000);
        });
    
        it("Click on the 'Sign Up' button", function() {
            cy.get('#sign-up-button').click()
            cy.wait(1000)
        });

        it("Populate the 'Name' field with invalid inputs (with number)", function() {
            cy.get('#signup-name').clear()
                .type("Automation")
        });

        it("Populate the 'Surname' field", function() {
            cy.get('#signup-surname').clear()
                .type("Test")
                .should("have.value", "Test")
        });

        it("Populate the 'Phone' field", function() {
            cy.get('#signup-phone').clear()
                .type("123123123")
                .should("have.value", "123123123")
        });

        it("Populate the 'Email' and the 'Repeat email' fields", function() {
            cy.get('#signup-email').clear()
                .type("alem"+Cypress.config('UniqueNumber')+"@yopmail.com")
            cy.get('#signup-email-check').clear()
                .type("alem"+Cypress.config('UniqueNumber')+"@yopmail.com")
        });

        it("Populate the 'Password' and the 'Confirm password' fields", function() {
            cy.get('#signup-password').clear()
                .type("Mostar123!")
            cy.get('#signup-password-check').clear()
                .type("Mostar123!") 
        });
        
        it("Click on 'Send' button", function() {
            cy.get('#create-user-button').click()
        });

        it("'I accept the terms and conditions' message is displayed", function() {
            cy.get('#accept-legal-checkbox').click()
        });
    });



describe("The user is not able to login in Councilbox with invalid inputs in the 'Email' field", function() {
    
        it("Open the browser and enter the URL of the staging environment", function() {
            cy.visit(login_url);
            cy.wait(1000);
        });
    
        it("Populate the “Email” field with invalid Email", function() {
            cy.get('#username')
                .type("alem53421@test.test")
        });

        it("Populate the “Password” field with valid inputs", function() {
            cy.get('#password')
                .type("Test12345")
                .should("have.value", "Test12345")
        });

        it("Click on the 'To enter' button without populating required fields", function() {
            cy.get('#login-button').click()
        });

        it("'The email is not verified or does not exist.' alert message is displayed", function() {
            cy.contains('The email was not verified or does not exist.')
        });

     });


describe("The user is not able to login in Councilbox with invalid password", function() {
    
        it("Open the browser and enter the URL of the staging environment", function() {
            cy.visit(login_url);
            cy.wait(1000);
        });
 
        it("Populate the “Email” field with invalid Email", function() {
            cy.get('#username')
                .type("alem@qaengineers.net")            
        });

        it("Populate the “Password” field with valid inputs", function() {
            cy.get('#password')
                .type("Test12345")
                .should("have.value", "Test12345")
        });

        it("Click on the 'To enter' button without populating required fields", function() {
            cy.get('#login-button').click()
        });

        it("'Incorrect password' alert message is displayed", function() {
            cy.contains('Incorrect password')
        });

     });


describe("The user is not able to login in Councilbox without populating required fields", function() {
    
        it("Open the browser and enter the URL of the staging environment", function() {
            cy.visit(login_url);
            cy.wait(1000);
        });
    
        it("Click on the 'To enter' button without populating required fields", function() {
            cy.get('#login-button').click()
        });

        it("'This field is required.' alert message is displayed beyond the “Email” and “Password” fields", function() {
            cy.contains('This field is required.')
        });

     });


describe("The user is able to change the 'Name' in the  'User settings' in the Councilbox", function() {
    
        it("Open the browser and enter the URL of the staging environment", function() {
            cy.visit(login_url);
            cy.wait(1000);
        });

        it("Populate all required fields and click on 'To enter' button", function() {
            cy.get('#username')
                .type('alem@qaengineers.net')
            cy.get('#password')
                .type('Mostar123!')
            cy.get('#login-button').click()
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

describe("The user is able to change the 'Phone' in the  'User settings' in the Councilbox", function() {
    
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

        it("Modify the 'Phone' field", function() {
            cy.get('#user-settings-phone')
                .clear()
                .type(Cypress.config('UniqueNumber'))
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
            cy.contains('English').click()
            cy.contains('Español').click()
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
            cy.contains('Español').click()
            cy.contains('Català').click()
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
            cy.contains('Català').click()
            cy.contains('Português').click()
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
            cy.contains('Português').click()
            cy.contains('Galego').click()
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
            cy.contains('Galego').click()
            cy.contains('Polsku').click()
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
            cy.contains('Polsku').click()
            cy.contains('Euskera').click()
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
            cy.contains('Euskera').click()
            cy.contains('Français').click()
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
            cy.contains('Français').click()
            cy.contains('English').click()
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

    });


describe("The user is not able to Link company with invalid inputs in the 'Master code' field", function() {
    
        it("From the dashboard click on the 'Link company' button", function() {
            cy.get('#entidadesSideBar').click({ force: true})
            cy.wait(1000)
            cy.contains('Link company').click({ force: true})

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
            cy.contains('Incorrect master code')
        });

    });


describe("The user is not able to Link company with invalid inputs in the 'CIF of the entity*' field", function() {

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
            cy.contains('COMPANY DOES NOT EXIST')
        });

    });

describe("The user is able to Link Company", function() {

        it("Populate 'TIN of the organization*' field", function() {
            cy.get('input').eq(0).clear()
                .type("automationtest")
                .should("have.value", "automationtest")
        });

        it("Populate 'Master key' field with invalid input", function() {
            cy.get('input').eq(1).clear()
                .type("automation")
                .should("have.value", "automation")
            cy.get('#company-link-button').click()
            cy.wait(3000)
        });

        it("'Company linked correctly' message should be displayed ", function() {
            cy.contains('Company linked correctly')
        });

        



    });

describe("The user is able to unlink the company", function() {

        it("On the upper left corner above 'Dashboard' click on 'Basic data' button", function() {
            cy.get('#entidadesSideBar').click({ force: true})
            cy.xpath('(//*[@role="menuitem"])[2]').click()
            cy.get('#user-menu-trigger').click()
            cy.xpath('(//*[@role="menuitem"])[10]').click()

        });

        it("Scroll down the page and in the right corner click on the 'Unlink' button", function() {
            cy.get('#company-unlink-button').click()
            cy.wait(1000)
        });

        it("Click on the 'OK' button", function() {
            cy.get('#unlink-modal-button-accept').click()
            cy.wait(1000)
        })

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
            cy.get('#business-name').clear()
                .type(userID_Alpha()+Cypress.config('UniqueNumber'))
            cy.get('#save-button').click()
        });

        it("'The changes have been saved successfully.' message is displayed", function() {
            cy.contains('The changes have been saved successfully.')
        });       

    });

describe("The user is able to edit 'TIN of the organization*' in the Company settings in the Councilbox", function() {

        it("On the upper right corner click on the 'User icon' button", function() {
            cy.wait(5000)
            cy.get('#user-menu-trigger').click()
        });

        it("From the drop down menu click on 'Company' button", function() {
            cy.xpath('(//*[@role="menuitem"])[9]').click()
        });

        it("Modify the 'TIN of the organization*'' field and click on the 'Save' button", function() {
            cy.get('#addSociedadCIF').clear()
                .type(userID_Alpha()+Cypress.config('UniqueNumber'))
            cy.get('#save-button').click()
        });

        it("'The changes have been saved successfully.' message is displayed", function() {
            cy.contains('The changes have been saved successfully.')
        });

    });


describe("The user is able to edit 'Domain' in the 'Company settings' in the Councilbox", function() {

        it("On the upper right corner click on the 'User icon' button", function() {
            cy.wait(5000)
            cy.get('#user-menu-trigger').click()
        });

        it("From the drop down menu click on 'Company' button", function() {
            cy.xpath('(//*[@role="menuitem"])[9]').click()
        });

        it("Modify the 'Domain' field and click on the 'Save' button", function() {
            cy.get('#addSociedadDominio').clear()
                .type(userID_Alpha()+Cypress.config('UniqueNumber'))
            cy.get('#save-button').click()
        });

        it("'The changes have been saved successfully.' message is displayed", function() {
            cy.contains('The changes have been saved successfully.')
        });

    });

describe("The user is able to edit 'Master code' in the 'Company settings' in the Councilbox", function() {

        it("On the upper right corner click on the 'User icon' button", function() {
            cy.wait(5000)
            cy.get('#user-menu-trigger').click()
        });

        it("From the drop down menu click on 'Company' button", function() {
            cy.xpath('(//*[@role="menuitem"])[9]').click()
        });

        it("Modify the 'Master code' field and click on the 'Save' button", function() {
            cy.get('#addSociedadClaveMaestra').clear()
                .type(userID_Alpha()+Cypress.config('UniqueNumber'))
            cy.get('#save-button').click()
        });

        it("'The changes have been saved successfully.' message is displayed", function() {
            cy.contains('The changes have been saved successfully.')
        });

    });


describe("The user is able to edit 'External ID' in the 'Company settings' in the Councilbox", function() {

        it("On the upper right corner click on the 'User icon' button", function() {
            cy.wait(5000)
            cy.get('#user-menu-trigger').click()
        });

        it("From the drop down menu click on 'Company' button", function() {
            cy.xpath('(//*[@role="menuitem"])[9]').click()
        });

        it("Modify the 'External ID' field and click on the 'Save' button", function() {
            cy.get('#company-external-id').clear()
                .type(userID_Alpha()+Cypress.config('UniqueNumber'))
            cy.get('#save-button').click()
        });

        it("'The changes have been saved successfully.' message is displayed", function() {
            cy.contains('The changes have been saved successfully.')
        });

    });

describe("The user is able to edit 'Address' in the 'Contact details' in the Company settings in the Councilbox", function() {

        it("On the upper right corner click on the 'User icon' button", function() {
            cy.wait(5000)
            cy.get('#user-menu-trigger').click()
        });

        it("From the drop down menu click on 'Company' button", function() {
            cy.xpath('(//*[@role="menuitem"])[9]').click()
        });

        it("Modify the 'Address' field and click on the 'Save' button", function() {
            cy.get('#addSociedadDireccion').clear()
                .type(userID_Alpha()+Cypress.config('UniqueNumber'))
            cy.get('#save-button').click()
        });

        it("'The changes have been saved successfully.' message is displayed", function() {
            cy.contains('The changes have been saved successfully.')
        });

    });

describe("The user is able to edit 'Town/City' in the 'Contact details' in the Company settings in the Councilbox", function() {

        it("On the upper right corner click on the 'User icon' button", function() {
            cy.wait(5000)
            cy.get('#user-menu-trigger').click()
        });

        it("From the drop down menu click on 'Company' button", function() {
            cy.xpath('(//*[@role="menuitem"])[9]').click()
        });

        it("Modify the 'Town/City' field and click on the 'Save' button", function() {
            cy.get('#addSociedadLocalidad').clear()
                .type(userID_Alpha()+Cypress.config('UniqueNumber'))
            cy.get('#save-button').click()
        });

        it("'The changes have been saved successfully.' message is displayed", function() {
            cy.contains('The changes have been saved successfully.')
        });

    });

describe("The user is able to edit 'Country' in the 'Contact details' in the Company settings in the Councilbox", function() {

        it("On the upper right corner click on the 'User icon' button", function() {
            cy.wait(5000)
            cy.get('#user-menu-trigger').click()
        });

        it("From the drop down menu click on 'Company' button", function() {
            cy.xpath('(//*[@role="menuitem"])[9]').click()
        });

        it("Modify the 'Country' field and click on the 'Save' button", function() {
            cy.get('#company-country').click()
            cy.wait(1000)
            cy.xpath('(//*[@role="option"])[1]').click()
            cy.get('#save-button').click()
        });

        it("'The changes have been saved successfully.' message is displayed", function() {
            cy.contains('The changes have been saved successfully.')
        });


    });

describe("The user is able to edit 'Province' in the 'Contact details' in the Company settings in the Councilbox", function() {

        it("On the upper right corner click on the 'User icon' button", function() {
            cy.wait(5000)
            cy.get('#user-menu-trigger').click()
        });

        it("From the drop down menu click on 'Company' button", function() {
            cy.xpath('(//*[@role="menuitem"])[9]').click()
        });


        it("Modify the 'Province' field and click on the 'Save' button", function() {
            cy.get('#country-state-select').click()
            cy.wait(1000)
            cy.xpath('(//*[@role="option"])[1]').click()
            cy.get('#save-button').click()
        });

        it("'The changes have been saved successfully.' message is displayed", function() {
            cy.contains('The changes have been saved successfully.')
        });


    });

describe("The user is able to edit 'Zipcode' in the 'Contact details' in the Company settings in the Councilbox", function() {

        it("On the upper right corner click on the 'User icon' button", function() {
            cy.wait(5000)
            cy.get('#user-menu-trigger').click()
        });

        it("From the drop down menu click on 'Company' button", function() {
            cy.xpath('(//*[@role="menuitem"])[9]').click()
        });

        it("Modify the 'Zipcodce' field and click on the 'Save' button", function() {
            cy.get('#addSociedadCP').clear()
                .type(Cypress.config('UniqueNumber'))
            cy.get('#save-button').click()
        });

        it("'The changes have been saved successfully.' message is displayed", function() {
            cy.contains('The changes have been saved successfully.')
        });

    });

describe("The user is able to edit 'Language' in the 'Contact details' in the Company settings in the Councilbox", function() {

        it("On the upper right corner click on the 'User icon' button", function() {
            cy.wait(5000)
            cy.get('#user-menu-trigger').click()
        });

        it("From the drop down menu click on 'Company' button", function() {
            cy.xpath('(//*[@role="menuitem"])[9]').click()
        });

        it("Modify the 'Language' field and click on the 'Save' button", function() {
            cy.get('#company-language-select').click()
            cy.wait(1000)
            cy.xpath('(//*[@role="option"])[1]').click()
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
            cy.get('#unsaved-changes-modal-button-accept').click()
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

        it("Click on the “Undo Changes” button", function() {
            cy.get('#discard-changes-button').click()
            cy.wait(1000)
        });

        it("Click on the 'OK' button", function() {
            cy.get('#alert-confirm-button-accept').click()
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

        it("From the list of meetings find and click the one you want to edit", function() {
            cy.contains('Extraordinary General Meeting').click()
            cy.wait(1000)
        });

        it("Populate fields with new data and click on the 'Save' button", function() {
            cy.contains('Email notification of the start of voting').click()
            cy.get('#council-statute-save-button').click()
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });


/*

describe("The user is able to Add a type of meeting in the 'Council types' section", function() {

        it("Click on the 'Council types' button", function() {
            cy.get('#edit-statutes-block').click()
            cy.wait(1000)
        });

        it("Click on 'Add type of meeting +' button", function() {
            cy.get('#anadirTipoDeReunion').click()
            cy.wait(1000)
        });


        it("Populate all required fields in Add type of meeting", function() {
            cy.get('#anadirTipoDeReunionInputEnModal').type('AlemTestAutomation')
        });

        it("Click on 'OK' button", function() {
            cy.get('#alert-confirm-button-accept').click()
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });




describe("The user is able to rename a type of meeting in the 'Types of meetings' section", function() {

        it("Click on the 'Council types' button", function() {
            cy.get('#edit-statutes-block').click()
            cy.wait(1000)
        });

        it("From the list of meetings choose the meeting you want to rename and hover it then click on the 'Rename meeting type' button", function() {
            cy.contains('AlemTestAutomation').click()
            cy.wait(1000)
            cy.get('#MISSING_ID').click()

        });


        it("Populate the “Meeting type*” field with a new name and click on the 'OK' button", function() {
            cy.get('#anadirTipoDeReunionInputEnModal')..clear().type('AlemTestAutomation')
            cy.get('#alert-confirm-button-accept').click()
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });




describe("The user is able to delete a type of meeting from the list of meetings in the 'Types of meetings' section", function() {

        it("Click on the 'Council types' button", function() {
            cy.get('#edit-statutes-block').click()
            cy.wait(1000)
        });

        it("Navigate to the already added meeting type and hover it then click on the “X” button", function() {
            cy.get('#MISSING_ID')
            cy.wait(1000)
        });


        it("Click on the 'Delete' button when the alert message appears", function() {
            cy.get('#alert-confirm-button-accept').click()
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

    

describe("The user is not able to add type of meeting without populating 'Meeting type*'' field in the 'Types of meetings' section", function() {

        it("Click on the 'Council types' button", function() {
            cy.get('#edit-statutes-block').click()
            cy.wait(1000)
        });

        it("Click on 'Add type of meeting +' button", function() {
            cy.get('#anadirTipoDeReunion').click()
            cy.wait(1000)
        });


        it("Click on the 'OK' button without populating the “Meeting type*”", function() {
            cy.get('#alert-confirm-button-accept').click()
        });

        it("The user is not able to add the meeting and the alert message 'Required field' is successfully displayed", function() {
            cy.contains('Required field')
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });


*/


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

describe("The user is able to choose and select 'Fraction' in the 'Quorum attendance 1st call' field in the 'Council types' form", function() {

        it("Click on the 'Council types' button", function() {
            cy.get('#edit-statutes-block').click()
            cy.wait(1000)
        });

        it("Navigate to the 'Attendance' section", function() {
            cy.contains('Attendance')
        });

        it("Navigate to the 'Quorum attendance 1st call' and click on the 'Fraction' button and enter the number then click on the 'Save' button", function() {
            cy.get('#council-type-quorum-first-call').click()
            cy.wait(1000)
            cy.get('#quorum-first-call-2').click()
            cy.wait(1000)
            cy.get('#council-statute-save-button').click()

        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to choose and select 'Number' in the 'Quorum attendance 1st call' field in the 'Council types' form", function() {

        it("Click on the 'Council types' button", function() {
            cy.get('#edit-statutes-block').click()
            cy.wait(1000)
        });

        it("Navigate to the 'Attendance' section", function() {
            cy.contains('Attendance')
        });

        it("Navigate to the 'Quorum attendance 1st call' and click on the 'Number' button and enter the number then click on the 'Save' button", function() {
            cy.get('#council-type-quorum-first-call').click()
            cy.wait(1000)
            cy.get('#quorum-first-call-3').click()
            cy.wait(1000)
            cy.get('#council-statute-save-button').click()

        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to choose and select 'None' in the 'Quorum attendance 1st call' field in the 'Council types' form", function() {

        it("Click on the 'Council types' button", function() {
            cy.get('#edit-statutes-block').click()
            cy.wait(1000)
        });

        it("Navigate to the 'Attendance' section", function() {
            cy.contains('Attendance')
        });

        it("Navigate to the 'Quorum attendance 1st call' and click on the 'None' button and enter the number then click on the 'Save' button", function() {
            cy.get('#council-type-quorum-first-call').click()
            cy.wait(1000)
            cy.get('#quorum-first-call--1').click()
            cy.wait(1000)
            cy.get('#council-statute-save-button').click()

        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });


describe("The user is able to choose and select 'Percentage' in the 'Quorum attendance 2nd call' field in the 'Council types' form", function() {

        it("Click on the 'Council types' button", function() {
            cy.get('#edit-statutes-block').click()
            cy.wait(1000)
        });

        it("Navigate to the 'Attendance' section", function() {
            cy.contains('Attendance')
        });

        it("Navigate to the 'Quorum attendance 2nd call' and click on the 'Percentage' button and enter the number then click on the 'Save' button", function() {
            cy.get('#council-type-quorum-second-call').click()
            cy.wait(1000)
            cy.get('#quorum-second-call-0').click()
            cy.wait(1000)
            cy.get('#council-statute-save-button').click()

        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to choose and select 'Fraction' in the 'Quorum attendance 2nd call' field in the 'Council types' form", function() {

        it("Click on the 'Council types' button", function() {
            cy.get('#edit-statutes-block').click()
            cy.wait(1000)
        });

        it("Navigate to the 'Attendance' section", function() {
            cy.contains('Attendance')
        });

        it("Navigate to the 'Quorum attendance 2nd call' and click on the 'Fraction' button and enter the number then click on the 'Save' button", function() {
            cy.get('#council-type-quorum-second-call').click()
            cy.wait(1000)
            cy.get('#quorum-second-call-2').click()
            cy.wait(1000)
            cy.get('#council-statute-save-button').click()

        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to choose and select 'Number' in the 'Quorum attendance 2nd call' field in the 'Council types' form", function() {

        it("Click on the 'Council types' button", function() {
            cy.get('#edit-statutes-block').click()
            cy.wait(1000)
        });

        it("Navigate to the 'Attendance' section", function() {
            cy.contains('Attendance')
        });

        it("Navigate to the 'Quorum attendance 2nd call' and click on the 'Number' button and enter the number then click on the 'Save' button", function() {
            cy.get('#council-type-quorum-second-call').click()
            cy.wait(1000)
            cy.get('#quorum-second-call-3').click()
            cy.wait(1000)
            cy.get('#council-statute-save-button').click()

        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to choose and select 'Half plus one' in the 'Quorum attendance 2nd call' field in the 'Council types' form", function() {

        it("Click on the 'Council types' button", function() {
            cy.get('#edit-statutes-block').click()
            cy.wait(1000)
        });

        it("Navigate to the 'Attendance' section", function() {
            cy.contains('Attendance')
        });

        it("Navigate to the 'Quorum attendance 2nd call' and click on the 'Half plus one' button and enter the number then click on the 'Save' button", function() {
            cy.get('#council-type-quorum-second-call').click()
            cy.wait(1000)
            cy.get('#quorum-second-call-1').click()
            cy.wait(1000)
            cy.get('#council-statute-save-button').click()

        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to choose and select 'None' in the 'Quorum attendance 2nd call' field in the 'Council types' form", function() {

        it("Click on the 'Council types' button", function() {
            cy.get('#edit-statutes-block').click()
            cy.wait(1000)
        });

        it("Navigate to the 'Attendance' section", function() {
            cy.contains('Attendance')
        });

        it("Navigate to the 'Quorum attendance 2nd call' and click on the 'None' button and enter the number then click on the 'Save' button", function() {
            cy.get('#council-type-quorum-second-call').click()
            cy.wait(1000)
            cy.get('#quorum-second-call--1').click()
            cy.wait(1000)
            cy.get('#council-statute-save-button').click()

        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to choose and select 'Delegated vote' option for the call in the 'Attendance' section in the 'Council types' section", function() {

        it("Click on the 'Council types' button", function() {
            cy.get('#edit-statutes-block').click()
            cy.wait(1000)
        });

        it("Navigate to the 'Attendance' section", function() {
            cy.contains('Attendance')
        });

        it("Click on the 'There is a delegated vote' checkbox and click on the 'Save' button", function() {
            cy.get('#council-type-delegated-vote').click()
            cy.wait(1000)
            cy.get('#council-statute-save-button').click()
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to choose and select 'The sense of vote can be indicated in the delegations' option for the call in the 'Attendance' section in the 'Council types' section", function() {

        it("Click on the 'Council types' button", function() {
            cy.get('#edit-statutes-block').click()
            cy.wait(1000)
        });

        it("Navigate to the 'Attendance' section", function() {
            cy.contains('Attendance')
        });

        it("Click on the 'The sense of vote can be indicated in the delegations' checkbox and click on the 'Save' button", function() {
            cy.get('#council-type-vote-sense').click()
            cy.wait(1000)
            cy.get('#council-statute-save-button').click()
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to choose and select 'Early voting' option for the call in the 'Assistance' section in the 'Council types' section", function() {

        it("Click on the 'Council types' button", function() {
            cy.get('#edit-statutes-block').click()
            cy.wait(1000)
        });

        it("Navigate to the 'Attendance' section", function() {
            cy.contains('Attendance')
        });

        it("Click on the 'There is early voting' checkbox and click on the 'Save' button", function() {
            cy.get('#council-type-early-vote').click()
            cy.wait(1000)
            cy.get('#council-statute-save-button').click()
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to choose and select 'There is maximum number of delegated votes option for the call' in the 'Assistance' section in the 'Council types' section", function() {

        it("Click on the 'Council types' button", function() {
            cy.get('#edit-statutes-block').click()
            cy.wait(1000)
        });

        it("Navigate to the 'Attendance' section", function() {
            cy.contains('Attendance')
        });

        it("Click on the 'There is a maximum number of delegated votes' checkbox and navigate to the 'Vote' field and populate it then click on the 'Save' button", function() {
            cy.get('#council-type-max-delegated').click()
            cy.wait(1000)
            cy.get('#council-type-max-delegated-number').clear()
                .type('3')
            cy.get('#council-statute-save-button').click()
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to choose and select 'Access to the room is limited after the start' option for the call in the 'Assistance' section in the 'Council types' section", function() {

        it("Click on the 'Council types' button", function() {
            cy.get('#edit-statutes-block').click()
            cy.wait(1000)
        });

        it("Navigate to the 'Attendance' section", function() {
            cy.contains('Attendance')
        });

        it("Click on the 'Access to the room is limited after the start' checkbox and navigate to the 'Minutes' field and populate it then click on the 'Save' button", function() {
            cy.get('#council-type-limited-access').click()
            cy.wait(1000)
            cy.get('#council-type-limited-access-minutes').clear()
                .type('3')
            cy.get('#council-statute-save-button').click()
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });



describe("The user is able to choose and select 'Against' option for the call in the 'Default vote sense' field in the  'Completion of social agreements' section in the 'Council types' section", function() {

        it("Click on the 'Council types' button", function() {
            cy.get('#edit-statutes-block').click()
            cy.wait(1000)
        });

        it("Scroll down the page and navigate to the 'Making resolutions' section", function() {
            cy.contains('Making resolutions')
        });

        it("Navigate to the 'Default vote sense' field", function() {
            cy.contains('Default voting').scrollIntoView()
            cy.wait(1000)
            //cy.get('.sidebar').scrollTo('bottom')
            cy.get('#council-type-default-vote').click()
            cy.wait(1000)
        });

        it("Click on the 'Against' button and click on the 'Save' button", function() {
            cy.get('#default-vote-0').click()
            cy.wait(1000)
            cy.get('#council-statute-save-button').click()
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to choose and select 'No vote' option for the call in the 'Default vote sense' field in the  'Completion of social agreements' section in the 'Council types' section", function() {

        it("Click on the 'Council types' button", function() {
            cy.get('#edit-statutes-block').click()
            cy.wait(1000)
        });

        it("Scroll down the page and navigate to the 'Making resolutions' section", function() {
            cy.contains('Making resolutions')
        });

        it("Navigate to the 'Default vote sense' field", function() {
            cy.contains('Default voting').scrollIntoView()
            cy.wait(1000)
            //cy.get('.sidebar').scrollTo('bottom')
            cy.get('#council-type-default-vote').click()
            cy.wait(1000)
        });

        it("Click on the 'No vote' button and click on the 'Save' button", function() {
            cy.get('#default-vote-no-vote').click()
            cy.wait(1000)
            cy.get('#council-statute-save-button').click()
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });


describe("The user is able to choose and select 'In favor' option for the call in the 'Default vote sense' field in the  'Completion of social agreements' section in the 'Council types' section", function() {

        it("Click on the 'Council types' button", function() {
            cy.get('#edit-statutes-block').click()
            cy.wait(1000)
        });

        it("Scroll down the page and navigate to the 'Making resolutions' section", function() {
            cy.contains('Making resolutions')
        });

        it("Navigate to the 'Default vote sense' field", function() {
            cy.contains('Default voting').scrollIntoView()
            cy.wait(1000)
            //cy.get('.sidebar').scrollTo('bottom')
            cy.get('#council-type-default-vote').click()
            cy.wait(1000)
        });

        it("Click on the 'In favor' button and click on the 'Save' button", function() {
            cy.get('#default-vote-1').click()
            cy.wait(1000)
            cy.get('#council-statute-save-button').click()
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to choose and select 'Abstention' option for the call in the 'Default vote sense' field in the  'Completion of social agreements' section in the 'Council types' section", function() {

        it("Click on the 'Council types' button", function() {
            cy.get('#edit-statutes-block').click()
            cy.wait(1000)
        });

        it("Scroll down the page and navigate to the 'Making resolutions' section", function() {
            cy.contains('Making resolutions')
        });

        it("Navigate to the 'Default vote sense' field", function() {
            cy.contains('Default voting').scrollIntoView()
            cy.wait(1000)
            //cy.get('.sidebar').scrollTo('bottom')
            cy.get('#council-type-default-vote').click()
            cy.wait(1000)
        });

        it("Click on the 'Abstention' button and click on the 'Save' button", function() {
            cy.get('#default-vote-2').click()
            cy.wait(1000)
            cy.get('#council-statute-save-button').click()
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });


describe("The user is able to choose and select 'There are comments on the agenda items' option for the call in the 'Making resolutions' section in the 'Council types' section", function() {

        it("Click on the 'Council types' button", function() {
            cy.get('#edit-statutes-block').click()
            cy.wait(1000)
        });

        it("Scroll down the page and navigate to the 'Making resolutions' section", function() {
            cy.contains('Making resolutions').scrollIntoView()
        });

        it("Click on the 'There are comments on the agenda items' checkbox and click on the 'Save' button", function() {
            cy.get('#council-type-has-comments').click()
            cy.wait(1000)
            cy.get('#council-statute-save-button').click()
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to choose and select 'Email notification of voting start' option for the call in the 'Making resolutions' section in the 'Council types' section", function() {

        it("Click on the 'Council types' button", function() {
            cy.get('#edit-statutes-block').click()
            cy.wait(1000)
        });

        it("Scroll down the page and navigate to the 'Making resolutions' section", function() {
            cy.contains('Making resolutions').scrollIntoView()
        });

        it("Click on the 'Email notification of voting start' checkbox and click on the 'Save' button", function() {
            cy.get('#council-type-notify-points').click()
            cy.wait(1000)
            cy.get('#council-statute-save-button').click()
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to choose and select 'Exists quality vote' option for the call in the 'Making resolutions' section in the 'Council types' section", function() {

        it("Click on the 'Council types' button", function() {
            cy.get('#edit-statutes-block').click()
            cy.wait(1000)
        });

        it("Scroll down the page and navigate to the 'Making resolutions' section", function() {
            cy.contains('Making resolutions').scrollIntoView()
        });

        it("Click on the 'Exists quality vote' checkbox and click on the 'Save' button", function() {
            cy.get('#council-type-quality-vote').click()
            cy.wait(1000)
            cy.get('#council-statute-save-button').click()
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to choose and select 'Chairperson' option for the call in the 'Making resolutions' section in the 'Council types' section", function() {

        it("Click on the 'Council types' button", function() {
            cy.get('#edit-statutes-block').click()
            cy.wait(1000)
        });

        it("Scroll down the page and navigate to the 'Making resolutions' section", function() {
            cy.contains('Making resolutions').scrollIntoView()
        });

        it("Click on the 'President' checkbox and click on the 'Save' button", function() {
            cy.get('#council-type-president').click()
            cy.wait(1000)
            cy.get('#council-statute-save-button').click()
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });


describe("The user is able to choose and select 'Secretary' option for the call in the 'Making resolutions' section in the 'Council types' section", function() {

        it("Click on the 'Council types' button", function() {
            cy.get('#edit-statutes-block').click()
            cy.wait(1000)
        });

        it("Scroll down the page and navigate to the 'Making resolutions' section", function() {
            cy.contains('Making resolutions').scrollIntoView()
        });

        it("Click on the 'Secretary' checkbox and click on the 'Save' button", function() {
            cy.get('#council-type-secretary').click()
            cy.wait(1000)
            cy.get('#council-statute-save-button').click()
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to choose and select 'Hide recounts until voting is closed' option for the call in the 'Making resolutions' section in the 'Council types' section", function() {

        it("Click on the 'Council types' button", function() {
            cy.get('#edit-statutes-block').click()
            cy.wait(1000)
        });

        it("Scroll down the page and navigate to the 'Making resolutions' section", function() {
            cy.contains('Making resolutions').scrollIntoView()
        });

        it("Click on the 'Hide recounts until voting is closed' checkbox and click on the 'Save' button", function() {
            cy.get('#council-type-hide-recount').click()
            cy.wait(1000)
            cy.get('#council-statute-save-button').click()
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to choose and select 'There are present participants with electronic vote' option for the call in the 'Making resolutions' section in the 'Council types' section", function() {

        it("Click on the 'Council types' button", function() {
            cy.get('#edit-statutes-block').click()
            cy.wait(1000)
        });

        it("Scroll down the page and navigate to the 'Making resolutions' section", function() {
            cy.contains('Making resolutions').scrollIntoView()
        });

        it("Click on the 'There are present participants with electronic vote' checkbox and click on the 'Save' button", function() {
            cy.get('#council-type-remote-vote').click()
            cy.wait(1000)
            cy.get('#council-statute-save-button').click()
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to choose and select 'It is permitted to reorder items on the agenda during the meeting' option for the call in the 'Making resolutions' section in the 'Council types' section", function() {

        it("Click on the 'Council types' button", function() {
            cy.get('#edit-statutes-block').click()
            cy.wait(1000)
        });

        it("Scroll down the page and navigate to the 'Making resolutions' section", function() {
            cy.get('#council-type-agenda-reorder').scrollIntoView()
            cy.wait(1000)
        });

        it("Click on the 'It is permitted to reorder items on the agenda during the meeting' checkbox and click on the 'Save' button", function() {
            cy.get('#council-type-agenda-reorder').click()
            cy.wait(1000)
            cy.get('#council-statute-save-button').click()
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to choose and select 'Those banned may be readmitted' option for the call in the 'Making resolutions' section in the 'Council types' section", function() {

        it("Click on the 'Council types' button", function() {
            cy.get('#edit-statutes-block').click()
            cy.wait(1000)
        });

        it("Scroll down the page and navigate to the 'Making resolutions' section", function() {
            cy.get('#council-type-can-unblock').scrollIntoView()
            cy.wait(1000)
        });

        it("Click on the 'Those banned may be readmitted' checkbox and click on the 'Save' button", function() {
            cy.get('#council-type-can-unblock').click()
            cy.wait(1000)
            cy.get('#council-statute-save-button').click()
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to choose and select 'Associated census' for the call in the 'Census' section in the 'Types of meetings' form", function() {

        it("Click on the 'Council types' button", function() {
            cy.get('#edit-statutes-block').click()
            cy.wait(1000)
        });

        it("Scroll down the page and navigate to the 'Census' section", function() {
            cy.get('#council-type-default-census').scrollIntoView()
            cy.wait(1000)
        });

        it("Navigate to the 'Associated census' and from the dropdown menu choose and click on the Census you want to select then click on the 'Save' button", function() {
            cy.get('#council-type-default-census').click()
            cy.wait(1000)
            cy.get('#census-governing-body').click()
            cy.wait(1000)
            cy.get('#council-statute-save-button').click()
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to choose and select 'Minutes exist' option for the call in the 'Minutes and documents' section in the 'Types of meetings' section", function() {

        it("Click on the 'Council types' button", function() {
            cy.get('#edit-statutes-block').click()
            cy.wait(1000)
        });

        it("Scroll down the page and navigate to the 'Minutes and documents' section", function() {
            cy.get('#council-type-has-act').scrollIntoView()
            cy.wait(1000)
        });

        it("Click on the 'Minutes exist' checkbox and click on the 'Save' button", function() {
            cy.get('#council-type-has-act').click()
            cy.wait(1000)
            cy.get('#council-statute-save-button').click()
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to choose and select 'A list of participants is included in the minutes' option for the call in the 'Minutes and documents' section in the 'Types of meetings' section", function() {

        it("Click on the 'Council types' button", function() {
            cy.get('#edit-statutes-block').click()
            cy.wait(1000)
        });

        it("Scroll down the page and navigate to the 'Minutes and documents' section", function() {
            cy.get('#council-type-include-attendants-list').scrollIntoView()
            cy.wait(1000)
        });

        it("Click on the 'A list of participants is included in the minutes' checkbox and click on the 'Save' button", function() {
            cy.get('#council-type-include-attendants-list').click()
            cy.wait(1000)
            cy.get('#council-statute-save-button').click()
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });


describe("The user is able to choose and select 'It is included in the minute book' option for the call in the 'Minutes and documents' section in the 'Types of meetings' section", function() {

        it("Click on the 'Council types' button", function() {
            cy.get('#edit-statutes-block').click()
            cy.wait(1000)
        });

        it("Scroll down the page and navigate to the 'Minutes and documents' section", function() {
            cy.get('#council-type-include-act-book').scrollIntoView()
            cy.wait(1000)
        });

        it("Click on the 'It is included in the minute book' checkbox and click on the 'Save' button", function() {
            cy.get('#council-type-include-act-book').click()
            cy.wait(1000)
            cy.get('#council-statute-save-button').click()
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to choose and select 'Double column' option for the call in the 'Documents' section in the 'Types of meetings' section", function() {

        it("Click on the 'Council types' button", function() {
            cy.get('#edit-statutes-block').click()
            cy.wait(1000)
        });

        it("Scroll down the page and navigate to the 'Documents' section", function() {
            cy.get('#council-type-double-column').scrollIntoView()
            cy.wait(1000)
        });

        it("Click on the 'Double column' checkbox and click on the 'Save' button", function() {
            cy.get('#council-type-double-column').click()
            cy.wait(1000)
            cy.get('#council-statute-save-button').click()
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to choose and select 'Require (proxy) document' option for the call in the 'Documents' section in the 'Types of meetings' section", function() {

        it("Click on the 'Council types' button", function() {
            cy.get('#edit-statutes-block').click()
            cy.wait(1000)
        });

        it("Scroll down the page and navigate to the 'Documents' section", function() {
            cy.get('#council-type-require-proxy').scrollIntoView()
            cy.wait(1000)
        });

        it("Click on the 'Require (proxy) document' checkbox and click on the 'Save' button", function() {
            cy.get('#council-type-require-proxy').click()
            cy.wait(1000)
            cy.get('#council-statute-save-button').click()
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to choose and select the tag in the 'tags' section in the 'Introduction' form in the 'Minutes templates' section in the 'Types of meetings' section", function() {

        it("Click on the 'Council types' button", function() {
            cy.get('#edit-statutes-block').click()
            cy.wait(1000)
        });

        it("Scroll down the page and navigate to the 'Minutes templates' section", function() {
            cy.get('#council-type-convene-header').scrollIntoView()
            cy.wait(1000)
        });

        it("Navigate to the 'Introduction' section and click on the 'tags' button and click on it then choose and select the tag you want and click on the 'Save' button", function() {
            cy.get('.ql-editor').eq(0).clear()
                .type('{{')
                    .type('business_name')
                        .type('}}')
            cy.wait(1000)
            cy.get('#council-statute-save-button').click()

        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });


describe("The user is able to choose and select the tag in the 'tags' section in the 'Annoucement footer' form in the 'Annoucement template' section in the 'Types of meetings' section", function() {

        it("Click on the 'Council types' button", function() {
            cy.get('#edit-statutes-block').click()
            cy.wait(1000)
        });

        it("Scroll down the page and navigate to the 'Announcement templates' section", function() {
            cy.get('#council-type-convene-footer').scrollIntoView()
            cy.wait(1000)
        });

        it("Navigate to the 'Announcement footer' section and click on the 'tags' button and click on it then choose and select the tag you want and click on the 'Save' button", function() {
            cy.get('.ql-editor').eq(1).clear()
                .type('{{')
                    .type('business_name')
                        .type('}}')
            cy.wait(1000)
            cy.get('#council-statute-save-button').click()

        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to choose and select the tag in the 'tags' section in the 'Custom proxy' form in the 'Documents' section in the 'Types of meetings' section", function() {

        it("Click on the 'Council types' button", function() {
            cy.get('#edit-statutes-block').click()
            cy.wait(1000)
        });

        it("Scroll down the page and navigate to the 'Announcement templates' section", function() {
            cy.get('#council-type-proxy').scrollIntoView()
            cy.wait(1000)
        });

        it("Navigate to the 'Custom proxy' section and click on the 'tags' button and click on it then choose and select the tag you want and click on the 'Save' button", function() {
            cy.get('.ql-editor').eq(2).clear()
                .type('{{')
                    .type('business_name')
                        .type('}}')
            cy.wait(1000)
            cy.get('#council-statute-save-button').click()

        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to choose and select the tag in the 'tags' section in the 'Voting letter with voting directions' form in the 'Document' section in the 'Types of meetings' section", function() {

        it("Click on the 'Council types' button", function() {
            cy.get('#edit-statutes-block').click()
            cy.wait(1000)
        });

        it("Scroll down the page and navigate to the 'Documents' section", function() {
            cy.get('#council-type-vote-letter').scrollIntoView()
            cy.wait(1000)
        });

        it("Navigate to the 'Voting letter with voting directions' section and click on the 'tags' button and click on it then choose and select the tag you want and click on the 'Save' button", function() {
            cy.get('.ql-editor').eq(4).clear()
                .type('{{')
                    .type('business_name')
                        .type('}}')
            cy.wait(1000)
            cy.get('#council-statute-save-button').click()

        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

































































/*


describe("Council box change user settings", function() {
    describe("Open user settings page", function() {
        before(function() {
            cy.deleteLocalStorage();
        });
    
        it("Visits the councilbox web page", function() {
            cy.loginUI();
            //cy.visit(login_url);
            cy.wait(1000);
        });
    
        it("Opens dropdown in upper right corner", function() {
            cy.get('#user-menu-trigger').click()
        });
        it("Clicks logout", function() {
            cy.contains(valid_email).click({force: true})
        });
    
        it("User successfully redirected to login page", function() {
            cy.url().should("include", 'user');
        });
    });

    describe("Change langauge settings", function() {
    
        it("Change language to Spanish", function() {
            cy.contains('English').click()
            cy.contains('Español').click()
            cy.contains('Save').click({force: true})
            cy.wait(2000);
            cy.get('body').invoke('text').should('contain', 'Idioma')
        });

        it("Change language to Portugese", function() {
            cy.contains('Español').click()
            cy.contains('Português').click()
            cy.contains('Guardar').click({force: true})
            cy.wait(2000);
            cy.get('body').invoke('text').should('contain', 'Alterar palavra-passe')
        });

        it("Change language to Catala", function() {
            cy.contains('Português').click()
            cy.contains('Català').click()
            cy.contains('Guardar').click({force: true})
            cy.wait(2000);
            cy.get('body').invoke('text').should('contain', 'Canviar contrasenya')
        });

        it("Change language to Galego", function() {
            cy.contains('Català').click()
            cy.contains('Galego').click()
            cy.contains('Guardar').click({force: true})
            cy.wait(2000);
            cy.get('body').invoke('text').should('contain', 'Mudar contrasinal')
        });

        it("Change language to English", function() {
            cy.contains('Galego').click()
            cy.contains('English').click()
            cy.contains('Gardar').click({force: true})
            cy.wait(2000);
            cy.get('body').invoke('text').should('contain', 'Change password')
        });
    });

    describe("Change user settings", function() {
    
        it("Change name", function() {
            cy.get('input').eq(0).clear()
            .type("Test Automation Name")    
            .should("have.value", "Test Automation Name")
        });

        it("Change surname", function() {
            cy.get('input').eq(1).clear()
            .type("Test Automation Surname")    
            .should("have.value", "Test Automation Surname")
        });

        it("Change email", function() {
            cy.get('input').eq(2).clear()
            .type("Test@Automation.com")    
            .should("have.value", "Test@Automation.com")
        });

        it("Change phone", function() {
            cy.get('input').eq(3).clear()
            .type("003873333333")    
            .should("have.value", "003873333333")
        });
    });

    describe("Save user settings and logout", function() {
    
        it("Save user settings", function() {
            cy.contains('Save').click()
        });

        it("Logout", function() {
            cy.logoutUI();
        });
    });

    describe("Enter and check if the user settings were saved", function() {
    
        it("Login and open user settigns page", function() {
            cy.loginUI();
            cy.wait(1000);
        });

        it("Opens dropdown in upper right corner", function() {
            cy.get('#user-menu-trigger').click()
        });
        it("Clicks on user profile", function() {
            cy.contains("test@automation.com").click({force: true})
        });
    
        it("User successfully redirected to user setting page", function() {
            cy.url().should("include", 'user');
        });

        it("Check if settings were saved", function() {
            cy.get('input').eq(0)    
                .should("have.value", "Test Automation Name")
    
            cy.get('input').eq(1)    
                .should("have.value", "Test Automation Surname")
    
            cy.get('input').eq(2)   
                .should("have.value", "test@automation.com")
    
            cy.get('input').eq(3)   
                .should("have.value", "003873333333")
        });
    });

    describe("Change user settings to default", function() {
    
        it("Change name", function() {
            cy.get('input').eq(0).clear()
            .type("Andrej")    
            .should("have.value", "Andrej")
        });

        it("Change surname", function() {
            cy.get('input').eq(1).clear()
            .type("QA")    
            .should("have.value", "QA")
        });

        it("Change email", function() {
            cy.get('input').eq(2).clear()
            .type("andrej@qaengineers.net")    
            .should("have.value", "andrej@qaengineers.net")
        });

        it("Change phone", function() {
            cy.get('input').eq(3).clear()
            .type("0038766666666")    
            .should("have.value", "0038766666666")
        });

        it("Save user settings", function() {
            cy.contains('Save').click()
        });

        it("Logout", function() {
            cy.logoutUI();
        });
    });
})









describe("Council box login - no username or password added", function() {
    before(function() {
        cy.deleteLocalStorage();
        
    });

    it("Visits the councilbox web page", function() {
       
        cy.clearLocalStorage();
        cy.saveLocalStorage();
        cy.visit(login_url);
        cy.wait(2000)
        cy.contains("Sign in to Councilbox");
    });

    it("Clicks to enter button", function() {
        cy.contains("To enter").click();
    });

    it("Email and password required label shown", function() {
        cy.contains("This field is required");
    }); 

    it("User is not logged in", function() {
        cy.url().should("include", login_url);
    });
});

describe("Councilbox login - invalid username and valid password", function() {

    before(function() {
        cy.deleteLocalStorage();
    });

    it("Visits the Councilbox web page", function() {
        cy.clearLocalStorage();
        cy.saveLocalStorage();
        cy.visit(login_url);
        cy.wait(2000)
        cy.contains("Sign in to Councilbox");
    });

    it("Enters invalid email address", function() {
        cy.get('input').eq(0)
            .type("councilbox@mail.com")    
            .should("have.value", "councilbox@mail.com")
    });

    it("Enters password", function() {
        cy.get('input').eq(1)
            .type(valid_password)
            .should("have.value", valid_password)
    });

    it("Clicks login button", function() {
        cy.contains("To enter").click();
    });

    it("Email is not verified or does not exist label shown", function() {
        cy.contains("The email is not verified or does not exist.");
    });

    it("User is not logged in", function() {
        cy.url().should("include", login_url);
    });
});

describe("Councilbox login - valid username and invalid password", function() {
    it("Visits the Councilbox web page", function() {
        cy.visit(login_url);
    });

    it("Enters existing, valid email address", function() {
        cy.get('input').eq(0)
            .type(valid_email)    
            .should("have.value", valid_email)
    });

    it("Enters invalid password", function() {
        cy.get('input').eq(1)
            .type("WrongPassword")    
            .should("have.value", "WrongPassword")
    });

    it("Clicks login button", function() {
        cy.get('#login-button').click();
    });

    it("Password incorrect label shown", function() {
        cy.contains("Incorrect password");
    });

    it("User is not logged in", function() {
        cy.url().should("include", login_url);
    });
});

*/




