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


<<<<<<< HEAD
describe("The user is able to finalize and approve act in the 'New call with session' type of meeting", function() {

     it("Click on the 'Nueva reunion' button", function() {
        cy.get('#create-council-block').click()
=======
describe("The alert message is successfully displayed when the user clicks on the 'Cancel' button without saving changes in the 'Edit tag' section", function() {
>>>>>>> 91030333d0af202c24b6bafe418feb2fd4bba666

    });


    it("Click on the “Con sesion” button", function() {
        cy.get('#create-council-with-session').click()
        cy.wait(3000)
    
    });


<<<<<<< HEAD
    it("Populate all required fields and click on the “Siguiente” button", function() {
        cy.get('#council-notice-title').clear()
            .type('Test')
       cy.get('#council-notice-convene-intro')
            .type('Test')

        cy.get('#council-editor-next').click()
        cy.wait(1000)

    });


    it("Click on the 'Anadir participante' button and populate all required fields then click on the “Siguiente” button", function() {
           cy.get('#anadirParticipanteEnCensoNewReunion').click()
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

        cy.get('#alert-confirm-button-accept').click()

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
        
            cy.get('#admin-room-iframe').then($iframe => {
  const $body = $iframe.contents().find('body') ; cy.wrap($body)


    .contains('Accept')
    .click()

    cy.wait(10000)
})

       
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

        cy.wait(200)

        //cy.get('#council-quality-vote-select').click()

        //cy.get('#participant-selector-0').click()

       
         cy.get('#alert-confirm-button-accept').click()
        cy.wait(200)
        cy.get('#alert-confirm-button-cancel').click()
        
    
    });


        it("Click on the “Abrir punto” button", function() {
        
        cy.get('#open-agenda-point-button').click()
        cy.wait(2000)
        
        
    
    });


    it("Click on the “Activar votaciones” button", function() {
        
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
        cy.wait(3000)
        
        
    
    });


    it("Click on the “Finalizar y aprobar acta” button and again click on the “Finalizar y aprobar acta” button", function() {
        
        cy.contains('Finalizar y aprobar acta').click()
        cy.wait(5000)
        cy.get('#alert-confirm-button-accept').click()
        cy.wait(1000)
        
        
    
    });
=======
        it("'Has changes without saving' alert message is successfully displayed", function() {
            cy.get('#unsaved-changes-discard').click()

            cy.wait(1000)
        });
>>>>>>> 91030333d0af202c24b6bafe418feb2fd4bba666

    it("Back to Home page", function() {
            cy.visit(login_url);
            cy.wait(3000)
        });
<<<<<<< HEAD


 });






describe("The user is able to send minutes in the 'New call with session' type of meeting", function() {

     it("Click on the 'Nueva reunion' button", function() {
        
        cy.get('#create-council-block').click()

    });


    it("Click on the “Con sesion” button", function() {
        cy.get('#create-council-with-session').click()
        cy.wait(3000)
    
    });


    it("Populate all required fields and click on the “Siguiente” button", function() {
        cy.get('#council-notice-title').clear()
            .type('Test')
       cy.get('#council-notice-convene-intro')
            .type('Test')

        cy.get('#council-editor-next').click()
        cy.wait(1000)

    });


    it("Click on the 'Anadir participante' button and populate all required fields then click on the “Siguiente” button", function() {
           cy.get('#anadirParticipanteEnCensoNewReunion').click()
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

        cy.get('#alert-confirm-button-accept').click()

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
        
            cy.get('#admin-room-iframe').then($iframe => {
  const $body = $iframe.contents().find('body') ; cy.wrap($body)


    .contains('Accept')
    .click()

    cy.wait(10000)
})

       
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

        //cy.get('#council-quality-vote-select').click()

        cy.wait(200)

        //cy.get('#participant-selector-0').click()

       
         cy.get('#alert-confirm-button-accept').click()
        cy.wait(200)
        cy.get('#alert-confirm-button-cancel').click()
        
    
    });


        it("Click on the “Abrir punto” button", function() {
        
        cy.get('#open-agenda-point-button').click()
        cy.wait(2000)
        
        
    
    });


    it("Click on the “Activar votaciones” button", function() {
        
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
        cy.wait(2000)
        
        
    
    });


    it("Click on the “Finalizar y aprobar acta” button and again click on the “Finalizar y aprobar acta” button", function() {
        
        cy.contains('Finalizar y aprobar acta').click()
        cy.wait(5000)
        cy.get('#alert-confirm-button-accept').click()
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

    it("Back to Home page", function() {
            cy.visit(login_url);
            cy.wait(3000)
        });



 });


=======
    });

>>>>>>> 91030333d0af202c24b6bafe418feb2fd4bba666
