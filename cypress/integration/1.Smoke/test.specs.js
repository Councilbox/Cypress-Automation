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
        cy.contains('EN').click();
        cy.contains('ES').click();
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
        cy.contains("Entrar").click();
        cy.wait(5000)
    });

});




describe("The user is able to send minutes in the 'New call with session' type of meeting", function() {

     it("Click on the 'Nueva reunion' button", function() {
        cy.contains('dashboard').click({ force: true })
        cy.get('#create-council-block').click()

    });


    it("Click on the “Con sesion” button", function() {
        cy.contains('Con sesión').click()
        cy.wait(3000)
    
    });


    it("Populate all required fields and click on the “Siguiente” button", function() {
        cy.xpath('(//*[@class="ql-editor ql-blank" ])[1]').type('Test')
       
        cy.get('#botonSiguienteNuevasReunionesAbajo').click()
        cy.wait(1000)

    });


    it("Click on the 'Anadir participante' button and populate all required fields then click on the “Siguiente” button", function() {
           cy.get('#anadirParticipanteEnCensoNewReunion').click()
        cy.wait(1000)


           
            
        cy.get('input').eq(7)
            .type('TestAutomation'+Cypress.config('UniqueNumber'))    
            
        
            
        cy.get('input').eq(8)
            .type('alem'+Cypress.config('UniqueNumber'))    
            
        cy.get('input').eq(9)
            .type('alem'+Cypress.config('UniqueNumber'))     
            
        cy.get('input').eq(10)
            .type('123123123')    
            
        cy.get('input').eq(11)
            .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com')    
            
        cy.get('input').eq(12)
            .type('alem'+Cypress.config('UniqueNumber')+'@yopmail.com') 
          
          cy.contains('Aceptar').click()

          cy.wait(1000)

          cy.get('#censoSiguienteNew').click()

    });


    it("Click on the “Anadir punto al orden del dia+” button", function() {
        cy.get('#newPuntoDelDiaOrdenDelDiaNew').click()
        

    });


    it("Click on the “Punto Si/no abstencion” button and populate “Title” field then choose “Votacio nominal” tipo and click on the “Aceptar” button then click on the “Siguiente” button", function() {
        cy.get('#puntoSiNoAbstencion').click()
        cy.get('#tituloPuntoDelDiaModal').type('Test')

        cy.contains('Informativo').click()

        cy.wait(1000)
        cy.contains('Votación nominal').click()

        cy.contains('Aceptar').click()

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
        
        cy.get('#optionsNewSiguiente').click()
        cy.wait(1000)
        
        

    });


      it("Click on the “Convocar y notificar” button", function() {
        
        cy.contains('Convocar y notificar').click()
        cy.wait(3000)
        
        

    });


       it("Click on the “Preparar sala” button", function() {
        
        cy.get('#prepararSalaNew').click()
        
        

    });


         it("Navigate to the upper right corner and click on the “Abrir Sala” button", function() {
        
        cy.get('#abrirSalaEnReunion').click()
        
        

    });


           it("Populate all required fields and click on the “Aceptar” button", function() {
        
        cy.contains('Aceptar').click()
        cy.wait(10000)
        
        

    });


           it("Navigate to the “Camera and microphone” form and click on the “Accept” button", function() {
        
            cy.get('#admin-room-iframe').then($iframe => {
  const $body = $iframe.contents().find('body') ; cy.wrap($body)


    .contains('Accept')
    .click()

    cy.wait(10000)
})

       
   });


            it("Navigate to the upper right corner and click on the “Iniciar reunion” button", function() {
        
        cy.get('#iniciarReunionDentroDeReunion').click()
        cy.wait(2000)
        
        
    
    });


             it("Populate all required fields and click on the “Aceptar” button", function() {
        
        cy.get('#seleccionaAlPresidenteEnReunion').click()


        cy.wait(200)

        cy.xpath('//*[@class="itemsSeleccionEnModalUsersEnReunion"]').click()

        cy.get('#seleccionaAlSecretarioEnReunion').click()

        cy.wait(200)

        cy.xpath('//*[@class="itemsSeleccionEnModalUsersEnReunion"]').click()

       
         cy.contains('Aceptar').click()
        cy.wait(200)
        cy.contains('Cerrar').click()
        
    
    });


        it("Click on the “Abrir punto” button", function() {
        
        cy.contains('Abrir punto').click()
        cy.wait(2000)
        
        
    
    });


    it("Click on the “Activar votaciones” button", function() {
        
        cy.contains('Activar votaciones').click()
        cy.wait(2000)
        
        
    
    });


    it("Click on the “Cerrar las votaciones del punto” button", function() {
        
        cy.contains('Cerrar las votaciones del punto').click()
        cy.wait(2000)
        
        
    
    });

    it("Click on the “Cerrar punto” button", function() {
        
        cy.contains('Cerrar punto').click()
        cy.wait(2000)
        
        
    
    });


    it("Click on the “Finalizar reunion” button", function() {
        
        cy.get('#finalizarReunionEnReunion').click()
        
        
    
    });


    it("Click on the “Accept” button", function() {
        
        cy.contains('Aceptar').click()
        cy.wait(2000)
        
        
    
    });


    it("Click on the “Finalizar y aprobar acta” button and again click on the “Finalizar y aprobar acta” button", function() {
        
        cy.contains('Finalizar y aprobar acta').click()
        cy.wait(5000)
        cy.contains('Finalizar y aprobar acta').click()
        cy.wait(1000)
        
        
    
    });


    it("Click on the “Envio del acta” button", function() {
        
        cy.contains('Envío del acta').click()
        cy.wait(1000)
        
        
    
    });


    it("Click on the “Enviar acta” button", function() {
        
        cy.contains('Enviar acta').click()
        cy.wait(1000)
        
        
    
    });


    it("Click on the “Enviar a todos los convocados then click on the “Enviar” button", function() {
        
        cy.contains('Enviar a todos los convocados').click()
        cy.wait(1000)
        cy.contains('Enviar').click()
        cy.wait(3000)
        cy.contains('Cerrar').click()
        
        
    
    });



 });
