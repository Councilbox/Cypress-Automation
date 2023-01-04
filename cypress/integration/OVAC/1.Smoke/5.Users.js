import loginPage from "../pageObjects/loginPage"
import adminDashboard from "../pageObjects/adminDashboardPage"
import usersPage from "../pageObjects/usersPage"
import entitiesPage from "../pageObjects/entitiesPage"

let url = Cypress.config().baseUrl;

import users from "/cypress/fixtures/OVAC/users.json"
import users_data from "/cypress/fixtures/OVAC/users_data.json"

Cypress.on('uncaught:exception', (err, runnable) => {
	return false;
  });

let login = new loginPage();
let dashboard = new adminDashboard()
let user = new usersPage()
let entit = new entitiesPage()

describe("Users tests", function() {
	before(function() {    
		cy.clearLocalStorage();
    });

	it("The user is able to navigate and login to the page", function() {
		cy.log("Open admin URL and login")
			cy.visit(url+'/admin')
			login.enter_email(users.email)
        	login.enter_password(users.password)
        	login.login_submit() 
        	login.confirm_login() 
		cy.log("Select OVAC Demo entity")
        	entit.click_on_entity()
        	entit.if_entity()
	})	

    it("Admin is able to create new user with 'English' language in the Users form", function() {
    	cy.log("The user is able to click on the 'Users' button")
    		dashboard.click_on_users()
		cy.log("The user is able to click on the 'Add' button")
			user.click_add_user()
		cy.log("The user is able to populate all required fields and set language to 'English'")
			user.enter_name(users_data.name)
			user.enter_surname(users_data.surname+Cypress.config('UniqueNumber'))
			user.enter_phone(users_data.phone)
			user.enter_tin(users_data.tin)
			user.enter_email(users_data.email+Cypress.config('UniqueNumber')+users_data.domain)
			user.change_language_english()
		cy.log("The user is able to click on the 'Continue' button")
			user.click_continue()
		cy.log("The user is able to click on the 'Finalize' button")
			user.click_on_finalize()
	})
    
})