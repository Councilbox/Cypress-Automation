import loginPage from "../pageObjects/loginPage";
import requestAppointment from "../pageObjects/requestAppointment";
import appointmentsPage from "../pageObjects/appointmentsPage";
import adminDashboard from "../pageObjects/adminDashboardPage";
import userSettingsPage from "../pageObjects/userSettingsPage";
import entitiesPage from "../pageObjects/entitiesPage";
import knowledgeBasePage from "../pageObjects/knowledgeBasePage";
import tagsPage from "../pageObjects/tagsPage";
import templatesPage from "../pageObjects/templatesPage";

import users from "../../../fixtures/OVAC/users.json";
import templates_data from "../../../fixtures/OVAC/templates_data.json";

let login = new loginPage();
let tag = new tagsPage();
let appointment = new requestAppointment();
let appointments = new appointmentsPage();
let dashboard = new adminDashboard();
let settings = new userSettingsPage();
let entit = new entitiesPage();
let documentation = new knowledgeBasePage();
let template = new templatesPage();

describe("Templates section - regression tests", function() {
	before(function() {});

	it("The user is not able to add a new template without populating the 'Title' field - Templates tab - Knowledge base section", function() {
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
		cy.log("The user is able to click on the 'Templates' tab");
			dashboard.click_on_templates();
		cy.log("The user is able to click on the 'New template' button");
			template.click_add_button();
			template.click_new();
		cy.log("The user is able to click on the 'Save' button");
			template.click_save();
		cy.log("The error message should be displayed below the Title field");
			template.verify_title_error();
	});

	it("The user is able to switch between the pages - Templates tab - Knowledge base section", function() {
		cy.clearLocalStorage();
		cy.log("Open browser and enter URL");
			login.navigate_admin();
		cy.log("The user is able to click on the 'Templates' tab");
			dashboard.click_on_templates();
		cy.log("The user is able to click on the 'Next' button");
			template.click_next_page();
	});

	it("The user is able to delete already existing template - Templates tab - Knowledge base section", function() {
		cy.clearLocalStorage();
		cy.log("Open browser and enter URL");
			login.navigate_admin();
		cy.log("The user is able to click on the 'Templates' tab");
			dashboard.click_on_templates();
		cy.log("The user is able to click on the 'New template' button");
			template.click_add_button();
			template.click_new();
		cy.log("Enter title");
			template.enter_title(templates_data.to_delete_title + Cypress.config("UniqueNumber"));
		cy.log("The user is able to click on the 'Save' button");
			template.click_save();
		cy.log("Search for Template");
			template.search_for_template(templates_data.to_delete_title + Cypress.config("UniqueNumber"));
		cy.log("Click on DELETE");
			template.click_on_action_menu();
			template.select_action_option(templates_data.option);
			template.alert_confirm();
		cy.log("Verify Template Deleted");
			template.verify_template_deleted();
	});	

	it("The user is able to edit already existing template - Templates tab - Knowledge base section", function() {
		cy.clearLocalStorage();
		cy.log("Open browser and enter URL");
			login.navigate_admin();
		cy.log("The user is able to click on the 'Templates' tab");
			dashboard.click_on_templates();
		cy.log("The user is able to click on the 'New template' button");
			template.click_add_button();
			template.click_new();
		cy.log("Enter title");
			template.enter_title(templates_data.to_edit_title + Cypress.config("UniqueNumber"));
		cy.log("The user is able to click on the 'Save' button");
			template.click_save();
		cy.log("Search for Template");
			template.search_for_template(templates_data.to_edit_title + Cypress.config("UniqueNumber"));
		cy.log("Click on EDIT");
			template.click_on_action_menu();
			template.select_action_option(templates_data.edit_option);
		cy.log("Edit the Title");
			template.enter_title(templates_data.edited_title + Cypress.config("UniqueNumber"));
		cy.log("Click on SAVE");
			template.click_save();
		cy.log("Verify Template is updated");
			template.search_for_template(templates_data.edited_title + Cypress.config("UniqueNumber"));
			template.verify_template(templates_data.to_edit_title + Cypress.config("UniqueNumber"));
	});

	it("The user is able to edit already existing template - Templates tab - Knowledge base section", function() {
		cy.clearLocalStorage();
		cy.log("Open browser and enter URL");
			login.navigate_admin();
		cy.log("The user is able to Login");
			login.enter_email(users.email);
			login.enter_password(users.password);
			login.login_submit();
		cy.log("The user is able to click on the 'Templates' tab");
			dashboard.click_on_templates();
		cy.log("The user is able to click on the 'Import' button");
			template.click_add_button();
			template.click_on_import();
		cy.log("Select first template");
			template.select_first_template();
		cy.log("Click on SAVE");
			template.click_save();
	});

	/*

   it("The user is able to use filter by - Templates tab - Knowledge base", function() {
    const email = "alem+1@qaengineers.net"
    const passowrd = "Mostar1234!test"
    const title = "ToEdit"+Cypress.config('UniqueNumber')
    const title_new = "Edited"+Cypress.config('UniqueNumber')
    const option = "Edit"
    const procedure = ""
    cy.clearLocalStorage()
    cy.log("Open browser and enter URL")
        login.navigate_admin()
    cy.log("The user is able to click on the 'Templates' tab")
        dashboard.click_on_templates()
    cy.log("The user is able to click on the Type of Procedure he wants")
        template.search_for_procedure(procedure)
   })

*/
});
