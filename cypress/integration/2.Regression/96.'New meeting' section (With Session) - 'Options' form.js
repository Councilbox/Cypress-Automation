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

describe("The user is able to select 'Recording of entire meeting' checkbox in the 'Options' section in the 'New meeting with session' type of meeting", function() {

     before(function() {
        
    });


    it("Click on the 'New meeting' button", function() {
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

    it("Click on the 'Add participant' button and populate all required fields then click on the “Next” button", function() {
        cy.get('#add-participant-dropdown-trigger').click()
        cy.wait(1000)
        cy.get('#add-participant-button').click()
        cy.wait(1000)
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
        cy.get('#alert-confirm-button-accept').click()
          cy.wait(1000)
          cy.wait(3000)
        cy.get('#censoSiguienteNew').click()
    });

    it("Click on the “Add item to the agenda+” button", function() {
        cy.get('#newPuntoDelDiaOrdenDelDiaNew').click()        
    });

    it("Click on the 'Item Yes/No Agenda' CTA", function() {
        cy.get('#puntoSiNoAbstencion').click()        
    });

    it("Populate all required fields and navigate to the 'ype' field and select the 'Informative' type then click on the 'OK' CTA", function() {
        cy.get('#agenda-editor-title-input').type('Informative Agenda')
        cy.get('#agenda-editor-type-select').click()
        cy.get('#agenda-editor-type-0').click()
        cy.get('#alert-confirm-button-accept').click()
    })

    it("'Informative' type of item is successfully added", function () {
        cy.contains('Informative Agenda').should('be.visible')
    })

    it("Click on the 'Next' CTA", function () {
        cy.get('#ordenDelDiaNext').click()
        cy.wait(1000)
        cy.get('#attachmentSiguienteNew').click()
    })

    it("Click on the 'Record of entire meeting' checkbox and click on the 'Save' CTA", function () {
        cy.get('#council-options-full-recording').check().should('be.checked')
        cy.get('#MISSING_ID').click()
    })

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });


});



describe("The user is able to select 'Password sent by email' checkbox in the 'Options' section in the 'New meeting with session' type of meeting", function() {

     before(function() {
        
    });


    it("Click on the 'New meeting' button", function() {
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

    it("Click on the 'Add participant' button and populate all required fields then click on the “Next” button", function() {
        cy.get('#add-participant-dropdown-trigger').click()
        cy.wait(1000)
        cy.get('#add-participant-button').click()
        cy.wait(1000)
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
        cy.get('#alert-confirm-button-accept').click()
          cy.wait(1000)
          cy.wait(3000)
        cy.get('#censoSiguienteNew').click()
    });

    it("Click on the “Add item to the agenda+” button", function() {
        cy.get('#newPuntoDelDiaOrdenDelDiaNew').click()        
    });

    it("Click on the 'Item Yes/No Agenda' CTA", function() {
        cy.get('#puntoSiNoAbstencion').click()        
    });

    it("Populate all required fields and navigate to the 'ype' field and select the 'Informative' type then click on the 'OK' CTA", function() {
        cy.get('#agenda-editor-title-input').type('Informative Agenda')
        cy.get('#agenda-editor-type-select').click()
        cy.get('#agenda-editor-type-0').click()
        cy.get('#alert-confirm-button-accept').click()
    })

    it("'Informative' type of item is successfully added", function () {
        cy.contains('Informative Agenda').should('be.visible')
    })

    it("Click on the 'Next' CTA", function () {
        cy.get('#ordenDelDiaNext').click()
        cy.wait(1000)
        cy.get('#attachmentSiguienteNew').click()
    })

    it("Click on the 'Password sent by email' checkbox and click on the 'Save' CTA", function () {
        cy.get('#council-options-security-email').click()
        cy.get('#MISSING_ID').click()
    })

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });


});




describe("The user is able to select 'Password not required' checkbox in the 'Options' section in the 'New meeting with session' type of meeting", function() {

     before(function() {
        
    });


    it("Click on the 'New meeting' button", function() {
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

    it("Click on the 'Add participant' button and populate all required fields then click on the “Next” button", function() {
        cy.get('#add-participant-dropdown-trigger').click()
        cy.wait(1000)
        cy.get('#add-participant-button').click()
        cy.wait(1000)
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
        cy.get('#alert-confirm-button-accept').click()
          cy.wait(1000)
          cy.wait(3000)
        cy.get('#censoSiguienteNew').click()
    });

    it("Click on the “Add item to the agenda+” button", function() {
        cy.get('#newPuntoDelDiaOrdenDelDiaNew').click()        
    });

    it("Click on the 'Item Yes/No Agenda' CTA", function() {
        cy.get('#puntoSiNoAbstencion').click()        
    });

    it("Populate all required fields and navigate to the 'ype' field and select the 'Informative' type then click on the 'OK' CTA", function() {
        cy.get('#agenda-editor-title-input').type('Informative Agenda')
        cy.get('#agenda-editor-type-select').click()
        cy.get('#agenda-editor-type-0').click()
        cy.get('#alert-confirm-button-accept').click()
    })

    it("'Informative' type of item is successfully added", function () {
        cy.contains('Informative Agenda').should('be.visible')
    })

    it("Click on the 'Next' CTA", function () {
        cy.get('#ordenDelDiaNext').click()
        cy.wait(1000)
        cy.get('#attachmentSiguienteNew').click()
    })

    it("Click on the 'Password not required' checkbox and click on the 'Save' CTA", function () {
        cy.get('#council-options-security-none').click()
        cy.get('#MISSING_ID').click()
    })

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });


});


describe("The user is able to select 'Password sent by SMS' checkbox in the 'Options' section in the 'New meeting with session' type of meeting", function() {

     before(function() {
        
    });


    it("Click on the 'New meeting' button", function() {
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

    it("Click on the 'Add participant' button and populate all required fields then click on the “Next” button", function() {
        cy.get('#add-participant-dropdown-trigger').click()
        cy.wait(1000)
        cy.get('#add-participant-button').click()
        cy.wait(1000)
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
        cy.get('#alert-confirm-button-accept').click()
          cy.wait(1000)
          cy.wait(3000)
        cy.get('#censoSiguienteNew').click()
    });

    it("Click on the “Add item to the agenda+” button", function() {
        cy.get('#newPuntoDelDiaOrdenDelDiaNew').click()        
    });

    it("Click on the 'Item Yes/No Agenda' CTA", function() {
        cy.get('#puntoSiNoAbstencion').click()        
    });

    it("Populate all required fields and navigate to the 'ype' field and select the 'Informative' type then click on the 'OK' CTA", function() {
        cy.get('#agenda-editor-title-input').type('Informative Agenda')
        cy.get('#agenda-editor-type-select').click()
        cy.get('#agenda-editor-type-0').click()
        cy.get('#alert-confirm-button-accept').click()
    })

    it("'Informative' type of item is successfully added", function () {
        cy.contains('Informative Agenda').should('be.visible')
    })

    it("Click on the 'Next' CTA", function () {
        cy.get('#ordenDelDiaNext').click()
        cy.wait(1000)
        cy.get('#attachmentSiguienteNew').click()
    })

    it("Click on the 'Password sent by SMS' checkbox and click on the 'Save' CTA", function () {
        cy.get('#council-options-security-sms').click()
        cy.get('#MISSING_ID').click()
    })

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });


});


/*

describe("The user is able to select 'Digital certificate (FNMT or DNIe)'' checkbox in the 'Options' section in the 'New meeting with session' type of meeting", function() {

     before(function() {
        
    });


    it("Click on the 'New meeting' button", function() {
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

    it("Click on the 'Add participant' button and populate all required fields then click on the “Next” button", function() {
        cy.get('#add-participant-dropdown-trigger').click()
        cy.wait(1000)
        cy.get('#add-participant-button').click()
        cy.wait(1000)
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
        cy.get('#alert-confirm-button-accept').click()
          cy.wait(1000)
          cy.wait(3000)
        cy.get('#censoSiguienteNew').click()
    });

    it("Click on the “Add item to the agenda+” button", function() {
        cy.get('#newPuntoDelDiaOrdenDelDiaNew').click()        
    });

    it("Click on the 'Item Yes/No Agenda' CTA", function() {
        cy.get('#puntoSiNoAbstencion').click()        
    });

    it("Populate all required fields and navigate to the 'ype' field and select the 'Informative' type then click on the 'OK' CTA", function() {
        cy.get('#agenda-editor-title-input').type('Informative Agenda')
        cy.get('#agenda-editor-type-select').click()
        cy.get('#agenda-editor-type-0').click()
        cy.get('#alert-confirm-button-accept').click()
    })

    it("'Informative' type of item is successfully added", function () {
        cy.contains('Informative Agenda').should('be.visible')
    })

    it("Click on the 'Next' CTA", function () {
        cy.get('#ordenDelDiaNext').click()
        cy.wait(1000)
        cy.get('#attachmentSiguienteNew').click()
    })

    it("Click on the 'Digital certificate (FNMT or DNIe)'' checkbox and click on the 'Save' CTA", function () {
        cy.get('#council-options-security-sms').click()
        cy.get('#MISSING_ID').click()
    })

});


*/




describe("The user is able to select 'If you want participants to receive a notice to confirm their intention to attend' checkbox in the 'Options' section in the 'New meeting with session' type of meeting", function() {

     before(function() {
        
    });


    it("Click on the 'New meeting' button", function() {
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

    it("Click on the 'Add participant' button and populate all required fields then click on the “Next” button", function() {
        cy.get('#add-participant-dropdown-trigger').click()
        cy.wait(1000)
        cy.get('#add-participant-button').click()
        cy.wait(1000)
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
        cy.get('#alert-confirm-button-accept').click()
          cy.wait(1000)
          cy.wait(3000)
        cy.get('#censoSiguienteNew').click()
    });

    it("Click on the “Add item to the agenda+” button", function() {
        cy.get('#newPuntoDelDiaOrdenDelDiaNew').click()        
    });

    it("Click on the 'Item Yes/No Agenda' CTA", function() {
        cy.get('#puntoSiNoAbstencion').click()        
    });

    it("Populate all required fields and navigate to the 'ype' field and select the 'Informative' type then click on the 'OK' CTA", function() {
        cy.get('#agenda-editor-title-input').type('Informative Agenda')
        cy.get('#agenda-editor-type-select').click()
        cy.get('#agenda-editor-type-0').click()
        cy.get('#alert-confirm-button-accept').click()
    })

    it("'Informative' type of item is successfully added", function () {
        cy.contains('Informative Agenda').should('be.visible')
    })

    it("Click on the 'Next' CTA", function () {
        cy.get('#ordenDelDiaNext').click()
        cy.wait(1000)
        cy.get('#attachmentSiguienteNew').click()
    })

    it("Click on the 'If you want participants to receive a notice to confirm their intention to attend' checkbox and click on the 'Save' CTA", function () {
        cy.get('#council-options-confirm-attendance').check().should('be.checked')
        cy.get('#MISSING_ID').click()
    })

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });


});





describe("The user is able to select 'There is room with video broadcast' checkbox in the 'Options' section in the 'New meeting with session' type of meeting", function() {

     before(function() {
        
    });


    it("Click on the 'New meeting' button", function() {
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

    it("Click on the 'Add participant' button and populate all required fields then click on the “Next” button", function() {
        cy.get('#add-participant-dropdown-trigger').click()
        cy.wait(1000)
        cy.get('#add-participant-button').click()
        cy.wait(1000)
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
        cy.get('#alert-confirm-button-accept').click()
          cy.wait(1000)
          cy.wait(3000)
        cy.get('#censoSiguienteNew').click()
    });

    it("Click on the “Add item to the agenda+” button", function() {
        cy.get('#newPuntoDelDiaOrdenDelDiaNew').click()        
    });

    it("Click on the 'Item Yes/No Agenda' CTA", function() {
        cy.get('#puntoSiNoAbstencion').click()        
    });

    it("Populate all required fields and navigate to the 'ype' field and select the 'Informative' type then click on the 'OK' CTA", function() {
        cy.get('#agenda-editor-title-input').type('Informative Agenda')
        cy.get('#agenda-editor-type-select').click()
        cy.get('#agenda-editor-type-0').click()
        cy.get('#alert-confirm-button-accept').click()
    })

    it("'Informative' type of item is successfully added", function () {
        cy.contains('Informative Agenda').should('be.visible')
    })

    it("Click on the 'Next' CTA", function () {
        cy.get('#ordenDelDiaNext').click()
        cy.wait(1000)
        cy.get('#attachmentSiguienteNew').click()
    })

    it("Click on the 'There is room with video broadcast' checkbox and click on the 'Save' CTA", function () {
        cy.get('#council-options-enable-video').should('be.checked')
        cy.get('#council-options-enable-video').click()
        cy.get('#council-options-enable-video').check().should('be.checked')
        cy.get('#MISSING_ID').click()
    })

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });


});




describe("The user is able to select 'Test meeting' checkbox in the 'Options' section in the 'New meeting with session' type of meeting", function() {

     before(function() {
        
    });


    it("Click on the 'New meeting' button", function() {
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

    it("Click on the 'Add participant' button and populate all required fields then click on the “Next” button", function() {
        cy.get('#add-participant-dropdown-trigger').click()
        cy.wait(1000)
        cy.get('#add-participant-button').click()
        cy.wait(1000)
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
        cy.get('#alert-confirm-button-accept').click()
          cy.wait(1000)
          cy.wait(3000)
        cy.get('#censoSiguienteNew').click()
    });

    it("Click on the “Add item to the agenda+” button", function() {
        cy.get('#newPuntoDelDiaOrdenDelDiaNew').click()        
    });

    it("Click on the 'Item Yes/No Agenda' CTA", function() {
        cy.get('#puntoSiNoAbstencion').click()        
    });

    it("Populate all required fields and navigate to the 'ype' field and select the 'Informative' type then click on the 'OK' CTA", function() {
        cy.get('#agenda-editor-title-input').type('Informative Agenda')
        cy.get('#agenda-editor-type-select').click()
        cy.get('#agenda-editor-type-0').click()
        cy.get('#alert-confirm-button-accept').click()
    })

    it("'Informative' type of item is successfully added", function () {
        cy.contains('Informative Agenda').should('be.visible')
    })

    it("Click on the 'Next' CTA", function () {
        cy.get('#ordenDelDiaNext').click()
        cy.wait(1000)
        cy.get('#attachmentSiguienteNew').click()
    })

    it("Click on the 'Test meeting' checkbox and click on the 'Save' CTA", function () {
        cy.get('#council-options-test-meeting').scrollIntoView().check().should('be.checked')
        cy.get('#MISSING_ID').click()
    })

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });


});





describe("The user is able to select 'Comments wall' checkbox in the 'Options' section in the 'New meeting with session' type of meeting", function() {

     before(function() {
        
    });


    it("Click on the 'New meeting' button", function() {
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

    it("Click on the 'Add participant' button and populate all required fields then click on the “Next” button", function() {
        cy.get('#add-participant-dropdown-trigger').click()
        cy.wait(1000)
        cy.get('#add-participant-button').click()
        cy.wait(1000)
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
        cy.get('#alert-confirm-button-accept').click()
          cy.wait(1000)
          cy.wait(3000)
        cy.get('#censoSiguienteNew').click()
    });

    it("Click on the “Add item to the agenda+” button", function() {
        cy.get('#newPuntoDelDiaOrdenDelDiaNew').click()        
    });

    it("Click on the 'Item Yes/No Agenda' CTA", function() {
        cy.get('#puntoSiNoAbstencion').click()        
    });

    it("Populate all required fields and navigate to the 'ype' field and select the 'Informative' type then click on the 'OK' CTA", function() {
        cy.get('#agenda-editor-title-input').type('Informative Agenda')
        cy.get('#agenda-editor-type-select').click()
        cy.get('#agenda-editor-type-0').click()
        cy.get('#alert-confirm-button-accept').click()
    })

    it("'Informative' type of item is successfully added", function () {
        cy.contains('Informative Agenda').should('be.visible')
    })

    it("Click on the 'Next' CTA", function () {
        cy.get('#ordenDelDiaNext').click()
        cy.wait(1000)
        cy.get('#attachmentSiguienteNew').click()
    })

    it("Click on the 'Comments wall' checkbox and click on the 'Save' CTA", function () {
        cy.get('#council-options-comments-wall').should('be.checked')
        cy.get('#council-options-comments-wall').click()
        cy.get('#council-options-comments-wall').check().should('be.checked')
        cy.get('#MISSING_ID').click()
    })

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });


});




describe("The user is able to select 'Can request the floor' checkbox in the 'Options' section in the 'New meeting with session' type of meeting", function() {

     before(function() {
        
    });


    it("Click on the 'New meeting' button", function() {
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

    it("Click on the 'Add participant' button and populate all required fields then click on the “Next” button", function() {
        cy.get('#add-participant-dropdown-trigger').click()
        cy.wait(1000)
        cy.get('#add-participant-button').click()
        cy.wait(1000)
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
        cy.get('#alert-confirm-button-accept').click()
          cy.wait(1000)
          cy.wait(3000)
        cy.get('#censoSiguienteNew').click()
    });

    it("Click on the “Add item to the agenda+” button", function() {
        cy.get('#newPuntoDelDiaOrdenDelDiaNew').click()        
    });

    it("Click on the 'Item Yes/No Agenda' CTA", function() {
        cy.get('#puntoSiNoAbstencion').click()        
    });

    it("Populate all required fields and navigate to the 'ype' field and select the 'Informative' type then click on the 'OK' CTA", function() {
        cy.get('#agenda-editor-title-input').type('Informative Agenda')
        cy.get('#agenda-editor-type-select').click()
        cy.get('#agenda-editor-type-0').click()
        cy.get('#alert-confirm-button-accept').click()
    })

    it("'Informative' type of item is successfully added", function () {
        cy.contains('Informative Agenda').should('be.visible')
    })

    it("Click on the 'Next' CTA", function () {
        cy.get('#ordenDelDiaNext').click()
        cy.wait(1000)
        cy.get('#attachmentSiguienteNew').click()
    })

    it("Click on the 'Can request the floor' checkbox and click on the 'Save' CTA", function () {
        cy.get('#council-options-ask-word-menu').should('be.checked')
        cy.get('#council-options-ask-word-menu').click()
        cy.get('#council-options-ask-word-menu').check().should('be.checked')
        cy.get('#MISSING_ID').click()
    })

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });


});




describe("The user is able to select 'Simple majority' option in the 'The reading and approval of the draft minutes will be added as the last item on the agenda' form in the 'Options' section in the 'New meeting with session' type of meeting", function() {

     before(function() {
        
    });


    it("Click on the 'New meeting' button", function() {
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

    it("Click on the 'Add participant' button and populate all required fields then click on the “Next” button", function() {
        cy.get('#add-participant-dropdown-trigger').click()
        cy.wait(1000)
        cy.get('#add-participant-button').click()
        cy.wait(1000)
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
        cy.get('#alert-confirm-button-accept').click()
          cy.wait(1000)
          cy.wait(3000)
        cy.get('#censoSiguienteNew').click()
    });

    it("Click on the “Add item to the agenda+” button", function() {
        cy.get('#newPuntoDelDiaOrdenDelDiaNew').click()        
    });

    it("Click on the 'Item Yes/No Agenda' CTA", function() {
        cy.get('#puntoSiNoAbstencion').click()        
    });

    it("Populate all required fields and navigate to the 'ype' field and select the 'Informative' type then click on the 'OK' CTA", function() {
        cy.get('#agenda-editor-title-input').type('Informative Agenda')
        cy.get('#agenda-editor-type-select').click()
        cy.get('#agenda-editor-type-0').click()
        cy.get('#alert-confirm-button-accept').click()
    })

    it("'Informative' type of item is successfully added", function () {
        cy.contains('Informative Agenda').should('be.visible')
    })

    it("Click on the 'Next' CTA", function () {
        cy.get('#ordenDelDiaNext').click()
        cy.wait(1000)
        cy.get('#attachmentSiguienteNew').click()
    })

    it("Scroll down the page and choose and select 'The reading and approval of the draft minutes will be added as the last item on the agenda' checkbox", function () {
        cy.get('#council-options-add-act-point').scrollIntoView()
        .check().should('be.checked')
    })

    it("Navigate to the dropdown and click on the 'Simple majority' option", function () {
        cy.get('#council-options-act-point-majority-type').click()
        cy.get('#council-options-act-majority-1').click()
    });

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });


});





describe("The user is able to select 'Absolute majority' option in the 'The reading and approval of the draft minutes will be added as the last item on the agenda' form in the 'Options' section in the 'New meeting with session' type of meeting", function() {

     before(function() {
        
    });


    it("Click on the 'New meeting' button", function() {
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

    it("Click on the 'Add participant' button and populate all required fields then click on the “Next” button", function() {
        cy.get('#add-participant-dropdown-trigger').click()
        cy.wait(1000)
        cy.get('#add-participant-button').click()
        cy.wait(1000)
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
        cy.get('#alert-confirm-button-accept').click()
          cy.wait(1000)
          cy.wait(3000)
        cy.get('#censoSiguienteNew').click()
    });

    it("Click on the “Add item to the agenda+” button", function() {
        cy.get('#newPuntoDelDiaOrdenDelDiaNew').click()        
    });

    it("Click on the 'Item Yes/No Agenda' CTA", function() {
        cy.get('#puntoSiNoAbstencion').click()        
    });

    it("Populate all required fields and navigate to the 'ype' field and select the 'Informative' type then click on the 'OK' CTA", function() {
        cy.get('#agenda-editor-title-input').type('Informative Agenda')
        cy.get('#agenda-editor-type-select').click()
        cy.get('#agenda-editor-type-0').click()
        cy.get('#alert-confirm-button-accept').click()
    })

    it("'Informative' type of item is successfully added", function () {
        cy.contains('Informative Agenda').should('be.visible')
    })

    it("Click on the 'Next' CTA", function () {
        cy.get('#ordenDelDiaNext').click()
        cy.wait(1000)
        cy.get('#attachmentSiguienteNew').click()
    })

    it("Scroll down the page and choose and select 'The reading and approval of the draft minutes will be added as the last item on the agenda' checkbox", function () {
        cy.get('#council-options-add-act-point').scrollIntoView()
        .check().should('be.checked')
    })

    it("Navigate to the dropdown and click on the 'Absolute majority' option", function () {
        cy.get('#council-options-act-point-majority-type').click()
        cy.get('#council-options-act-majority-2').click()
    });

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });


});



describe("The user is able to select 'Two-thirds majority' option in the 'The reading and approval of the draft minutes will be added as the last item on the agenda' form in the 'Options' section in the 'New meeting with session' type of meeting", function() {

     before(function() {
        
    });


    it("Click on the 'New meeting' button", function() {
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

    it("Click on the 'Add participant' button and populate all required fields then click on the “Next” button", function() {
        cy.get('#add-participant-dropdown-trigger').click()
        cy.wait(1000)
        cy.get('#add-participant-button').click()
        cy.wait(1000)
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
        cy.get('#alert-confirm-button-accept').click()
          cy.wait(1000)
          cy.wait(3000)
        cy.get('#censoSiguienteNew').click()
    });

    it("Click on the “Add item to the agenda+” button", function() {
        cy.get('#newPuntoDelDiaOrdenDelDiaNew').click()        
    });

    it("Click on the 'Item Yes/No Agenda' CTA", function() {
        cy.get('#puntoSiNoAbstencion').click()        
    });

    it("Populate all required fields and navigate to the 'ype' field and select the 'Informative' type then click on the 'OK' CTA", function() {
        cy.get('#agenda-editor-title-input').type('Informative Agenda')
        cy.get('#agenda-editor-type-select').click()
        cy.get('#agenda-editor-type-0').click()
        cy.get('#alert-confirm-button-accept').click()
    })

    it("'Informative' type of item is successfully added", function () {
        cy.contains('Informative Agenda').should('be.visible')
    })

    it("Click on the 'Next' CTA", function () {
        cy.get('#ordenDelDiaNext').click()
        cy.wait(1000)
        cy.get('#attachmentSiguienteNew').click()
    })

    it("Scroll down the page and choose and select 'The reading and approval of the draft minutes will be added as the last item on the agenda' checkbox", function () {
        cy.get('#council-options-add-act-point').scrollIntoView()
        .check().should('be.checked')
    })

    it("Navigate to the dropdown and click on the 'Two-thirds majority' option", function () {
        cy.get('#council-options-act-point-majority-type').click()
        cy.get('#council-options-act-majority-4').click()
    });

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });


});




describe("The user is able to select 'Percentage' option in the 'The reading and approval of the draft minutes will be added as the last item on the agenda' form in the 'Options' section in the 'New meeting with session' type of meeting", function() {

     before(function() {
        
    });


    it("Click on the 'New meeting' button", function() {
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

    it("Click on the 'Add participant' button and populate all required fields then click on the “Next” button", function() {
        cy.get('#add-participant-dropdown-trigger').click()
        cy.wait(1000)
        cy.get('#add-participant-button').click()
        cy.wait(1000)
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
        cy.get('#alert-confirm-button-accept').click()
          cy.wait(1000)
          cy.wait(3000)
        cy.get('#censoSiguienteNew').click()
    });

    it("Click on the “Add item to the agenda+” button", function() {
        cy.get('#newPuntoDelDiaOrdenDelDiaNew').click()        
    });

    it("Click on the 'Item Yes/No Agenda' CTA", function() {
        cy.get('#puntoSiNoAbstencion').click()        
    });

    it("Populate all required fields and navigate to the 'ype' field and select the 'Informative' type then click on the 'OK' CTA", function() {
        cy.get('#agenda-editor-title-input').type('Informative Agenda')
        cy.get('#agenda-editor-type-select').click()
        cy.get('#agenda-editor-type-0').click()
        cy.get('#alert-confirm-button-accept').click()
    })

    it("'Informative' type of item is successfully added", function () {
        cy.contains('Informative Agenda').should('be.visible')
    })

    it("Click on the 'Next' CTA", function () {
        cy.get('#ordenDelDiaNext').click()
        cy.wait(1000)
        cy.get('#attachmentSiguienteNew').click()
    })

    it("Scroll down the page and choose and select 'The reading and approval of the draft minutes will be added as the last item on the agenda' checkbox", function () {
        cy.get('#council-options-add-act-point').scrollIntoView()
        .check().should('be.checked')
    })

    it("Navigate to the dropdown and click on the 'Percentage' option", function () {
        cy.get('#council-options-act-point-majority-type').click()
        cy.get('#council-options-act-majority-0').click()
    });

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });


});





describe("The user is able to select 'Number' option in the 'The reading and approval of the draft minutes will be added as the last item on the agenda' form in the 'Options' section in the 'New meeting with session' type of meeting", function() {

     before(function() {
        
    });


    it("Click on the 'New meeting' button", function() {
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

    it("Click on the 'Add participant' button and populate all required fields then click on the “Next” button", function() {
        cy.get('#add-participant-dropdown-trigger').click()
        cy.wait(1000)
        cy.get('#add-participant-button').click()
        cy.wait(1000)
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
        cy.get('#alert-confirm-button-accept').click()
          cy.wait(1000)
          cy.wait(3000)
        cy.get('#censoSiguienteNew').click()
    });

    it("Click on the “Add item to the agenda+” button", function() {
        cy.get('#newPuntoDelDiaOrdenDelDiaNew').click()        
    });

    it("Click on the 'Item Yes/No Agenda' CTA", function() {
        cy.get('#puntoSiNoAbstencion').click()        
    });

    it("Populate all required fields and navigate to the 'ype' field and select the 'Informative' type then click on the 'OK' CTA", function() {
        cy.get('#agenda-editor-title-input').type('Informative Agenda')
        cy.get('#agenda-editor-type-select').click()
        cy.get('#agenda-editor-type-0').click()
        cy.get('#alert-confirm-button-accept').click()
    })

    it("'Informative' type of item is successfully added", function () {
        cy.contains('Informative Agenda').should('be.visible')
    })

    it("Click on the 'Next' CTA", function () {
        cy.get('#ordenDelDiaNext').click()
        cy.wait(1000)
        cy.get('#attachmentSiguienteNew').click()
    })

    it("Scroll down the page and choose and select 'The reading and approval of the draft minutes will be added as the last item on the agenda' checkbox", function () {
        cy.get('#council-options-add-act-point').scrollIntoView()
        .check().should('be.checked')
    })

    it("Navigate to the dropdown and click on the 'Number' option", function () {
        cy.get('#council-options-act-point-majority-type').click()
        cy.get('#council-options-act-majority-6').click()
    });

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });


});




describe("The user is able to select 'Fraction' option in the 'The reading and approval of the draft minutes will be added as the last item on the agenda' form in the 'Options' section in the 'New meeting with session' type of meeting", function() {

     before(function() {
        
    });


    it("Click on the 'New meeting' button", function() {
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

    it("Click on the 'Add participant' button and populate all required fields then click on the “Next” button", function() {
        cy.get('#add-participant-dropdown-trigger').click()
        cy.wait(1000)
        cy.get('#add-participant-button').click()
        cy.wait(1000)
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
        cy.get('#alert-confirm-button-accept').click()
          cy.wait(1000)
          cy.wait(3000)
        cy.get('#censoSiguienteNew').click()
    });

    it("Click on the “Add item to the agenda+” button", function() {
        cy.get('#newPuntoDelDiaOrdenDelDiaNew').click()        
    });

    it("Click on the 'Item Yes/No Agenda' CTA", function() {
        cy.get('#puntoSiNoAbstencion').click()        
    });

    it("Populate all required fields and navigate to the 'ype' field and select the 'Informative' type then click on the 'OK' CTA", function() {
        cy.get('#agenda-editor-title-input').type('Informative Agenda')
        cy.get('#agenda-editor-type-select').click()
        cy.get('#agenda-editor-type-0').click()
        cy.get('#alert-confirm-button-accept').click()
    })

    it("'Informative' type of item is successfully added", function () {
        cy.contains('Informative Agenda').should('be.visible')
    })

    it("Click on the 'Next' CTA", function () {
        cy.get('#ordenDelDiaNext').click()
        cy.wait(1000)
        cy.get('#attachmentSiguienteNew').click()
    })

    it("Scroll down the page and choose and select 'The reading and approval of the draft minutes will be added as the last item on the agenda' checkbox", function () {
        cy.get('#council-options-add-act-point').scrollIntoView()
        .check().should('be.checked')
    })

    it("Navigate to the dropdown and click on the 'Fraction' option", function () {
        cy.get('#council-options-act-point-majority-type').click()
        cy.get('#council-options-act-majority-5').click()
    });

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });


});




describe("The user is able to select who will receive delegated vote in the 'Can receive delegations' section in the 'New meeting with session' type of meeting", function() {

     before(function() {
        
    });


    it("Click on the 'New meeting' button", function() {
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

    it("Click on the 'Add participant' button and populate all required fields then click on the “Next” button", function() {
        cy.get('#add-participant-dropdown-trigger').click()
        cy.wait(1000)
        cy.get('#add-participant-button').click()
        cy.wait(1000)
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
        cy.get('#alert-confirm-button-accept').click()
          cy.wait(1000)
          cy.wait(3000)
        cy.get('#censoSiguienteNew').click()
    });

    it("Click on the “Add item to the agenda+” button", function() {
        cy.get('#newPuntoDelDiaOrdenDelDiaNew').click()        
    });

    it("Click on the 'Item Yes/No Agenda' CTA", function() {
        cy.get('#puntoSiNoAbstencion').click()        
    });

    it("Populate all required fields and navigate to the 'ype' field and select the 'Informative' type then click on the 'OK' CTA", function() {
        cy.get('#agenda-editor-title-input').type('Informative Agenda')
        cy.get('#agenda-editor-type-select').click()
        cy.get('#agenda-editor-type-0').click()
        cy.get('#alert-confirm-button-accept').click()
    })

    it("'Informative' type of item is successfully added", function () {
        cy.contains('Informative Agenda').should('be.visible')
    })

    it("Click on the 'Next' CTA", function () {
        cy.get('#ordenDelDiaNext').click()
        cy.wait(1000)
        cy.get('#attachmentSiguienteNew').click()
    })

    it("Scroll down the page and navigate to the 'Can receive delegations' section", function () {
        cy.get('#MISSING_ID').scrollIntoView()
       
    })

    it("Click on the 'Select' button and choose the participant you want", function () {
        cy.get('#MISSING_ID').click()
        cy.get('#MISSING_ID').click()
        cy.get('#alert-confirm-close').click()
    });

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });


});


describe("The user is able to remove who will receive delegated vote in the 'Can receive delegations' section in the 'New meeting with session' type of meeting", function() {

     before(function() {
        
    });


    it("Click on the 'New meeting' button", function() {
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

    it("Click on the 'Add participant' button and populate all required fields then click on the “Next” button", function() {
        cy.get('#add-participant-dropdown-trigger').click()
        cy.wait(1000)
        cy.get('#add-participant-button').click()
        cy.wait(1000)
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
        cy.get('#alert-confirm-button-accept').click()
          cy.wait(1000)
          cy.wait(3000)
        cy.get('#censoSiguienteNew').click()
    });

    it("Click on the “Add item to the agenda+” button", function() {
        cy.get('#newPuntoDelDiaOrdenDelDiaNew').click()        
    });

    it("Click on the 'Item Yes/No Agenda' CTA", function() {
        cy.get('#puntoSiNoAbstencion').click()        
    });

    it("Populate all required fields and navigate to the 'ype' field and select the 'Informative' type then click on the 'OK' CTA", function() {
        cy.get('#agenda-editor-title-input').type('Informative Agenda')
        cy.get('#agenda-editor-type-select').click()
        cy.get('#agenda-editor-type-0').click()
        cy.get('#alert-confirm-button-accept').click()
    })

    it("'Informative' type of item is successfully added", function () {
        cy.contains('Informative Agenda').should('be.visible')
    })

    it("Click on the 'Next' CTA", function () {
        cy.get('#ordenDelDiaNext').click()
        cy.wait(1000)
        cy.get('#attachmentSiguienteNew').click()
    })

    it("Scroll down the page and navigate to the 'Can receive delegations' section", function () {
        cy.get('#MISSING_ID').scrollIntoView()
       
    })

    it("Click on the 'Select' button and choose the participant you want", function () {
        cy.get('#MISSING_ID').click()
        cy.get('#MISSING_ID').click()
        cy.get('#alert-confirm-close').click()
    });

    it("Navigate to the already selected delegations and click on the 'X' button", function () {
        cy.get('#MISSING_ID').click() 
    })

    it("Click on the 'OK' button", function () {
        cy.get('#alert-confirm-button-accept').click() 
    })

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });


});


describe("The user is able to populate the 'Contact Email' field in the 'Options' section in the 'New meeting with session' type of meeting", function() {

     before(function() {
        
    });


    it("Click on the 'New meeting' button", function() {
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

    it("Click on the 'Add participant' button and populate all required fields then click on the “Next” button", function() {
        cy.get('#add-participant-dropdown-trigger').click()
        cy.wait(1000)
        cy.get('#add-participant-button').click()
        cy.wait(1000)
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
        cy.get('#alert-confirm-button-accept').click()
          cy.wait(1000)
          cy.wait(3000)
        cy.get('#censoSiguienteNew').click()
    });

    it("Click on the “Add item to the agenda+” button", function() {
        cy.get('#newPuntoDelDiaOrdenDelDiaNew').click()        
    });

    it("Click on the 'Item Yes/No Agenda' CTA", function() {
        cy.get('#puntoSiNoAbstencion').click()        
    });

    it("Populate all required fields and navigate to the 'ype' field and select the 'Informative' type then click on the 'OK' CTA", function() {
        cy.get('#agenda-editor-title-input').type('Informative Agenda')
        cy.get('#agenda-editor-type-select').click()
        cy.get('#agenda-editor-type-0').click()
        cy.get('#alert-confirm-button-accept').click()
    })

    it("'Informative' type of item is successfully added", function () {
        cy.contains('Informative Agenda').should('be.visible')
    })

    it("Click on the 'Next' CTA", function () {
        cy.get('#ordenDelDiaNext').click()
        cy.wait(1000)
        cy.get('#attachmentSiguienteNew').click()
    })

    it("Navigate to the 'Contact email' form and populate email field and click on the 'Save' CTA", function () {
        cy.get('#council-options-contact-email').clear()
            .type('test@test.test')
            .should('have.value', 'test@test.test')
        cy.get('#MISSING_ID').click()
       
    })

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });


});



describe("The user is not able to populate the 'Contact Email' field with invalid email format in the 'Options' section in the 'New meeting with session' type of meeting and the alert message is displayed", function() {

     before(function() {
        
    });


    it("Click on the 'New meeting' button", function() {
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

    it("Click on the 'Add participant' button and populate all required fields then click on the “Next” button", function() {
        cy.get('#add-participant-dropdown-trigger').click()
        cy.wait(1000)
        cy.get('#add-participant-button').click()
        cy.wait(1000)
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
        cy.get('#alert-confirm-button-accept').click()
          cy.wait(1000)
          cy.wait(3000)
        cy.get('#censoSiguienteNew').click()
    });

    it("Click on the “Add item to the agenda+” button", function() {
        cy.get('#newPuntoDelDiaOrdenDelDiaNew').click()        
    });

    it("Click on the 'Item Yes/No Agenda' CTA", function() {
        cy.get('#puntoSiNoAbstencion').click()        
    });

    it("Populate all required fields and navigate to the 'ype' field and select the 'Informative' type then click on the 'OK' CTA", function() {
        cy.get('#agenda-editor-title-input').type('Informative Agenda')
        cy.get('#agenda-editor-type-select').click()
        cy.get('#agenda-editor-type-0').click()
        cy.get('#alert-confirm-button-accept').click()
    })

    it("'Informative' type of item is successfully added", function () {
        cy.contains('Informative Agenda').should('be.visible')
    })

    it("Click on the 'Next' CTA", function () {
        cy.get('#ordenDelDiaNext').click()
        cy.wait(1000)
        cy.get('#attachmentSiguienteNew').click()
    })

    it("Navigate to the 'Contact email' form and populate email field and click on the 'Save' CTA", function () {
        cy.get('#council-options-contact-email').clear()
            .type('test1')
            .should('have.value', 'test1')
        cy.get('#optionsNewSiguiente').click()       
    })

    it("Alert message is displayed", function () {
        cy.get('#council-options-contact-email-error-text').should('be.visible')
    })

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });



});


describe("The user is able to open the tooltip next to the 'Contact Email' by clicking on the '?'' icon", function() {

     before(function() {
        
    });


    it("Click on the 'New meeting' button", function() {
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

    it("Click on the 'Add participant' button and populate all required fields then click on the “Next” button", function() {
        cy.get('#add-participant-dropdown-trigger').click()
        cy.wait(1000)
        cy.get('#add-participant-button').click()
        cy.wait(1000)
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
        cy.get('#alert-confirm-button-accept').click()
          cy.wait(1000)
          cy.wait(3000)
        cy.get('#censoSiguienteNew').click()
    });

    it("Click on the “Add item to the agenda+” button", function() {
        cy.get('#newPuntoDelDiaOrdenDelDiaNew').click()        
    });

    it("Click on the 'Item Yes/No Agenda' CTA", function() {
        cy.get('#puntoSiNoAbstencion').click()        
    });

    it("Populate all required fields and navigate to the 'ype' field and select the 'Informative' type then click on the 'OK' CTA", function() {
        cy.get('#agenda-editor-title-input').type('Informative Agenda')
        cy.get('#agenda-editor-type-select').click()
        cy.get('#agenda-editor-type-0').click()
        cy.get('#alert-confirm-button-accept').click()
    })

    it("'Informative' type of item is successfully added", function () {
        cy.contains('Informative Agenda').should('be.visible')
    })

    it("Click on the 'Next' CTA", function () {
        cy.get('#ordenDelDiaNext').click()
        cy.wait(1000)
        cy.get('#attachmentSiguienteNew').click()
    })

    it("Navigate to the contact email text and click on the '?'' icon", function () {
        cy.get('#council-options-contact-email').scrollIntoView()
        cy.get('#MISSING_ID').click()
        cy.contains('This email address will be used as the contact email for the meeting administrator').should('be.visible')

    })

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });


});


describe("The user is able to open the tooltip next to the 'If you want participants to receive a notice to confirm their intention to attend' text in the 'Options' section by clicking on the '?' icon", function() {

     before(function() {
        
    });


    it("Click on the 'New meeting' button", function() {
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

    it("Click on the 'Add participant' button and populate all required fields then click on the “Next” button", function() {
        cy.get('#add-participant-dropdown-trigger').click()
        cy.wait(1000)
        cy.get('#add-participant-button').click()
        cy.wait(1000)
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
        cy.get('#alert-confirm-button-accept').click()
          cy.wait(1000)
          cy.wait(3000)
        cy.get('#censoSiguienteNew').click()
    });

    it("Click on the “Add item to the agenda+” button", function() {
        cy.get('#newPuntoDelDiaOrdenDelDiaNew').click()        
    });

    it("Click on the 'Item Yes/No Agenda' CTA", function() {
        cy.get('#puntoSiNoAbstencion').click()        
    });

    it("Populate all required fields and navigate to the 'ype' field and select the 'Informative' type then click on the 'OK' CTA", function() {
        cy.get('#agenda-editor-title-input').type('Informative Agenda')
        cy.get('#agenda-editor-type-select').click()
        cy.get('#agenda-editor-type-0').click()
        cy.get('#alert-confirm-button-accept').click()
    })

    it("'Informative' type of item is successfully added", function () {
        cy.contains('Informative Agenda').should('be.visible')
    })

    it("Click on the 'Next' CTA", function () {
        cy.get('#ordenDelDiaNext').click()
        cy.wait(1000)
        cy.get('#attachmentSiguienteNew').click()
    })

    it("Click on the '?'' icon next to the 'If you want participants to receive a notice to confirm their intention to attend' text", function () {
        cy.get('#MISSING_ID').click()
        cy.contains('The participants will be able to confirm their intention to attend the meeting using the invitation email.').should('be.visible')

    })

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });


});



describe("The user is able to click on the tooltip above the 'Room Layout' form when clicking on the '?'' icon", function() {

     before(function() {
        
    });


    it("Click on the 'New meeting' button", function() {
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

    it("Click on the 'Add participant' button and populate all required fields then click on the “Next” button", function() {
        cy.get('#add-participant-dropdown-trigger').click()
        cy.wait(1000)
        cy.get('#add-participant-button').click()
        cy.wait(1000)
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
        cy.get('#alert-confirm-button-accept').click()
          cy.wait(1000)
          cy.wait(3000)
        cy.get('#censoSiguienteNew').click()
    });

    it("Click on the “Add item to the agenda+” button", function() {
        cy.get('#newPuntoDelDiaOrdenDelDiaNew').click()        
    });

    it("Click on the 'Item Yes/No Agenda' CTA", function() {
        cy.get('#puntoSiNoAbstencion').click()        
    });

    it("Populate all required fields and navigate to the 'ype' field and select the 'Informative' type then click on the 'OK' CTA", function() {
        cy.get('#agenda-editor-title-input').type('Informative Agenda')
        cy.get('#agenda-editor-type-select').click()
        cy.get('#agenda-editor-type-0').click()
        cy.get('#alert-confirm-button-accept').click()
    })

    it("'Informative' type of item is successfully added", function () {
        cy.contains('Informative Agenda').should('be.visible')
    })

    it("Click on the 'Next' CTA", function () {
        cy.get('#ordenDelDiaNext').click()
        cy.wait(1000)
        cy.get('#attachmentSiguienteNew').click()
    })

    it("Navigate to the 'Room Layout' form and click on '?' icon", function () {
        cy.get('#MISSING_ID').scrollIntoView().click()
        cy.contains('By choosing an option, all users will access with this room layout').should('be.visible')

    })

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });


});




describe("The user is able to select 'Active Speaker View' option in the 'Room Layout /Options step' ", function() {

     before(function() {
        
    });


    it("Click on the 'New meeting' button", function() {
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

    it("Click on the 'Add participant' button and populate all required fields then click on the “Next” button", function() {
        cy.get('#add-participant-dropdown-trigger').click()
        cy.wait(1000)
        cy.get('#add-participant-button').click()
        cy.wait(1000)
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
        cy.get('#alert-confirm-button-accept').click()
          cy.wait(1000)
          cy.wait(3000)
        cy.get('#censoSiguienteNew').click()
    });

    it("Click on the “Add item to the agenda+” button", function() {
        cy.get('#newPuntoDelDiaOrdenDelDiaNew').click()        
    });

    it("Click on the 'Item Yes/No Agenda' CTA", function() {
        cy.get('#puntoSiNoAbstencion').click()        
    });

    it("Populate all required fields and navigate to the 'ype' field and select the 'Informative' type then click on the 'OK' CTA", function() {
        cy.get('#agenda-editor-title-input').type('Informative Agenda')
        cy.get('#agenda-editor-type-select').click()
        cy.get('#agenda-editor-type-0').click()
        cy.get('#alert-confirm-button-accept').click()
    })

    it("'Informative' type of item is successfully added", function () {
        cy.contains('Informative Agenda').should('be.visible')
    })

    it("Click on the 'Next' CTA", function () {
        cy.get('#ordenDelDiaNext').click()
        cy.wait(1000)
        cy.get('#attachmentSiguienteNew').click()
    })

    it("Navigate to the 'Room Layout' form", function () {
        cy.get('#council-options-active-speaker').scrollIntoView().click()
    })

    it("Select the checkbox next to the  'Active Speaker View' option", function () {
        cy.get('#council-options-active-speaker').click()
    })

    it("Clicks on the 'SAVE' CTA", function () {
        cy.get('#MISSING_ID').click()
    })

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });


});




describe("The user is able to select 'Grid View' option in the 'Room Layout /Options step' ", function() {

     before(function() {
        
    });


    it("Click on the 'New meeting' button", function() {
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

    it("Click on the 'Add participant' button and populate all required fields then click on the “Next” button", function() {
        cy.get('#add-participant-dropdown-trigger').click()
        cy.wait(1000)
        cy.get('#add-participant-button').click()
        cy.wait(1000)
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
        cy.get('#alert-confirm-button-accept').click()
          cy.wait(1000)
          cy.wait(3000)
        cy.get('#censoSiguienteNew').click()
    });

    it("Click on the “Add item to the agenda+” button", function() {
        cy.get('#newPuntoDelDiaOrdenDelDiaNew').click()        
    });

    it("Click on the 'Item Yes/No Agenda' CTA", function() {
        cy.get('#puntoSiNoAbstencion').click()        
    });

    it("Populate all required fields and navigate to the 'ype' field and select the 'Informative' type then click on the 'OK' CTA", function() {
        cy.get('#agenda-editor-title-input').type('Informative Agenda')
        cy.get('#agenda-editor-type-select').click()
        cy.get('#agenda-editor-type-0').click()
        cy.get('#alert-confirm-button-accept').click()
    })

    it("'Informative' type of item is successfully added", function () {
        cy.contains('Informative Agenda').should('be.visible')
    })

    it("Click on the 'Next' CTA", function () {
        cy.get('#ordenDelDiaNext').click()
        cy.wait(1000)
        cy.get('#attachmentSiguienteNew').click()
    })

    it("Navigate to the 'Room Layout' form", function () {
        cy.get('#council-options-grid').scrollIntoView().click()
    })

    it("Select the checkbox next to the  'Grid View' option", function () {
        cy.get('#council-options-grid').click()
    })

    it("Clicks on the 'SAVE' CTA", function () {
        cy.get('#MISSING_ID').click()
    })

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });


});
