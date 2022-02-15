import loginPage from "./pageObjects/loginPage"
import logoutPage from "./pageObjects/logoutPage"

let login = new loginPage();
let logout = new logoutPage();



describe("The user is able to log in to the page - Account section", function() {

    before(function() {
        cy.clearLocalStorage();
      
    });
    
    it("The user is able to open the browser and enter the URL: ", function() {       

    	login.navigateAdmin()
        
    });

    it("The user is able to enter the email address", function() {     

    	login.enterEmailValid()
        
    });

    it("The user is able to enter the password", function() {    

    	login.enterPasswordValid()
        
    });

    it("The user is able to click on the Log in button", function() {  

    	login.loginSubmit()    
        
    });

    it("The user is successfully logged in", function() {  

    	login.confirmLogin()
        
    });

})


describe("The user is able to log out from the page - Account section", function() {


    it("The user is successfully logged in", function() {  

    	login.confirmLogin()
        
    });

    it("The user is able to click on the Account icon", function() {  

    	logout.accountButton()
        
    });

    it("The user is able to click on the Log out button", function() {  

    	logout.logoutButton()
        
    });

    it("User is logged out successfully", function() {  

    	logout.logoutConfirm()
        
    });



})





