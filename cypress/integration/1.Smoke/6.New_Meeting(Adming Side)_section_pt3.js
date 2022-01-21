describe("The user is able to close point in the 'New call with session' type of meeting'", function() {

     it("Click on the 'Nueva reunion' button", function() {
        cy.contains('dashboard').click({ force: true })
        cy.get('#create-council-block').click()

    });


    it("Click on the “Con sesion” button", function() {
        cy.get('#create-council-with-session').click()
        cy.wait(3000)
    
    });


    it("Populate all required fields and click on the “Siguiente” button", function() {
        cy.get('#council-notice-type-select').click()
        cy.get('#council-notice-type-2').click()
        cy.get('#council-notice-title').clear()
            .type('Test')
       cy.get('#council-notice-convene-intro')
            .type('Test')

        cy.get('#council-editor-next').click()
        cy.wait(1000)

    });


    it("Click on the 'Anadir participante' button and populate all required fields then click on the “Siguiente” button", function() {
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


    it("Click on the “Anadir punto al orden del dia+” button", function() {
        cy.get('#newPuntoDelDiaOrdenDelDiaNew').click()
        

    });


    it("Click on the “Punto Si/no abstencion” button and populate “Title” field then choose “Votacio nominal” tipo and click on the “Aceptar” button then click on the “Siguiente” button", function() {
        cy.get('#puntoSiNoAbstencion').click()
        cy.get('#agenda-editor-title-input').type('Test')

        cy.get('#agenda-editor-type-select').click()

        cy.wait(1000)
        cy.get('#agenda-editor-type-1').click()
        cy.wait(1000)
        cy.get('#alert-confirm-button-accept').click()
        cy.wait(1000)
        cy.get('#ordenDelDiaNext').click()

        cy.wait(1000)

        cy.get('#attachmentSiguienteNew').click()

        cy.wait(1000)
        

    });

/*
    it("Click on the 'Anadir+'' button then click on the 'Subir archivo button and select the document you want to add and click on the next' button", function() {
        cy.get('#puntoSiNoAbstencion').click()
        cy.get('#tituloPuntoDelDiaModal').type('Test')
        cy.contains('Informativo').click()
        cy.wait(1000)
        cy.contains('Votación nominal').click()
        cy.contains('Aceptar').click()
        cy.get('#botonSiguienteNuevasReunionesAbajo').click()
        cy.wait(1000)
        cy.get('#botonSiguienteNuevasReunionesAbajo').click()
        cy.wait(1000)

       

    });

    */


     it("Populate all required fields and click on the “Siguiente” button", function() {
        cy.get('#council-options-contact-email').scrollIntoView()
        cy.wait(1000)
        cy.get('#council-options-contact-email')
            .type('test@test.test')
        
        cy.get('#optionsNewSiguiente').click()
        cy.wait(1000)
        
        

    });


      it("Click on the “Convocar y notificar” button", function() {
        
        cy.get('#council-editor-convene-notify').click()
        cy.wait(3000)
        
        

    });


       it("Click on the “Preparar sala” button", function() {
        
        cy.get('#prepararSalaNew').click()
        
        

    });


         it("Navigate to the upper right corner and click on the “Abrir Sala” button", function() {
        
        cy.get('#abrirSalaEnReunion').click()
        
        

    });


           it("Populate all required fields and click on the “Aceptar” button", function() {
        
        cy.get('#alert-confirm-button-accept').click()
        cy.wait(10000)
        
        

    });


           it("Navigate to the “Camera and microphone” form and click on the “Accept” button", function() {
 /*       
            cy.get('#admin-room-iframe').then($iframe => {
  const $body = $iframe.contents().find('body') ; cy.wrap($body)


    .contains('Join')
    .click()

    cy.wait(10000)
})
*/
       
   });


            it("Navigate to the upper right corner and click on the “Iniciar reunion” button", function() {
        
        cy.get('#start-council-button').click()
        cy.wait(2000)
        
        
    
    });


             it("Populate all required fields and click on the “Aceptar” button", function() {
        
       

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


        it("Click on the “Abrir punto” button", function() {
        
        cy.get('#council-live-tab-agenda').click()
        cy.wait(1000)

        cy.get('#open-agenda-point-button').click()
        cy.wait(2000)
        
        
    
    });


    it("Click on the “Activar votaciones” button", function() {
        
        cy.get('#council-live-tab-agenda').click()
        cy.wait(1000)

        cy.get('#open-point-votings-button').click()
        cy.wait(2000)
        
        
    
    });


    it("Click on the “Cerrar las votaciones del punto” button", function() {
        
        cy.get('#close-point-votings-button').click()
        cy.wait(2000)
        
        
    
    });

    it("Click on the “Cerrar punto” button", function() {
        
        cy.get('#close-agenda-point-button').click()
        cy.wait(2000)
        
        
    
    });



    it("User should be able to exit the meeting", function() {

        cy.visit(login_url)

    });




 });







describe("The user is able to finish council in the 'New call with session' type of meeting", function() {

     it("Click on the 'Nueva reunion' button", function() {
        cy.get('#create-council-block').click()

    });


    it("Click on the “Con sesion” button", function() {
        cy.get('#create-council-with-session').click()
        cy.wait(3000)
    
    });


    it("Populate all required fields and click on the “Siguiente” button", function() {
        cy.get('#council-notice-type-select').click()
        cy.get('#council-notice-type-2').click()
        cy.get('#council-notice-title').clear()
            .type('Test')
       cy.get('#council-notice-convene-intro')
            .type('Test')

        cy.get('#council-editor-next').click()
        cy.wait(1000)

    });


    it("Click on the 'Anadir participante' button and populate all required fields then click on the “Siguiente” button", function() {
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


    it("Click on the “Anadir punto al orden del dia+” button", function() {
        cy.get('#newPuntoDelDiaOrdenDelDiaNew').click()
        

    });


    it("Click on the “Punto Si/no abstencion” button and populate “Title” field then choose “Votacio nominal” tipo and click on the “Aceptar” button then click on the “Siguiente” button", function() {
        cy.get('#puntoSiNoAbstencion').click()
        cy.get('#agenda-editor-title-input').type('Test')

        cy.get('#agenda-editor-type-select').click()

        cy.wait(1000)
        cy.get('#agenda-editor-type-1').click()
        cy.wait(1000)
        cy.get('#alert-confirm-button-accept').click()
        cy.wait(1000)
        cy.get('#ordenDelDiaNext').click()

        cy.wait(1000)

        cy.get('#attachmentSiguienteNew').click()

        cy.wait(1000)
        

    });

/*
    it("Click on the 'Anadir+'' button then click on the 'Subir archivo button and select the document you want to add and click on the next' button", function() {
        cy.get('#puntoSiNoAbstencion').click()
        cy.get('#tituloPuntoDelDiaModal').type('Test')
        cy.contains('Informativo').click()
        cy.wait(1000)
        cy.contains('Votación nominal').click()
        cy.contains('Aceptar').click()
        cy.get('#botonSiguienteNuevasReunionesAbajo').click()
        cy.wait(1000)
        cy.get('#botonSiguienteNuevasReunionesAbajo').click()
        cy.wait(1000)

       

    });

    */


     it("Populate all required fields and click on the “Siguiente” button", function() {
        cy.get('#council-options-contact-email').scrollIntoView()
        cy.wait(1000)
        cy.get('#council-options-contact-email')
            .type('test@test.test')
        
        cy.get('#optionsNewSiguiente').click()
        cy.wait(1000)
        
        

    });


      it("Click on the “Convocar y notificar” button", function() {
        
        cy.get('#council-editor-convene-notify').click()
        cy.wait(3000)
        
        

    });


       it("Click on the “Preparar sala” button", function() {
        
        cy.get('#prepararSalaNew').click()
        
        

    });


         it("Navigate to the upper right corner and click on the “Abrir Sala” button", function() {
        
        cy.get('#abrirSalaEnReunion').click()
        
        

    });


           it("Populate all required fields and click on the “Aceptar” button", function() {
        
        cy.get('#alert-confirm-button-accept').click()
        cy.wait(10000)
        
        

    });


           it("Navigate to the “Camera and microphone” form and click on the “Accept” button", function() {
 /*       
            cy.get('#admin-room-iframe').then($iframe => {
  const $body = $iframe.contents().find('body') ; cy.wrap($body)


    .contains('Join')
    .click()

    cy.wait(10000)
})
*/
       
   });


            it("Navigate to the upper right corner and click on the “Iniciar reunion” button", function() {
        
        cy.get('#start-council-button').click()
        cy.wait(2000)
        
        
    
    });


             it("Populate all required fields and click on the “Aceptar” button", function() {
        
       

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


        it("Click on the “Abrir punto” button", function() {
        
        cy.get('#council-live-tab-agenda').click()
        cy.wait(1000)

        cy.get('#open-agenda-point-button').click()
        cy.wait(2000)
        
        
    
    });


    it("Click on the “Activar votaciones” button", function() {
        
        cy.get('#council-live-tab-agenda').click()
        cy.wait(1000)

        cy.get('#open-point-votings-button').click()
        cy.wait(2000)
        
        
    
    });


    it("Click on the “Cerrar las votaciones del punto” button", function() {
        
        cy.get('#close-point-votings-button').click()
        cy.wait(2000)
        
        
    
    });

    it("Click on the “Cerrar punto” button", function() {
        
        cy.get('#close-agenda-point-button').click()
        cy.wait(2000)
        
        
    
    });


    it("Click on the “Finalizar reunion” button", function() {
        
        cy.get('#finalizarReunionEnReunion').click()
        
        
    
    });


    it("Click on the “Accept” button", function() {
        
        cy.get('#alert-confirm-button-accept').click()
        cy.wait(1000)
        
        
    
    });

    it("User should be able to exit the meeting", function() {

        cy.visit(login_url)

    });


 });
