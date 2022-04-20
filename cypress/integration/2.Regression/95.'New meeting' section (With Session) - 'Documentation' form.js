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


describe("The user is able to upload a new document to the 'Documentation' form in the 'New meeting with session' section[upload file]", function() {

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

    it("Populate all required fields and navigate to the 'ype' field and select the 'Roll-call vote' type then click on the 'OK' CTA then click on the 'Next' CTA", function() {
        cy.get('#agenda-editor-title-input').type('Roll-call vote Agenda')
        cy.get('#agenda-editor-type-select').click()
        cy.get('#agenda-editor-type-1').click()
        cy.get('#alert-confirm-button-accept').click()
        cy.get('#ordenDelDiaNext').click()
    })

    it("On the upper right corner click on the 'Add+'' button then click on the 'Upload file' button", function () {
        cy.get('#MISSING_ID').click()
    })

    it("Find the file you want to upload and click on it then click on the 'Open' button", function () {
        cy.get('#MISSING_ID').click()
    })

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });



});



describe("The user is able to edit a document name in the 'Documentation' form in the 'New meeting with session' section", function() {

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

    it("Populate all required fields and navigate to the 'ype' field and select the 'Roll-call vote' type then click on the 'OK' CTA then click on the 'Next' CTA", function() {
        cy.get('#agenda-editor-title-input').type('Roll-call vote Agenda')
        cy.get('#agenda-editor-type-select').click()
        cy.get('#agenda-editor-type-1').click()
        cy.get('#alert-confirm-button-accept').click()
        cy.get('#ordenDelDiaNext').click()
    })

    it("On the upper right corner click on the 'Add+'' button then click on the 'Upload file' button", function () {
        cy.get('#MISSING_ID').click()
    })

    it("Find the file you want to upload and click on it then click on the 'Open' button", function () {
        cy.get('#MISSING_ID').click()
    })

    it("Click on the already added document and populate it with the name you want", function () {
        cy.get('#MISSING_ID').click()
        cy.get('#MISSING_ID').clear().type('Edit File Name')
        cy.get('#alert-confirm-button-accept').click()

    })

    it("Name of document is successfully edited", function() {
        cy.contains('Edit File Name').should('be.visible')
    })

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });



});


describe("The user is able to remove a already added document in the 'Documentation' form in the 'New meeting with session' section", function() {

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

    it("Populate all required fields and navigate to the 'ype' field and select the 'Roll-call vote' type then click on the 'OK' CTA then click on the 'Next' CTA", function() {
        cy.get('#agenda-editor-title-input').type('Roll-call vote Agenda')
        cy.get('#agenda-editor-type-select').click()
        cy.get('#agenda-editor-type-1').click()
        cy.get('#alert-confirm-button-accept').click()
        cy.get('#ordenDelDiaNext').click()
    })

    it("On the upper right corner click on the 'Add+'' button then click on the 'Upload file' button", function () {
        cy.get('#MISSING_ID').click()
    })

    it("Find the file you want to upload and click on it then click on the 'Open' button", function () {
        cy.get('#MISSING_ID').click()
    })

    it("Navigate to the already added document and click on the 'X' button to remove the document", function () {
        cy.get('#MISSING_ID').click()
    })

    it("Click on the 'Delete' button", function() {
        cy.get('#alert-confirm-button-accept').click()
    })

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });



});

