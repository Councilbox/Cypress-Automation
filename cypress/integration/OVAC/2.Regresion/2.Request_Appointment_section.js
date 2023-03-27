import loginPage from "../pageObjects/loginPage";
import requestAppointment from "../pageObjects/requestAppointment";
import appointmentsPage from "../pageObjects/appointmentsPage";
import adminDashboard from "../pageObjects/adminDashboardPage";
import usersPage from "../pageObjects/usersPage";
import knowledgeBasePage from "../pageObjects/knowledgeBasePage";
import userSettingsPage from "../pageObjects/userSettingsPage";

let login = new loginPage();
let appointment = new requestAppointment();
let appointments = new appointmentsPage();
let dashboard = new adminDashboard();
let users = new usersPage();
let knowledgeBase = new knowledgeBasePage();
let settings = new userSettingsPage();
let entit = new entitiesPage()

import account from "../../../fixtures/OVAC/users.json";
import users_data from "../../../fixtures/OVAC/users_data.json";
import documentation_data from "../../../fixtures/OVAC/documentation_data.json";
import entitiesPage from "../pageObjects/entitiesPage";

describe("Request appointment - regression tests", function() {
	before(function() {});

	it("Admin is able to Log in to the page", function() {
		cy.log("Open the browser and enter URL");
			login.navigate_admin();
		cy.log("Populate all required fields with valid data");
			login.enter_email(account.email);
			login.enter_password(account.password);
		cy.log("Click on login button");
			login.login_submit();
		cy.log("Admin shuold be logged in");
			login.confirm_login();
	});

	it("User is able to Upload file in the 'Documentation' page", function() {
		cy.log("Select OVAC Demo entity");
			entit.click_on_entity();
			entit.if_entity();
		cy.log("The user is able to click on the 'Documentations' button");
			dashboard.click_on_documentation();
		cy.log("The user is able to click on the '+' button");
			knowledgeBase.click_add_button();
		cy.log("The user is able to click on the 'Upload file' button and upload a file");
			knowledgeBase.upload_file();
	});

	it("User is able to create new folder in the 'Documentation' page", function() {
		cy.log("Open browser and enter URL");
			login.navigate_admin();
		cy.log("The user is able to click on the 'Documentations' button");
			dashboard.click_on_documentation();
		cy.log("The user is able to click on the '+' button");
			knowledgeBase.click_add_button();
		cy.log("The user is able to click on the 'New folder' button from the drop-down menu");
			knowledgeBase.click_on_new_folder();
		cy.log("The user is able to enter the 'Title' of new folder");
			knowledgeBase.enter_folder_title(documentation_data.folder_title + Cypress.config("UniqueNumber"));
		cy.log("The user is able to click on the 'OK' button");
			knowledgeBase.click_alert_confirm();
		cy.log("Verify that Folder is created");
			knowledgeBase.search_for_folder(documentation_data.folder_title + Cypress.config("UniqueNumber"));
			knowledgeBase.verify_folder(documentation_data.folder_title + Cypress.config("UniqueNumber"));
	});

	it("User is able to click on the 'Templates' button", function() {
		cy.log("Open browser and enter URL");
			login.navigate_admin();
		cy.log("The user is able to click on the 'Template' from the left-side menu");
			dashboard.click_on_templates();
	});

	it("User is able to click on the '<Tags>' button", function() {
		cy.log("Open browser and enter URL");
			login.navigate_admin();
		cy.log("The user is able to click on the '<Tags>' from the left-side menu");
			dashboard.click_on_tags();
	});

	it("User is able to click on the 'Procedures' button", function() {
		cy.log("Open browser and enter URL");
			login.navigate_admin();
		cy.log("The user is able to click on the 'Procedures' from the left-side menu");
			dashboard.click_on_procedures();
	});

	it("Admin is able to Add new user in the 'Users' form", function() {
		cy.log("Open browser and enter URL");
			login.navigate_admin();
		cy.log("The user is able to click on the 'Users' from the left-side menu");
			dashboard.click_on_users();
		cy.log("The user is able to click on the '+' button");
			users.click_add_user();
		cy.log("The user is able to enter the 'Name' field");
			users.enter_name(users_data.name);
		cy.log("The user is able to enter the 'Surname' field");
			users.enter_surname(users_data.surname + Cypress.config("UniqueNumber"));
		cy.log("The user is able to enter the 'Email' field");
			users.enter_email(users_data.email +Cypress.config("UniqueNumber") + users_data.domain);
		cy.log("The user is able to enter the 'Licence code' field");
			users.enter_tin(users_data.tin);
		cy.log("The user is able to enter the 'Telephone' field");
			users.enter_phone_code(users_data.phone_code);
			users.enter_phone(users_data.phone);
		cy.log("The user is able to click on the 'Continue' button");
			users.click_continue();
		cy.log("The user is able to click on the 'Finalize' button");
			users.click_on_finalize();
		cy.log("Verify that user is added");
			users.search_for_user(users_data.surname + Cypress.config("UniqueNumber"));
			users.verify_user(users_data.surname + Cypress.config("UniqueNumber"));
	});

	it("Admin should be able to edit already existing user in the 'Users' form", function() {
		cy.log("Open browser and enter URL");
			login.navigate_admin();
		cy.log("The user is able to click on the 'Users' from the left-side menu");
			dashboard.click_on_users();
		cy.log("Search for existing user");
			users.search_for_user(users_data.surname + Cypress.config("UniqueNumber"));
		cy.log("Click on Edit button");
			users.click_on_edit();
		cy.log("Edit Surname");
			users.enter_surname(users_data.surname_new + Cypress.config("UniqueNumber"));
		cy.log("The user is able to click on the 'Continue' button");
			users.click_continue();
		cy.log("The user is able to click on the 'Finalize' button");
			users.click_on_finalize();
		cy.log("Verify that user is Edited");
			users.search_for_user(users_data.surname_new + Cypress.config("UniqueNumber"));
			users.verify_user(users_data.surname_new + Cypress.config("UniqueNumber"));
	});

	it("When logged in to one organization, an admin or superadmin user can view the 'Institutions' entry in the left menu", function() {
		cy.log("Open browser and enter URL");
			login.navigate_admin();
		cy.log("The user is able to click on the 'Institutions' from the left-side menu");
			dashboard.click_on_istitutions();
	});

	it("Admin is able to Log out from the page", function() {
		cy.log("Open browser and enter URL");
			login.navigate_admin();
		cy.log("The user is able to click on the 'Account' icon");
			settings.click_on_my_account();
		cy.log("Click on End session");
			settings.click_on_logout();
	});
});
