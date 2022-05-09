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
            .type('Mostar123!')    
            .should("have.value", 'Mostar123!')
    });

    it("Clicks login button", function() {
        cy.get("#login-button").click();
    });

});


describe("The user is able to add a partner in the 'Libro de socios' section", function() {

    it("From the menu choose and click on the 'Libro de socios' button", function() {

        cy.get('#edit-company-block').click()

    });


    it("Click on the 'Anadir socio' form", function() {
        cy.get('#add-partner-button').click()

    });

    it("Populate “Nombre” field", function() {

        cy.get('#add-partner-name').type('Test'+Cypress.config('UniqueNumber'))
    
    });

    it("Populate “Apelidos” field", function() {

        cy.get('#add-partner-surname').type('Test'+Cypress.config('UniqueNumber'))
    
    });


    it("Populate “DNI/NIF” field", function() {

        cy.get('#add-partner-dni').type('Test'+Cypress.config('UniqueNumber'))
    
    });

    it("Populate “Nacionalidad” field", function() {

        cy.get('#add-partner-nationality').type('Test'+Cypress.config('UniqueNumber'))
    
    });

    it("Populate “Email” field", function() {

        cy.get('#add-partner-email').type('automationTest@test.com')
    
    });

    it("Populate “Telefono” field", function() {

        cy.get('#add-partner-phone').type(Cypress.config('UniqueNumber'))
    
    });


    it("Populate “Telefono Fijo” field", function() {

        cy.get('#add-partner-landline-phone').type(Cypress.config('UniqueNumber'))
    
    });

    it("Populate “TIpo de Socio” field", function() {

        cy.get('#add-partner-type').type('test'+Cypress.config('UniqueNumber'))
    
    });

    it("Select the “Estado”", function() {

        cy.get('#add-partner-state').click()
        cy.get('#add-partner-unsubscribed').click()
    
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

        cy.get('#add-partner-subscribe-number').type(Cypress.config('UniqueNumber'))
    
    });

    it("Populate “Nº de acta de baja” field", function() {

        cy.get('#add-partner-unsubscribe-number').type(Cypress.config('UniqueNumber'))
    
    });


    it("Select “Fecha de apertura de ficha”", function() {

        cy.get('#add-partner-open-date-icon').click()
        cy.get('#calendar-accept-button').click()
       
    
    });


    it("Select “Fecha de alta”", function() {

        cy.get('#add-partner-open-subscribe-icon').click()
        cy.get('#calendar-accept-button').click()
       
    
    });


    it("Select “Acta de alta”", function() {

        cy.get('#add-partner-open-subscribe-act-icon').click()
        cy.get('#calendar-accept-button').click()
       
    
    });


    it("Select “Fecha de baja”", function() {

        cy.get('#add-partner-open-unsubscribe-icon').click()
        cy.get('#calendar-accept-button').click()
       
    
    });


    it("Select “Acta de baja”", function() {

        cy.get('#add-partner-open-unsubscribe-act-icon').click()
        cy.get('#calendar-accept-button').click()
       
    
    });


     it("Navigate to the “Datos adicionales” section and populate “Dirección” field", function() {

        cy.get('#add-partner-address').type('AutomationTest')
    
    });

     it("Populate “Localidad” field", function() {

        cy.get('#add-partner-locality').type('AutomationTest')
       
    
    });

      it("Select “Provincia”", function() {

        cy.get('#add-partner-country_state').type('Catalonia')
       
       
    
    });

      it("Populate “Codigo Postal” field", function() {

        cy.get('#add-partner-zipcode').type(Cypress.config('UniqueNumber'))
       
    
    });


      it("Select “Idioma”", function() {

        cy.get('#add-partner-language-select').click()
        cy.get('#add-partner-language-select-en').click()
       
    
    });

       it("Click on the 'Guardar cambios' button", function() {

        cy.get('#guardarAnadirSocio').click()

       
    
    });



       it("Back to Home page", function() {
            cy.visit(login_url);

        });


 

});
