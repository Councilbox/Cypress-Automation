import loginPage from "../pageObjects/loginPage"
import requestAppointment from "../pageObjects/requestAppointment"
import adminDashboard from "../pageObjects/adminDashboardPage"
import appointmentsPage from "../pageObjects/appointmentsPage"
import knowledgeBasePage from "../pageObjects/knowledgeBasePage"
import usersPage from "../pageObjects/usersPage"


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
	const email = "alem+1@qaengineers.net"
	const password = "Mostar123!"

	it("Open admin URL and login", function() {
		login.navigate_admin()
		login.enter_email(email)
        login.enter_password(password)
        login.login_submit() 
        login.confirm_login() 
	})	
})


describe("Admin is able to create new user with 'English' language in the Users form", function() {

	const phone = "600000666"
	const tin = "12345678Z"
	const name = "Automation"
	const surname = "Sur"+Cypress.config('UniqueNumber')
	const email = 'test'+Cypress.config('UniqueNumber')+'@test.com'
     
    it("The user is able to click on the 'Users' button", function() {

    	dashboard.click_on_users()
		
	})

	it("The user is able to click on the 'Add' button", function() {

		users.click_add_user()
	})

	it("The user is able to populate all required fields and set language to 'English'", function() {

		users.enter_name(name)
		users.enter_surname(surname)
		users.enter_phone(phone)
		users.enter_tin(tin)
		users.enter_email(email)
		users.change_language_english()
	})

	it("The user is able to click on the 'Continue' button", function() {

		users.click_continue()
	})

	it("The user is able to click on the 'Finalize' button", function() {
		users.click_on_finalize()
	})
    

})