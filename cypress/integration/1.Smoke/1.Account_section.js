import loginPage from "../pageObjects/loginPage";

const invalid_emails = ["andrej@qa", "andrej.qa", "andrej@majl.234"];
const login_url = Cypress.env("baseUrl");
const valid_password = Cypress.env("login_password");
const valid_email = Cypress.env("login_email");


let login = new loginPage()

describe("The user is able to create a new account in Councilbox", function() {

    before(function() {
      
    });
    
    it("Open the browser and enter the URL: https://app.councilbox.com/", function() {       
        cy.visit(login_url);
        cy.wait(5000);
    });

    it("Change language to Spanish", function() {
        login.click_on_language_dropmenu()
        cy.get('#language-es').click();
    });

    it("Click on the 'Registarse' button", function() {
        cy.get("#sign-up-button").click();
    });

    it("Populate all required fields", function() {
        cy.get('#signup-name').clear()
            .type("Automation")
            .should("have.value", "Automation")
        cy.get('#signup-surname').clear()
            .type("Test")
            .should("have.value", "Test")
        cy.get('#signup-phone').clear()
            .type("123123123")
            .should("have.value", "123123123")
        cy.get('#signup-email').clear()
            .type("alem"+Cypress.config('UniqueNumber')+"@yopmail.com")            
        cy.get('#signup-email-check').clear()
            .type("alem"+Cypress.config('UniqueNumber')+"@yopmail.com")
        cy.get('#signup-password').clear()
            .type("Test12345")
        cy.get('#signup-password-check').clear()
            .type("Test12345")    
    });

    it("Click on the checkbox button to accept the 'términos y condiciones de councilbox'", function() {
        cy.get('#accept-legal-checkbox').click();
    });

    it("Click on the 'Enviar button'", function() {
        cy.get('#create-user-button').click();
    });

    it("User should be registered successfully", function() {
        cy.xpath('//*[@id="root"]/div[1]/div/div/div[1]/div/div[2]/div/div[1]/div[2]/div')
            .should('be.visible')
        cy.wait(1000)
    });

    it("Open email application and navigate to the activation email", function() {
        
       /*
       cy.visit('http://www.yopmail.com/en/')    
       cy.get('#login').clear()
       		.type("alem"+Cypress.config('UniqueNumber'))
       cy.get('.sbut').click()   
       */    
   });
/*
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

*/
    


});




describe("Councilbox login - valid username and password", function() {

    it("Visits the Councilbox web page", function() {
        cy.clearLocalStorage();
        cy.saveLocalStorage();
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
            .type('Mostar123!test')    
            .should("have.value", 'Mostar123!test')
    });

    it("Clicks login button", function() {
        cy.get("#login-button").click();
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
        cy.get('#restore-password-link').click()
    });

    it("Enter your Email and click on the 'Restablecer acceso' button", function() {
        cy.get('#restore-password-email-input').clear()
        	.type('alemtestqa12@yopmail.com')
        cy.get('#restore-password-button').click()
    });

    it("Open your email application", function() {
       cy.visit('http://www.yopmail.com/en/')

});

    /*
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

*/
it("Back to Home page", function() {
            cy.visit(login_url);
        });    
});

