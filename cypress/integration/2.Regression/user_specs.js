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
            cy.contains('Sign up').click()
            cy.wait(1000)
        });

        it("Click on the “Sign up” button without populating required fields", function() {
            cy.contains('Send').click()

       
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
            cy.contains('Sign up').click()
            cy.wait(1000)
        });


        it("Populate the 'Name' field with invalid inputs (with number)", function() {
            cy.get('input').eq(0)
            .type("12345")
            
        });


        it("Populate the 'Surname' field", function() {
            cy.get('input').eq(1)
            .type("Test")
            .should("have.value", "Test")
        });


        it("Populate the 'Phone' field", function() {
            cy.get('input').eq(2)
            .type("123123123")
            .should("have.value", "123123123")
        });

        it("Populate the 'Email' and the 'Repeat email' fields", function() {
            cy.get('input').eq(4)
            .type("alem"+Cypress.config('UniqueNumber')+"@yopmail.com")
            

        cy.get('input').eq(5)
            .type("alem"+Cypress.config('UniqueNumber')+"@yopmail.com")
        });

        it("Populate the 'Password' and the 'Confirm password' fields", function() {
             cy.get('input').eq(6)
            .type("Mostar123!")

        cy.get('input').eq(7)
            .type("Mostar123!") 
        });

        it("Click on the checkbox to confirm terms and conditions of councilbox", function() {
            cy.contains('I have read and accept the ').click()
        });




        it("Click on 'Send' button", function() {
            cy.contains('Send').click()

       
        });

        it("Should display 'Please enter a valid name'", function() {
            cy.contains('Please enter a valid first name')
        })
    });


describe("The user is not able to create a new account in Councilbox with invalid inputs in the 'Phone' field", function() {
    
        it("Open the browser and enter the URL of the staging environment", function() {
            cy.visit(login_url);
            cy.wait(1000);
        });
    
        it("Click on the 'Sign Up' button", function() {
            cy.contains('Sign up').click()
            cy.wait(1000)
        });


        it("Populate the 'Name' field with invalid inputs (with number)", function() {
            cy.get('input').eq(0)
            .type("Automation")
            
        });


        it("Populate the 'Surname' field", function() {
            cy.get('input').eq(1)
            .type("Test")
            .should("have.value", "Test")
        });


        it("Populate the 'Phone' field", function() {
            cy.get('input').eq(2)
            .type("test")
            .should("have.value", "test")
        });

        it("Populate the 'Email' and the 'Repeat email' fields", function() {
            cy.get('input').eq(4)
            .type("alem"+Cypress.config('UniqueNumber')+"@yopmail.com")
            

        cy.get('input').eq(5)
            .type("alem"+Cypress.config('UniqueNumber')+"@yopmail.com")
        });

        it("Populate the 'Password' and the 'Confirm password' fields", function() {
             cy.get('input').eq(6)
            .type("Mostar123!")

        cy.get('input').eq(7)
            .type("Mostar123!") 
        });

        it("Click on the checkbox to confirm terms and conditions of councilbox", function() {
            cy.contains('I have read and accept the ').click()
        });




        it("Click on 'Send' button", function() {
            cy.contains('Send').click()

       
        });

        it("Should display 'Please enter a valid phone number'", function() {
            cy.contains('Please enter a valid phone number')
        })
    });


describe("The user is not able to create a new account in Councilbox with invalid inputs in the 'Surname' field", function() {
    
        it("Open the browser and enter the URL of the staging environment", function() {
            cy.visit(login_url);
            cy.wait(1000);
        });
    
        it("Click on the 'Sign Up' button", function() {
            cy.contains('Sign up').click()
            cy.wait(1000)
        });


        it("Populate the 'Name' field with invalid inputs (with number)", function() {
            cy.get('input').eq(0)
            .type("Automation")
            
        });


        it("Populate the 'Surname' field", function() {
            cy.get('input').eq(1)
            .type("12345")
            .should("have.value", "12345")
        });


        it("Populate the 'Phone' field", function() {
            cy.get('input').eq(2)
            .type("123123123")
            .should("have.value", "123123123")
        });

        it("Populate the 'Email' and the 'Repeat email' fields", function() {
            cy.get('input').eq(4)
            .type("alem"+Cypress.config('UniqueNumber')+"@yopmail.com")
            

        cy.get('input').eq(5)
            .type("alem"+Cypress.config('UniqueNumber')+"@yopmail.com")
        });

        it("Populate the 'Password' and the 'Confirm password' fields", function() {
             cy.get('input').eq(6)
            .type("Mostar123!")

        cy.get('input').eq(7)
            .type("Mostar123!") 
        });

        it("Click on the checkbox to confirm terms and conditions of councilbox", function() {
            cy.contains('I have read and accept the ').click()
        });




        it("Click on 'Send' button", function() {
            cy.contains('Send').click()

       
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
            cy.contains('Sign up').click()
            cy.wait(1000)
        });


        it("Populate the 'Name' field with invalid inputs (with number)", function() {
            cy.get('input').eq(0)
            .type("Automation")
            
        });


        it("Populate the 'Surname' field", function() {
            cy.get('input').eq(1)
            .type("Test")
            .should("have.value", "Test")
        });


        it("Populate the 'Phone' field", function() {
            cy.get('input').eq(2)
            .type("123123123")
            .should("have.value", "123123123")
        });

        it("Populate the 'Email' and the 'Repeat email' fields", function() {
            cy.get('input').eq(4)
            .type("alem@qaengineers.net")
            

        cy.get('input').eq(5)
            .type("alem@qaengineers.net")
        });

        it("Populate the 'Password' and the 'Confirm password' fields", function() {
             cy.get('input').eq(6)
            .type("Mostar123!")

        cy.get('input').eq(7)
            .type("Mostar123!") 
        });

        it("Click on the checkbox to confirm terms and conditions of councilbox", function() {
            cy.contains('I have read and accept the ').click()
        });




        it("Click on 'Send' button", function() {
            cy.contains('Send').click()

       
        });

        it("'This email is already registered.'' message is displayed beyond the “Email” field", function() {
            cy.contains('This email is already registered.')
        })
    });


describe("The user is not able to register to the Councilbox with the invalid inputs in the 'Repeat Email' field", function() {
    
        it("Open the browser and enter the URL of the staging environment", function() {
            cy.visit(login_url);
            cy.wait(1000);
        });
    
        it("Click on the 'Sign Up' button", function() {
            cy.contains('Sign up').click()
            cy.wait(1000)
        });


        it("Populate the 'Name' field with invalid inputs (with number)", function() {
            cy.get('input').eq(0)
            .type("Automation")
            
        });


        it("Populate the 'Surname' field", function() {
            cy.get('input').eq(1)
            .type("Test")
            .should("have.value", "Test")
        });


        it("Populate the 'Phone' field", function() {
            cy.get('input').eq(2)
            .type("123123123")
            .should("have.value", "123123123")
        });

        it("Populate the 'Email' and the 'Repeat email' fields", function() {
            cy.get('input').eq(4)
            .type("alem"+Cypress.config('UniqueNumber')+"@yopmail.com")
            

        cy.get('input').eq(5)
            .type("alem123@test.test")
        });

        it("Populate the 'Password' and the 'Confirm password' fields", function() {
             cy.get('input').eq(6)
            .type("Mostar123!")

        cy.get('input').eq(7)
            .type("Mostar123!") 
        });

        it("Click on the checkbox to confirm terms and conditions of councilbox", function() {
            cy.contains('I have read and accept the ').click()
        });




        it("Click on 'Send' button", function() {
            cy.contains('Send').click()

       
        });

        it("'The email does not match.'' message is displayed beyond the “Repeat Email” field", function() {
            cy.contains('The email does not match.')
        })
    });


describe("The user is not able to register to the Councilbox with the invalid inputs in the 'Confirm Password' field", function() {
    
        it("Open the browser and enter the URL of the staging environment", function() {
            cy.visit(login_url);
            cy.wait(1000);
        });
    
        it("Click on the 'Sign Up' button", function() {
            cy.contains('Sign up').click()
            cy.wait(1000)
        });


        it("Populate the 'Name' field with invalid inputs (with number)", function() {
            cy.get('input').eq(0)
            .type("Automation")
            
        });


        it("Populate the 'Surname' field", function() {
            cy.get('input').eq(1)
            .type("Test")
            .should("have.value", "Test")
        });


        it("Populate the 'Phone' field", function() {
            cy.get('input').eq(2)
            .type("123123123")
            .should("have.value", "123123123")
        });

        it("Populate the 'Email' and the 'Repeat email' fields", function() {
            cy.get('input').eq(4)
            .type("alem"+Cypress.config('UniqueNumber')+"@yopmail.com")
            

        cy.get('input').eq(5)
            .type("alem"+Cypress.config('UniqueNumber')+"@yopmail.com")
        });

        it("Populate the 'Password' and the 'Confirm password' fields", function() {
             cy.get('input').eq(6)
            .type("Mostar123!")

        cy.get('input').eq(7)
            .type("123456") 
        });

        it("Click on the checkbox to confirm terms and conditions of councilbox", function() {
            cy.contains('I have read and accept the ').click()
        });




        it("Click on 'Send' button", function() {
            cy.contains('Send').click()

       
        });

        it("'Passwords do not match' message is displayed beyond the “Repeat Email” field", function() {
            cy.contains('The passwords do not match.')
        })
    });


describe("The user is not able to register without accepting terms and conditions", function() {
    
        it("Open the browser and enter the URL of the staging environment", function() {
            cy.visit(login_url);
            cy.wait(1000);
        });
    
        it("Click on the 'Sign Up' button", function() {
            cy.contains('Sign up').click()
            cy.wait(1000)
        });


        it("Populate the 'Name' field with invalid inputs (with number)", function() {
            cy.get('input').eq(0)
            .type("Automation")
            
        });


        it("Populate the 'Surname' field", function() {
            cy.get('input').eq(1)
            .type("Test")
            .should("have.value", "Test")
        });


        it("Populate the 'Phone' field", function() {
            cy.get('input').eq(2)
            .type("123123123")
            .should("have.value", "123123123")
        });

        it("Populate the 'Email' and the 'Repeat email' fields", function() {
            cy.get('input').eq(4)
            .type("alem"+Cypress.config('UniqueNumber')+"@yopmail.com")
            

        cy.get('input').eq(5)
            .type("alem"+Cypress.config('UniqueNumber')+"@yopmail.com")
        });

        it("Populate the 'Password' and the 'Confirm password' fields", function() {
             cy.get('input').eq(6)
            .type("Mostar123!")

        cy.get('input').eq(7)
            .type("Mostar123!") 
        });

        
        it("Click on 'Send' button", function() {
            cy.contains('Send').click()

       
        });

        it("'Accept terms and conditions' message is displayed", function() {
            cy.contains('I accept the terms and conditions.')
        })
    });



describe("The user is not able to login in Councilbox with invalid inputs in the 'Email' field", function() {
    
        it("Open the browser and enter the URL of the staging environment", function() {
            cy.visit(login_url);
            cy.wait(1000);
        });
    
        it("Navigate to the 'Sign in' form", function() {
            cy.contains('Sign in to Councilbox')
        });


        it("Populate the “Email” field with invalid Email", function() {
            cy.get('#username').type("alem53421@test.test")
            
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
    
        it("Navigate to the 'Sign in' form", function() {
            cy.contains('Sign in to Councilbox')
        });


        it("Populate the “Email” field with invalid Email", function() {
            cy.get('#username').type("alem@qaengineers.net")
            
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
    
        it("Navigate to the 'Sign in' form", function() {
            cy.contains('Sign in to Councilbox')
        });

        it("Click on the 'To enter' button without populating required fields", function() {
            cy.get('#login-button').click()
        });

        it("'Required fields' alert message is displayed", function() {
            cy.contains('This field is required.')
        });

     });


describe("The user is able to change the 'Name' in the  'User settings' in the Councilbox", function() {
    
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

        it("From the drop down menu click on the 'Edit user' button", function() {
            cy.xpath('//*[@class="fa fa-edit"]').click()
        });

        it("Modify the 'Name' field", function() {
            cy.get('input').eq(0)
            .clear()
            .type('Balla')
            cy.contains('Save').click()
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
            cy.get('input').eq(1)
            .clear()
            .type('Balic')
            cy.contains('Save').click()
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
            cy.get('input').eq(3)
            .clear()
            .type(Cypress.config('UniqueNumber'))
            cy.contains('Save').click()
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
            cy.contains('Save').click()
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
            cy.contains('Guardar').click()
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
            cy.contains('Guardar').click()
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
            cy.contains('Gravar').click()
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
            cy.contains('Gardar').click()
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
            cy.contains('Zapisz').click()
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
            cy.contains('Gorde').click()
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
            cy.contains('Enregistrer').click()
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
            cy.contains('Change password').click()
            cy.wait(1000)
        });


        it("Populate all required fields and click on the 'Save' button", function() {
            cy.xpath('(//*[@type="password"])[1]').type('Mostar123!')
            cy.xpath('(//*[@type="password"])[2]').type('Mostar123!')
            cy.xpath('(//*[@type="password"])[3]').type('Mostar123!')
            cy.xpath('(//*[@type="button"])[4]').click()
        });


        



    });




describe("The user is not able to Link company with invalid inputs in the 'Master code' field", function() {
    
        it("From the dashboard click on the 'Link company' button", function() {
            cy.get('#entidadesSideBar').click({ force: true})
            cy.wait(1000)
            cy.contains('Link company').click({ force: true})

        });

        it("Populate 'CIF of the entity*'' field", function() {
            cy.get('input').eq(0)
            .type("edittest04032021")
            .should("have.value", "edittest04032021")
        });

        it("Populate 'Master key' field with invalid input", function() {
            cy.get('input').eq(1)
            .type("123")
            .should("have.value", "123")
            cy.xpath('(//*[@type="button"])[5]').click()
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
            cy.xpath('(//*[@type="button"])[5]').click()
        });

        it("'COMPANY DOES NOT EXIST' message is displayed", function() {
            cy.contains('COMPANY DOES NOT EXIST')
        });

    });

describe("The user is able to Link Company", function() {

        it("Populate 'CIF of the entity*'' field", function() {
            cy.get('input').eq(0).clear()
            .type("edittest04032021")
            .should("have.value", "edittest04032021")
        });

        it("Populate 'Master key' field with invalid input", function() {
            cy.get('input').eq(1).clear()
            .type("Regressiontest04032021")
            .should("have.value", "Regressiontest04032021")
            cy.xpath('(//*[@type="button"])[5]').click()
            cy.wait(3000)
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
            cy.contains('Unlink').click()
            cy.wait(1000)
            cy.contains('OK').click()
            cy.wait(1000)
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


        it("Modify the 'Business name*'' field and click on the 'Save' button", function() {
            cy.get('#business-name').clear().type(userID_Alpha()+Cypress.config('UniqueNumber'))
            cy.get('#save-button').click()
        });

    });

describe("The user is able to edit 'CIF of the entity*'' in the Company settings in the Councilbox", function() {

        it("On the upper right corner click on the 'User icon' button", function() {
            cy.wait(5000)
            cy.get('#user-menu-trigger').click()
        });

        it("From the drop down menu click on 'Company' button", function() {
            cy.xpath('(//*[@role="menuitem"])[9]').click()
        });


        it("Modify the 'CIF of entity' field and click on the 'Save' button", function() {
            cy.get('#addSociedadCIF').clear().type(userID_Alpha()+Cypress.config('UniqueNumber'))
            cy.get('#save-button').click()
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
            cy.get('#addSociedadDominio').clear().type(userID_Alpha()+Cypress.config('UniqueNumber'))
            cy.get('#save-button').click()
        });

    });

describe("The user is able to edit 'Master key' in the 'Company settings' in the Councilbox", function() {

        it("On the upper right corner click on the 'User icon' button", function() {
            cy.wait(5000)
            cy.get('#user-menu-trigger').click()
        });

        it("From the drop down menu click on 'Company' button", function() {
            cy.xpath('(//*[@role="menuitem"])[9]').click()
        });


        it("Modify the 'Master key' field and click on the 'Save' button", function() {
            cy.get('#addSociedadClaveMaestra').clear().type(userID_Alpha()+Cypress.config('UniqueNumber'))
            cy.get('#save-button').click()
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
            cy.get('#company-external-id').clear().type(userID_Alpha()+Cypress.config('UniqueNumber'))
            cy.get('#save-button').click()
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });

    });

describe("The user is able to edit 'Address' in the 'Contact data' in the Company settings in the Councilbox", function() {

        it("On the upper right corner click on the 'User icon' button", function() {
            cy.wait(5000)
            cy.get('#user-menu-trigger').click()
        });

        it("From the drop down menu click on 'Company' button", function() {
            cy.xpath('(//*[@role="menuitem"])[9]').click()
        });


        it("Modify the 'Address' field and click on the 'Save' button", function() {
            cy.get('#addSociedadDireccion').clear().type(userID_Alpha()+Cypress.config('UniqueNumber'))
            cy.get('#save-button').click()
        });

    });

describe("The user is able to edit 'Locality' in the 'Contact data' in the Company settings in the Councilbox", function() {

        it("On the upper right corner click on the 'User icon' button", function() {
            cy.wait(5000)
            cy.get('#user-menu-trigger').click()
        });

        it("From the drop down menu click on 'Company' button", function() {
            cy.xpath('(//*[@role="menuitem"])[9]').click()
        });


        it("Modify the 'Locality' field and click on the 'Save' button", function() {
            cy.get('#addSociedadLocalidad').clear().type(userID_Alpha()+Cypress.config('UniqueNumber'))
            cy.get('#save-button').click()
        });

    });

describe("The user is able to edit 'Country' in the 'Contact data' in the Company settings in the Councilbox", function() {

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

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to edit 'Province' in the 'Contact data' in the Company settings in the Councilbox", function() {

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

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to edit 'Zipcode' in the 'Contact data' in the Company settings in the Councilbox", function() {

        it("On the upper right corner click on the 'User icon' button", function() {
            cy.wait(5000)
            cy.get('#user-menu-trigger').click()
        });

        it("From the drop down menu click on 'Company' button", function() {
            cy.xpath('(//*[@role="menuitem"])[9]').click()
        });


        it("Modify the 'Zipcodce' field and click on the 'Save' button", function() {
            cy.get('#addSociedadCP').clear().type(Cypress.config('UniqueNumber'))
            cy.get('#save-button').click()
        });

    });

describe("The user is able to edit 'Language' in the 'Contact data' in the Company settings in the Councilbox", function() {

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

        it("From the dropdown menu choose and click on the 'Boards of directors' button and after that populate all required fields", function() {
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




