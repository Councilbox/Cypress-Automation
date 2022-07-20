import loginPage from "../pageObjects/loginPage";
import userSettingsPage from "../pageObjects/userSettingsPage";

const invalid_emails = ["andrej@qa", "andrej.qa", "andrej@majl.234"];
const login_url = Cypress.env("baseUrl");
const valid_password = Cypress.env("login_password");
const valid_email = Cypress.env("login_email");

let settings = new userSettingsPage()
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







describe("The user is able to change the 'Name' in the  'User settings' in the Councilbox", function() {
    
    const name = "Balla"

        it("On the upper right corner click on 'User' icon", function() {
            cy.wait(5000)
            settings.click_on_my_account()
        });

        it("From the drop down menu click on the 'Edit user' button", function() {
            settings.click_on_user_settings()
        });

        it("Modify the 'Name' field", function() {
            settings.enter_user_name(name)
         
        });

        it("User should be able to save changes", function() {
            settings.click_on_save()
        });



    });

describe("The user is able to change the 'Surname' in the  'User settings' in the Councilbox", function() {
    
    const surname = "Balic"
        it("Open the browser and enter the URL of the staging environment", function() {
            cy.visit(login_url);
           
        });

        it("On the upper right corner click on 'User' icon", function() {
            settings.click_on_my_account()
        });

        it("From the drop down menu click on the 'Edit user' button", function() {
            settings.click_on_user_settings()
        });

        it("Modify the 'Surname' field", function() {
            settings.enter_user_surname(surname)
              
        });

        it("User should be able to save changes", function() {
            settings.click_on_save()
        });

    });

describe("The user is able to change the 'Telephone No' in the  'User settings' in the Councilbox", function() {
    
    const phone = Cypress.config('UniqueNumber')
        it("Open the browser and enter the URL of the staging environment", function() {
            cy.visit(login_url);
           
        });

        it("On the upper right corner click on 'User' icon", function() {
            settings.click_on_my_account()
        });

        it("From the drop down menu click on the 'Edit user' button", function() {
            settings.click_on_user_settings()
        });

        it("Modify the 'Telephone No' field", function() {
            settings.enter_user_phone(phone)
               
        });

        it("User should be able to save changes", function() {
            settings.click_on_save()
        });

    });

describe("The user is able to change the 'Email' in the  'User settings' in the Councilbox", function() {
    
    const email = "alem@qaengineers.net"
        it("Open the browser and enter the URL of the staging environment", function() {
            cy.visit(login_url);
            
        });

        it("On the upper right corner click on 'User' icon", function() {
            settings.click_on_my_account()
        });

        it("From the drop down menu click on the 'Edit user' button", function() {
            settings.click_on_user_settings()
        });

        it("Modify the 'Email' field", function() {
            settings.enter_user_email(email) 
            
            
        });

        it("User should be able to save changes", function() {
            settings.click_on_save()
        });

    });


describe("The user is able to select the 'Español' language in the  'User settings' in the Councilbox", function() {
    
        it("Open the browser and enter the URL of the staging environment", function() {
            cy.visit(login_url);
            
        });
        
        it("On the upper right corner click on 'User' icon", function() {
            settings.click_on_my_account()
        });

        it("From the drop down menu click on the 'Edit user' button", function() {
            settings.click_on_user_settings()
        });

        it("Navigate to the 'Language' section and select the 'English' language and click on the “Save” button", function() {
            settings.click_on_user_language()
            login.select_spanish_language()
        });

        it("User should be able to save changes", function() {
            settings.click_on_save()
        });

    });

describe("The user is able to select the 'Català' language in the  'User settings' in the Councilbox", function() {
    
        it("Open the browser and enter the URL of the staging environment", function() {
            cy.visit(login_url);
            
        });
        
        it("On the upper right corner click on 'User' icon", function() {
            settings.click_on_my_account()
        });

        it("From the drop down menu click on the 'Edit user' button", function() {
            settings.click_on_user_settings()
        });

        it("Navigate to the 'Language' section and select the 'English' language and click on the “Save” button", function() {
            settings.click_on_user_language()
            login.select_catala_language()
        });

        it("User should be able to save changes", function() {
            settings.click_on_save()
        });

    });

describe("The user is able to select the 'Português' language in the  'User settings' in the Councilbox", function() {
    
        it("Open the browser and enter the URL of the staging environment", function() {
            cy.visit(login_url);
            
        });
        
        it("On the upper right corner click on 'User' icon", function() {
            settings.click_on_my_account()
        });

        it("From the drop down menu click on the 'Edit user' button", function() {
            settings.click_on_user_settings()
        });

        it("Navigate to the 'Language' section and select the 'English' language and click on the “Save” button", function() {
            settings.click_on_user_language()
            login.select_portugese_language()
        });

        it("User should be able to save changes", function() {
            settings.click_on_save()
        });

    });

describe("The user is able to select the 'Galego' language in the  'User settings' in the Councilbox", function() {
    
        it("Open the browser and enter the URL of the staging environment", function() {
            cy.visit(login_url);
           
        });
        
        it("On the upper right corner click on 'User' icon", function() {
            settings.click_on_my_account()
        });

        it("From the drop down menu click on the 'Edit user' button", function() {
            settings.click_on_user_settings()
        });

        it("Navigate to the 'Language' section and select the 'English' language and click on the “Save” button", function() {
            settings.click_on_user_language()
            login.select_galego_language()
        });

        it("User should be able to save changes", function() {
            settings.click_on_save()
        });

    });


describe("The user is able to select the 'Polsku' language in the  'User settings' in the Councilbox", function() {
    
        it("Open the browser and enter the URL of the staging environment", function() {
            cy.visit(login_url);
            
        });
        
        it("On the upper right corner click on 'User' icon", function() {
            settings.click_on_my_account()
        });

        it("From the drop down menu click on the 'Edit user' button", function() {
            settings.click_on_user_settings()
        });

        it("Navigate to the 'Language' section and select the 'English' language and click on the “Save” button", function() {
            settings.click_on_user_language()
            login.select_polish_language()
        });

        it("User should be able to save changes", function() {
            settings.click_on_save()
        });

    });


describe("The user is able to select the 'Euskera' language in the  'User settings' in the Councilbox", function() {
    
        it("Open the browser and enter the URL of the staging environment", function() {
            cy.visit(login_url);
            
        });
        
        it("On the upper right corner click on 'User' icon", function() {
            settings.click_on_my_account()
        });

        it("From the drop down menu click on the 'Edit user' button", function() {
            settings.click_on_user_settings()
        });

        it("Navigate to the 'Language' section and select the 'English' language and click on the “Save” button", function() {
            settings.click_on_user_language()
            login.select_euskera_language()
        });

        it("User should be able to save changes", function() {
            settings.click_on_save()
        });

    });


describe("The user is able to select the 'Français' language in the  'User settings' in the Councilbox", function() {
    
        it("Open the browser and enter the URL of the staging environment", function() {
            cy.visit(login_url);
          
        });
        
        it("On the upper right corner click on 'User' icon", function() {
            settings.click_on_my_account()
        });

        it("From the drop down menu click on the 'Edit user' button", function() {
            settings.click_on_user_settings()
        });

        it("Navigate to the 'Language' section and select the 'English' language and click on the “Save” button", function() {
            settings.click_on_user_language()
            login.select_french_language()
        });

        it("User should be able to save changes", function() {
            settings.click_on_save()
        });

    });

describe("The user is able to select the 'English' language in the  'User settings' in the Councilbox", function() {
    
        it("Open the browser and enter the URL of the staging environment", function() {
            cy.visit(login_url);
          
        });
        
        it("On the upper right corner click on 'User' icon", function() {
            settings.click_on_my_account()
        });

        it("From the drop down menu click on the 'Edit user' button", function() {
            settings.click_on_user_settings()
        });

        it("Navigate to the 'Language' section and select the 'English' language and click on the “Save” button", function() {
            settings.click_on_user_language()
            login.select_english_language()
        });

        it("User should be able to save changes", function() {
            settings.click_on_save()
        });

        it("Refresh the Web App", function() {
            cy.visit(login_url);
        })

    });


describe("The user is able to change password in the Councilbox", function() {
    const password = "Mostar123!"
    const new_password = "Mostar123!"
        it("On the upper right corner click on 'User' icon", function() {
            settings.click_on_my_account()
        });

        it("From the drop down menu click on the 'Edit user' button", function() {
            settings.click_on_user_settings()
        });

        it("Click on the 'Change password' button", function() {
            settings.click_on_change_password()
          
        });


        it("Populate all required fields and click on the 'Save' button", function() {
            settings.enter_current_password(password)
            settings.enter_new_password(new_password)
            settings.enter_new_password_confirm(new_password)
            settings.click_on_save_password() 
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });

    });

describe("The user is not able to change password without populating the 'Current password' field", function() {
    const new_password = "Mostar123!"
    

        it("On the upper right corner click on 'User' icon", function() {
            settings.click_on_my_account()
        });

        it("From the drop down menu click on the 'Edit user' button", function() {
            settings.click_on_user_settings()
        });

        it("Click on the 'Change password' button", function() {
            settings.click_on_change_password()
           
        });

      

        it("Populate the “New password” field", function() {
            settings.enter_new_password(new_password)
         
        });

        it("Populate the “Confirm” field", function() {
            settings.enter_new_password_confirm(new_password)
           
        });

        it("Click on the 'Save' button", function() {
            settings.click_on_save_password() 
           
        });

        it("“The password cannot be empty” message is displayed", function() {
            settings.verify_existing_current_password_error()
          
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });

    });

describe("The user is not able to change password without populating the 'New password' field", function() {
    
    const password = "Mostar123!"
    const new_password = "Mostar123!"
    const new_password1 = " "
        it("On the upper right corner click on 'User' icon", function() {
            settings.click_on_my_account()
        });

        it("From the drop down menu click on the 'Edit user' button", function() {
            settings.click_on_user_settings()
        });

        it("Click on the 'Change password' button", function() {
            settings.click_on_change_password()
           
        });

        it("Populate the “Current password” field", function() {
            settings.enter_current_password(password)
           
        });

        it("Skip the “New password” field", function() {
           settings.clear_user_new_password()
        });

        it("Populate the “Confirm” field", function() {
            settings.enter_new_password_confirm(new_password)
           
        });

        it("Click on the 'Save' button", function() {
            settings.click_on_save_password() 
           
        });

        it("“The password cannot be empty” alert message is displayed beyond the “New password” field", function() {
            settings.verify_existing_new_password_error() 
            
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });

    });

describe("The user is not able to change password without populating the 'Confirm' field", function() {
    
    const password = "Mostar123!"
    const new_password = "Mostar123!"
    const new_password1 = " "
        it("On the upper right corner click on 'User' icon", function() {
            settings.click_on_my_account()
        });

        it("From the drop down menu click on the 'Edit user' button", function() {
            settings.click_on_user_settings()
        });

        it("Click on the 'Change password' button", function() {
            settings.click_on_change_password()
           
        });

        it("Populate the “Current password” field", function() {
            settings.enter_current_password(password)
           
        });

        it("Populate the “New password” field", function() {
            settings.enter_new_password(new_password)
           
        });

        it("Skip the “Confirm” field", function() {
            settings.clear_user_new_password_confirm()
        });

        it("Click on the 'Save' button", function() {
            settings.click_on_save_password() 
            
        });

        it("“The passwords do not match” alert message is displayed beyond the “Confirm” field", function() {
            settings.verify_existing_new_password_confirm_error() 
            
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });

    });

describe("The user is not able to change password without populating the 'Confirm' field", function() {
    const password = "Starmo123!"
    const new_password = "Mostar123!"
        it("On the upper right corner click on 'User' icon", function() {
            settings.click_on_my_account()
        });

        it("From the drop down menu click on the 'Edit user' button", function() {
            settings.click_on_user_settings()
        });

        it("Click on the 'Change password' button", function() {
            settings.click_on_change_password()
         
        });

        it("Populate the “Current password” field with invalid inputs", function() {
            settings.enter_current_password(password)
            
        });

        it("Populate the “New password” field", function() {
            settings.enter_new_password(new_password)
          
        });

        it("Populate the “Confirm” field", function() {
            settings.enter_new_password_confirm(new_password)
         
        });

        it("Click on the 'Save' button", function() {
            settings.click_on_save_password() 
          
        });

        it("“Incorrect current password” alert message is displayed beyond the “Current password field” field", function() {
            settings.verify_existing_current_password_error()
           
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });

    });

describe("The user is not able to change Email with invalid inputs", function() {
    
    const name = "Balla"
    const surname = "Alem"
    const email = "sfdafsdf"
    const phone = "123456"
        it("On the upper right corner click on 'User' icon", function() {
            settings.click_on_my_account()
        });

        it("From the drop down menu click on the 'Edit user' button", function() {
            settings.click_on_user_settings()
        });

        it("Populate the 'Name' field", function() {
            settings.enter_user_name(name)
            
        });

        it("Populate the 'Last Name' field", function() {
            settings.enter_user_surname(surname)
            
        });

        it("Populate the “Email” field with invalid inputs", function() {
            settings.enter_user_email(email)
           
        });

        it("Populate the 'Telephone No' field", function() {
            settings.enter_user_phone(phone)
          
        });

        it("Click on the “Save” button", function() {
            settings.click_on_save()
         
        });

        it("Observe the “Save” button and observe the message beyond the “Email” field - “Invalid field”", function() {
            settings.verify_existing_user_email_error()
        
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });

    });

describe("The user is not able to save changes without populating the 'Last Name' field", function() {
    const name = "Balla"
    const email = "alem@qaengineers.net"
    const phone = "123456"
    const surname = " "
        it("On the upper right corner click on 'User' icon", function() {
            settings.click_on_my_account()
        });

        it("From the drop down menu click on the 'Edit user' button", function() {
            settings.click_on_user_settings()
        });

        it("Populate the 'Name' field", function() {
            settings.enter_user_name(name)
         
        });

        it("Skip the 'Last Name' field", function() {
           settings.clear_user_surname()
        });

        it("Populate the “Email” field", function() {
            settings.enter_user_email(email)
          
        });

        it("Populate the 'Telephone No' field", function() {
            settings.enter_user_phone(phone)
           
        });

        it("Click on the “Save” button", function() {
            settings.click_on_save()
          
        })

        it("Observe the “Save” button and observe the message beyond the “Last Name” field - “This field is required.”", function() {
            settings.verify_existing_user_surname_error()
            
        })

        it("Back to Home page", function() {
            cy.visit(login_url);
        });

    });

describe("The user is not able to save changes without populating the 'Email' field", function() {
    const name = "Balla"
    const surname = "Alem"
    const phone = "123456"
    const email = " "
        it("On the upper right corner click on 'User' icon", function() {
            settings.click_on_my_account()
        });

        it("From the drop down menu click on the 'Edit user' button", function() {
            settings.click_on_user_settings()
        });

        it("Populate the 'Name' field", function() {
            settings.enter_user_name(name)
          
        });

        it("Populate the 'Last Name' field", function() {
            settings.enter_user_surname(surname)
           
        });

        it("Skip the “Email” field", function() {
            settings.clear_user_email()
        });

        it("Populate the 'Telephone No' field", function() {
            settings.enter_user_phone(phone)
          
        });

        it("Click on the “Save” button", function() {
            settings.click_on_save()
          
        })

        it("Observe the “Save” button and observe the message beyond the “Email” field - “Invalid field”", function() {
            settings.verify_existing_user_email_error()
            
        })

        it("Back to Home page", function() {
            cy.visit(login_url);
        });

    });

describe("The user is not able to save changes without populating the 'First Name' field", function() {
    const surname = "Alem"
    const email = "alem@qaengineers.net"
    const phone = "123456"
    const name = " "
        it("On the upper right corner click on 'User' icon", function() {
            settings.click_on_my_account()
        });

        it("From the drop down menu click on the 'Edit user' button", function() {
            settings.click_on_user_settings()
        });

        it("Skip the 'Name' field", function() {
            settings.clear_user_name()
        });

        it("Populate the 'Last Name' field", function() {
            settings.enter_user_surname(surname)
            
        });

        it("Populate the “Email” field", function() {
            settings.enter_user_email(email)
            
        });

        it("Populate the 'Telephone No' field", function() {
            settings.enter_user_phone(phone)
         
        });

        it("Click on the “Save” button", function() {
            settings.click_on_save()
           
        })

        it("Observe the “Save” button and observe the message beyond the “Name” field - “This field is required.”", function() {
            settings.verify_existing_user_name_error()
          
        })

        it("Back to Home page", function() {
            cy.visit(login_url);
        });

    });