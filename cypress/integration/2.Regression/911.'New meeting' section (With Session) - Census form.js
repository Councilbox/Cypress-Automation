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



describe("The user is not able to add participant with invalid inputs in the 'Name' field to the Census in the 'New meeting' section", function() {

     before(function() {
        
    });

    it("Click on the 'New meeting' button", function() {
        cy.get('#create-council-block').click()
    });

    it("Click on the “With session” button", function() {
        cy.get('#create-council-with-session').click()
          
    });

    it("Populate all required fields and click on the “Next” button", function() {
        cy.get('#council-notice-type-select').click()
        cy.get('#council-notice-type-2').click()
        cy.get('#council-notice-title').clear()
            .type('Test')
       cy.get('#council-notice-convene-intro')
            .type('Test')
        cy.get('#council-editor-next').click()
        
    });

    it("Click on the 'Add participant+' button", function() {
        cy.get('#add-participant-dropdown-trigger').click()
        cy.get('#add-participant-button').click()
    })

    it("Populate the 'Name' field with invalid inputs(press just space button on the keyboard) and all other fields with valid inputs click on the 'OK' button", function() {
        cy.get('#participant-name-input').clear()
            .type('!')               
        cy.get('#participant-surname-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')) 
                
        cy.get('#participant-email-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com')                
  
        cy.get('#alert-confirm-button-accept').click()
          
    })

    it("'Invalid field' alert message is displayed beyond the 'Name' field", function() {
        cy.get('#participant-name-input-error-text').should('be.visible')
    })

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });

});

describe("The user is not able to add participant with invalid inputs in the 'Surname' field to the Census in the 'New meeting' section", function() {

     before(function() {
        
    });

    it("Click on the 'New meeting' button", function() {
        cy.get('#create-council-block').click()
    });

    it("Click on the “With session” button", function() {
        cy.get('#create-council-with-session').click()
          
    });

    it("Populate all required fields and click on the “Next” button", function() {
        cy.get('#council-notice-type-select').click()
        cy.get('#council-notice-type-2').click()
        cy.get('#council-notice-title').clear()
            .type('Test')
       cy.get('#council-notice-convene-intro')
            .type('Test')
        cy.get('#council-editor-next').click()
        
    });

    it("Click on the 'Add participant+' button", function() {
        cy.get('#add-participant-dropdown-trigger').click()
        cy.get('#add-participant-button').click()
    })

    it("Populate the 'Surname' field with invalid inputs(press just space button on the keyboard) and all other fields with valid inputs click on the 'OK' button", function() {
        cy.get('#participant-name-input').clear()
            .type('alem'+Cypress.config('UniqueNumber'))               
        cy.get('#participant-surname-input').clear()
            .type('!') 
                
        cy.get('#participant-email-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com')                
  
        cy.get('#alert-confirm-button-accept').click()
          
    })

    it("'Invalid field' alert message is displayed beyond the 'Name' field", function() {
        cy.get('#participant-surname-input-error-text').should('be.visible')
    })

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });

});

describe("The user is not able to add representative with invalid inputs in the 'Name' field in the 'Add participant+'' form in the 'New meeting with session' type of meeting", function() {

     before(function() {
        
    });

    it("Click on the 'New meeting' button", function() {
        cy.get('#create-council-block').click()
    });

    it("Click on the “With session” button", function() {
        cy.get('#create-council-with-session').click()
          
    });

    it("Populate all required fields and click on the “Next” button", function() {
        cy.get('#council-notice-type-select').click()
        cy.get('#council-notice-type-2').click()
        cy.get('#council-notice-title').clear()
            .type('Test')
       cy.get('#council-notice-convene-intro')
            .type('Test')
        cy.get('#council-editor-next').click()
        
    });

    it("Click on the 'Add participant+' button", function() {
        cy.get('#add-participant-dropdown-trigger').click()
        cy.get('#add-participant-button').click()
    })

    it("Populate all required fields and scroll down the page", function() {
        cy.get('#participant-name-input').clear()
            .type('alem'+Cypress.config('UniqueNumber'))               
        cy.get('#participant-surname-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')) 
                
        cy.get('#participant-email-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com')                
  

    })

    it("Click on the 'Add representative' button", function() {
        cy.get('#add-representative-button').click()
    })

    it("Populate the 'Name' field with invalid inputs(press just space button on the keyboard) and all other fields with valid inputs click on the 'OK' button", function() {
        cy.get('#representative-name-input').clear()
            .type('!!')
        cy.get('#representative-surname-input').clear()
            .type('Repre'+Cypress.config('UniqueNumber'))
  
        cy.get('#representative-email-input').clear()
            .type('rep'+Cypress.config('UniqueNumber')+'@yopmail.com')  

        cy.get('#alert-confirm-button-accept').click()
    })

    it("'Invalid field' alert message is displayed beyond the 'Name' field",function() {


        cy.get('#representative-name-input-error-text').should('be.visible')
    })
    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });


});

describe("The user is not able to add representative with invalid inputs in the 'Surname' field in the 'Add participant+'' form in the 'New meeting with session' type of meeting", function() {

     before(function() {
        
    });

    it("Click on the 'New meeting' button", function() {
        cy.get('#create-council-block').click()
    });

    it("Click on the “With session” button", function() {
        cy.get('#create-council-with-session').click()
          
    });

    it("Populate all required fields and click on the “Next” button", function() {
        cy.get('#council-notice-type-select').click()
        cy.get('#council-notice-type-2').click()
        cy.get('#council-notice-title').clear()
            .type('Test')
       cy.get('#council-notice-convene-intro')
            .type('Test')
        cy.get('#council-editor-next').click()
        
    });

    it("Click on the 'Add participant+' button", function() {
        cy.get('#add-participant-dropdown-trigger').click()
        cy.get('#add-participant-button').click()
    })

    it("Populate all required fields and scroll down the page", function() {
        cy.get('#participant-name-input').clear()
            .type('alem'+Cypress.config('UniqueNumber'))               
        cy.get('#participant-surname-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')) 
                
        cy.get('#participant-email-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com')                
  

    })

    it("Click on the 'Add representative' button", function() {
        cy.get('#add-representative-button').click()
    })

    it("Populate the 'Surname' field with invalid inputs(press just space button on the keyboard) and all other fields with valid inputs click on the 'OK' button", function() {
        cy.get('#representative-name-input').clear()
            .type('Repre'+Cypress.config('UniqueNumber'))
        cy.get('#representative-surname-input').clear()
            .type('!!')
  
        cy.get('#representative-email-input').clear()
            .type('rep'+Cypress.config('UniqueNumber')+'@yopmail.com')  

        cy.get('#alert-confirm-button-accept').click()
    })

    it("'Invalid field' alert message is displayed beyond the 'Surname' field",function() {


        cy.get('#representative-surname-input-error-text').should('be.visible')
        })

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });

});

/*

describe("The user is not able to add representative with invalid inputs in the 'Phone' field in the 'Add participant+'' form in the 'New meeting with session' type of meeting", function() {

     before(function() {
        
    });

    it("Click on the 'New meeting' button", function() {
        cy.get('#create-council-block').click()
    });

    it("Click on the “With session” button", function() {
        cy.get('#create-council-with-session').click()
          
    });

    it("Populate all required fields and click on the “Next” button", function() {
        cy.get('#council-notice-type-select').click()
        cy.get('#council-notice-type-2').click()
        cy.get('#council-notice-title').clear()
            .type('Test')
       cy.get('#council-notice-convene-intro')
            .type('Test')
        cy.get('#council-editor-next').click()
        
    });

    it("Click on the 'Add participant+' button", function() {
        cy.get('#add-participant-dropdown-trigger').click()
        cy.get('#add-participant-button').click()
    })

    it("Populate all required fields and scroll down the page", function() {
        cy.get('#participant-name-input').clear()
            .type('alem'+Cypress.config('UniqueNumber'))               
        cy.get('#participant-surname-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')) 
                
        cy.get('#participant-email-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com')                
  

    })

    it("Click on the 'Add representative' button", function() {
        cy.get('#add-representative-button').click()
    })

    it("Populate the 'Surname' field with invalid inputs(press just space button on the keyboard) and all other fields with valid inputs click on the 'OK' button", function() {
        cy.get('#representative-name-input').clear()
            .type('Repre'+Cypress.config('UniqueNumber'))
        cy.get('#representative-surname-input').clear()
            .type('Repre'+Cypress.config('UniqueNumber'))
  
        cy.get('#representative-email-input').clear()
            .type('rep'+Cypress.config('UniqueNumber')+'@yopmail.com')  
        cy.get('#representative-phone-input').clear()
            .type('!!')  
        cy.get('#alert-confirm-button-accept').click()
    })

    it("'Invalid field' alert message is displayed beyond the 'Phone' field",function() {


        cy.get('#representative-phone-input-error-text').should('be.visible')
        })

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });

});



describe("The user is not able to add representative with invalid inputs in the 'TIN' field in the 'Add participant+'' form in the 'New meeting with session' type of meeting", function() {

     before(function() {
        
    });

    it("Click on the 'New meeting' button", function() {
        cy.get('#create-council-block').click()
    });

    it("Click on the “With session” button", function() {
        cy.get('#create-council-with-session').click()
          
    });

    it("Populate all required fields and click on the “Next” button", function() {
        cy.get('#council-notice-type-select').click()
        cy.get('#council-notice-type-2').click()
        cy.get('#council-notice-title').clear()
            .type('Test')
       cy.get('#council-notice-convene-intro')
            .type('Test')
        cy.get('#council-editor-next').click()
        
    });

    it("Click on the 'Add participant+' button", function() {
        cy.get('#add-participant-dropdown-trigger').click()
        cy.get('#add-participant-button').click()
    })

    it("Populate all required fields and scroll down the page", function() {
        cy.get('#participant-name-input').clear()
            .type('alem'+Cypress.config('UniqueNumber'))               
        cy.get('#participant-surname-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')) 
                
        cy.get('#participant-email-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com')                
  

    })

    it("Click on the 'Add representative' button", function() {
        cy.get('#add-representative-button').click()
    })

    it("Populate the 'TIN' field with invalid inputs(press just space button on the keyboard) and all other fields with valid inputs click on the 'OK' button", function() {
        cy.get('#representative-name-input').clear()
            .type('Repre'+Cypress.config('UniqueNumber'))
        cy.get('#representative-surname-input').clear()
            .type('Repre'+Cypress.config('UniqueNumber'))
  
        cy.get('#representative-email-input').clear()
            .type('rep'+Cypress.config('UniqueNumber')+'@yopmail.com')  
        cy.get('#representative-dni-input').clear()
            .type('!!')  
        cy.get('#alert-confirm-button-accept').click()
    })

    it("'Invalid field' alert message is displayed beyond the 'TIN' field",function() {

    
        cy.get('#representative-dni-input-error-text').should('be.visible')
})

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });

});

*/

describe("The user is able to add representative in the 'Add participant+'' form in the 'New meeting with session' type of meeting", function() {

     before(function() {
        
    });

    it("Click on the 'New meeting' button", function() {
        cy.get('#create-council-block').click()
    });

    it("Click on the “With session” button", function() {
        cy.get('#create-council-with-session').click()
          
    });

    it("Populate all required fields and click on the “Next” button", function() {
        cy.get('#council-notice-type-select').click()
        cy.get('#council-notice-type-2').click()
        cy.get('#council-notice-title').clear()
            .type('Test')
       cy.get('#council-notice-convene-intro')
            .type('Test')
        cy.get('#council-editor-next').click()
        
    });

    it("Click on the 'Add participant+' button", function() {
        cy.get('#add-participant-dropdown-trigger').click()
        cy.get('#add-participant-button').click()
    })

    it("Populate all required fields and scroll down the page", function() {
        cy.get('#participant-name-input').clear()
            .type('alem'+Cypress.config('UniqueNumber'))               
        cy.get('#participant-surname-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')) 
                
        cy.get('#participant-email-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com')                
  

    })

    it("Click on the 'Add representative' button", function() {
        cy.get('#add-representative-button').click()
    })

    it("Populate all required fields and click on the 'OK' CTA", function() {
        cy.get('#representative-name-input').clear()
            .type('Repre'+Cypress.config('UniqueNumber'))
        cy.get('#representative-surname-input').clear()
            .type('Repre'+Cypress.config('UniqueNumber'))
  
        cy.get('#representative-email-input').clear()
            .type('rep'+Cypress.config('UniqueNumber')+'@yopmail.com')  
 
        cy.get('#alert-confirm-button-accept').click()
    })

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });

});


describe("The user is able to edit participant to the Census in the 'New meeting' section", function() {

     before(function() {
        
    });

    it("Click on the 'New meeting' button", function() {
        cy.get('#create-council-block').click()
    });

    it("Click on the “With session” button", function() {
        cy.get('#create-council-with-session').click()
          
    });

    it("Populate all required fields and click on the “Next” button", function() {
        cy.get('#council-notice-type-select').click()
        cy.get('#council-notice-type-2').click()
        cy.get('#council-notice-title').clear()
            .type('Test')
       cy.get('#council-notice-convene-intro')
            .type('Test')
        cy.get('#council-editor-next').click()
        
    });

    it("Click on the 'Add participant+' button", function() {
        cy.get('#add-participant-dropdown-trigger').click()
        cy.get('#add-participant-button').click()
    })

    it("Populate all required fields and scroll down the page", function() {
        cy.get('#participant-name-input').clear()
            .type('alem'+Cypress.config('UniqueNumber'))               
        cy.get('#participant-surname-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')) 
                
        cy.get('#participant-email-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com')                
  
        cy.get('#alert-confirm-button-accept').click()

    })

    it("Navigate to the already added participant and click on it", function() {
        cy.get('#participant-row-0').click()
    })

    it("Modify the data with changes you want and click on the 'OK' button", function() {
        cy.get('#participant-name-input').clear()
            .type('Edit'+Cypress.config('UniqueNumber'))
        cy.get('#alert-confirm-button-accept').click()
        cy.contains('Edit'+Cypress.config('UniqueNumber')).should('be.visible')
    })

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });

});

describe("The user is able to delete participant to the Census in the 'New meeting' section", function() {

     before(function() {
        
    });

    it("Click on the 'New meeting' button", function() {
        cy.get('#create-council-block').click()
    });

    it("Click on the “With session” button", function() {
        cy.get('#create-council-with-session').click()
          
    });

    it("Populate all required fields and click on the “Next” button", function() {
        cy.get('#council-notice-type-select').click()
        cy.get('#council-notice-type-2').click()
        cy.get('#council-notice-title').clear()
            .type('Test')
       cy.get('#council-notice-convene-intro')
            .type('Test')
        cy.get('#council-editor-next').click()
        
    });

    it("Click on the 'Add participant+' button", function() {
        cy.get('#add-participant-dropdown-trigger').click()
        cy.get('#add-participant-button').click()
    })

    it("Populate all required fields and scroll down the page", function() {
        cy.get('#participant-name-input').clear()
            .type('alem'+Cypress.config('UniqueNumber'))               
        cy.get('#participant-surname-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')) 
                
        cy.get('#participant-email-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com')                
  
        cy.get('#alert-confirm-button-accept').click()

    })

    it("Navigate to the already added participant and hover it", function() {
        cy.get('#participant-row-0').trigger('mouseover')
    })

    it("Click on 'X' button", function() {
        cy.get('#delete-participant-icon-0').click()
    })

    it("Click on 'OK' button", function() {
        cy.get('#alert-confirm-button-accept').click()
    })

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });



});

describe("The user is able to select representative in the 'Add participant+'' form in the 'New meeting with session' type of meeting", function() {

     before(function() {
        
    });

    it("Click on the 'New meeting' button", function() {
        cy.get('#create-council-block').click()
    });

    it("Click on the “With session” button", function() {
        cy.get('#create-council-with-session').click()
          
    });

    it("Populate all required fields and click on the “Next” button", function() {
        cy.get('#council-notice-type-select').click()
        cy.get('#council-notice-type-2').click()
        cy.get('#council-notice-title').clear()
            .type('Test')
       cy.get('#council-notice-convene-intro')
            .type('Test')
        cy.get('#council-editor-next').click()
        
    });

    it("Click on the 'Add participant+' button", function() {
        cy.get('#add-participant-dropdown-trigger').click()
        cy.get('#add-participant-button').click()
    })

    it("Populate all required fields and scroll down the page", function() {
        cy.get('#participant-name-input').clear()
            .type('alem'+Cypress.config('UniqueNumber'))               
        cy.get('#participant-surname-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')) 
                
        cy.get('#participant-email-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com')                
  

    })

    it("Click on the 'Add representative' button", function() {
        cy.get('#add-representative-button').click()
    })

    it("Populate all required fields and click on the 'OK' CTA", function() {
        cy.get('#representative-name-input').clear()
            .type('Repre'+Cypress.config('UniqueNumber'))
        cy.get('#representative-surname-input').clear()
            .type('Repre'+Cypress.config('UniqueNumber'))
  
        cy.get('#representative-email-input').clear()
            .type('rep'+Cypress.config('UniqueNumber')+'@yopmail.com')  
 
        cy.get('#alert-confirm-button-accept').click()
    })

    it("Click on the 'Add participant+' button", function() {
        cy.get('#add-participant-dropdown-trigger').click()
        cy.get('#add-participant-button').click()
    })

    it("Populate all required fields and scroll down the page", function() {
        cy.get('#participant-name-input').clear()
            .type('New'+Cypress.config('UniqueNumber'))               
        cy.get('#participant-surname-input').clear()
            .type('New'+Cypress.config('UniqueNumber')) 
                
        cy.get('#participant-email-input').clear()
            .type('alem1'+Cypress.config('UniqueNumber')+'@yopmail.com')                
        cy.get('#participant-administrative-email-input').clear()
            .type('alem1'+Cypress.config('UniqueNumber')+'@yopmail.com') 

    })

    it("Click on the 'Select representative' button", function() {
        cy.get('#select-representative-button').click()
    })


    it("Navigate to the user you want to select and click on it then click on the 'OK' button", function() {
        cy.get('#MISSING_ID').click()
        cy.get('#alert-confirm-button-accept').click()
    })

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });


});


describe("The user is able to add 'Viewer' type of participation to the Census in the 'New meeting' section", function() {

     before(function() {
        
    });

    it("Click on the 'New meeting' button", function() {
        cy.get('#create-council-block').click()
    });

    it("Click on the “With session” button", function() {
        cy.get('#create-council-with-session').click()
          
    });

    it("Populate all required fields and click on the “Next” button", function() {
        cy.get('#council-notice-type-select').click()
        cy.get('#council-notice-type-2').click()
        cy.get('#council-notice-title').clear()
            .type('Test')
       cy.get('#council-notice-convene-intro')
            .type('Test')
        cy.get('#council-editor-next').click()
        
    });

    it("Click on the 'Add participant+' button", function() {
        cy.get('#add-participant-dropdown-trigger').click()
        cy.get('#add-participant-button').click()
    })

    it("Populate all required fields and scroll down the page", function() {
        cy.get('#participant-name-input').clear()
            .type('alem'+Cypress.config('UniqueNumber'))               
        cy.get('#participant-surname-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')) 
                
        cy.get('#participant-email-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com')                
  

    })

    it("Navigate to the 'Type of participation' field and click on the 'Viewer' button", function() {
        cy.get('#participant-participation-type-select').click()
        cy.get('#participant-participation-viewer').click()
    })


    
    it("Click 'OK' button", function() {
        cy.get('#alert-confirm-button-accept').click()
    })

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });


});

describe("The user is able to add 'Floor given' type of participation to the Census in the 'New meeting' section", function() {

     before(function() {
        
    });

    it("Click on the 'New meeting' button", function() {
        cy.get('#create-council-block').click()
    });

    it("Click on the “With session” button", function() {
        cy.get('#create-council-with-session').click()
          
    });

    it("Populate all required fields and click on the “Next” button", function() {
        cy.get('#council-notice-type-select').click()
        cy.get('#council-notice-type-2').click()
        cy.get('#council-notice-title').clear()
            .type('Test')
       cy.get('#council-notice-convene-intro')
            .type('Test')
        cy.get('#council-editor-next').click()
        
    });

    it("Click on the 'Add participant+' button", function() {
        cy.get('#add-participant-dropdown-trigger').click()
        cy.get('#add-participant-button').click()
    })

    it("Populate all required fields and scroll down the page", function() {
        cy.get('#participant-name-input').clear()
            .type('alem'+Cypress.config('UniqueNumber'))               
        cy.get('#participant-surname-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')) 
                
        cy.get('#participant-email-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com')                
  

    })

    it("Navigate to the 'Type of participation' field and click on the 'Floor given' button", function() {
        cy.get('#participant-participation-type-select').click()
        cy.get('#participant-participation-granted-word').click()
    })


    
    it("Click 'OK' button", function() {
        cy.get('#alert-confirm-button-accept').click()
    })

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });


});

describe("The user is able to add 'You cannot request the floor' type of participation to the Census in the 'New meeting' section", function() {

     before(function() {
        
    });

    it("Click on the 'New meeting' button", function() {
        cy.get('#create-council-block').click()
    });

    it("Click on the “With session” button", function() {
        cy.get('#create-council-with-session').click()
          
    });

    it("Populate all required fields and click on the “Next” button", function() {
        cy.get('#council-notice-type-select').click()
        cy.get('#council-notice-type-2').click()
        cy.get('#council-notice-title').clear()
            .type('Test')
       cy.get('#council-notice-convene-intro')
            .type('Test')
        cy.get('#council-editor-next').click()
        
    });

    it("Click on the 'Add participant+' button", function() {
        cy.get('#add-participant-dropdown-trigger').click()
        cy.get('#add-participant-button').click()
    })

    it("Populate all required fields and scroll down the page", function() {
        cy.get('#participant-name-input').clear()
            .type('alem'+Cypress.config('UniqueNumber'))               
        cy.get('#participant-surname-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')) 
                
        cy.get('#participant-email-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com')                
  

    })

    it("Navigate to the 'Type of participation' field and click on the 'You cannot request the floor' button", function() {
        cy.get('#participant-participation-type-select').click()
        cy.get('#participant-participation-cant-ask-word').click()
    })


    
    it("Click 'OK' button", function() {
        cy.get('#alert-confirm-button-accept').click()
    })

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });


});

describe("The user is able to add 'Waiting room' type of participation to the Census in the 'New meeting' section", function() {

     before(function() {
        
    });

    it("Click on the 'New meeting' button", function() {
        cy.get('#create-council-block').click()
    });

    it("Click on the “With session” button", function() {
        cy.get('#create-council-with-session').click()
          
    });

    it("Populate all required fields and click on the “Next” button", function() {
        cy.get('#council-notice-type-select').click()
        cy.get('#council-notice-type-2').click()
        cy.get('#council-notice-title').clear()
            .type('Test')
       cy.get('#council-notice-convene-intro')
            .type('Test')
        cy.get('#council-editor-next').click()
        
    });

    it("Click on the 'Add participant+' button", function() {
        cy.get('#add-participant-dropdown-trigger').click()
        cy.get('#add-participant-button').click()
    })

    it("Populate all required fields and scroll down the page", function() {
        cy.get('#participant-name-input').clear()
            .type('alem'+Cypress.config('UniqueNumber'))               
        cy.get('#participant-surname-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')) 
                
        cy.get('#participant-email-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com')                
  

    })

    it("Navigate to the 'Type of participation' field and click on the 'Waiting room' button", function() {
        cy.get('#participant-participation-type-select').click()
        cy.get('#participant-participation-waiting-room').click()
    })


    
    it("Click 'OK' button", function() {
        cy.get('#alert-confirm-button-accept').click()
    })

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });


});


describe("The user is able to select 'Espanol' language in the 'Add participant+'' form in the 'New meeting' type in the 'Census' section", function() {

     before(function() {
        
    });

    it("Click on the 'New meeting' button", function() {
        cy.get('#create-council-block').click()
    });

    it("Click on the “With session” button", function() {
        cy.get('#create-council-with-session').click()
          
    });

    it("Populate all required fields and click on the “Next” button", function() {
        cy.get('#council-notice-type-select').click()
        cy.get('#council-notice-type-2').click()
        cy.get('#council-notice-title').clear()
            .type('Test')
       cy.get('#council-notice-convene-intro')
            .type('Test')
        cy.get('#council-editor-next').click()
        
    });

    it("Click on the 'Add participant+' button", function() {
        cy.get('#add-participant-dropdown-trigger').click()
        cy.get('#add-participant-button').click()
    })

    it("Populate all required fields and scroll down the page", function() {
        cy.get('#participant-name-input').clear()
            .type('alem'+Cypress.config('UniqueNumber'))               
        cy.get('#participant-surname-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')) 
                
        cy.get('#participant-email-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com')                
  

    })

    it("Navigate to the 'Type of participation' field and click on the 'Waiting room' button", function() {
        cy.get('#participant-participation-type-select').click()
        cy.get('#participant-participation-waiting-room').click()
    })


    
    it("Click 'OK' button", function() {
        cy.get('#alert-confirm-button-accept').click()
    })

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });


});

describe("The user is able to add guest in the 'Censues' step during the meeting creation", function() {

     before(function() {
        
    });

    it("Click on the 'New meeting' button", function() {
        cy.get('#create-council-block').click()
    });

    it("Click on the “With session” button", function() {
        cy.get('#create-council-with-session').click()
          
    });

    it("Populate all required fields and click on the “Next” button", function() {
        cy.get('#council-notice-type-select').click()
        cy.get('#council-notice-type-2').click()
        cy.get('#council-notice-title').clear()
            .type('Test')
       cy.get('#council-notice-convene-intro')
            .type('Test')
        cy.get('#council-editor-next').click()
        
    });

    it("Click on the 'Add guestt+' button", function() {
        cy.get('#add-participant-dropdown-trigger').click()
        cy.get('#add-guest-button').click()
    })

    it("Populate all required fields and scroll down the page", function() {
        cy.get('#participant-form-name').clear()
            .type('alem'+Cypress.config('UniqueNumber'))               
        cy.get('#participant-form-surname').clear()
            .type('alem'+Cypress.config('UniqueNumber')) 
                 
        cy.get('#participant-form-email').clear()
            .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com')                

    })
 
    it("Click on 'Send' button", function() {
        cy.get('#alert-confirm-button-accept').click()
    })


    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });
 });




describe("The user is able to edit guest in the 'Censuses' step during the meeting creation", function() {

     before(function() {
        
    });

    it("Click on the 'New meeting' button", function() {
        cy.get('#create-council-block').click()
    });

    it("Click on the “With session” button", function() {
        cy.get('#create-council-with-session').click()
          
    });

    it("Populate all required fields and click on the “Next” button", function() {
        cy.get('#council-notice-type-select').click()
        cy.get('#council-notice-type-2').click()
        cy.get('#council-notice-title').clear()
            .type('Test')
       cy.get('#council-notice-convene-intro')
            .type('Test')
        cy.get('#council-editor-next').click()
        
    });

    it("Click on the 'Add guestt+' button", function() {
        cy.get('#add-participant-dropdown-trigger').click()
        cy.get('#add-guest-button').click()
    })

    it("Populate all required fields and scroll down the page", function() {
        cy.get('#participant-form-name').clear()
            .type('alem'+Cypress.config('UniqueNumber'))               
        cy.get('#participant-form-surname').clear()
            .type('alem'+Cypress.config('UniqueNumber')) 
                 
        cy.get('#participant-form-email').clear()
            .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com')                

    })
 
    it("Click on 'Send' button", function() {
        cy.get('#alert-confirm-button-accept').click()
    })

    it("Navigate to the already added guest and click on it", function() {
        cy.get('#participant-row-0').click() 
    });

    it("Modify the fields you want and click on the 'Send' CTA",function() {
        cy.get('#participant-name-input').clear()
            .type('EditName'+Cypress.config('UniqueNumber'))
        cy.get('#alert-confirm-button-accept').click()
    })

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });


});




describe("The user is able to select checkbox in the 'Manage Participants' page (Census)", function() {

     before(function() {
        
    });

    it("Click on the 'New meeting' button", function() {
        cy.get('#create-council-block').click()
    });

    it("Click on the “With session” button", function() {
        cy.get('#create-council-with-session').click()
          
    });

    it("Populate all required fields and click on the “Next” button", function() {
        cy.get('#council-notice-type-select').click()
        cy.get('#council-notice-type-2').click()
        cy.get('#council-notice-title').clear()
            .type('Test')
       cy.get('#council-notice-convene-intro')
            .type('Test')
        cy.get('#council-editor-next').click()
        
    });

    it("Click on the 'Add participant+' button", function() {
        cy.get('#add-participant-dropdown-trigger').click()
        cy.get('#add-participant-button').click()
    })

    it("Populate all required fields and scroll down the page", function() {
        cy.get('#participant-name-input').clear()
            .type('alem'+Cypress.config('UniqueNumber'))               
        cy.get('#participant-surname-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')) 
                
        cy.get('#participant-email-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com')                
  

    })
 
    it("Click on 'Send' button", function() {
        cy.get('#alert-confirm-button-accept').click()
    })

    it("Navigate to the already added participant and click on the checkbox", function() {
        cy.get('#participant-row-0').trigger('mouseover')
        cy.get('#step-census-header-checkbox-0').click()
    })


    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });
 });






