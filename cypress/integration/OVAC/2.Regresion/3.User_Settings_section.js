import loginPage from "../pageObjects/loginPage";
import requestAppointment from "../pageObjects/requestAppointment";
import appointmentsPage from "../pageObjects/appointmentsPage";
import adminDashboard from "../pageObjects/adminDashboardPage";
import userSettingsPage from "../pageObjects/userSettingsPage";
import entitiesPage from "../pageObjects/entitiesPage";

let login = new loginPage();
let appointment = new requestAppointment();
let appointments = new appointmentsPage();
let dashboard = new adminDashboard();
let settings = new userSettingsPage();
let entit = new entitiesPage();

import users from "../../../fixtures/OVAC/users.json";

describe("User settings - regression tests", function() {
	before(function() {});

	it("The user is able to change the Name - Users settings section", function() {
		cy.clearLocalStorage();
		cy.log("Open browser and enter URL");
			login.navigate_admin();
		cy.log("The user is able to Login");
			login.enter_email(users.email);
			login.enter_password(users.password);
			login.login_submit();
		cy.log("Select OVAC Demo entity");
			entit.click_on_entity();
			entit.if_entity();
		cy.log("The user is able to click on the Account icon");
			settings.click_on_my_account();
		cy.log("The user is able to click on the Edit button");
			settings.click_on_user_settings();
		cy.log("The user is able to edit a 'Name' field");
			settings.enter_user_name(users.name + Cypress.config("UniqueNumber"));
		cy.log("Click on SAVE");
			settings.click_on_save();
		cy.log("Verify that User is successfully edited");
		cy.reload();
			settings.verify_user_name(users.name + Cypress.config("UniqueNumber"));
	});

	it("The user is able to change the Surname - Users settings section", function() {
		cy.clearLocalStorage();
		cy.log("Open browser and enter URL");
			login.navigate_admin();
		cy.log("The user is able to click on the Account icon");
			settings.click_on_my_account();
		cy.log("The user is able to click on the Edit button");
			settings.click_on_user_settings();
		cy.log("The user is able to edit a 'Surname' field");
			settings.enter_user_surname(users.surname);
		cy.log("Click on SAVE");
			settings.click_on_save();
		cy.log("Verify that User is successfully edited");
		cy.reload();
			settings.verify_user_surname(users.surname);
	});

	it("The user is able to change the Email - Users settings section", function() {
		cy.clearLocalStorage();
		cy.log("Open browser and enter URL");
			login.navigate_admin();
		cy.log("The user is able to click on the Account icon");
			settings.click_on_my_account();
		cy.log("The user is able to click on the Edit button");
			settings.click_on_user_settings();
		cy.log("The user is able to edit a 'Email' field");
			settings.enter_user_email(users.email);
		cy.log("Click on SAVE");
			settings.click_on_save();
		cy.log("Verify that User is successfully edited");
		cy.reload();
			settings.verify_user_email(users.email);
	});

	it("The user is able to change the Telephone No - Users settings section", function() {
		cy.clearLocalStorage();
		cy.log("Open browser and enter URL");
			login.navigate_admin();
		cy.log("The user is able to click on the Account icon");
			settings.click_on_my_account();
		cy.log("The user is able to click on the Edit button");
			settings.click_on_user_settings();
		cy.log("The user is able to edit a 'Email' field");
			settings.enter_user_phone(Cypress.config("UniqueNumber"));
		cy.log("Click on SAVE");
			settings.click_on_save();
		cy.log("Verify that User is successfully edited");
		cy.reload();
			settings.verify_user_phone(Cypress.config("UniqueNumber"));
	});

	/*

   it("The user is able to change password - User settings section", function() {
    const email = "alem+1@qaengineers.net"
    const password = "Mostar1234!test1"
    const new_password = "T2est1234!blabla"
    cy.clearLocalStorage()
    cy.log("Open browser and enter URL")
        login.navigate_admin()
    cy.log("The user is able to click on the Account icon")
        settings.click_on_my_account()
    cy.log("The user is able to click on the Edit button")
        settings.click_on_user_settings()
    cy.log("The user is able to click on the 'Change password' button")
        settings.click_on_change_password()
    cy.log("The user is able to enter valid data in the Current label")
        settings.enter_current_password(password)
    cy.log("The user is able to enter new password")
        settings.enter_new_password(new_password)
        settings.enter_new_password_confirm(new_password)
    cy.log("Click on SAVE")
        settings.click_on_save_password()
    cy.log("Verify that Password is successfully changed by logging out and logging in")
        settings.click_on_my_account()
        settings.click_on_logout()
        login.enter_email(email)
        login.enter_password(new_password)
        login.login_submit()
        login.confirm_login()
    cy.log("Change password back to original")
        settings.click_on_my_account()
        settings.click_on_user_settings()
        settings.click_on_change_password()
        settings.enter_current_password(new_password)
        settings.enter_new_password(password)
        settings.enter_new_password_confirm(password)
        settings.click_on_save_password()
   })
*/
	it("The user is not able to change password with invalid input in the Current password field - User settings section ", function() {
		cy.clearLocalStorage();
		cy.log("Open browser and enter URL");
			login.navigate_admin();
		cy.log("The user is able to click on the Account icon");
			settings.click_on_my_account();
		cy.log("The user is able to click on the Edit button");
			settings.click_on_user_settings();
		cy.log("The user is able to click on the 'Change password' button");
			settings.click_on_change_password();
		cy.log("The user is able to enter invalid data in the Current label");
			settings.enter_current_password(users.invalid_password);
		cy.log("The user is able to enter new password");
			settings.enter_new_password(users.new_password);
			settings.enter_new_password_confirm(users.new_password);
		cy.log("Click on SAVE");
			settings.click_on_save_password();
		cy.log("The error message is displayed below Current password label");
			settings.verify_existing_current_password_error();
	});

	it("The user is not able to change password with invalid input in the Confirm password field - User settings section ", function() {
		cy.clearLocalStorage();
		cy.log("Open browser and enter URL");
			login.navigate_admin();
		cy.log("The user is able to click on the Account icon");
			settings.click_on_my_account();
		cy.log("The user is able to click on the Edit button");
			settings.click_on_user_settings();
		cy.log("The user is able to click on the 'Change password' button");
			settings.click_on_change_password();
		cy.log("The user is able to enter valid data in the Current label");
			settings.enter_current_password(users.invalid_password);
		cy.log("The user is able to enter new password");
			settings.enter_new_password(users.new_password);
		cy.log("The user is able to enter invalid password in the Confirm label");
			settings.enter_new_password_confirm(users.invalid_password);
		cy.log("Click on SAVE");
			settings.click_on_save_password();
		cy.log("The error message is displayed below Confirm password label");
			settings.verify_existing_confirm_password_error();
	});

	it("The user is able to save all changes by clicking on the 'Save' button - User settings section", function() {
		cy.clearLocalStorage();
		cy.log("Open browser and enter URL");
			login.navigate_admin();
		cy.log("The user is able to click on the Account icon");
			settings.click_on_my_account();
		cy.log("The user is able to click on the Edit button");
			settings.click_on_user_settings();
		cy.log("The user is able to edit a 'Name' field");
			settings.enter_user_name(users.name + Cypress.config("UniqueNumber") + "1");
		cy.log("The user is able to edit a 'Surname' field");
			settings.enter_user_surname(users.surname + Cypress.config("UniqueNumber") + "1");
		cy.log("The user is able to edit a 'Email' field");
			settings.enter_user_email(users.email);
		cy.log("Click on SAVE");
			settings.click_on_save();
		cy.log("Verify that User is successfully edited");
		cy.reload();
			settings.verify_user_surname(users.surname + Cypress.config("UniqueNumber") + "1");
			settings.verify_user_name(users.name + Cypress.config("UniqueNumber") + "1");
			settings.verify_user_email(users.email);
	});

	it("The user is able to change the Language to English - Users settings section", function() {
		cy.clearLocalStorage();
		cy.log("Open browser and enter URL");
			login.navigate_admin();
		cy.log("The user is able to click on the Account icon");
			settings.click_on_my_account();
		cy.log("The user is able to click on the Edit button");
			settings.click_on_user_settings();
		cy.log("The user is able to edit a 'Language' field");
			settings.click_on_language_menu();
			settings.select_english_language();
		cy.log("Click on SAVE");
			settings.click_on_save();
		cy.log("Verify that User is successfully edited");
		cy.reload();
			settings.verify_english_language();
	});

	it("The user is able to change the Language to Italiano - Users settings section", function() {
		cy.clearLocalStorage();
		cy.log("Open browser and enter URL");
			login.navigate_admin();
		cy.log("The user is able to click on the Account icon");
			settings.click_on_my_account();
		cy.log("The user is able to click on the Edit button");
			settings.click_on_user_settings();
		cy.log("The user is able to edit a 'Language' field");
			settings.click_on_language_menu();
			settings.select_italian_language();
		cy.log("Click on SAVE");
			settings.click_on_save();
		cy.log("Verify that User is successfully edited");
		cy.reload();
			settings.verify_italian_language();
	});

	it("The user is able to change the Language to Catalá  - Users settings section", function() {
		cy.clearLocalStorage();
		cy.log("Open browser and enter URL");
			login.navigate_admin();
		cy.log("The user is able to click on the Account icon");
			settings.click_on_my_account();
		cy.log("The user is able to click on the Edit button");
			settings.click_on_user_settings();
		cy.log("The user is able to edit a 'Language' field");
			settings.click_on_language_menu();
			settings.select_catala_language();
		cy.log("Click on SAVE");
			settings.click_on_save();
		cy.log("Verify that User is successfully edited");
		cy.reload();
			settings.verify_catala_language();
	});

	it("The user is able to change the Language to Euskera  - Users settings section", function() {
		cy.clearLocalStorage();
		cy.log("Open browser and enter URL");
			login.navigate_admin();
		cy.log("The user is able to click on the Account icon");
			settings.click_on_my_account();
		cy.log("The user is able to click on the Edit button");
			settings.click_on_user_settings();
		cy.log("The user is able to edit a 'Language' field");
			settings.click_on_language_menu();
			settings.select_ruskera_language();
		cy.log("Click on SAVE");
			settings.click_on_save();
		cy.log("Verify that User is successfully edited");
		cy.reload();
			settings.verify_euskera_language();
	});

	it("The user is able to change the Language to Spanish - Users settings section", function() {
		cy.clearLocalStorage();
		cy.log("Open browser and enter URL");
			login.navigate_admin();
		cy.log("The user is able to click on the Account icon");
			settings.click_on_my_account();
		cy.log("The user is able to click on the Edit button");
			settings.click_on_user_settings();
		cy.log("The user is able to edit a 'Language' field");
			settings.click_on_language_menu();
			settings.select_spanish_language();
		cy.log("Click on SAVE");
			settings.click_on_save();
		cy.log("Verify that User is successfully edited");
		cy.reload();
			settings.verify_spanish_language();
	});

	it("The user is able to change the Language BACK to English - Users settings section", function() {
		cy.clearLocalStorage();
		cy.log("Open browser and enter URL");
			login.navigate_admin();
		cy.log("The user is able to click on the Account icon");
			settings.click_on_my_account();
		cy.log("The user is able to click on the Edit button");
			settings.click_on_user_settings();
		cy.log("The user is able to edit a 'Language' field");
			settings.click_on_language_menu();
			settings.select_english_language();
		cy.log("Click on SAVE");
			settings.click_on_save();
		cy.log("Verify that User is successfully edited");
		cy.reload();
			settings.verify_english_language();
	});
});
