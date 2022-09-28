import loginPage from "../pageObjects/loginPage";

const login_url = Cypress.env("baseUrl");


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

let url = Cypress.config().baseUrl;

function userID_Alpha() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    for (var i = 0; i < 10; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

  describe("Account Section - Regression tests", function() {

  
    it("The user is not able to register to the Councilbox without populating required fields", function() {
        cy.log("Open the browser and enter the URL of the staging environment")
            cy.visit(url);
        cy.log("Click on the 'Sign Up' button")
            login.click_on_sign_up_button()
        cy.log("Click on the “Sign up” button without populating required fields")
            login.click_on_send()
        cy.log("An alert message is displayed beyond the fields")
            login.verify_existing_name_error()
            login.verify_existing_surname_error()
            login.verify_existing_phone_error()
            login.verify_existing_email_error()
            login.verify_existing_password_error()
            login.verify_existing_legal_terms_error()
    });

    it("The user is not able to create a new account in Councilbox with invalid inputs in the 'Name' field", function() {
        const name = "12345"
        const surname = "Test"
        const phone = "123123123"
        const email = "alem"+Cypress.config('UniqueNumber')+"@yopmail.com"
        const password = "Mostar123!test"
        cy.log("Open the browser and enter the URL of the staging environment")
            cy.visit(url);
        cy.log("Click on the 'Sign Up' button")
            login.click_on_sign_up_button()
        cy.log("Populate the 'Name' field with invalid inputs (with number)")
            login.enter_signup_name(name)
        cy.log("Populate the 'Surname' field")
            login.enter_signup_surname(surname) 
        cy.log("Populate the 'Phone' field")
            login.enter_signup_phone(phone)
        cy.log("Populate the 'Email' and the 'Repeat email' fields")
            login.enter_signup_email_and_confirm_it(email)
        cy.log("Populate the 'Password' and the 'Confirm password' fields")
            login.enter_signup_password_and_confirm_it(password)
        cy.log("Click on the checkbox to confirm terms and conditions of councilbox")
            login.accept_terms() 
        cy.log("Click on 'Send' button")
            login.click_on_send() 
        cy.log("Should display 'Please enter a valid first name'")
            login.verify_existing_name_error()
    });

    it("The user is not able to create a new account in Councilbox with invalid inputs in the 'Phone' field", function() {
        const name = "Automation"
        const surname = "Test"
        const phone = "Testing"
        const email = "alem"+Cypress.config('UniqueNumber')+"@yopmail.com"
        const password = "Mostar123!test"
        cy.log("Open the browser and enter the URL of the staging environment")
            cy.visit(url);
        cy.log("Click on the 'Sign Up' button")
            login.click_on_sign_up_button()
        cy.log("Populate the 'Name' field with invalid inputs (with number)")
            login.enter_signup_name(name)
        cy.log("Populate the 'Surname' field")
            login.enter_signup_surname(surname) 
        cy.log("Populate the 'Phone' field")
            login.enter_signup_phone(phone)
        cy.log("Populate the 'Email' and the 'Repeat email' fields")
            login.enter_signup_email_and_confirm_it(email)
        cy.log("Populate the 'Password' and the 'Confirm password' fields")
             login.enter_signup_password_and_confirm_it(password)
        cy.log("Click on the checkbox to confirm terms and conditions of councilbox")
            login.accept_terms() 
        cy.log("Click on 'Send' button")
            login.click_on_send()
        cy.log("Should display 'Please enter a valid phone number'")
            login.verify_existing_phone_error()
    });

    it("The user is not able to create a new account in Councilbox with invalid inputs in the 'Surname' field", function() {
        const name = "Automation"
        const surname = "12345"
        const phone = "123123123"
        const email = "alem"+Cypress.config('UniqueNumber')+"@yopmail.com"
        const password = "Mostar123!test"
        cy.log("Open the browser and enter the URL of the staging environment")
            cy.visit(url);
        cy.log("Click on the 'Sign Up' button")
            login.click_on_sign_up_button()
        cy.log("Populate the 'Name' field with invalid inputs (with number)")
            login.enter_signup_name(name)
        cy.log("Populate the 'Surname' field")
            login.enter_signup_surname(surname) 
        cy.log("Populate the 'Phone' field")
            login.enter_signup_phone(phone)
        cy.log("Populate the 'Email' and the 'Repeat email' fields")
            login.enter_signup_email_and_confirm_it(email)
        cy.log("Populate the 'Password' and the 'Confirm password' fields")
             login.enter_signup_password_and_confirm_it(password)
        cy.log("Click on the checkbox to confirm terms and conditions of councilbox")
            login.accept_terms() 
        cy.log("Click on 'Send' button")
            login.click_on_send()
        cy.log("Please enter valid last names")
            login.verify_existing_surname_error()
    });

    it("The user is not able to register to the Councilbox with the E-mail already used", function() {
        const name = "Automation"
        const surname = "Test"
        const phone = "123123123"
        const email = "ballalem@hotmail.com"
        const password = "Mostar123!test"
        cy.log("Open the browser and enter the URL of the staging environment")
            cy.visit(url);
        cy.log("Click on the 'Sign Up' button")
            login.click_on_sign_up_button()
        cy.log("Populate the 'Name' field with invalid inputs (with number)")
            login.enter_signup_name(name)
        cy.log("Populate the 'Surname' field")
            login.enter_signup_surname(surname) 
        cy.log("Populate the 'Phone' field")
            login.enter_signup_phone(phone)
        cy.log("Populate the 'Email' and the 'Repeat email' fields")
            login.enter_signup_email_and_confirm_it(email)
        cy.log("Populate the 'Password' and the 'Confirm password' fields")
            login.enter_signup_password_and_confirm_it(password)
        cy.log("Click on the checkbox to confirm terms and conditions of councilbox")
            login.accept_terms() 
        cy.log("Click on 'Send' button")
            login.click_on_send()
        cy.log("'This email is already registered.'' message is displayed beyond the “Email” field")
            login.verify_existing_email_error()
    });

    it("The user is not able to register to the Councilbox with the invalid inputs in the 'Repeat Email' field", function() {
        const name = "Automation"
        const surname = "Test"
        const phone = "123123123"
        const email = "alem"+Cypress.config('UniqueNumber')+"@yopmail.com"
        const password = "Mostar123!test"
        const email_confirm = "alem123@test.test"
        cy.log("Open the browser and enter the URL of the staging environment")
            cy.visit(url);
        cy.log("Click on the 'Sign Up' button")
            login.click_on_sign_up_button()
        cy.log("Populate the 'Name' field with invalid inputs (with number)")
            login.enter_signup_name(name)
        cy.log("Populate the 'Surname' field")
            login.enter_signup_surname(surname) 
        cy.log("Populate the 'Phone' field")
            login.enter_signup_phone(phone)
        cy.log("Populate the 'Email' and the 'Repeat email' fields")
            login.enter_signup_email(email)
            login.enter_signup_email_confirm(email_confirm)
        cy.log("Populate the 'Password' and the 'Confirm password' fields")
             login.enter_signup_password_and_confirm_it(password)
        cy.log("Click on the checkbox to confirm terms and conditions of councilbox")
            login.accept_terms() 
        cy.log("Click on 'Send' button")
            login.click_on_send()
        cy.log("'The email does not match.'' message is displayed beyond the “Repeat Email” field")
            login.verify_existing_email_confirm_error()
    });

    it("The user is not able to register to the Councilbox with the invalid inputs in the 'Confirm Password' field", function() {
        const name = "Automation"
        const surname = "Test"
        const phone = "123123123"
        const email = "alem"+Cypress.config('UniqueNumber')+"@yopmail.com"
        const password = "Mostar123!test"
        const password_confirm = "123456"
        cy.log("Open the browser and enter the URL of the staging environment")
            cy.visit(url);
        cy.log("Click on the 'Sign Up' button")
            login.click_on_sign_up_button()
        cy.log("Populate the 'Name' field with invalid inputs (with number)")
            login.enter_signup_name(name)
        cy.log("Populate the 'Surname' field")
            login.enter_signup_surname(surname) 
        cy.log("Populate the 'Phone' field")
            login.enter_signup_phone(phone)
        cy.log("Populate the 'Email' and the 'Repeat email' fields")
            login.enter_signup_email_and_confirm_it(email)
        cy.log("Populate the 'Password' and the 'Confirm password' fields")
            login.enter_signup_password(password)
            login.enter_signup_password_confirm(password_confirm)
        cy.log("Click on the checkbox to confirm terms and conditions of councilbox")
            login.accept_terms() 
        cy.log("Click on 'Send' button")
            login.click_on_send()
        cy.log("'The passwords do not match' message is displayed beyond the “Confirm Password” field")
            login.verify_existing_password_confirm_error()
    });


    it("The user is not able to register without accepting terms and conditions", function() {
        const name = "Automation"
        const surname = "Test"
        const phone = "123123123"
        const email = "alem"+Cypress.config('UniqueNumber')+"@yopmail.com"
        const password = "Mostar123!test"
        cy.log("Open the browser and enter the URL of the staging environment")
            cy.visit(url);
        cy.log("Click on the 'Sign Up' button")
            login.click_on_sign_up_button()
        cy.log("Populate the 'Name' field with invalid inputs (with number)")
            login.enter_signup_name(name)
        cy.log("Populate the 'Surname' field")
            login.enter_signup_surname(surname) 
        cy.log("Populate the 'Phone' field")
            login.enter_signup_phone(phone)
        cy.log("Populate the 'Email' and the 'Repeat email' fields")
            login.enter_signup_email_and_confirm_it(email)
        cy.log("Populate the 'Password' and the 'Confirm password' fields")
            login.enter_signup_password_and_confirm_it(password)
        cy.log("Click on 'Send' button")
            login.click_on_send()
        cy.log("'I accept the terms and conditions' message is displayed")
            login.verify_existing_legal_terms_error()
    });

    it("The user is not able to login in Councilbox with invalid inputs in the 'Email' field", function() {
    
        const email = "alem54321@test.test"
        const password = "Test12345"
        cy.log("Open the browser and enter the URL of the staging environment")
            cy.visit(url);
        cy.log("Populate the “Email” field with invalid Email")
            login.enter_email(email)
        cy.log("Populate the “Password” field with valid inputs")
            login.enter_password(password)
        cy.log("Click on the 'To enter' button without populating required fields")
            login.click_login()
        cy.log("'The email is not verified or does not exist.' alert message is displayed")
            login.verify_existing_username_error()
    });


    it("The user is not able to login in Councilbox with invalid password", function() {
        const email = "alem@qaengineers.net"
        const password = "Test12345"
        cy.log("Open the browser and enter the URL of the staging environment")
            cy.visit(url);
        cy.log("Populate the “Email” field with invalid Email")
            login.enter_email(email)
        cy.log("Populate the “Password” field with valid inputs")
            login.enter_password(password)
        cy.log("Click on the 'To enter' button without populating required fields")
            login.click_login()
        cy.log("'Incorrect password' alert message is displayed")
            login.verify_existing_username_error()
    });


    it("The user is not able to login in Councilbox without populating required fields", function() {
        cy.log("Open the browser and enter the URL of the staging environment")
            cy.visit(url);
        cy.log("Click on the 'To enter' button without populating required fields")
            login.click_login()
        cy.log("'This field is required.' alert message is displayed beyond the “Email” and “Password” fields")
            login.verify_existing_username_error()
            login.verify_existing_login_password_error()
    });

    it("The user is able to select the 'EN' language on the 'Homepage' section", function() {
        cy.log("Open the browser and enter the URL of the staging environment")
            cy.visit(url);
        cy.log("Navigate to the upper right corner of the page and click on the “Language selector” button")
            login.click_on_language_dropmenu()
        cy.log("From the dropdown menu choose and click on the 'EN' button")
            login.select_english_language()
    });

    it("The user is able to select the 'ES' language on the 'Homepage' section", function() {
        cy.log("Open the browser and enter the URL of the staging environment")
            cy.visit(url);
        cy.log("Navigate to the upper right corner of the page and click on the “Language selector” button")
            login.click_on_language_dropmenu()
            cy.wait(1000)
        cy.log("From the dropdown menu choose and click on the 'ES' button")
            login.select_spanish_language()
    });

    it("The user is able to select the 'CAT' language on the 'Homepage' section", function() {
        cy.log("Open the browser and enter the URL of the staging environment")
            cy.visit(url);
        cy.log("Navigate to the upper right corner of the page and click on the “Language selector” button")
            login.click_on_language_dropmenu()
        cy.log("From the dropdown menu choose and click on the 'CAT' button")
            login.select_catala_language()
    });

    it("The user is able to select the 'GAL' language on the 'Homepage' section", function() {
        cy.log("Open the browser and enter the URL of the staging environment")
            cy.visit(url);
        cy.log("Navigate to the upper right corner of the page and click on the “Language selector” button")
            login.click_on_language_dropmenu()
        cy.log("From the dropdown menu choose and click on the 'GAL' button")
            login.select_galego_language()
    });

    it("The user is able to select the 'PT' language on the 'Homepage' section", function() {
        cy.log("Open the browser and enter the URL of the staging environment")
            cy.visit(url);
        cy.log("Navigate to the upper right corner of the page and click on the “Language selector” button")
            login.click_on_language_dropmenu()
        cy.log("From the dropdown menu choose and click on the 'PT' button")
            login.select_portugese_language()
    });

    it("The user is able to select the 'EU' language on the 'Homepage' section", function() {
        cy.log("Open the browser and enter the URL of the staging environment")
            cy.visit(url);
        cy.log("Navigate to the upper right corner of the page and click on the “Language selector” button")
            login.click_on_language_dropmenu()
        cy.log("From the dropdown menu choose and click on the 'EU' button")
            login.select_euskera_language()
    });

    it("The user is able to select the 'FR' language on the 'Homepage' section", function() {
        cy.log("Open the browser and enter the URL of the staging environment")
            cy.visit(url);
        cy.log("Navigate to the upper right corner of the page and click on the “Language selector” button")
            login.click_on_language_dropmenu()
        cy.log("From the dropdown menu choose and click on the 'FR' button")
            login.select_french_language()
    });

    it("The user is able to select the 'EN' language on the 'Homepage' section", function() {
        cy.log("Open the browser and enter the URL of the staging environment")
            cy.visit(url);
        cy.log("Navigate to the upper right corner of the page and click on the “Language selector” button")
            login.click_on_language_dropmenu()
        cy.log("From the dropdown menu choose and click on the 'EN' button")
            login.select_english_language()
    });

    it("The user is not able to restore password without populating the 'Email' field", function() {
        cy.log("Open the browser and enter the URL of the staging environment")
            cy.visit(url);
        cy.log("Click on the “I forgot my password” button")
            login.click_on_forgot_password() 
        cy.log("Click on the “Restore access” button without populating the 'Email' field")
            login.click_on_restore_password() 
        cy.log("“Please enter a valid email address.” alert message is displayed")
            login.verify_existing_restore_password_email_error()
    });

    it("The user is not able to restore password with invalid inputs in the 'Email' field", function() {
    
        const email = "fsdafdsfafsda"
        cy.log("Open the browser and enter the URL of the staging environment")
            cy.visit(url);
        cy.log("Click on the “I forgot my password” button")
            login.click_on_forgot_password() 
        cy.log("Populate the “Email” field with invalid email format")
            login.enter_email_restore_password(email)
        cy.log("Click on the “Restore access” button")
            login.click_on_restore_password() 
        cy.log("“Please enter a valid email address.” alert message is displayed")
            login.verify_existing_restore_password_email_error()
    });

    it("The user is not able to restore password with email that is not verified", function() {
        const email = "fsdafdsf@fdsafa.fsa'"
        cy.log("Open the browser and enter the URL of the staging environment")
            cy.visit(url);
        cy.log("Click on the “I forgot my password” button")
            login.click_on_forgot_password() 
        cy.log("Populate the “Email” field with invalid email format")
            login.enter_email_restore_password(email)
        cy.log("Click on the “Restore access” button")
            login.click_on_restore_password() 
        cy.log("“The email was not verified or does not exist.” alert message is displayed")
            login.verify_existing_restore_password_email_error()
        
    });
});