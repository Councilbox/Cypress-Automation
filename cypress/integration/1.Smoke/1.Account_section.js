import loginPage from "../pageObjects/loginPage";

const invalid_emails = ["andrej@qa", "andrej.qa", "andrej@majl.234"];
const login_url = Cypress.env("baseUrl");
const valid_password = Cypress.env("login_password");
const valid_email = Cypress.env("login_email");

let login = new loginPage();

describe("Account section", function() {
	before(function() {});

	it("The user is able to create a new account in Councilbox", function() {
		const name = "Automation";
		const surname = "Test";
		const phone = "123123123";
		const email = "alem" + Cypress.config("UniqueNumber") + "@yopmail.com";
		const password = "Test12345";

		cy.clearLocalStorage();

		cy.log(
			"Open the browser and enter the URL: https://app.councilbox.com/"
		);
		cy.visit(login_url);
		cy.wait(5000);

		cy.log("Change language to Spanish");
		login.click_on_language_dropmenu();
		login.select_spanish_language();

		cy.log("Click on the 'Registarse' button");
		cy.get("#sign-up-button").click();

		cy.log("Populate all required fields");
		login.enter_signup_name(name);
		login.enter_signup_surname(surname);
		login.enter_signup_phone(phone);
		login.enter_signup_email_and_confirm_it(email);
		login.enter_signup_password(password);
		login.enter_signup_password_confirm(password);

		cy.log(
			"Click on the checkbox button to accept the 'términos y condiciones de councilbox'"
		);
		cy.get("#accept-legal-checkbox").click();

		cy.log("Click on the 'Enviar button'");
		cy.get("#create-user-button").click();

		cy.log("User should be registered successfully");
		cy.get("#signup-back-button").should("be.visible");

		cy.log("Open email application and navigate to the activation email");
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
		cy.get("#language-selector").click();
		cy.get("#language-es").click();
	});

	it("Enters email address", function() {
		cy.get("#username")
			.clear()
			.type("alem@qaengineers.net")
			.should("have.value", "alem@qaengineers.net");
	});

	it("Enters password", function() {
		cy.get("#password")
			.clear()
			.type("Mostar123!test")
			.should("have.value", "Mostar123!test");
	});

	it("Clicks login button", function() {
		cy.get("#login-button").click();
	});
});

describe("Log Out", function() {
	it("Opens dropdown in upper right corner", function() {
		cy.get("#user-menu-trigger").click();
	});
	it("Clicks logout", function() {
		cy.get("#user-menu-logout").click();
	});

	it("User successfully redirected to login page", function() {
		cy.url().should("include", login_url);
	});
});

describe("The user is able to restore a password", function() {
	it("Click on the 'Olvide mi contrasena?'' button", function() {
		cy.get("#restore-password-link").click();
	});

	it("Enter your Email and click on the 'Restablecer acceso' button", function() {
		cy.get("#restore-password-email-input")
			.clear()
			.type("alemtestqa12@yopmail.com");
		cy.get("#restore-password-button").click();
	});

	it("Open your email application", function() {
		cy.visit("http://www.yopmail.com/en/");
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
