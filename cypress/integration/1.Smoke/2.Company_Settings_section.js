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
        cy.wait(2000)
    });

});




describe("The user is able to add company in the Councilbox", function() {

    it("From the dashboard click on the 'Anadir sociedad' button", function() {
        cy.wait(5000)
        cy.get('#entidadesSideBar').click()
        cy.wait(1000)
        cy.get('#entidadesAddSociedad').click()
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
        cy.get('#company-name-input').clear()
            .type('Test')
    });

    it("Populate “CIF de la entidad*” field", function() {
        cy.get('#company-id-input').clear()
            .type(Cypress.config('UniqueNumber'))
    });

    it("Populate “Dominio” field", function() {
        cy.get('#company-domain-input').clear()
            .type('Test')
    });

    it("Populate “Clave maestra” field", function() {
        cy.get('#company-key-input').clear()
            .type('Test')
    });
/*
    it("Populate “Identificador externo” field", function() {
        cy.get('#company-external-id-input').clear()
            .type(Cypress.config('UniqueNumber'))
    });
*/

    it("Scroll down the page and populate “Dirección” field", function() {
        cy.get('#company-address-input').clear()
            .type('Test')
    });

    it("Populate “Localidad” field", function() {
        cy.get('#company-city-input').clear()
            .type('Test')
    });

    it("Select the “Pais”", function() {
        cy.get('#company-country-select').click()
        cy.get('#company-country-Portugal').click()
    });
 
    it("Populate “Código Postal” field", function() {
        cy.get('#company-zipcode-input').clear()
            .type(Cypress.config('UniqueNumber'))
    });

    it("Populate “Código afiliación”", function() {
        cy.get('#company-code-input').clear()
            .type('Test')
    });
   
});



describe("The user is able to Link company", function() {

    it("From the dashboard click on the 'Vincular sociedad' button", function() {
        cy.get('#entidadesSideBar').click()
        cy.get('#company-link-nav-button').click()
});

    it("Populate “CIF de la entidad*” field", function() {
        cy.get('#company-link-cif').clear()
            .type('automationtest')    
            .should("have.value", 'automationtest')
    });

    it("Populate “Clave maestra*” field", function() {
        cy.get('#company-link-key').clear()
            .type('automation')    
            .should("have.value", 'automation')
    });


    it("Click on the 'Vincular' button", function() {
        cy.get('#company-link-button').click()
            cy.wait(3000)
    });

    it("Back to Home page", function() {
            cy.visit(login_url);
            cy.wait(3000)
        });


});
