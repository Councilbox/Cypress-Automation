const url = "app.dev.councilbox.com"
const email = "alem@qaengineers.net"
const password = "Mostar123!"
const login_url = Cypress.env("baseUrl");


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



describe("Councilbox login - valid username and password", function() {

     before(function() {
        
    });


    it("Visits the Councilbox web page", function() {
        cy.visit(url);
        cy.url().should('eq', "https://app.dev.councilbox.com/")

    });

    it("Enters email address", function() {
        cy.get('#username')
            .type(email)    
            .should("have.value", email)
    });

    it("Enters password", function() {
        cy.get('#password')
            .type(password)    
            .should("have.value", password)
    });

    it("Clicks login button", function() {
        cy.get("#login-button").click();
        cy.wait(1000)
    });

    it("User should be successfully logged in", function() {
        cy.url().should('include', '/company/')
    })

});


describe("The user is able to open the 'Show the list of attendees' section", function() {

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

    it("Click on the “Item Yes/No/Abstention” button and populate “Title” field then choose “Public voting” tipo and click on the “OK” button then click on the “Next” button", function() {
        cy.get('#puntoSiNoAbstencion').click()
        cy.get('#agenda-editor-title-input').type('Test')
        cy.get('#agenda-editor-type-select').click()
        cy.wait(1000)
        cy.get('#agenda-editor-type-1').click()
        cy.wait(1000)
        cy.wait(1000)
        cy.get('#alert-confirm-button-accept').click()
        cy.wait(1000)
        cy.get('#ordenDelDiaNext').click()
        cy.wait(1000)
        cy.get('#attachmentSiguienteNew').click()
        cy.wait(1000)        
    });

    it("Populate all required fields and click on the “Next” button", function() {       
        cy.get('#council-options-contact-email').scrollIntoView()
        cy.wait(1000)
        cy.get('#council-options-contact-email')
            .type('test@test.test')
        cy.get('#optionsNewSiguiente').click()
        cy.wait(1000) 
    });

    it("Click on the “Invite and notify” button", function() {
        cy.get('#council-editor-convene-notify').click()
        cy.wait(3000)        
    });
    
    it("Click on the “Prepare room” button", function() {
        cy.get('#prepararSalaNew').click()        
    });

    it("Navigate to the upper right corner and click on the “Open room” button", function() { 
        cy.get('#abrirSalaEnReunion').click()        
    });

    it("Populate all required fields and click on the “OK” button", function() {       
        cy.get('#alert-confirm-button-accept').click()
        cy.wait(10000)        
    });

    it("Navigate to the upper right corner and click on the “Start meeting” button", function() {        
        cy.get('#start-council-button').click()
        cy.wait(2000)    
    });

    it("Populate all required fields and click on the “OK” button", function() {
        cy.get('#council-president-select').click()
        cy.wait(200)
        cy.get('#participant-selector-0').click()
        cy.get('#council-secretary-select').click()
        cy.wait(200)
        cy.get('#participant-selector-0').click()
        cy.get('#council-quality-vote-select').click()
        cy.wait(200)
        cy.get('#participant-selector-0').click()
        cy.get('#alert-confirm-button-accept').click()
        cy.wait(200)
        cy.get('#alert-confirm-button-cancel').click()   
    });

    it("Click on the “Activate voting” button", function() {
        cy.get('#council-live-tab-agenda').click()
        cy.wait(1000)
        cy.get('#open-point-votings-button').click()
        cy.wait(1000)
    });

    it("Click on the 'Close voting on the item' button", function() {
        cy.get('#close-point-votings-button').click()
        cy.wait(1000)
    });

    it("Click on the 'Open item' button", function() {
        cy.get('#council-live-tab-agenda').click()
        cy.wait(1000)
        cy.get('#open-agenda-point-button').click()
        cy.wait(1000)
    });

    it("Click on the 'Close item' button", function() {
        cy.get('#close-agenda-point-button').click()
        cy.wait(1000)
    });

    it("On the upper right corner click on the 'End meeting' button and then click on the 'OK' button", function() {
        cy.get('#finalizarReunionEnReunion').click()
        cy.wait(1000)
        cy.get('#alert-confirm-button-accept').click()
        cy.wait(1000)
    });

    it("Navigate to the upper right corner and click on the 'Show the list of attendees' button", function() {
        cy.get('#tab-attendants').click()
        cy.wait(1000)
    });

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });

 });
