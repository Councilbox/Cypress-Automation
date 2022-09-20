const invalid_emails = ["andrej@qa", "andrej.qa", "andrej@majl.234"];
const login_url = Cypress.env("baseUrl");
const valid_password = Cypress.env("login_password");
const valid_email = Cypress.env("login_email");



describe("Councilbox login - valid username and password", function() {

     before(function() {
        
    });


    it("Visits the Councilbox web page", function() {
        cy.visit(login_url);
    });

    it("Change language to Spanish", function() {
        cy.get('#language-selector').click();
        cy.get('#language-es').click();
    });

    it("Enters email address", function() {
        cy.get('#username').clear()
            .type('alem@qaengineers.net')    
            .should("have.value", 'alem@qaengineers.net')
    });

    it("Enters password", function() {
        cy.get('#password').clear()
            .type('Mostar123!test')    
            .should("have.value", 'Mostar123!test')
    });

    it("Clicks login button", function() {
        cy.get("#login-button").click();
    
    });

});


describe("Quorum numbers (current/initial) scenario (test case 1) - current quorum 80/initial quorum 70 - 100 votes - 100 shares", function() {
    
    it("Click on the “Censuses” button", function() {
        cy.get('#edit-censuses-block').click()
    });

    it("Click on the “Add census” button and populate all required fields then click on the “OK” button", function() {
        cy.get('#add-census-button').click()
        cy.get('#census-name').clear()
            .type('Qourum'+Cypress.config('UniqueNumber'))
        cy.get('#census-type').click()
        cy.get('#census-type-social-capital').click()
    
        cy.get('#alert-confirm-button-accept').click()
    });

    it("Navigate to the already added census and hover it then click on the “Manage participants” icon", function() {
        cy.get('#undefined-search-input').clear()
            .type('Qourum'+Cypress.config('UniqueNumber'))
        cy.wait(4000)
        cy.get('#census_row_0').trigger('mouseover')
        cy.get('#census-manage-participants-button').click()

    });

    it("Add participant A with 20 votes and 20 shares", function() {
        cy.get('#add-census-participant-button').click()
  
        cy.get('#participant-name-input').clear()
            .type('Participant')
        cy.get('#participant-surname-input').clear()
            .type('A')
        cy.get('#participant-email-input').clear()
            .type('testA@test.test')
        cy.get('#participant-phone-input').clear()
            .type('123456')
        cy.get('#participant-votes-input').clear()
            .type('20')
        cy.get('#participant-social-capital-input').clear()
            .type('20')
        cy.get('#alert-confirm-button-accept').click()
     
        
        
        
    });

    it("Add participant B with 10 votes and 10 shares", function() {
   
        cy.get('#add-census-participant-button').click()
       
        cy.get('#participant-name-input').clear()
            .type('Participant')
        cy.get('#participant-surname-input').clear()
            .type('B')
        cy.get('#participant-email-input').clear()
            .type('testB@test.test')
        cy.get('#participant-phone-input').clear()
            .type('123456')
        cy.get('#participant-votes-input').clear()
            .type('10')
        cy.get('#participant-social-capital-input').clear()
            .type('10')
        cy.get('#alert-confirm-button-accept').click()
    
        
    });

    it("Add participant C with 10 votes and 10 shares", function() {
        cy.get('#add-census-participant-button').click()
       
        cy.get('#participant-name-input').clear()
            .type('Participant')
        cy.get('#participant-surname-input').clear()
            .type('C')
        cy.get('#participant-email-input').clear()
            .type('testC@test.test')
        cy.get('#participant-phone-input').clear()
            .type('123456')
        cy.get('#participant-votes-input').clear()
            .type('10')
        cy.get('#participant-social-capital-input').clear()
            .type('10')
        cy.get('#alert-confirm-button-accept').click()
      
       
    });

    it("Add participant D with 20 votes and 20 shares", function() {
        cy.get('#add-census-participant-button').click()
        
        cy.get('#participant-name-input').clear()
            .type('Participant')
        cy.get('#participant-surname-input').clear()
            .type('D')
        cy.get('#participant-email-input').clear()
            .type('testD@test.test')
        cy.get('#participant-phone-input').clear()
            .type('123456')
        cy.get('#participant-votes-input').clear()
            .type('20')
        cy.get('#participant-social-capital-input').clear()
            .type('20')
        cy.get('#alert-confirm-button-accept').click()
        
       
    });
 
    it("Add participant E with 10 votes and 10 shares", function() {
        cy.get('#add-census-participant-button').click()
     
        cy.get('#participant-name-input').clear()
            .type('Participant')
        cy.get('#participant-surname-input').clear()
            .type('E')
        cy.get('#participant-email-input').clear()
            .type('testE@test.test')
        cy.get('#participant-phone-input').clear()
            .type('123456')
        cy.get('#participant-votes-input').clear()
            .type('10')
        cy.get('#participant-social-capital-input').clear()
            .type('10')
        cy.get('#alert-confirm-button-accept').click()
       
       
    });

    it("Add participant F with 10 votes and 10 shares”", function() {
        cy.get('#add-census-participant-button').click()
        
        cy.get('#participant-name-input').clear()
            .type('Participant')
        cy.get('#participant-surname-input').clear()
            .type('F')
        cy.get('#participant-email-input').clear()
            .type('testF@test.test')
        cy.get('#participant-phone-input').clear()
            .type('123456')
        cy.get('#participant-votes-input').clear()
            .type('10')
        cy.get('#participant-social-capital-input').clear()
            .type('10')
        cy.get('#alert-confirm-button-accept').click()
          
    });

    it("Add participant G with 5 votes and 5 shares", function() {
        cy.get('#add-census-participant-button').click()
        
        cy.get('#participant-name-input').clear()
            .type('Participant')
        cy.get('#participant-surname-input').clear()
            .type('G')
        cy.get('#participant-email-input').clear()
            .type('testG@test.test')
        cy.get('#participant-phone-input').clear()
            .type('123456')
        cy.get('#participant-votes-input').clear()
            .type('5')
        cy.get('#participant-social-capital-input').clear()
            .type('5')
        cy.get('#alert-confirm-button-accept').click()
       
        
    });

    it("Add participant H with 5 votes and 5 shares", function() {
        cy.get('#add-census-participant-button').click()
       
        cy.get('#participant-name-input').clear()
            .type('Participant')
        cy.get('#participant-surname-input').clear()
            .type('H')
        cy.get('#participant-email-input').clear()
            .type('testH@test.test')
        cy.get('#participant-phone-input').clear()
            .type('123456')
        cy.get('#participant-votes-input').clear()
            .type('5')
        cy.get('#participant-social-capital-input').clear()
            .type('5')
        cy.get('#alert-confirm-button-accept').click()
       
        
    });

    it("Add participant I with 10 votes and 10 shares", function() {
        cy.get('#add-census-participant-button').click()
        
        cy.get('#participant-name-input').clear()
            .type('Participant')
        cy.get('#participant-surname-input').clear()
            .type('I')
        cy.get('#participant-email-input').clear()
            .type('testI@test.test')
        cy.get('#participant-phone-input').clear()
            .type('123456')
        cy.get('#participant-votes-input').clear()
            .type('10')
        cy.get('#participant-social-capital-input').clear()
            .type('10')
        cy.get('#alert-confirm-button-accept').click()
        
        
    });

    it("Observe the total number of votes and shares", function() {
        cy.get('#census-total-votes').should('have.text', '100')
       
        cy.get('#census-total-social-capital').should('have.text', '100')
    });


    it("Close the “Census” section and navigate to the landing page", function() {
        cy.visit(login_url)
    });

    it("Click on the “New meeting” button the select the “With session” type of meeting", function() {
        
        cy.get('#create-council-block').click()
          
        cy.get('#create-council-with-session').click()
        
    });

    it("Populate all required fields and click on the “Next” button", function() {
        cy.get('#council-notice-convene-intro')
            .type('Test')
        cy.get('#council-editor-next').click()
        
    });
    
    it("Navigate to the “Current census” on the top left corner and click on the field to select the census", function() {
        cy.get('#change-census-select').click()
    });
    
    it("Select the census you added before (with 9 participants - 100 votes and 100 shares)", function() {
        cy.contains('Qourum'+Cypress.config('UniqueNumber')).click()
    });
    
    it("Click on the “Yes, I want to change the census” button", function() {
        cy.get('#change-census-confirm').click()
    });
   
    it("Click on the “Next” button", function() {
        cy.get('#censoSiguienteNew').click()
       
    });

    it("Add item to agenda", function() {
        cy.get('#newPuntoDelDiaOrdenDelDiaNew').click()
        cy.get('#puntoSiNoAbstencion').click()
        cy.get('#agenda-editor-title-input')
            .type('Test')
        cy.get('#agenda-editor-type-select').click()
        cy.get('#agenda-editor-type-1').click()
        cy.get('#alert-confirm-button-accept').click()  
        
    });

    it("Click on the “Next” button", function() {
        cy.wait(4000)
        cy.get('#ordenDelDiaNext').click()
       
    });

    it("Click on the “Next” button", function() {
        cy.get('#attachmentSiguienteNew').click()
       
    });

    it("Click on the “Next” button", function() {
        cy.get('#council-options-contact-email').scrollIntoView()
      
        cy.get('#council-options-contact-email')
            .clear().type('test@test.test')
        cy.get('#optionsNewSiguiente').click()
        
    });

    it("Click on the “Invite and notify” button then click on the “Prepare room” button", function() {
        cy.get('#council-editor-convene-notify').click()
       
    });

    it("Click on the “Open room” button then click on the “Open room” button", function() {
        cy.get('#prepararSalaNew').click()
        
    });

    it("Click on the “Participants” button", function() {
        cy.get('#council-live-tab-participants').click()
        
    });

    it("Click to the “Participant E”", function() {
        cy.contains(/^Participant E$/).click()
       
    });

    it("Click on the “Delegate vote” button then choose the “Participant B” and click on it”", function() {
        cy.get('#participant-editor-delegate-vote-button').click()
        
        cy.get('#participant-row-1').click()
       
        cy.get('#alert-confirm-close').click()
        
    });

    it("Click on the “Participant B” and observe the total votes”", function() {
        
        cy.contains(/^Participant B$/).click()
     
        cy.get('#owned-votes-total').should('have.text', ' 10')
        cy.get('#owned-delegated-social-capital').should('have.text', ' 10')
       
        cy.get('#alert-confirm-close').click()
       

    });

    it("Click on the “Participant B” and select the “Attending in person” status", function() {
        cy.get('#input-search-live')
            .type('B')
            .wait(1000)
        cy.get('#state-selector-participant-item-1').click()
        
        cy.get('#state-in-person-participant-item-1').click()
       cy.get('#input-search-live').clear()
    });


    it("Observe the current quorum number on the top right side of the page”", function() {
        cy.wait(5000)
        cy.get('#live-current-quorum').should('have.text', '20')
       
    });

    it("Click on the “Participant D” button", function() {
        cy.contains(/^Participant D$/).click()
        
    });

    it("Click on the “Vote early” button and select the option you want", function() {
        
        cy.get('#participant-early-voting-button').click()
     
        cy.get('#early-vote-option-1-point-0').click()
      
        cy.xpath('(//*[@id="alert-confirm-close"])[2]').click()  
     
        cy.get('#alert-confirm-close').click() 
       
         
    });

    it("Observe the current quorum number on the top right side of the page”", function() {
        cy.wait(5000)
        cy.get('#live-current-quorum').should('have.text', '40')
        
    });

    it("Click to the “Participant C”", function() {
        cy.contains(/^Participant C$/).click()
        
    });

    it("Click on the “Delegate vote” button then choose the “Participant A” and click on it”", function() {
        cy.get('#participant-editor-delegate-vote-button').click()
       
        cy.get('#participant-row-0').click()
        
        cy.get('#alert-confirm-close').click()
        
    });

    it("Click on the “Participant A” and observe the total votes”", function() {
        cy.contains(/^Participant A$/).click()
        
        cy.get('#owned-votes-total').should('contain', '20')
        cy.get('#owned-delegated-social-capital').should('contain', '10')
        
        cy.get('#alert-confirm-close').click()
       

    });





    it("Back to Home page", function() {
            cy.visit(login_url);
           
        });  

   
   
});






