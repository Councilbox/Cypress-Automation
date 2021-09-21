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

describe("The user is able to select 'English' language in the 'Add participant' form in the 'New meeting' type of meeting in the 'Census' section", function() {

    it("Click on the 'New meeting' button", function() {
        cy.wait(2000)
        cy.get('#create-council-block').click()
    });

    it("Click on the “With session” button", function() {
        cy.get('#create-council-with-session').click()
        cy.wait(3000)   
    });

    it("Populate all required fields and click on the “Next” button", function() {
        cy.get('#council-notice-type-select').click()
        cy.get('#council-notice-type-2').click()
        cy.get('#council-notice-title').clear()
            .type('Test')
       cy.get('#council-notice-convene-intro')
            .type('Test')
        cy.get('#council-editor-next').click()
        cy.wait(1000)
    });

    it("Click on the 'Add participant' button", function() {
        cy.get('#anadirParticipanteEnCensoNewReunion').click()
        cy.wait(1000)
    });

    it("Populate all required fields with valid inputs", function() {
        cy.get('#participant-name-input').clear()
            .type('alem'+Cypress.config('UniqueNumber'))               
        cy.get('#participant-surname-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')) 
        cy.get('#participant-dni-input').clear()
            .type('TestAutomation'+Cypress.config('UniqueNumber'))                  
        cy.get('#participant-phone-input').clear()
            .type('123123123')                
        cy.get('#participant-email-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com')                
        cy.get('#participant-administrative-email-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com') 
    });

    it("Navigate to the 'Language' field and click on the 'English' button", function() {
        cy.get('#participant-language-select').click()
        cy.wait(500)
        cy.get('#participant-language-en').click() 
        cy.wait(1000)     
    });

    it("Click on the 'OK' button", function() {
        cy.get('#alert-confirm-button-accept').click()
        cy.wait(1000)       
    });

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });

 });

describe("The user is able to select 'Espanol' language in the 'Add participant' form in the 'New meeting' type of meeting in the 'Census' section", function() {

    it("Click on the 'New meeting' button", function() {
        cy.wait(2000)
        cy.get('#create-council-block').click()
    });

    it("Click on the “With session” button", function() {
        cy.get('#create-council-with-session').click()
        cy.wait(3000)   
    });

    it("Populate all required fields and click on the “Next” button", function() {
        cy.get('#council-notice-type-select').click()
        cy.get('#council-notice-type-2').click()
        cy.get('#council-notice-title').clear()
            .type('Test')
       cy.get('#council-notice-convene-intro')
            .type('Test')
        cy.get('#council-editor-next').click()
        cy.wait(1000)
    });

    it("Click on the 'Add participant' button", function() {
        cy.get('#anadirParticipanteEnCensoNewReunion').click()
        cy.wait(1000)
    });

    it("Populate all required fields with valid inputs", function() {
        cy.get('#participant-name-input').clear()
            .type('alem'+Cypress.config('UniqueNumber'))               
        cy.get('#participant-surname-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')) 
        cy.get('#participant-dni-input').clear()
            .type('TestAutomation'+Cypress.config('UniqueNumber'))                  
        cy.get('#participant-phone-input').clear()
            .type('123123123')                
        cy.get('#participant-email-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com')                
        cy.get('#participant-administrative-email-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com') 
    });

    it("Navigate to the 'Language' field and click on the 'Espanol' button", function() {
        cy.get('#participant-language-select').click()
        cy.wait(500)
        cy.get('#participant-language-es').click() 
        cy.wait(1000)     
    });

    it("Click on the 'OK' button", function() {
        cy.get('#alert-confirm-button-accept').click()
        cy.wait(1000)       
    });

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });

 });

describe("The user is able to select 'Portugues' language in the 'Add participant' form in the 'New meeting' type of meeting in the 'Census' section", function() {

    it("Click on the 'New meeting' button", function() {
        cy.wait(2000)
        cy.get('#create-council-block').click()
    });

    it("Click on the “With session” button", function() {
        cy.get('#create-council-with-session').click()
        cy.wait(3000)   
    });

    it("Populate all required fields and click on the “Next” button", function() {
        cy.get('#council-notice-type-select').click()
        cy.get('#council-notice-type-2').click()
        cy.get('#council-notice-title').clear()
            .type('Test')
       cy.get('#council-notice-convene-intro')
            .type('Test')
        cy.get('#council-editor-next').click()
        cy.wait(1000)
    });

    it("Click on the 'Add participant' button", function() {
        cy.get('#anadirParticipanteEnCensoNewReunion').click()
        cy.wait(1000)
    });

    it("Populate all required fields with valid inputs", function() {
        cy.get('#participant-name-input').clear()
            .type('alem'+Cypress.config('UniqueNumber'))               
        cy.get('#participant-surname-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')) 
        cy.get('#participant-dni-input').clear()
            .type('TestAutomation'+Cypress.config('UniqueNumber'))                  
        cy.get('#participant-phone-input').clear()
            .type('123123123')                
        cy.get('#participant-email-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com')                
        cy.get('#participant-administrative-email-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com') 
    });

    it("Navigate to the 'Language' field and click on the 'Portugues' button", function() {
        cy.get('#participant-language-select').click()
        cy.wait(500)
        cy.get('#participant-language-pt').click() 
        cy.wait(1000)     
    });

    it("Click on the 'OK' button", function() {
        cy.get('#alert-confirm-button-accept').click()
        cy.wait(1000)       
    });

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });

 });

describe("The user is able to select 'Catala' language in the 'Add participant' form in the 'New meeting' type of meeting in the 'Census' section", function() {

    it("Click on the 'New meeting' button", function() {
        cy.wait(2000)
        cy.get('#create-council-block').click()
    });

    it("Click on the “With session” button", function() {
        cy.get('#create-council-with-session').click()
        cy.wait(3000)   
    });

    it("Populate all required fields and click on the “Next” button", function() {
        cy.get('#council-notice-type-select').click()
        cy.get('#council-notice-type-2').click()
        cy.get('#council-notice-title').clear()
            .type('Test')
       cy.get('#council-notice-convene-intro')
            .type('Test')
        cy.get('#council-editor-next').click()
        cy.wait(1000)
    });

    it("Click on the 'Add participant' button", function() {
        cy.get('#anadirParticipanteEnCensoNewReunion').click()
        cy.wait(1000)
    });

    it("Populate all required fields with valid inputs", function() {
        cy.get('#participant-name-input').clear()
            .type('alem'+Cypress.config('UniqueNumber'))               
        cy.get('#participant-surname-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')) 
        cy.get('#participant-dni-input').clear()
            .type('TestAutomation'+Cypress.config('UniqueNumber'))                  
        cy.get('#participant-phone-input').clear()
            .type('123123123')                
        cy.get('#participant-email-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com')                
        cy.get('#participant-administrative-email-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com') 
    });

    it("Navigate to the 'Language' field and click on the 'Catala' button", function() {
        cy.get('#participant-language-select').click()
        cy.wait(500)
        cy.get('#participant-language-cat').click() 
        cy.wait(1000)     
    });

    it("Click on the 'OK' button", function() {
        cy.get('#alert-confirm-button-accept').click()
        cy.wait(1000)       
    });

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });

 });

describe("The user is able to select 'Galego' language in the 'Add participant' form in the 'New meeting' type of meeting in the 'Census' section", function() {

    it("Click on the 'New meeting' button", function() {
        cy.wait(2000)
        cy.get('#create-council-block').click()
    });

    it("Click on the “With session” button", function() {
        cy.get('#create-council-with-session').click()
        cy.wait(3000)   
    });

    it("Populate all required fields and click on the “Next” button", function() {
        cy.get('#council-notice-type-select').click()
        cy.get('#council-notice-type-2').click()
        cy.get('#council-notice-title').clear()
            .type('Test')
       cy.get('#council-notice-convene-intro')
            .type('Test')
        cy.get('#council-editor-next').click()
        cy.wait(1000)
    });

    it("Click on the 'Add participant' button", function() {
        cy.get('#anadirParticipanteEnCensoNewReunion').click()
        cy.wait(1000)
    });

    it("Populate all required fields with valid inputs", function() {
        cy.get('#participant-name-input').clear()
            .type('alem'+Cypress.config('UniqueNumber'))               
        cy.get('#participant-surname-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')) 
        cy.get('#participant-dni-input').clear()
            .type('TestAutomation'+Cypress.config('UniqueNumber'))                  
        cy.get('#participant-phone-input').clear()
            .type('123123123')                
        cy.get('#participant-email-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com')                
        cy.get('#participant-administrative-email-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com') 
    });

    it("Navigate to the 'Language' field and click on the 'Galego' button", function() {
        cy.get('#participant-language-select').click()
        cy.wait(500)
        cy.get('#participant-language-gal').click() 
        cy.wait(1000)     
    });

    it("Click on the 'OK' button", function() {
        cy.get('#alert-confirm-button-accept').click()
        cy.wait(1000)       
    });

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });

 });

describe("The user is able to select 'Polsku' language in the 'Add participant' form in the 'New meeting' type of meeting in the 'Census' section", function() {

    it("Click on the 'New meeting' button", function() {
        cy.wait(2000)
        cy.get('#create-council-block').click()
    });

    it("Click on the “With session” button", function() {
        cy.get('#create-council-with-session').click()
        cy.wait(3000)   
    });

    it("Populate all required fields and click on the “Next” button", function() {
        cy.get('#council-notice-type-select').click()
        cy.get('#council-notice-type-2').click()
        cy.get('#council-notice-title').clear()
            .type('Test')
       cy.get('#council-notice-convene-intro')
            .type('Test')
        cy.get('#council-editor-next').click()
        cy.wait(1000)
    });

    it("Click on the 'Add participant' button", function() {
        cy.get('#anadirParticipanteEnCensoNewReunion').click()
        cy.wait(1000)
    });

    it("Populate all required fields with valid inputs", function() {
        cy.get('#participant-name-input').clear()
            .type('alem'+Cypress.config('UniqueNumber'))               
        cy.get('#participant-surname-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')) 
        cy.get('#participant-dni-input').clear()
            .type('TestAutomation'+Cypress.config('UniqueNumber'))                  
        cy.get('#participant-phone-input').clear()
            .type('123123123')                
        cy.get('#participant-email-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com')                
        cy.get('#participant-administrative-email-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com') 
    });

    it("Navigate to the 'Language' field and click on the 'Polsku' button", function() {
        cy.get('#participant-language-select').click()
        cy.wait(500)
        cy.get('#participant-language-pl').click() 
        cy.wait(1000)     
    });

    it("Click on the 'OK' button", function() {
        cy.get('#alert-confirm-button-accept').click()
        cy.wait(1000)       
    });

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });

 });

describe("The user is able to select 'Francis' language in the 'Add participant' form in the 'New meeting' type of meeting in the 'Census' section", function() {

    it("Click on the 'New meeting' button", function() {
        cy.wait(2000)
        cy.get('#create-council-block').click()
    });

    it("Click on the “With session” button", function() {
        cy.get('#create-council-with-session').click()
        cy.wait(3000)   
    });

    it("Populate all required fields and click on the “Next” button", function() {
        cy.get('#council-notice-type-select').click()
        cy.get('#council-notice-type-2').click()
        cy.get('#council-notice-title').clear()
            .type('Test')
       cy.get('#council-notice-convene-intro')
            .type('Test')
        cy.get('#council-editor-next').click()
        cy.wait(1000)
    });

    it("Click on the 'Add participant' button", function() {
        cy.get('#anadirParticipanteEnCensoNewReunion').click()
        cy.wait(1000)
    });

    it("Populate all required fields with valid inputs", function() {
        cy.get('#participant-name-input').clear()
            .type('alem'+Cypress.config('UniqueNumber'))               
        cy.get('#participant-surname-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')) 
        cy.get('#participant-dni-input').clear()
            .type('TestAutomation'+Cypress.config('UniqueNumber'))                  
        cy.get('#participant-phone-input').clear()
            .type('123123123')                
        cy.get('#participant-email-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com')                
        cy.get('#participant-administrative-email-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com') 
    });

    it("Navigate to the 'Language' field and click on the 'Francis' button", function() {
        cy.get('#participant-language-select').click()
        cy.wait(500)
        cy.get('#participant-language-fr').click() 
        cy.wait(1000)     
    });

    it("Click on the 'OK' button", function() {
        cy.get('#alert-confirm-button-accept').click()
        cy.wait(1000)       
    });

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });

 });

describe("The user is able to select 'Euskera' language in the 'Add participant' form in the 'New meeting' type of meeting in the 'Census' section", function() {

    it("Click on the 'New meeting' button", function() {
        cy.wait(2000)
        cy.get('#create-council-block').click()
    });

    it("Click on the “With session” button", function() {
        cy.get('#create-council-with-session').click()
        cy.wait(3000)   
    });

    it("Populate all required fields and click on the “Next” button", function() {
        cy.get('#council-notice-type-select').click()
        cy.get('#council-notice-type-2').click()
        cy.get('#council-notice-title').clear()
            .type('Test')
       cy.get('#council-notice-convene-intro')
            .type('Test')
        cy.get('#council-editor-next').click()
        cy.wait(1000)
    });

    it("Click on the 'Add participant' button", function() {
        cy.get('#anadirParticipanteEnCensoNewReunion').click()
        cy.wait(1000)
    });

    it("Populate all required fields with valid inputs", function() {
        cy.get('#participant-name-input').clear()
            .type('alem'+Cypress.config('UniqueNumber'))               
        cy.get('#participant-surname-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')) 
        cy.get('#participant-dni-input').clear()
            .type('TestAutomation'+Cypress.config('UniqueNumber'))                  
        cy.get('#participant-phone-input').clear()
            .type('123123123')                
        cy.get('#participant-email-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com')                
        cy.get('#participant-administrative-email-input').clear()
            .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com') 
    });

    it("Navigate to the 'Language' field and click on the 'Euskera' button", function() {
        cy.get('#participant-language-select').click()
        cy.wait(500)
        cy.get('#participant-language-eu').click() 
        cy.wait(1000)     
    });

    it("Click on the 'OK' button", function() {
        cy.get('#alert-confirm-button-accept').click()
        cy.wait(1000)       
    });

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });

 });