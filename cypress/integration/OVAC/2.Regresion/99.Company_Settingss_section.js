import loginPage from "../pageObjects/loginPage";
import requestAppointment from "../pageObjects/requestAppointment";
import appointmentsPage from "../pageObjects/appointmentsPage";
import adminDashboard from "../pageObjects/adminDashboardPage";
import userSettingsPage from "../pageObjects/userSettingsPage";
import entitiesPage from "../pageObjects/entitiesPage";

import users from "../../../fixtures/OVAC/users.json";
import entity_data from "../../../fixtures/OVAC/entity_data.json";

let login = new loginPage();
let appointment = new requestAppointment();
let appointments = new appointmentsPage();
let dashboard = new adminDashboard();
let settings = new userSettingsPage();
let entit = new entitiesPage();

describe("Company settings - regression tests", function() {
	before(function() {});

	it("The user is able to change the Name of the company - Company settings section", function() {
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
		cy.log("The user is able to click on the 'Institutions' button");
			dashboard.click_on_istitutions();
		cy.log("The user is able to click on the 'Add' button");
			entit.click_add_button();
		cy.log("Populate all required fields and click SUBMIT");
			entit.populate_all_fields(entity_data.name_company + Cypress.config("UniqueNumber"), Cypress.config("UniqueNumber"), entity_data.name_test, entity_data.name_test, entity_data.zip_12300);
			entit.click_submit_entity();
		cy.wait(5000);
		cy.reload();
		cy.log("Switch to New Entity");
			entit.click_on_entity();
			entit.new_entity_switch(entity_data.name_company + Cypress.config("UniqueNumber"));
		cy.log("The user is able to click on the Account icon");
			settings.click_on_my_account();
		cy.log("The user is able to click on the Configuration button");
			settings.click_on_company_settings();
		cy.log("The user is able to edit a 'Name' field");
			settings.enter_company_name(entity_data.name_edit + Cypress.config("UniqueNumber"));
		cy.log("Click on SAVE");
			settings.click_on_save_compay_button();
		cy.log("Verify that Company is successfully edited");
		cy.reload();
			settings.verify_company_name(entity_data.name_edit + Cypress.config("UniqueNumber"));
	});

	it("The user is able to change the VAT NO/CIF - Company settings section", function() {
		cy.clearLocalStorage();
		cy.log("Open browser and enter URL");
			login.navigate_admin();
		cy.log("The user is able to click on the Account icon");
			settings.click_on_my_account();
		cy.log("The user is able to click on the Configuration button");
			settings.click_on_company_settings();
		cy.log("The user is able to edit a 'TAX' field");
			settings.enter_company_tax("1" + Cypress.config("UniqueNumber"));
		cy.log("Click on SAVE");
			settings.click_on_save_compay_button();
		cy.log("Verify that Company is successfully edited");
		cy.reload();
			settings.verify_company_tax("1" + Cypress.config("UniqueNumber"));
	});

	it("The user is able to change the contact e-mail - Company settings section", function() {
		cy.clearLocalStorage();
		cy.log("Open browser and enter URL");
			login.navigate_admin();
		cy.log("The user is able to click on the Account icon");
			settings.click_on_my_account();
		cy.log("The user is able to click on the Configuration button");
			settings.click_on_company_settings();
		cy.log("The user is able to edit a 'Contact Email' field");
			settings.enter_company_contact_email(entity_data.contact_email + Cypress.config("UniqueNumber") + entity_data.company_domain);
		cy.log("Click on SAVE");
			settings.click_on_save_compay_button();
		cy.log("Verify that Company is successfully edited");
		cy.reload();
			settings.verify_company_contact_email(entity_data.contact_email + Cypress.config("UniqueNumber") + entity_data.company_domain);
	});

	it("The user is able to change the language to English - Company settings section", function() {
		cy.clearLocalStorage();
		cy.log("Open browser and enter URL");
			login.navigate_admin();
		cy.log("The user is able to click on the Account icon");
			settings.click_on_my_account();
		cy.log("The user is able to click on the Configuration button");
			settings.click_on_company_settings();
		cy.log("The user is able to edit a 'Language' field");
			settings.click_on_company_language_menu();
			settings.select_company_english_language();
		cy.log("Click on SAVE");
			settings.click_on_save_compay_button();
		cy.log("Verify that Company is successfully edited");
		cy.reload();
			settings.verify_company_language(entity_data.language);
	});
});
