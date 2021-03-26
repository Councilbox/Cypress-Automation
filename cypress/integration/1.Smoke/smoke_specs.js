const invalid_emails = ["andrej@qa", "andrej.qa", "andrej@majl.234"];
const login_url = Cypress.env("baseUrl");
const valid_password = Cypress.env("login_password");
const valid_email = Cypress.env("login_email");


/*
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

*/



/*
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
      
    });

    
    it("Open the browser and enter the URL: https://app.councilbox.com/", function() {
       
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
        cy.wait(15000)
    })



    it("User should be registered successfully", function() {
        cy.contains('Alta de usuario')
    })

    

    it("Open email application and navigate to the activation email", function() {
       cy.visit('http://www.yopmail.com/en/')

       cy.wait(15000)
        cy.wait(15000)
       cy.get('#login').type("alem"+Cypress.config('UniqueNumber'))
       cy.get('.sbut').click()

       
   });

    it('GET', function(){

        cy.request({
            method:'GET',
            url:'http://email.notify-pre.councilbox.com',

        }).then(function(response){

            expect(response.body).have.property('url')
        })


        public String getLastMailContent(final String yopmailUserName) throws IOException{
        Response res = Jsoup.connect(new StringBuffer().append(YOPMAIL_BASE_URL).append("inbox.php?login=").append(yopmailUserName.toLowerCase().replaceAll("@yopmail.com", "")).append("&p=1").append("&d=&ctrl=&scrl=&spam=true&yf=HZwD0ZGH5AwLlAGpjBGt0Aj&yp=YZGD0BQt3AGLjBGL4ZmNkBN&yj=RZGHjZmLlAwNkAmtmZGV4BN&v=2.6&r_c=&id=").toString())
                .userAgent(MOBILE_USER_AGENT)
                .method(Method.GET)
                .execute();
        
        final Elements elements = Jsoup.parse(res.body()).getElementsByClass("lm_m");
        res = Jsoup.connect(new StringBuffer().append(YOPMAIL_BASE_URL).append(elements.get(0).attr("href")).toString())
                .userAgent(MOBILE_USER_AGENT)
                .cookies(res.cookies())
                .method(Method.GET)
                .execute();
        
        return Jsoup.parse(res.body()).getElementById("mailmillieu").text();
    }
}


    


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
       cy.wait(20000)

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


     it("Populate all required fields", function() {

    cy.get('input').eq(0).type('test12345')
    cy.get('input').eq(1).type('test12345')

});


      it("Click on 'Change Password'", function() {

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


    it("Click on the 'Con sesion' button", function() {
        cy.contains('Con sesión').click()

        cy.wait(10000)

       

    });

    it("Populate all required fields and click on the 'Siguiente' button", function() {
        cy.xpath('(//*[@class="ql-editor ql-blank" ])[1]').type('Test')
       

        cy.get('#botonSiguienteNuevasReunionesAbajo').click()
    });


    it("Click on the 'Anadir participante' button and populate all required fields then click on the 'Siguiente' button", function() {
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
          
          
    });

  

    it("Click on the 'Aceptar' button", function() {
        cy.contains('Aceptar').click()
        cy.get('#censoSiguienteNew').click()
          
    });


    it("Click on the 'Anadir punto al orden del dia+'' button", function() {
        cy.get('#newPuntoDelDiaOrdenDelDiaNew').click()
          
    });




     it("Click on the 'Punto Si/no/ abstencion' button and populate all required fields and click on the 'Aceptar' button then click on the 'Siguiente' button", function() {
        cy.get('#puntoSiNoAbstencion').click()
        cy.get('#tituloPuntoDelDiaModal').type('Test')
        cy.contains('Aceptar').click()  
        cy.wait(1000)
        cy.get('#ordenDelDiaNext').click()
        cy.wait(1000)
        cy.get('#attachmentSiguienteNew').click()
        cy.wait(1000)
        cy.get('#optionsNewSiguiente').click()
        cy.wait(1000)
    });

/*

     it("Click on the 'Anadir+'' button then click on the 'Subir archivo button and select the document you want to add and click on the 'next' button", function() {
        cy.get('#puntoSiNoAbstencion').click()
        cy.get('#tituloPuntoDelDiaModal').type('Test')
        cy.contains('Aceptar').click()  
        cy.get('#ordenDelDiaNext').click()
    });

*/

it("Click on the 'Convocar y notificar' button", function() {
        cy.contains('Convocar y notificar').click()
        cy.wait(5000)


    
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
        cy.get('#date-time-picker-date-end').click()
        cy.contains('2021').click()
        cy.contains('2022').click()
        cy.contains('Aceptar').click()
        cy.get('#date-time-picker-date-start').click()
        cy.wait(1000)
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

    it("User should be able to exit the meeting", function() {

        cy.visit(login_url)
/*
         cy.get('#Your App: 'councilbox-client'').then($iframe => {
  const $body = $iframe.contents().find('body') ; cy.wrap($body)


    cy.get('#exit-live-room-button').click()
        cy.wait(1000)

   
})
        
        
        cy.contains('Aceptar').click()
        cy.wait(1000)
        
   */     
    
    });

     

 });



describe("The user is able to open point in the 'New call with session' section", function() {

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




        it("User should be able to exit the meeting", function() {

        cy.visit(login_url)

    });




 });




describe("The user is able to activate ratings in the 'New call with session'", function() {

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



    it("User should be able to exit the meeting", function() {

        cy.visit(login_url)

    });







 });




describe("The user is able to close point votations in the 'New call with session' type of meeting'", function() {

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




    it("User should be able to exit the meeting", function() {

        cy.visit(login_url)

    });






 });



describe("The user is able to close point in the 'New call with session' type of meeting'", function() {

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



    it("User should be able to exit the meeting", function() {

        cy.visit(login_url)

    });




 });







describe("The user is able to finish council in the 'New call with session' type of meeting", function() {

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


 });




describe("The user is able to finalize and approve act in the 'New call with session' type of meeting", function() {

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





describe("The user is able to start conference", function() {

    it("Click on the 'Iniciar conferencia' button", function() {
        cy.contains('dashboard').click({ force: true })
        cy.get('#init-meeting-block').click()
        cy.wait(10000)

    });


    it("Populate required field and click on the 'Join' button", function() {

        cy.get('#meeting-iframe').then($iframe => {
  const $body = $iframe.contents().find('body') ; cy.wrap($body)


    cy.get('#participant-name-input').type('AutomationTest')
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

  */  


