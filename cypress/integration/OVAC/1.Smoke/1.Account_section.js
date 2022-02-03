const ovac_admin_url = Cypress.env("ovacAdminUrl");
const ovac_url = Cypress.env("ovacUrl");

const emailAlem = "alem@qaengineers.net";
const emailTest = "5ebc694c-dd33-4b25-883a-33c7da04304d@mailslurp.com";
const password = "Mostar123!";

describe("The user is able to log in to the page - Account section", function() {

    before(function() {
      
    });
    
    it("The user is able to open the browser and enter the URL: ", function() {       

    	cy.visit(ovac_admin_url)
        
    });

    it("The user is able to enter the email address", function() {     

    	cy.get('#username').type(emailTest).should(emailTest)  
        
    });

    it("The user is able to enter the password", function() {    

    	cy.get('#password').type(password).should('have.value', password)
        
    });

    it("The user is able to click on the Log in button", function() {  

    	cy.get('#login-button').click()     
        
    });

    it("The user is successfully logged in", function() {  

    	cy.url().should('include', '/company/')
        
    });

})


describe("The user is able to log out from the page - Account section", function() {


    it("The user is successfully logged in", function() {  

    	cy.url().should('include', '/company/')
        
    });

    it("The user is able to click on the Account icon", function() {  

    	cy.get('#user-menu-trigger').click()
        
    });

    it("The user is able to click on the Log out button", function() {  

    	cy.get('#user-menu-logout').click()
        
    });

    it("User is logged out successfully", function() {  

    	cy.url().should('include', '/admin')
        
    });



})





