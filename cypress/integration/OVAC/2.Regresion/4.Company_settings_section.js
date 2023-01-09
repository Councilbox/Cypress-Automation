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
let entity = new entitiesPage();

describe("Company settings - regression tests", function() {
	before(function() {});

	it("The user is able to add entity", function() {
		cy.clearLocalStorage();
		cy.log("Open browser and enter URL");
			login.navigate_admin();
		cy.log("The user is able to Login");
			login.enter_email(users.email);
			login.enter_password(users.password);
			login.login_submit();
		cy.log("Select OVAC Demo entity");
			entity.click_on_entity();
			entity.if_entity();
		cy.log("The user is able to click on the 'Insitution' button");
			dashboard.click_on_istitutions();
		cy.log("The user is able to click on the 'Add' button");
			entity.click_add_button();
		cy.log("The user is able to populate the 'Name' field");
			entity.enter_name(entity_data.company_name + Cypress.config("UniqueNumber"));
		cy.log("The user is able to populate the 'TAX ID NO/CIF/NIE' field");
			entity.enter_TAX_id(Cypress.config("UniqueNumber"));
		cy.log("The user is able to populate the 'Address' field");
			entity.enter_entity_address(entity_data.address);
		cy.log("The user is able to populate the 'Town/City' field");
			entity.enter_town_city(entity_data.town);
		cy.log("The user is able to populate the 'Province' label");
			entity.select_province_entity();
		cy.log("The user is able to populate the 'ZIP Code' label");
			entity.enter_zip_code(entity_data.zip);
		cy.log("The user is able to click on the 'Add entity+' button");
			entity.click_submit_entity();
		cy.log("Navigate back to Home page");
			login.navigate_admin();
		cy.wait(5000);
	});

	it("The user is able to change the Name of the company - Company settings section", function() {
		cy.log("The user is able to click on the Account icon");
			settings.click_on_my_account();
		cy.log("The user is able to click on the Configuration button");
			settings.click_on_company_settings();
		cy.log("The user is able to edit a 'Name' field");
			entity.enter_name(entity_data.edited_company_name);
		cy.log("Click on SAVE");
			settings.click_on_save_button();
		cy.log("Verify that Company is edited");
		cy.contains("The changes have been saved successfully.").should("be.visible");
		cy.reload();
			settings.click_on_my_account();
			settings.click_on_company_settings();
			entity.verify_name(entity_data.edited_company_name);
		cy.log("Navigate back to Home page");
			login.navigate_admin();
	});

	it("The user is able to change the VAT NO/CIF - Company settings section", function() {
		cy.log("The user is able to click on the Account icon");
			settings.click_on_my_account();
		cy.log("The user is able to click on the Configuration button");
			settings.click_on_company_settings();
		cy.log("The user is able to edit a 'TAX ID NO/CIF/NIE' field");
			entity.enter_TAX_id(Cypress.config("UniqueNumber") + "1");
		cy.log("Click on SAVE");
			settings.click_on_save_button();
		cy.log("Verify that Company is edited");
		cy.contains("The changes have been saved successfully.").should("be.visible");
		cy.reload();
			settings.click_on_my_account();
			settings.click_on_company_settings();
			entity.verify_tax(Cypress.config("UniqueNumber") + "1");
		cy.log("Navigate back to Home page");
			login.navigate_admin();
	});

	it("The user is able to change the contact e-mail - Company settings section", function() {
		cy.log("The user is able to click on the Account icon");
			settings.click_on_my_account();
		cy.log("The user is able to click on the Configuration button");
			settings.click_on_company_settings();
		cy.log("The user is able to edit a 'Contact Email' field");
			entity.enter_contact_email(entity_data.company_email + Cypress.config("UniqueNumber") + entity_data.company_domain);
		cy.log("Click on SAVE");
			settings.click_on_save_button();
		cy.log("Verify that Company is edited");
		cy.contains("The changes have been saved successfully.").should("be.visible");
		cy.reload();
			settings.click_on_my_account();
			settings.click_on_company_settings();
			entity.verify_contact_email(entity_data.company_email + Cypress.config("UniqueNumber") + entity_data.company_domain);
		cy.log("Navigate back to Home page");
			login.navigate_admin();
	});

	it("The user is able to change the Organization logo - Company settings section", function() {
		cy.log("The user is able to click on the Account icon");
			settings.click_on_my_account();
		cy.log("The user is able to click on the Configuration button");
			settings.click_on_company_settings();
		cy.log("The user is able to edit a 'Organization logo' field");
			entity.upload_organisation_logo();
		cy.log("Click on SAVE");
			settings.click_on_save_button();
		cy.log("Navigate back to Home page");
			login.navigate_admin();
	});

	it("The user is able to change the language to English - Company settings section", function() {
		cy.log("The user is able to click on the Account icon");
			settings.click_on_my_account();
		cy.log("The user is able to click on the Configuration button");
			settings.click_on_company_settings();
		cy.log("The user is able to edit a 'Main language' field");
			entity.select_company_language(users.language);
		cy.log("Click on SAVE");
			settings.click_on_save_button();
		cy.log("Verify that Company is edited");
		cy.contains("The changes have been saved successfully.").should("be.visible");
		cy.reload();
			settings.click_on_my_account();
			settings.click_on_company_settings();
			entity.verify_language(users.language);
		cy.log("Navigate back to Home page");
			login.navigate_admin();
	});

	it("Only the Super administrator and Administrator can configure the organization/entity from the 'Account' icon", function() {
		cy.log("Navigate back to Home page");
			login.navigate_admin();
		cy.log("Click on My Acount");
			settings.click_on_my_account();
		cy.log("On the menu, there is the organization/entity configuration option");
			settings.company_settings_visible();
		cy.log("Logout");
			settings.click_on_logout();
	});

	it("The Professional and Calendar managers don't see the Organization/Entity configuration under the 'Account' icon", function() {
		cy.clearLocalStorage();

		cy.clearLocalStorage();
		cy.log("Open browser and enter URL");
			login.navigate_admin();
		cy.log("The user is able to Login");
			login.enter_email(users.mo.email);
			login.enter_password(users.mo.passowrd);
			login.login_submit();
		cy.log("Click on My Acount");
			settings.click_on_my_account();
		cy.log("On the menu, the organization/entity configuration option is not displayed");
			settings.company_settings_not_visible();
		cy.log("Logout");
			settings.click_on_logout();
	});

	it("The user can add or edit support email for organization", function() {
		cy.clearLocalStorage();

		cy.clearLocalStorage();
		cy.log("Open browser and enter URL");
			login.navigate_admin();
		cy.log("The user is able to Login");
			login.enter_email(users.email);
			login.enter_password(users.passowrd);
			login.login_submit();
		cy.log("Click on My Acount");
			settings.click_on_my_account();
		cy.log("Click to Edit company");
			settings.click_on_company_settings();
		cy.log("Add/Edit the support email");
			settings.enter_support_email(entity_data.support_email + Cypress.config("UniqueNumber") + entity_data.company_domain);
		cy.log("Click on the 'Save' button");
			settings.click_on_save_button();
	});

	it("The user is able to change entity", function() {
		cy.log("Navigate back to Home page");
			login.navigate_admin();
		cy.log("Select OVAC Demo entity");
			entity.click_on_entity();
			entity.if_entity();
		cy.log("Navigate back to Home page");
			login.navigate_admin();
	});
});
