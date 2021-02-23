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

/*

describe("Councilbox login - valid username and password", function() {

     before(function() {
        cy.deleteLocalStorage();
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



describe("The user is able to start conference", function() {

    it("Click on the 'Iniciar conferencia' button", function() {
        cy.contains('dashboard').click({ force: true })
        cy.get('#init-meeting-block').click()
        cy.wait(10000)

    });


    it("Populate required field and click on the 'Join' button", function() {

        cy.get('#meeting-iframe').then($iframe => {
  const $body = $iframe.contents().find('body');  cy.wrap($body)

    .get('#participant-name-input')
    .type('AutomationTest')
    cy.contains('Join').click()
    cy.wait(10000)

   
});

        });

    });

    */


describe("The user is able to create a new account in Councilbox", function() {
    before(function() {
        cy.deleteLocalStorage();
    });

    
    it("Open the browser and enter the URL: https://app.councilbox.com/", function() {
        cy.clearLocalStorage();
        cy.saveLocalStorage();
        cy.visit(login_url);
        cy.wait(5000);
    });

    it("Change language to Spanish", function() {
        cy.contains('EN').click();
        cy.contains('ES').click();
    });

    it("Click on the 'Registarse' button", function() {
        cy.contains("Registrarse").click();
    });

    it("Populate all required fields", function() {
        cy.get('input').eq(0)
            .type("Automation")
            .should("have.value", "Automation")

        cy.get('input').eq(1)
            .type("Test")
            .should("have.value", "Test")

        cy.get('input').eq(2)
            .type("123123123")
            .should("have.value", "123123123")

        cy.get('input').eq(4)
            .type("alem"+Cypress.config('UniqueNumber')+"@yopmail.com")
            

        cy.get('input').eq(5)
            .type("alem"+Cypress.config('UniqueNumber')+"@yopmail.com")
            

        cy.get('input').eq(6)
            .type("Test12345")

        cy.get('input').eq(7)
            .type("Test12345")    
    });

    it("Click on the checkbox button to accept the 'términos y condiciones de councilbox'", function() {
        cy.contains('He leído y acepto los ').click();
    });

    it("Click on the 'Enviar button'", function() {
        cy.contains('Enviar').click();

    })

    it("User should be registered successfully", function() {
        cy.contains('Alta de usuario')
    })

    

    it("Open email application and navigate to the activation email", function() {
       cy.visit('http://www.yopmail.com/en/')

       cy.get('#login').type("alem"+Cypress.config('UniqueNumber'))
       cy.get('.sbut').click()


    
       
       cy.get('#ifmail').then($iframe => {
  const $body = $iframe.contents().find('body') ; cy.wrap($body)


    .contains('Verificar cuenta')
    .click()

    cy.wait(3000)
})

       
   });


});




describe("Councilbox login - valid username and password", function() {


    it("Visits the Councilbox web page", function() {
        cy.clearLocalStorage();
        cy.saveLocalStorage();
        cy.visit(login_url);
        cy.wait(3000)
    });

    it("Change language to Spanish", function() {
        cy.contains('EN').click();
        cy.contains('ES').click();
    });

    it("Enters email address", function() {
        cy.get('input').eq(0)
            .type('alemtestqa11@yopmail.com')    
            .should("have.value", 'alemtestqa11@yopmail.com')
    });

    it("Enters password", function() {
        cy.get('input').eq(1)
            .type('test1234')    
            .should("have.value", 'test1234')
    });

    it("Clicks login button", function() {
        cy.contains("Entrar").click();
        cy.wait(3000)
    });

});


describe("The user is able to add company in the Councilbox", function() {


    it("From the dashboard click on the 'Anadir sociedad' button", function() {
        cy.contains('Añadir sociedad').click()
    });

    /*

    it("Click on the 'Prueba Gratida' button", function() {
        cy.contains('Prueba gratuita').click()
    });

    it("Click on the “Cerrar” button then click on the “Anadir sociedad” button", function() {
        cy.contains('Cerrar').click()
        cy.contains('Añadir sociedad').click()
    });

    */

    

    it("Populate “Razón social*” field", function() {
        cy.get('input').eq(0).type('Test')
    });

    it("Populate “CIF de la entidad*” field", function() {
        cy.get('input').eq(2).type(Cypress.config('UniqueNumber'))
    });

    it("Populate “Dominio” field", function() {
        cy.get('input').eq(3).type('Test')
    });

    it("Populate “Clave maestra” field", function() {
        cy.get('input').eq(4).type('Test')
    });

    it("Populate “Identificador externo” field", function() {
        cy.get('input').eq(5).type(Cypress.config('UniqueNumber'))
    });

    it("Scroll down the page and populate “Dirección” field", function() {
        cy.get('input').eq(7).type('Test')
    });

    it("Populate “Localidad” field", function() {
        cy.get('input').eq(8).type('Test')
    });

    it("Select the “Pais”", function() {
        cy.contains('España').click()
        cy.contains('Portugal').click()
    });

    it("Select the “Provincia”", function() {
        cy.xpath('(//*[@class="jss1178 jss1179 jss1172"])[3]').click()
        cy.wait(3000)
        cy.contains('Coimbra').click()
    });

    
    it("Populate “Código Postal” field", function() {
        cy.get('input').eq(11).type(Cypress.config('UniqueNumber'))
    });

    it("Populate “Código afiliación”", function() {
        cy.get('input').eq(13).type('Test')
    });
   
});





describe("Log Out", function() {
    it("Opens dropdown in upper right corner", function() {
        cy.get('#user-menu-trigger').click()
    });
    it("Clicks logout", function() {
        cy.get('#user-menu-logout').click()
    });

    it("User successfully redirected to login page", function() {
        cy.url().should("include", login_url);
    });
});


describe("The user is able to restore a password", function() {

    it("Click on the 'Olvide mi contrasena?'' button", function() {
        cy.contains('Olvidé mi contraseña').click()
    });

    it("Enter your Email and click on the 'Restablecer acceso' button", function() {
        cy.get('input').eq(0).type('alemtestqa12@yopmail.com')
        cy.contains('Restablecer acceso').click()
    });

    it("Open your email application", function() {
       cy.visit('http://www.yopmail.com/en/')
       cy.wai(15000)

});
     it("Open 'Restablecer contrasena' email and click on the 'Restablecer contrasena' button", function() {
    
       cy.get('#login').type('alemtestqa12')
       cy.get('.sbut').click()


    
       
       cy.get('#ifmail').then($iframe => {
  const $body = $iframe.contents().find('body') ; cy.wrap($body)


    .contains('Restablecer contraseña')
    .click()

    cy.wait(3000)
})

       
   });


     describe(" Populate all required fields", function() {

    cy.get('input').eq(0).type('test12345')
    cy.get('input').eq(1).type('test12345')

});


      describe("Click on 'Change Password'", function() {

    cy.contains('Change password').click()

});




    
});



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



describe("The user is able to Link company", function() {

    it("From the dashboard click on the 'Vincular sociedad' button", function() {
        cy.get('#entidadesSideBar').click()
        cy.contains('Vincular sociedad').click()
});

    it("Populate “CIF de la entidad*” field", function() {
        cy.get('input').eq(0)
            .type('edittest17022021')    
            .should("have.value", 'edittest17022021')
    });

    it("Populate “Clave maestra*” field", function() {
        cy.get('input').eq(1)
            .type('Regressiontest17022021')    
            .should("have.value", 'Regressiontest17022021')
    });


    it("Click on the 'Vincular' button", function() {
        cy.contains('Vincular').click({ force: true})
    });


});




describe("The user is able to add a new type of meeting in the 'Tipos de reunion' section", function() {

    it("From the menu choose and click on the 'Tipos de reunion' button", function() {
        cy.contains('dashboard').click({ force: true })
        cy.get('#edit-statutes-block').click()

    });


    it("On the upper left corner click on the 'Anadir tipo de reunion+'' button", function() {
        cy.contains('Añadir tipo de reunión').click()

    });

    it("Populate required field and click on the 'Aceptar' button", function() {
        cy.get('#anadirTipoDeReunionInputEnModal').type('Test'+Cypress.config('UniqueNumber'))
        cy.contains('Aceptar').click()
    });

});






describe("The user is able to add a partner in the 'Libro de socios' section", function() {

    it("From the menu choose and click on the 'Libro de socios' button", function() {
        cy.contains('dashboard').click({ force: true })
        cy.get('#edit-company-block').click()

    });


    it("Click on the 'Anadir socio' form", function() {
        cy.get('#anadirSocioLibroSocios').click()
        cy.wait(1000)

    });

    it("Populate “Nombre” field", function() {

        cy.get('#anadirSocioNombre').type('Test'+Cypress.config('UniqueNumber'))
    
    });

    it("Populate “Apelidos” field", function() {

        cy.get('#anadirSocioApellido').type('Test'+Cypress.config('UniqueNumber'))
    
    });


    it("Populate “DNI/NIF” field", function() {

        cy.get('#anadirSocioDni').type('Test'+Cypress.config('UniqueNumber'))
    
    });

    it("Populate “Nacionalidad” field", function() {

        cy.get('#anadirSocioNAcionalidad').type('Test'+Cypress.config('UniqueNumber'))
    
    });

    it("Populate “Email” field", function() {

        cy.get('#anadirSocioMail').type('automationTest@test.com')
    
    });

    it("Populate “Telefono” field", function() {

        cy.get('#anadirSocioTelefono').type(Cypress.config('UniqueNumber'))
    
    });


    it("Populate “Telefono Fijo” field", function() {

        cy.get('#anadirSocioFijo').type(Cypress.config('UniqueNumber'))
    
    });

    it("Populate “TIpo de Socio” field", function() {

        cy.get('#anadirSocioTipoSocio').type('test'+Cypress.config('UniqueNumber'))
    
    });

    it("Select the “Estado”", function() {

        cy.contains('Alta').click()
        cy.contains('Baja').click()
    
    });

    

    it("Select “Votos”", function() {

        cy.get('#add-partner-votes')
            .type('5')    
            
    
    });



    it("Select “Participaciones”", function() {

        cy.get('#add-partner-social-capital')
            .type('5')
    
    });

    

    it("Navigate to the “Ficha” section and populate “Nº de acta de alta” field", function() {

        cy.get('#anadirSocioActaAlta').type(Cypress.config('UniqueNumber'))
    
    });

    it("Populate “Nº de acta de baja” field", function() {

        cy.get('#anadirSocioActaBaja').type(Cypress.config('UniqueNumber'))
    
    });


    it("Select “Fecha de apertura de ficha”", function() {

        cy.get('#anadirSocioAperturaFicha').click()
        cy.contains('Ok').click()
       
    
    });


    it("Select “Fecha de alta”", function() {

        cy.get('#anadirSocioFechaAlta').click()
        cy.contains('Ok').click()
       
    
    });


    it("Select “Acta de alta”", function() {

        cy.get('#anadirSocioFechaActaAlta2').click()
        cy.contains('Ok').click()
       
    
    });


    it("Select “Fecha de baja”", function() {

        cy.get('#anadirSocioFechaActaBaja').click()
        cy.contains('Ok').click()
       
    
    });


    it("Select “Acta de baja”", function() {

        cy.get('#anadirSocioFechaActaBaja2').click()
        cy.contains('Ok').click()
       
    
    });


     it("Navigate to the “Datos adicionales” section and populate “Dirección” field", function() {

        cy.get('#anadirSocioDireccion').type('AutomationTest')
    
    });

     it("Populate “Localidad” field", function() {

        cy.get('#anadirSocioLocalidad').type('AutomationTest')
       
    
    });

      it("Select “Provincia”", function() {

        cy.get('#anadirSocioProvincia').type('Catalonia')
       
       
    
    });

      it("Populate “Codigo Postal” field", function() {

        cy.get('#anadirSocioCP').type(Cypress.config('UniqueNumber'))
       
    
    });


      it("Select “Idioma”", function() {

        cy.contains('Español').click()
        cy.wait(1000)
        cy.contains('English').click({force : true})
       
    
    });

       it("Click on the 'Guardar cambios' button", function() {

        cy.get('#guardarAnadirSocio').click()
        cy.wait(3000)
       
    
    });
 

});








describe("The user is able to add census in the 'Censos' section [tipo Assistentes]", function() {

    it("From the menu choose and click on the 'Censos' button", function() {
        cy.contains('dashboard').click({ force: true })
        cy.wait(3000)
        cy.get('#edit-censuses-block').click()
        cy.wait(3000)

    });


    it("Click on 'Anadir censo+' button", function() {
        cy.contains('Añadir censo').click()

    });

    it("Populate “Nombre” field", function() {
        cy.get('input').eq(2)
            .type('AutomationTest'+Cypress.config('UniqueNumber'))    
            .should("have.value", 'AutomationTest'+Cypress.config('UniqueNumber'))
    });


    it("“Select the “Assistentes” tipo de census", function() {
        cy.contains('Asistentes').click()
        cy.wait(2000)
        cy.contains('Participaciones').click()

    });

    it("Populate “Descripcion” field", function() {
        cy.get('input').eq(4)
            .type('TestAutomation')    
            .should("have.value", 'TestAutomation')
    });

    it("Click on the 'Aceptar' button", function() {
        cy.contains('Aceptar').click()
    });



    
});


describe("The user is able to add a new document in the 'Base de conocimiento' section", function() {


     it("From the menu choose and click on the 'Base de conocimiento' button", function() {
        cy.contains('dashboard').click({ force: true })
        cy.get('#edit-drafts-block').click()

    });


    it("Click on the 'Mi documentacion' button", function() {
        cy.contains('Mi documentación').click()

    });

    it("From the drop down menu click on the 'Subir archivo' button", function() {
        
        const docFile = 'testDocument.txt';
        cy.contains('Subir archivo').attachFile(docFile)

    });



    it("Choose the file you want to upload click on it and then click on 'Open' button", function() {
        
    });




   

    });


describe("The user is able to create a new template in the 'Base de conocimiento' section", function() {

    it("From the menu choose and click on the 'Base de conocimiento' button", function() {
        cy.contains('dashboard').click({ force: true })
        cy.get('#edit-drafts-block').click()

    });


    it("Click on the 'Plantillas' button", function() {
        cy.contains('Plantillas').click()

    });

    it("Click on the 'Nueva plantilla' button", function() {
        cy.get('#newDraft').click()
    });


    it("Populate “Titulo” field", function() {
        cy.get('#titleDraft')
            .type('TestAutomation'+Cypress.config('UniqueNumber'))    
            
          
    });

    it("Click on the 'Guardar' button", function() {
        cy.get('#saveDraft').click()
        cy.wait(5000)
          
    });



    
});



describe("The user is able to add new tag in the 'Base de conocimiento' section", function() {

    it("From the menu choose and click on the 'Base de conocimiento' button", function() {
        cy.contains('dashboard').click({ force: true })
        cy.get('#edit-drafts-block').click()

    });


    it("Click on the 'Tags' button", function() {
        cy.contains('<Tags>').click()

    });

    it("Click on the 'Anadir' button", function() {
        cy.get('#idAddEtiqueta').click()
        cy.wait(3000)
    });


    it("Populate “Clave” field", function() {
        cy.get('input').eq(1)
            .type('TestAutomation'+Cypress.config('UniqueNumber'))    
            
          
    });

    it("Populate “Valor” field", function() {
        cy.get('input').eq(2)
            .type('TestAutomation'+Cypress.config('UniqueNumber'))    
            
          
    });

    it("Populate “Descripcion” field", function() {
     
         cy.get('input').eq(3)
            .type('TestAutomation')  
            
          
    });

    it("Click on the 'Aceptar' button", function() {
        cy.contains('Aceptar').click()
          
    });



    
});




describe("The user is able to create a new call with session in the 'Nueva reunion' section", function() {

    it("Click on the 'Nueva reunion' button", function() {
        cy.contains('dashboard').click({ force: true })
        cy.get('#create-council-block').click()

    });


    it("Click on the 'Con sesion' button and populate all required fields then click on the 'Aceptar' button", function() {
        cy.contains('Con sesión').click()
        cy.wait(10000)

    });

    it("Populate all required fields and click on the 'Siguiente' button", function() {
        cy.xpath('(//*[@class="ql-editor ql-blank" ])[1]').type('AutomationTest'+Cypress.config('UniqueNumber'))
        cy.wait(1000)
        cy.get('#botonSiguienteNuevasReunionesAbajo').click()
    });


    it("Click on the 'Anadir participante' button and populate all required fields then click on the 'Siguiente' button", function() {
        cy.get('#anadirParticipanteEnCensoNewReunio').click()
        cy.wait(1000)
        cy.get('input').eq(0)
            .type('TestAutomation'+Cypress.config('UniqueNumber'))    
            .should("have.value", 'TestAutomation'+Cypress.config('UniqueNumber'))
        cy.get('input').eq(1)
            .type('TestAutomation'+Cypress.config('UniqueNumber'))    
            .should("have.value", 'TestAutomation'+Cypress.config('UniqueNumber'))
        cy.get('input').eq(2)
            .type('TestAutomation'+Cypress.config('UniqueNumber'))    
            .should("have.value", 'TestAutomation'+Cypress.config('UniqueNumber'))
        cy.get('input').eq(3)
            .type('TestAutomation'+Cypress.config('UniqueNumber'))    
            .should("have.value", 'TestAutomation'+Cypress.config('UniqueNumber'))
        cy.get('input').eq(4)
            .type('TestAutomation'+Cypress.config('UniqueNumber'))    
            .should("have.value", 'TestAutomation'+Cypress.config('UniqueNumber'))
        cy.get('input').eq(5)
            .type('TestAutomation'+Cypress.config('UniqueNumber'))    
            .should("have.value", 'TestAutomation'+Cypress.config('UniqueNumber'))
        cy.get('input').eq(6)
            .type('TestAutomation'+Cypress.config('UniqueNumber'))    
            .should("have.value", 'TestAutomation'+Cypress.config('UniqueNumber'))
          
    });

  

    it("Click on the 'Aceptar' button", function() {
        cy.contains('Aceptar').click()
          
    });



    
});


describe("The user is able to create a new call without session in the 'Nueva reunion' section", function() {

    it("Click on the 'Nueva reunion' button", function() {
        cy.contains('dashboard').click({ force: true })
        cy.get('#create-council-block').click()

    });


    it("Click on the 'Sin sesion' button and populate all required fields then click on the 'Aceptar' button", function() {
        cy.contains('Sin sesión').click()
        cy.wait(3000)
        cy.xpath('(//*[@class="material-icons jss4252 jss4253"])[1]').click()
        cy.contains('Ok').click()
        cy.xpath('(//*[@class="material-icons jss4252 jss4253"])[2]').click()
        cy.contains('Ok').click()


    });






    it("Click on the 'Aceptar' button", function() {
        cy.contains('Aceptar').click()
    });

    
});

describe("The user is able to start council in the 'New call with session' section", function() {

    it("Click on the 'Nueva reunion' button", function() {
        cy.contains('dashboard').click({ force: true })
        cy.get('#create-council-block').click()

    });


    it("Click on the “Con sesion” button", function() {
        cy.contains('Con sesión').click()
        cy.wait(3000)
    
    });


    it("Populate all required fields and click on the “Siguiente” button", function() {
        cy.get('input').eq(0).type('Test')
        cy.get('input').eq(1).type('Test')
        cy.get('input').eq(2).type('Test')
        cy.get('input').eq(3).type('Test')
        cy.get('input').eq(4).type('Test')
        cy.get('#botonSiguienteNuevasReunionesAbajo').click()
        cy.wait(1000)

    });


    it("Click on the 'Anadir participante' button and populate all required fields then click on the “Siguiente” button", function() {
        cy.get('#anadirParticipanteEnCensoNewReunion').click()
        cy.get('input').eq(0).type('Test')
        cy.get('input').eq(1).type('Automation')
        cy.get('input').eq(4).type('alem@qaengineers.net')
        cy.contains('Aceptar').click()
        cy.get('#botonSiguienteNuevasReunionesAbajo').click()
        cy.wait(1000)

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
        cy.get('#botonSiguienteNuevasReunionesAbajo').click()
        cy.wait(1000)
        

    });


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


     it("Populate all required fields and click on the “Siguiente” button", function() {
        
        cy.get('#botonSiguienteNuevasReunionesAbajo').click()
        cy.wait(1000)
        
        

    });


      it("Click on the “Convocar y notificar” button", function() {
        
        cy.contains('Convocar y notificar').click()
        
        

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
        
            cy.get('#ifmail').then($iframe => {
  const $body = $iframe.contents().find('body') ; cy.wrap($body)


    .contains('Accept')
    .click()

    cy.wait(10000)
})

       
   });


            it("Navigate to the upper right corner and click on the “Iniciar reunion” button", function() {
        
        cy.get('#iniciarReunionDentroDeReunion').click()
        
        
    
    });


             it("Populate all required fields and click on the “Aceptar” button", function() {
        
        cy.get('#iniciarReunionDentroDeReunion').click()
        cy.get('#seleccionaAlPresidenteEnReunion').click()
        cy.contains('test test').click()
        cy.get('#seleccionaAlSecretarioEnReunion').click()
        cy.contains('test test').click()
        cy.contains('Aceptar').click()
        
        
    
    });


        
    









    it("Click on the 'Aceptar' button", function() {
        cy.contains('Aceptar').click()
    });

    
});





describe("The user is able to start conference", function() {

    it("Click on the 'Iniciar conferencia' button", function() {
        cy.contains('dashboard').click({ force: true })
        cy.get('#init-meeting-block').click()
        cy.wait(10000)

    });


    it("Populate required field and click on the 'Join' button", function() {

        cy.get('#meeting-iframe').then($iframe => {
  const $body = $iframe.contents().find('body'); 
  cy.wrap($body)
    .get('#participant-name-input')
    .type('AutomationTest')
    cy.contains('Join').click()
    cy.wait(10000)
    
});

        });

    });


/*
describe("The user is able to create a new document signature in the 'Signatures' section", function() {

    it("On the left side of the page find the menu and click on the 'Firmas' button", function() {
        cy.contains('Firmas').click()

    });

     it("Click on the 'Nueva firma de documentos' button", function() {
        cy.contains('Nueva firma de documentos').click()

    });

     it("Populate all required fields", function() {
        cy.contains('Nueva firma de documentos').click()

    });

    

});


*/