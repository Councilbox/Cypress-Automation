import loginPage from "../pageObjects/loginPage";

const invalid_emails = ["andrej@qa", "andrej.qa", "andrej@majl.234"];
const login_url = Cypress.env("baseUrl");
const valid_password = Cypress.env("login_password");
const valid_email = Cypress.env("login_email");

let login = new loginPage()

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
            
        });
    
        it("Click on the 'Sign Up' button", function() {
            login.click_on_sign_up_button()
            
        });

        it("Click on the “Sign up” button without populating required fields", function() {
            login.click_on_send()
        });

        it("An alert message is displayed beyond the fields", function() {
            login.verify_existing_name_error()
            login.verify_existing_surname_error()
            login.verify_existing_phone_error()
            login.verify_existing_email_error()
            login.verify_existing_password_error()
            login.verify_existing_legal_terms_error()
        })
    });


describe("The user is not able to create a new account in Councilbox with invalid inputs in the 'Name' field", function() {
    

    const name = "12345"
    const surname = "Test"
    const phone = "123123123"
    const email = "alem"+Cypress.config('UniqueNumber')+"@yopmail.com"
    const password = "Mostar123!"
        it("Open the browser and enter the URL of the staging environment", function() {
            cy.visit(login_url);
           
        });
    
        it("Click on the 'Sign Up' button", function() {
            login.click_on_sign_up_button()
           
        });

        it("Populate the 'Name' field with invalid inputs (with number)", function() {
            login.enter_signup_name(name)
                       
        });

        it("Populate the 'Surname' field", function() {
            login.enter_signup_surname(surname) 
                
        });

        it("Populate the 'Phone' field", function() {
            login.enter_signup_phone(phone)
                
        });

        it("Populate the 'Email' and the 'Repeat email' fields", function() {
            login.enter_signup_email_and_confirm_it(email)
                
        });

        it("Populate the 'Password' and the 'Confirm password' fields", function() {
            login.enter_signup_password_and_confirm_it(password)
                
        });

        it("Click on the checkbox to confirm terms and conditions of councilbox", function() {
            login.accept_terms() 
        });

        it("Click on 'Send' button", function() {
            login.click_on_send() 
        });

        it("Should display 'Please enter a valid first name'", function() {
            login.verify_existing_name_error()
        })
    });


describe("The user is not able to create a new account in Councilbox with invalid inputs in the 'Phone' field", function() {
    
    const name = "Automation"
    const surname = "Test"
    const phone = "Testing"
    const email = "alem"+Cypress.config('UniqueNumber')+"@yopmail.com"
    const password = "Mostar123!"

        it("Open the browser and enter the URL of the staging environment", function() {
            cy.visit(login_url);
          
        });
    
        it("Click on the 'Sign Up' button", function() {
            login.click_on_sign_up_button()
            
        });

        it("Populate the 'Name' field with invalid inputs (with number)", function() {
            login.enter_signup_name(name)
                .type("Automation")           
        });

        it("Populate the 'Surname' field", function() {
            login.enter_signup_surname(surname) 
                
        });

        it("Populate the 'Phone' field", function() {
            login.enter_signup_phone(phone)
                
        });

        it("Populate the 'Email' and the 'Repeat email' fields", function() {
            login.enter_signup_email_and_confirm_it(email)
        
        });

        it("Populate the 'Password' and the 'Confirm password' fields", function() {
             login.enter_signup_password_and_confirm_it(password)
        
        });

        it("Click on the checkbox to confirm terms and conditions of councilbox", function() {
            login.accept_terms() 
        });

        it("Click on 'Send' button", function() {
            login.click_on_send()
        });

        it("Should display 'Please enter a valid phone number'", function() {
            login.verify_existing_phone_error()
        });
    });


describe("The user is not able to create a new account in Councilbox with invalid inputs in the 'Surname' field", function() {
    
    const name = "Automation"
    const surname = "12345"
    const phone = "123123123"
    const email = "alem"+Cypress.config('UniqueNumber')+"@yopmail.com"
    const password = "Mostar123!"

        it("Open the browser and enter the URL of the staging environment", function() {
            cy.visit(login_url);
         
        });
    
        it("Click on the 'Sign Up' button", function() {
            login.click_on_sign_up_button()
    
        });

        it("Populate the 'Name' field with invalid inputs (with number)", function() {
            login.enter_signup_name(name)
                .type("Automation")
        });

        it("Populate the 'Surname' field", function() {
            login.enter_signup_surname(surname) 
                .type("12345")
                .should("have.value", "12345")
        });

        it("Populate the 'Phone' field", function() {
            login.enter_signup_phone(phone)
                
        }); 

        it("Populate the 'Email' and the 'Repeat email' fields", function() {
            login.enter_signup_email_and_confirm_it(email)
      
        });

        it("Populate the 'Password' and the 'Confirm password' fields", function() {
             login.enter_signup_password_and_confirm_it(password)
             
        });

        it("Click on the checkbox to confirm terms and conditions of councilbox", function() {
            login.accept_terms() 
        });

        it("Click on 'Send' button", function() {
            login.click_on_send()
        });

        it("Please enter valid last names", function() {
            login.verify_existing_surname_error()
        })
    });


describe("The user is not able to register to the Councilbox with the E-mail already used", function() {
    
    const name = "Automation"
    const surname = "Test"
    const phone = "123123123"
    const email = "ballalem@hotmail.com"
    const password = "Mostar123!"

        it("Open the browser and enter the URL of the staging environment", function() {
            cy.visit(login_url);
          
        });
    
        it("Click on the 'Sign Up' button", function() {
            login.click_on_sign_up_button()
          
        });

        it("Populate the 'Name' field with invalid inputs (with number)", function() {
            login.enter_signup_name(name)
                .type("Automation")
        });

        it("Populate the 'Surname' field", function() {
            login.enter_signup_surname(surname) 
                
        });


        it("Populate the 'Phone' field", function() {
            login.enter_signup_phone(phone)
                
        });

        it("Populate the 'Email' and the 'Repeat email' fields", function() {
            login.enter_signup_email_and_confirm_it(email)
      
        });

        it("Populate the 'Password' and the 'Confirm password' fields", function() {
            login.enter_signup_password_and_confirm_it(password)
        
        });

        it("Click on the checkbox to confirm terms and conditions of councilbox", function() {
            login.accept_terms() 
        });

        it("Click on 'Send' button", function() {
            login.click_on_send()
        });

        it("'This email is already registered.'' message is displayed beyond the “Email” field", function() {
            login.verify_existing_email_error()
        });
    });


describe("The user is not able to register to the Councilbox with the invalid inputs in the 'Repeat Email' field", function() {
    
    const name = "Automation"
    const surname = "Test"
    const phone = "123123123"
    const email = "alem"+Cypress.config('UniqueNumber')+"@yopmail.com"
    const password = "Mostar123!"
    const email_confirm = "alem123@test.test"

        it("Open the browser and enter the URL of the staging environment", function() {
            cy.visit(login_url);
        
        });
    
        it("Click on the 'Sign Up' button", function() {
            login.click_on_sign_up_button()
            
        });

        it("Populate the 'Name' field with invalid inputs (with number)", function() {
            login.enter_signup_name(name)
                .type("Automation")
        });

        it("Populate the 'Surname' field", function() {
            login.enter_signup_surname(surname) 
                
        });

        it("Populate the 'Phone' field", function() {
            login.enter_signup_phone(phone)
                
        });

        it("Populate the 'Email' and the 'Repeat email' fields", function() {
            login.enter_signup_email(email)
            login.enter_signup_email_confirm(email_confirm)
        });

        it("Populate the 'Password' and the 'Confirm password' fields", function() {
             login.enter_signup_password_and_confirm_it(password)
     
        });

        it("Click on the checkbox to confirm terms and conditions of councilbox", function() {
            login.accept_terms() 
        });

        it("Click on 'Send' button", function() {
            login.click_on_send()
        });

        it("'The email does not match.'' message is displayed beyond the “Repeat Email” field", function() {
            login.verify_existing_email_confirm_error()
        });
    });


describe("The user is not able to register to the Councilbox with the invalid inputs in the 'Confirm Password' field", function() {
    
    const name = "Automation"
    const surname = "Test"
    const phone = "123123123"
    const email = "alem"+Cypress.config('UniqueNumber')+"@yopmail.com"
    const password = "Mostar123!"
    const password_confirm = "123456"

        it("Open the browser and enter the URL of the staging environment", function() {
            cy.visit(login_url);
         
        });
    
        it("Click on the 'Sign Up' button", function() {
            login.click_on_sign_up_button()
         
        });

        it("Populate the 'Name' field with invalid inputs (with number)", function() {
            login.enter_signup_name(name)
            .type("Automation")
        });

        it("Populate the 'Surname' field", function() {
            login.enter_signup_surname(surname) 
                
        });

        it("Populate the 'Phone' field", function() {
            login.enter_signup_phone(phone)
                
        });

        it("Populate the 'Email' and the 'Repeat email' fields", function() {
            login.enter_signup_email_and_confirm_it(email)
         
        });

        it("Populate the 'Password' and the 'Confirm password' fields", function() {
            login.enter_signup_password(password)
            login.enter_signup_password_confirm(password_confirm)
        });

        it("Click on the checkbox to confirm terms and conditions of councilbox", function() {
            login.accept_terms() 
        });

        it("Click on 'Send' button", function() {
            login.click_on_send()
        });

        it("'The passwords do not match' message is displayed beyond the “Confirm Password” field", function() {
            login.verify_existing_password_confirm_error()
        });
    });


describe("The user is not able to register without accepting terms and conditions", function() {
    
        it("Open the browser and enter the URL of the staging environment", function() {
            cy.visit(login_url);
         
        });
    
        it("Click on the 'Sign Up' button", function() {
            login.click_on_sign_up_button()
         
        });

        it("Populate the 'Name' field with invalid inputs (with number)", function() {
            login.enter_signup_name(name)
                .type("Automation")
        });

        it("Populate the 'Surname' field", function() {
            login.enter_signup_surname(surname) 
                
        });

        it("Populate the 'Phone' field", function() {
            login.enter_signup_phone(phone)
                
        });

        it("Populate the 'Email' and the 'Repeat email' fields", function() {
            login.enter_signup_email_and_confirm_it(email)
                .type("alem"+Cypress.config('UniqueNumber')+"@yopmail.com")
            cy.get('#signup-email-check').clear()
                .type("alem"+Cypress.config('UniqueNumber')+"@yopmail.com")
        });

        it("Populate the 'Password' and the 'Confirm password' fields", function() {
            login.enter_signup_password_and_confirm_it(password)
                
        });
        
        it("Click on 'Send' button", function() {
            login.click_on_send()
        });

        it("'I accept the terms and conditions' message is displayed", function() {
            login.verify_existing_legal_terms_error().click()
        });
    });



describe("The user is not able to login in Councilbox with invalid inputs in the 'Email' field", function() {
    
        it("Open the browser and enter the URL of the staging environment", function() {
            cy.visit(login_url);
         
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
            cy.get('#username-helper-text')
        });

     });


describe("The user is not able to login in Councilbox with invalid password", function() {
    
        it("Open the browser and enter the URL of the staging environment", function() {
            cy.visit(login_url);
        
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
            cy.get('#password-helper-text')
        });

     });


describe("The user is not able to login in Councilbox without populating required fields", function() {
    
        it("Open the browser and enter the URL of the staging environment", function() {
            cy.visit(login_url);
            
        });
    
        it("Click on the 'To enter' button without populating required fields", function() {
            cy.get('#login-button').click()
        });

        it("'This field is required.' alert message is displayed beyond the “Email” and “Password” fields", function() {
            cy.get('#username-helper-text')
            cy.get('#password-helper-text')
        });

     });

describe("The user is able to select the 'EN' language on the 'Homepage' section", function() {
    
        it("Open the browser and enter the URL of the staging environment", function() {
            cy.visit(login_url);
           
        });
    
        it("Navigate to the upper right corner of the page and click on the “Language selector” button", function() {
            cy.get('#language-selector').click()
          
        });

        it("From the dropdown menu choose and click on the 'EN' button", function() {
            cy.get('#language-en').click()
          
        });

     });

describe("The user is able to select the 'ES' language on the 'Homepage' section", function() {
    
        it("Open the browser and enter the URL of the staging environment", function() {
            cy.visit(login_url);
          
        });
    
        it("Navigate to the upper right corner of the page and click on the “Language selector” button", function() {
            cy.get('#language-selector').click()
            cy.wait(1000)
        });

        it("From the dropdown menu choose and click on the 'ES' button", function() {
            cy.get('#language-es').click()
            
        });

     });

describe("The user is able to select the 'CAT' language on the 'Homepage' section", function() {
    
        it("Open the browser and enter the URL of the staging environment", function() {
            cy.visit(login_url);
         
        });
    
        it("Navigate to the upper right corner of the page and click on the “Language selector” button", function() {
            cy.get('#language-selector').click()
         
        });

        it("From the dropdown menu choose and click on the 'CAT' button", function() {
            cy.get('#language-cat').click()
            
        });

     });

describe("The user is able to select the 'GAL' language on the 'Homepage' section", function() {
    
        it("Open the browser and enter the URL of the staging environment", function() {
            cy.visit(login_url);
          
        });
    
        it("Navigate to the upper right corner of the page and click on the “Language selector” button", function() {
            cy.get('#language-selector').click()
            
        });

        it("From the dropdown menu choose and click on the 'GAL' button", function() {
            cy.get('#language-gal').click()
           
        });

     });

describe("The user is able to select the 'PT' language on the 'Homepage' section", function() {
    
        it("Open the browser and enter the URL of the staging environment", function() {
            cy.visit(login_url);
           
        });
    
        it("Navigate to the upper right corner of the page and click on the “Language selector” button", function() {
            cy.get('#language-selector').click()
            
        });

        it("From the dropdown menu choose and click on the 'PT' button", function() {
            cy.get('#language-pt').click()
         
        });

     });

describe("The user is able to select the 'EU' language on the 'Homepage' section", function() {
    
        it("Open the browser and enter the URL of the staging environment", function() {
            cy.visit(login_url);
           
        });
    
        it("Navigate to the upper right corner of the page and click on the “Language selector” button", function() {
            cy.get('#language-selector').click()
            
        });

        it("From the dropdown menu choose and click on the 'EU' button", function() {
            cy.get('#language-eu').click()
        
        });

     });

describe("The user is able to select the 'FR' language on the 'Homepage' section", function() {
    
        it("Open the browser and enter the URL of the staging environment", function() {
            cy.visit(login_url);
            
        });
    
        it("Navigate to the upper right corner of the page and click on the “Language selector” button", function() {
            cy.get('#language-selector').click()
           
        });

        it("From the dropdown menu choose and click on the 'FR' button", function() {
            cy.get('#language-fr').click()
            
        });

     });

describe("The user is able to select the 'EN' language on the 'Homepage' section", function() {
    
        it("Open the browser and enter the URL of the staging environment", function() {
            cy.visit(login_url);
           
        });
    
        it("Navigate to the upper right corner of the page and click on the “Language selector” button", function() {
            cy.get('#language-selector').click()
          
        });

        it("From the dropdown menu choose and click on the 'EN' button", function() {
            cy.get('#language-en').click()
            
        });

     });

describe("The user is not able to restore password without populating the 'Email' field", function() {
    
        it("Open the browser and enter the URL of the staging environment", function() {
            cy.visit(login_url);
            
        });
    
        it("Click on the “I forgot my password” button", function() {
            cy.get('#restore-password-link').click()
            
        });

        it("Click on the “Restore access” button without populating the 'Email' field", function() {
            cy.get('#restore-password-button').click()
            
        });

        it("“Please enter a valid email address.” alert message is displayed", function() {
            cy.get('#restore-password-email-input-error-text').click()
           
        });


     });

describe("The user is not able to restore password with invalid inputs in the 'Email' field", function() {
    
        it("Open the browser and enter the URL of the staging environment", function() {
            cy.visit(login_url);
            
        });
    
        it("Click on the “I forgot my password” button", function() {
            cy.get('#restore-password-link').click()
           
        });

        it("Populate the “Email” field with invalid email format", function() {
            cy.get('#restore-password-email-input').clear()
                .type('fsdafdsfafsda')
            
        });

        it("Click on the “Restore access” button", function() {
            cy.get('#restore-password-button').click()
            
        });

        it("“Please enter a valid email address.” alert message is displayed", function() {
            cy.get('#restore-password-email-input-error-text').click()
           
        });


     });

describe("The user is not able to restore password with email that is not verified", function() {
    
        it("Open the browser and enter the URL of the staging environment", function() {
            cy.visit(login_url);
            
        });
    
        it("Click on the “I forgot my password” button", function() {
            cy.get('#restore-password-link').click()
          
        });

        it("Populate the “Email” field with invalid email format", function() {
            cy.get('#restore-password-email-input').clear()
                .type('fsdafdsf@fdsafa.fsa')
          
        });

        it("Click on the “Restore access” button", function() {
            cy.get('#restore-password-button').click()
          
        });

        it("“The email was not verified or does not exist.” alert message is displayed", function() {
            cy.get('#restore-password-email-input-error-text').click()
        
        });


     });