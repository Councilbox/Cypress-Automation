import loginPage from "./pageObjects/loginPage"
import adminDashboard from "./pageObjects/adminDashboardPage"

let login = new loginPage();
let dashboard = new adminDashboard()



describe("The user is able to log in to the page - Account section", function() {
    before(function() {
        cy.clearLocalStorage();  
    });
    const email = "alem@qaengineers.net"
    const password = "Mostar123!"
    it("The user is able to open the browser and enter the URL: ", function() {       
    	login.navigate_admin()        
    });

    it("The user is able to enter the email address", function() {     
    	login.enter_email(email)       
    });

    it("The user is able to enter the password", function() {    
    	login.enter_password(password)       
    });

    it("The user is able to click on the Log in button", function() {  
    	login.login_submit()       
    });

    it("The user is successfully logged in", function() {  
    	login.confirm_login()    
    });
})

describe("The user is able to log out from the page - Account section", function() {

    it("The user is successfully logged in", function() {  
    	login.confirm_login()       
    });

    it("The user is able to click on the Account icon", function() {  
       	dashboard.click_user_icon()       
    });

    it("The user is able to click on the Log out button", function() {  
    	dashboard.click_logout()       
    });

    it("User is logged out successfully", function() {  
    	dashboard.confirm_logout()   
    });
})





