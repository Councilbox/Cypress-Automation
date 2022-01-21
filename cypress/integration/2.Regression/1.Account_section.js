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
            cy.get('#signup-name-error-text')
            cy.get('#signup-surname-error-text')
            cy.get('#signup-phone-error-text')
            cy.get('#signup-email-error-text')
            cy.get('#signup-password-error-text')
            cy.get('#legal-terms-error-text')
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
            cy.get('#signup-name-error-text')
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
            cy.get('#signup-phone-error-text')
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
            cy.get('#signup-surname-error-text')
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
                .type("ballalem@hotmail.com")
            cy.get('#signup-email-check').clear()
                .type("ballalem@hotmail.com")
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
            cy.get('#signup-email-error-text')
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
            cy.get('#signup-email-check-error-text')
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
            cy.get('#signup-password-check-error-text')
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
            cy.get('#username-error-text')
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
            cy.get('#username-error-text')
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
            cy.get('#username-error-text')
            cy.get('#password-error-text')
        });

     });

describe("The user is able to select the 'EN' language on the 'Homepage' section", function() {
    
        it("Open the browser and enter the URL of the staging environment", function() {
            cy.visit(login_url);
            cy.wait(2000);
        });
    
        it("Navigate to the upper right corner of the page and click on the “Language selector” button", function() {
            cy.get('#language-selector').click()
            cy.wait(1000)
        });

        it("From the dropdown menu choose and click on the 'EN' button", function() {
            cy.get('#language-en').click()
            cy.wait(1000)
        });

     });

describe("The user is able to select the 'ES' language on the 'Homepage' section", function() {
    
        it("Open the browser and enter the URL of the staging environment", function() {
            cy.visit(login_url);
            cy.wait(2000);
        });
    
        it("Navigate to the upper right corner of the page and click on the “Language selector” button", function() {
            cy.get('#language-selector').click()
            cy.wait(1000)
        });

        it("From the dropdown menu choose and click on the 'ES' button", function() {
            cy.get('#language-es').click()
            cy.wait(1000)
        });

     });

describe("The user is able to select the 'CAT' language on the 'Homepage' section", function() {
    
        it("Open the browser and enter the URL of the staging environment", function() {
            cy.visit(login_url);
            cy.wait(2000);
        });
    
        it("Navigate to the upper right corner of the page and click on the “Language selector” button", function() {
            cy.get('#language-selector').click()
            cy.wait(1000)
        });

        it("From the dropdown menu choose and click on the 'CAT' button", function() {
            cy.get('#language-cat').click()
            cy.wait(1000)
        });

     });

describe("The user is able to select the 'GAL' language on the 'Homepage' section", function() {
    
        it("Open the browser and enter the URL of the staging environment", function() {
            cy.visit(login_url);
            cy.wait(2000);
        });
    
        it("Navigate to the upper right corner of the page and click on the “Language selector” button", function() {
            cy.get('#language-selector').click()
            cy.wait(1000)
        });

        it("From the dropdown menu choose and click on the 'GAL' button", function() {
            cy.get('#language-gal').click()
            cy.wait(1000)
        });

     });

describe("The user is able to select the 'PT' language on the 'Homepage' section", function() {
    
        it("Open the browser and enter the URL of the staging environment", function() {
            cy.visit(login_url);
            cy.wait(2000);
        });
    
        it("Navigate to the upper right corner of the page and click on the “Language selector” button", function() {
            cy.get('#language-selector').click()
            cy.wait(1000)
        });

        it("From the dropdown menu choose and click on the 'PT' button", function() {
            cy.get('#language-pt').click()
            cy.wait(1000)
        });

     });

describe("The user is able to select the 'EU' language on the 'Homepage' section", function() {
    
        it("Open the browser and enter the URL of the staging environment", function() {
            cy.visit(login_url);
            cy.wait(2000);
        });
    
        it("Navigate to the upper right corner of the page and click on the “Language selector” button", function() {
            cy.get('#language-selector').click()
            cy.wait(1000)
        });

        it("From the dropdown menu choose and click on the 'EU' button", function() {
            cy.get('#language-eu').click()
            cy.wait(1000)
        });

     });

describe("The user is able to select the 'FR' language on the 'Homepage' section", function() {
    
        it("Open the browser and enter the URL of the staging environment", function() {
            cy.visit(login_url);
            cy.wait(2000);
        });
    
        it("Navigate to the upper right corner of the page and click on the “Language selector” button", function() {
            cy.get('#language-selector').click()
            cy.wait(1000)
        });

        it("From the dropdown menu choose and click on the 'FR' button", function() {
            cy.get('#language-fr').click()
            cy.wait(1000)
        });

     });

describe("The user is able to select the 'EN' language on the 'Homepage' section", function() {
    
        it("Open the browser and enter the URL of the staging environment", function() {
            cy.visit(login_url);
            cy.wait(2000);
        });
    
        it("Navigate to the upper right corner of the page and click on the “Language selector” button", function() {
            cy.get('#language-selector').click()
            cy.wait(1000)
        });

        it("From the dropdown menu choose and click on the 'EN' button", function() {
            cy.get('#language-en').click()
            cy.wait(1000)
        });

     });

describe("The user is not able to restore password without populating the 'Email' field", function() {
    
        it("Open the browser and enter the URL of the staging environment", function() {
            cy.visit(login_url);
            cy.wait(1000);
        });
    
        it("Click on the “I forgot my password” button", function() {
            cy.get('#restore-password-link').click()
            cy.wait(1000)
        });

        it("Click on the “Restore access” button without populating the 'Email' field", function() {
            cy.get('#restore-password-button').click()
            cy.wait(1000)
        });

        it("“Please enter a valid email address.” alert message is displayed", function() {
            cy.get('#restore-password-email-input-error-text').click()
            cy.wait(1000)
        });


     });

describe("The user is not able to restore password with invalid inputs in the 'Email' field", function() {
    
        it("Open the browser and enter the URL of the staging environment", function() {
            cy.visit(login_url);
            cy.wait(1000);
        });
    
        it("Click on the “I forgot my password” button", function() {
            cy.get('#restore-password-link').click()
            cy.wait(1000)
        });

        it("Populate the “Email” field with invalid email format", function() {
            cy.get('#restore-password-email-input').clear()
                .type('fsdafdsfafsda')
            cy.wait(1000)
        });

        it("Click on the “Restore access” button", function() {
            cy.get('#restore-password-button').click()
            cy.wait(1000)
        });

        it("“Please enter a valid email address.” alert message is displayed", function() {
            cy.get('#restore-password-email-input-error-text').click()
            cy.wait(1000)
        });


     });

describe("The user is not able to restore password with email that is not verified", function() {
    
        it("Open the browser and enter the URL of the staging environment", function() {
            cy.visit(login_url);
            cy.wait(1000);
        });
    
        it("Click on the “I forgot my password” button", function() {
            cy.get('#restore-password-link').click()
            cy.wait(1000)
        });

        it("Populate the “Email” field with invalid email format", function() {
            cy.get('#restore-password-email-input').clear()
                .type('fsdafdsf@fdsafa.fsa')
            cy.wait(1000)
        });

        it("Click on the “Restore access” button", function() {
            cy.get('#restore-password-button').click()
            cy.wait(1000)
        });

        it("“The email was not verified or does not exist.” alert message is displayed", function() {
            cy.get('#restore-password-email-input-error-text').click()
            cy.wait(1000)
        });


     });