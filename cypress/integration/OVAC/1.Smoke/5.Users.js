import loginPage from "./pageObjects/loginPage"
import requestAppointment from "./pageObjects/requestAppointment"
import adminDashboard from "./pageObjects/adminDashboardPage"
import appointmentsPage from "./pageObjects/appointmentsPage"
import knowledgeBasePage from "./pageObjects/knowledgeBasePage"
import usersPage from "./pageObjects/usersPage"


let inboxId;
let login = new loginPage();
let appointment = new requestAppointment()
let dashboard = new adminDashboard()
let appoinments = new appointmentsPage()
let knowledgeBase = new knowledgeBasePage()
let users = new usersPage()


describe("The user is able to navigate and login to the page", function() {
	before(function() {    
		cy.clearLocalStorage();
    });

	it("Open admin URL and login", function() {
		login.navigateAdmin()
		login.enterEmailValid()
        login.enterPasswordValid()
        login.loginSubmit()  
        login.confirmLogin() 
	})	
})


describe("Admin is able to create new user with 'English' language in the Users form", function() {
     
    it("The user is able to click on the 'Users' button", function() {

    	dashboard.usersButton()
		
	})

	it("The user is able to click on the 'Add' button", function() {

		users.addUser()
	})

	it("The user is able to populate all required fields and set language to 'English'", function() {

		users.enterName()
		users.enterSurname()
		users.enterEmail()
		users.changeLanguageEnglish()
	})

	it("The user is able to click on the 'Save' button", function() {

		users.saveUser()
	})
    

})