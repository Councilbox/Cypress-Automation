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


describe("Users tests", function() {
	before(function() {    
		cy.clearLocalStorage();
    });

	it("The user is able to navigate and login to the page", function() {
	const email = "alem+1@qaengineers.net"
	const password = "Mostar1234!test12"

	cy.log("Open admin URL and login")
		login.navigate_admin()
		login.enter_email(email)
        login.enter_password(password)
        login.login_submit() 
        login.confirm_login() 
	})	

    it("Admin is able to create new user with 'English' language in the Users form", function() {
	const phone = "600000666"
	const tin = "12345678Z"
	const name = "Automation"
	const surname = "Sur"+Cypress.config('UniqueNumber')
	const email = 'test'+Cypress.config('UniqueNumber')+'@test.com'
     
    cy.log("The user is able to click on the 'Users' button")
    	dashboard.click_on_users()
	cy.log("The user is able to click on the 'Add' button")
		users.click_add_user()
	cy.log("The user is able to populate all required fields and set language to 'English'")
		users.enter_name(name)
		users.enter_surname(surname)
		users.enter_phone(phone)
		users.enter_tin(tin)
		users.enter_email(email)
		users.change_language_english()
	cy.log("The user is able to click on the 'Continue' button")
		users.click_continue()
	cy.log("The user is able to click on the 'Finalize' button")
		users.click_on_finalize()
	})
    
})