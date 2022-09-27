const invalid_emails = ["andrej@qa", "andrej.qa", "andrej@majl.234"];
const login_url = Cypress.env("baseUrl");
const valid_password = Cypress.env("login_password");
const valid_email = Cypress.env("login_email");
let url = Cypress.config().baseUrl;



describe("Councilbox login - valid username and password", function() {

     before(function() {
        
    });


    it("Visits the Councilbox web page", function() {
        cy.visit(url);
        cy.visit(url);
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


describe("The user is able to add a new document in the 'Base de conocimiento' section", function() {


     it("From the menu choose and click on the 'Base de conocimiento' button", function() {
        
        cy.get('#edit-drafts-block').click()

    });


    it("Click on the 'Mi documentacion' button", function() {
        cy.get('#company-documents-drowpdown').click()

    });

    it("From the drop down menu click on the 'Subir archivo' button", function() {

        cy.get('#company-documents-drowpdown')
        

    });



    it("Choose the file you want to upload click on it and then click on 'Open' button", function() {

        const docFile = 'testDocument.txt';
        cy.get('#company-document-upload-file').attachFile(docFile)
        
    });

    it("Back to Home page", function() {
            cy.visit(url);
            
        });




   

    });


describe("The user is able to create a new template in the 'Base de conocimiento' section", function() {

    it("From the menu choose and click on the 'Base de conocimiento' button", function() {
        cy.get('#edit-drafts-block').click()

    });


    it("Click on the 'Plantillas' button", function() {
        cy.get('#tab-1').click()

    });

    it("Click on the 'Nueva plantilla' button", function() {
        cy.get('#draft-create-button').click()
    });


    it("Populate “Titulo” field", function() {
        cy.get('#draft-editor-title').clear()
            .type('TestAutomation'+Cypress.config('UniqueNumber'))    
            
          
    });

    it("Click on the 'Guardar' button", function() {
        cy.get('#draft-editor-save').click()
       
          
    });

    it("Back to Home page", function() {
            cy.visit(url);
          
        });



    
});



describe("The user is able to add new tag in the 'Base de conocimiento' section", function() {

    it("From the menu choose and click on the 'Base de conocimiento' button", function() {
        cy.get('#edit-drafts-block').click()

    });


    it("Click on the 'Tags' button", function() {
        cy.get('#tab-2').click()

    });

    it("Click on the 'Anadir' button", function() {
        cy.get('#company-tag-add-button').click()
      
    });


    it("Populate “Clave” field", function() {
        cy.get('#company-tag-key').clear()
            .type('TestAutomation'+Cypress.config('UniqueNumber'))    
            
          
    });

    it("Populate “Valor” field", function() {
        cy.get('#company-tag-value').clear()
            .type('TestAutomation'+Cypress.config('UniqueNumber'))    
            
          
    });

    it("Populate “Descripcion” field", function() {
     
         cy.get('#company-tag-description').clear()
            .type('TestAutomation')  
            
          
    });

    it("Click on the 'Aceptar' button", function() {
        cy.get('#alert-confirm-button-accept').click()
          
    });

    it("Back to Home page", function() {
            cy.visit(url);
           
        });



    
});
