import loginPage from "../pageObjects/loginPage";
import requestAppointment from "../pageObjects/requestAppointment";
import appointmentsPage from "../pageObjects/appointmentsPage";
import adminDashboard from "../pageObjects/adminDashboardPage";
import userSettingsPage from "../pageObjects/userSettingsPage";
import entitiesPage from "../pageObjects/entitiesPage";
import knowledgeBasePage from "../pageObjects/knowledgeBasePage";
import tagsPage from "../pageObjects/tagsPage";
import templatesPage from "../pageObjects/templatesPage";
import usersPage from "../pageObjects/usersPage";

import users from "../../../fixtures/OVAC/users.json";
import users_data from "../../../fixtures/OVAC/users_data.json";

let login = new loginPage();
let tag = new tagsPage();
let appointment = new requestAppointment();
let appointments = new appointmentsPage();
let dashboard = new adminDashboard();
let settings = new userSettingsPage();
let entit = new entitiesPage();
let documentation = new knowledgeBasePage();
let template = new templatesPage();
let users = new usersPage();

describe("Users section - regression tests", function() {
	before(function() {});

	it("Admin is able to use search engine to find users by user name", function() {
		cy.clearLocalStorage();
		cy.log("Open browser and enter URL");
		login.navigate_admin();
		cy.log("The user is able to Login");
		login.enter_email(users.email);
		login.enter_password(users.passowrd);
		login.login_submit();
		cy.log("Select OVAC Demo entity");
		entit.click_on_entity();
		entit.if_entity();
		cy.log("The user is able to click on the 'Users' tab");
		dashboard.click_on_users();
		cy.log(
			"The user is able to click on the 'Search' field and enter the name"
		);
		users.search_for_user(users_data.user);
		cy.log("The user with that name is displayed successfully");
		users.verify_user(users_data.user);
	});

	it("Admin is able to create new user with 'Catala' language in the Users form", function() {
		cy.clearLocalStorage();
		cy.log("Open browser and enter URL");
		login.navigate_admin();
		cy.log("The user is able to click on the 'Users' tab");
		dashboard.click_on_users();
		cy.log("The user is able to click on the 'Add' button");
		users.click_add_user();
		cy.log(
			"The user is able to populate all required fields and set language to 'Catala'"
		);
		users.enter_name(
			users_data.name_test_user + Cypress.config("UniqueNumber")
		);
		users.enter_surname(users_data.name);
		users.enter_phone_code("+" + users_data.phone_code);
		users.enter_phone(users_data.phone);
		users.enter_tin(users_data.tin);
		users.enter_email(
			users_data.email +
				"1" +
				Cypress.config("UniqueNumber") +
				users_data.domain
		);
		users.click_language_menu();
		users.select_calego_language();
		cy.log("Click Continue");
		users.click_continue();
		users.click_on_finalize();
		cy.log("Verify user is created");
		users.search_for_user(
			users_data.name_test_user + Cypress.config("UniqueNumber")
		);
		users.verify_user(
			users_data.name_test_user + Cypress.config("UniqueNumber")
		);
	});

	it("Admin is able to create new user with 'Spanish' language in the Users form", function() {
		cy.clearLocalStorage();
		cy.log("Open browser and enter URL");
		login.navigate_admin();
		cy.log("The user is able to click on the 'Users' tab");
		dashboard.click_on_users();
		cy.log("The user is able to click on the 'Add' button");
		users.click_add_user();
		cy.log(
			"The user is able to populate all required fields and set language to 'Spanish'"
		);
		users.enter_name(
			users_data.name_test_user + Cypress.config("UniqueNumber")
		);
		users.enter_surname(users_data.name);
		users.enter_phone_code("+" + users_data.phone_code);
		users.enter_phone(users_data.phone);
		users.enter_tin(users_data.tin);
		users.enter_email(
			users_data.email +
				"2" +
				Cypress.config("UniqueNumber") +
				users_data.domain
		);
		users.click_language_menu();
		users.select_spanish_language();
		cy.log("Click Continue");
		users.click_continue();
		users.click_on_finalize();
		cy.log("Verify user is created");
		users.search_for_user(
			users_data.name_test_user + Cypress.config("UniqueNumber")
		);
		users.verify_user(
			users_data.name_test_user + Cypress.config("UniqueNumber")
		);
	});

	it("Admin is able to create new user with 'Italiano' language in the Users form", function() {
		cy.clearLocalStorage();
		cy.log("Open browser and enter URL");
		login.navigate_admin();
		cy.log("The user is able to click on the 'Users' tab");
		dashboard.click_on_users();
		cy.log("The user is able to click on the 'Add' button");
		users.click_add_user();
		cy.log(
			"The user is able to populate all required fields and set language to 'Italiano'"
		);
		users.enter_name(
			users_data.name_test_user + Cypress.config("UniqueNumber")
		);
		users.enter_surname(users_data.name);
		users.enter_phone_code("+" + users_data.phone_code);
		users.enter_phone(users_data.phone);
		users.enter_tin(users_data.tin);
		users.enter_email(
			users_data.email +
				"3" +
				Cypress.config("UniqueNumber") +
				users_data.domain
		);
		users.click_language_menu();
		users.select_italiano_language();
		cy.log("Click Continue");
		users.click_continue();
		users.click_on_finalize();
		cy.log("Verify user is created");
		users.search_for_user(
			users_data.name_test_user + Cypress.config("UniqueNumber")
		);
		users.verify_user(
			users_data.name_test_user + Cypress.config("UniqueNumber")
		);
	});

	it("Admin is able to create new user with 'Euskera' language in the Users form", function() {
		cy.clearLocalStorage();
		cy.log("Open browser and enter URL");
		login.navigate_admin();
		cy.log("The user is able to click on the 'Users' tab");
		dashboard.click_on_users();
		cy.log("The user is able to click on the 'Add' button");
		users.click_add_user();
		cy.log(
			"The user is able to populate all required fields and set language to 'Euskera'"
		);
		users.enter_name(
			users_data.name_test_user + Cypress.config("UniqueNumber")
		);
		users.enter_surname(users_data.name);
		users.enter_phone_code("+" + users_data.phone_code);
		users.enter_phone(users_data.phone);
		users.enter_tin(users_data.tin);
		users.enter_email(
			users_data.email +
				"4" +
				Cypress.config("UniqueNumber") +
				users_data.domain
		);
		users.click_language_menu();
		users.select_euskera_language();
		cy.log("Click Continue");
		users.click_continue();
		users.click_on_finalize();
		cy.log("Verify user is created");
		users.search_for_user(
			users_data.name_test_user + Cypress.config("UniqueNumber")
		);
		users.verify_user(
			users_data.name_test_user + Cypress.config("UniqueNumber")
		);
	});

	it("Admin is able to create new user with 'English' language in the Users form", function() {
		cy.clearLocalStorage();
		cy.log("Open browser and enter URL");
		login.navigate_admin();
		cy.log("The user is able to click on the 'Users' tab");
		dashboard.click_on_users();
		cy.log("The user is able to click on the 'Add' button");
		users.click_add_user();
		cy.log(
			"The user is able to populate all required fields and set language to 'English'"
		);
		users.enter_name(
			users_data.name_test_user + Cypress.config("UniqueNumber")
		);
		users.enter_surname(user.name);
		users.enter_phone_code("+" + users_data.phone_code);
		users.enter_phone(users_data.phone);
		users.enter_tin(users_data.phone);
		users.enter_email(
			users_data.email +
				"5" +
				Cypress.config("UniqueNumber") +
				users_data.domain
		);
		users.change_language_english();
		cy.log("Click Continue");
		users.click_continue();
		users.click_on_finalize();
		cy.log("Verify user is created");
		users.search_for_user(
			users_data.name_test_user + Cypress.config("UniqueNumber")
		);
		users.verify_user(
			users_data.name_test_user + Cypress.config("UniqueNumber")
		);
	});

	it("Admin is able to click the 'Return' button in the 'Add user' form", function() {
		cy.clearLocalStorage();
		cy.log("Open browser and enter URL");
		login.navigate_admin();
		cy.log("The user is able to click on the 'Users' tab");
		dashboard.click_on_users();
		cy.log("The user is able to click on the 'Add' button");
		users.click_add_user();
		cy.log("The user is able to click on the 'Back' icon");
		users.click_return();
	});

	it("The admin is not able to create a user without populating the Name field - Add user form", function() {
		cy.clearLocalStorage();
		cy.log("Open browser and enter URL");
		login.navigate_admin();
		cy.log("The user is able to click on the 'Users' tab");
		dashboard.click_on_users();
		cy.log("The user is able to click on the 'Add' button");
		users.click_add_user();
		cy.log(
			"The user is able to populate all required fields except the 'Name' field"
		);
		users.enter_surname(users_data.name);
		users.enter_phone_code("+" + users_data.passowrd);
		users.enter_phone(users_data.phone);
		users.enter_tin(users_data.phone);
		users.enter_email(
			users_data.email +
				"6" +
				Cypress.config("UniqueNumber") +
				users_data.domain
		);
		cy.log("Click Continue");
		users.click_continue();
		cy.log("The error message is displayed below the 'Name' field");
		users.verify_error();
	});

	it("The admin is not able to create a user without populating the Surname field - Add user form", function() {
		cy.clearLocalStorage();
		cy.log("Open browser and enter URL");
		login.navigate_admin();
		cy.log("The user is able to click on the 'Users' tab");
		dashboard.click_on_users();
		cy.log("The user is able to click on the 'Add' button");
		users.click_add_user();
		cy.log(
			"The user is able to populate all required fields except the 'Surname' field"
		);
		users.enter_name(
			users_data.name_test_user + Cypress.config("UniqueNumber")
		);
		users.enter_phone_code("+" + users_data.phone_code);
		users.enter_phone(users_data.phone);
		users.enter_tin(users_data.tin);
		users.enter_email(
			users_data.email +
				"7" +
				Cypress.config("UniqueNumber") +
				users_data.domain
		);
		cy.log("Click Continue");
		users.click_continue();
		cy.log("The error message is displayed below the 'Surname' field");
		users.verify_error();
	});

	it("The admin is not able to create a user without populating the E-mail field - Add user form", function() {
		cy.clearLocalStorage();
		cy.log("Open browser and enter URL");
		login.navigate_admin();
		cy.log("The user is able to click on the 'Users' tab");
		dashboard.click_on_users();
		cy.log("The user is able to click on the 'Add' button");
		users.click_add_user();
		cy.log(
			"The user is able to populate all required fields except the 'Email' field"
		);
		users.enter_name(
			users_data.name_test_user + Cypress.config("UniqueNumber")
		);
		users.enter_surname(users_data.name);
		users.enter_phone_code("+" + users_data.phone_code);
		users.enter_phone(users_data.phone);
		users.enter_tin(users_data.tin);
		cy.log("Click Continue");
		users.click_continue();
		cy.log("The error message is displayed below the 'Email' field");
		users.verify_error();
	});

	it("The admin is not able to create a user with invalid Telephone number field - Add user form", function() {
		cy.clearLocalStorage();
		cy.log("Open browser and enter URL");
		login.navigate_admin();
		cy.log("The user is able to click on the 'Users' tab");
		dashboard.click_on_users();
		cy.log("The user is able to click on the 'Add' button");
		users.click_add_user();
		cy.log(
			"The user is able to populate all required fields except the 'Phone' field"
		);
		users.enter_name(
			users_data.name_test_user + Cypress.config("UniqueNumber")
		);
		users.enter_surname(users_data.name);
		users.enter_phone_code("+" + users_data.phone_code);
		users.enter_tin(users_data.tin);
		users.enter_email(
			users_data.email +
				"8" +
				Cypress.config("UniqueNumber") +
				users_data.domain
		);
		cy.log("Click Continue");
		users.click_continue();
		cy.log("The error message is displayed below the 'Phone' field");
		users.verify_error();
	});

	it("The admin is able to choose entities when adding the user - Add user form", function() {
		cy.clearLocalStorage();
		cy.log("Open browser and enter URL");
		login.navigate_admin();
		cy.log("The user is able to click on the 'Users' tab");
		dashboard.click_on_users();
		cy.log("The user is able to click on the 'Add' button");
		users.click_add_user();
		cy.log(
			"The user is able to populate all required fields and set language to 'Catala'"
		);
		users.enter_name(
			users_data.name_test_user + Cypress.config("UniqueNumber")
		);
		users.enter_surname(users_data.name);
		users.enter_phone_code("+" + users_data.phone_code);
		users.enter_phone(users_data.phone);
		users.enter_tin(users_data.tin);
		users.enter_email(
			users_data.email +
				"9" +
				Cypress.config("UniqueNumber") +
				users_data.domain
		);
		users.click_language_menu();
		users.select_calego_language();
		cy.log("Click Continue");
		users.click_continue();
		users.click_on_finalize();
		cy.log("Verify user is created");
		users.search_for_user(
			users_data.name_test_user + Cypress.config("UniqueNumber")
		);
		users.verify_user(
			users_data.name_test_user + Cypress.config("UniqueNumber")
		);
	});
});
