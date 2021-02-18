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
            .type("alemtestqa10@yopmail.com")
            .should("have.value", "alemtestqa10@yopmail.com")

        cy.get('input').eq(5)
            .type("alemtestqa10@yopmail.com")
            .should("have.value", "alemtestqa10@yopmail.com")

        cy.get('input').eq(6)
            .type("AutomationTest123")

        cy.get('input').eq(7)
            .type("AutomationTest123")    
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

       cy.get('#login').type('alemtestqa10')
       cy.get('.sbut').click()


    
       
       cy.get('#ifmail').then($iframe => {
  const $body = $iframe.contents().find('body') ; cy.wrap($body)
    .contains('Verify account')
    .click({ force: true })

    cy.wait(3000)
})

       
   });


});

describe("Council box login - no username or password added", function() {
    before(function() {
        cy.deleteLocalStorage();
        
    });

    it("Visits the councilbox web page", function() {
       
        cy.clearLocalStorage();
        cy.saveLocalStorage();
        cy.visit(login_url);
        cy.wait(2000)
        cy.contains("Sign in to Councilbox");
    });

    it("Clicks to enter button", function() {
        cy.contains("To enter").click();
    });

    it("Email and password required label shown", function() {
        cy.contains("This field is required");
    }); 

    it("User is not logged in", function() {
        cy.url().should("include", login_url);
    });
});

describe("Councilbox login - invalid username and valid password", function() {

    before(function() {
        cy.deleteLocalStorage();
    });

    it("Visits the Councilbox web page", function() {
        cy.clearLocalStorage();
        cy.saveLocalStorage();
        cy.visit(login_url);
        cy.wait(2000)
        cy.contains("Sign in to Councilbox");
    });

    it("Enters invalid email address", function() {
        cy.get('input').eq(0)
            .type("councilbox@mail.com")    
            .should("have.value", "councilbox@mail.com")
    });

    it("Enters password", function() {
        cy.get('input').eq(1)
            .type(valid_password)
            .should("have.value", valid_password)
    });

    it("Clicks login button", function() {
        cy.contains("To enter").click();
    });

    it("Email is not verified or does not exist label shown", function() {
        cy.contains("The email is not verified or does not exist.");
    });

    it("User is not logged in", function() {
        cy.url().should("include", login_url);
    });
});

describe("Councilbox login - valid username and invalid password", function() {
    it("Visits the Councilbox web page", function() {
        cy.visit(login_url);
    });

    it("Enters existing, valid email address", function() {
        cy.get('input').eq(0)
            .type(valid_email)    
            .should("have.value", valid_email)
    });

    it("Enters invalid password", function() {
        cy.get('input').eq(1)
            .type("WrongPassword")    
            .should("have.value", "WrongPassword")
    });

    it("Clicks login button", function() {
        cy.get('#login-button').click();
    });

    it("Password incorrect label shown", function() {
        cy.contains("Incorrect password");
    });

    it("User is not logged in", function() {
        cy.url().should("include", login_url);
    });
});








describe("Councilbox login - valid username and password", function() {

     before(function() {
        cy.deleteLocalStorage();
    });


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
        cy.get('#anadirTipoDeReunionInputEnModal').type('Test')
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

    });

    it("Populate “Nombre” field", function() {

        cy.get('#anadirSocioNombre').type('Test')
    
    });

    it("Populate “Apelidos” field", function() {

        cy.get('#anadirSocioApellido').type('Test')
    
    });

    it("Populate “Nombre” field", function() {

        cy.get('#anadirSocioNombre').type('Test')
    
    });

    it("Populate “DNI/NIF” field", function() {

        cy.get('#anadirSocioDni').type('Test')
    
    });

    it("Populate “Nacionalidad” field", function() {

        cy.get('#anadirSocioNAcionalidad').type('Test')
    
    });

    it("Populate “Email” field", function() {

        cy.get('#anadirSocioMail').type('automationTestPartnet@test.com')
    
    });

    it("Populate “Telefono” field", function() {

        cy.get('#anadirSocioTelefono').type(Cypress.config('UniqueNumber'))
    
    });

    it("Populate “DNI/NIF” field", function() {

        cy.get('#anadirSocioDni').type('Test')
    
    });

    it("Populate “Telefono Fijo” field", function() {

        cy.get('#anadirSocioFijo').type(Cypress.config('UniqueNumber'))
    
    });

    it("Populate “TIpo de Socio” field", function() {

        cy.get('#anadirSocioTipoSocio').type('test')
    
    });

    it("Select the “Estado”", function() {

        cy.contains('Alta').click()
        cy.contains('Baja').click()
    
    });

    it("Select “Votos”", function() {

        cy.xpath('(//*[@class="jss2050 jss2053"])[1]').type('1')
    
    });



    it("Select “Participaciones”", function() {

        cy.xpath('(//*[@class="jss2050 jss2053"])[2]').type('5')
    
    });

    it("Navigate to the “Ficha” section and populate “Nº de acta de alta” field", function() {

        cy.get('#anadirSocioActaAlta').type('12345')
    
    });

    it("Populate “Nº de acta de baja” field", function() {

        cy.get('#anadirSocioActaBaja').type('54321')
    
    });


    it("Select “Fecha de apertura de ficha”", function() {

        cy.xpath('(//*[@class="jss620"])[11]').click()
        cy.contains('Ok').click()
    
    });

 
    

});