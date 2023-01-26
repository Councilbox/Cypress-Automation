import loginPage from "../pageObjects/loginPage";
import requestAppointment from "../pageObjects/requestAppointment";
import appointmentsPage from "../pageObjects/appointmentsPage";
import adminDashboard from "../pageObjects/adminDashboardPage";
import userSettingsPage from "../pageObjects/userSettingsPage";
import entitiesPage from "../pageObjects/entitiesPage";
import knowledgeBasePage from "../pageObjects/knowledgeBasePage";
import tagsPage from "../pageObjects/tagsPage";

import users from "../../../fixtures/OVAC/users.json";
import tags_data from "../../../fixtures/OVAC/tags_data.json";

let login = new loginPage();
let tag = new tagsPage();
let appointment = new requestAppointment();
let appointments = new appointmentsPage();
let dashboard = new adminDashboard();
let settings = new userSettingsPage();
let entit = new entitiesPage();
let documentation = new knowledgeBasePage();

describe("Tags section - regression tests", function() {
	before(function() {});

	it("The user is able to edit already existing tag - <Tags> tab - Knowledge base sectionn", function() {
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
		cy.log("The user is able to click on the 'Tags' button");
			dashboard.click_on_tags();
		cy.log("Add new Tag");
			tag.click_add_button();
			tag.enter_code(tags_data.code + Cypress.config("UniqueNumber"));
			tag.enter_value(tags_data.value + Cypress.config("UniqueNumber"));
			tag.click_save();
			tag.search_for_tag(tags_data.code + Cypress.config("UniqueNumber"));
		cy.log("The user is able to click on the 'Edit' icon");
			tag.click_on_action_menu();
			tag.click_on_edit();
		cy.log("Change the Code");
			tag.enter_code(tags_data.code_new + Cypress.config("UniqueNumber"));
		cy.log("Click on SAVE");
			tag.click_save();
		cy.log("Verify that Tag is edited");
			tag.search_for_tag(tags_data.code_new+Cypress.config("UniqueNumber"));
			tag.verify_tag(tags_data.code_new+Cypress.config("UniqueNumber"));
	});

	it("The user is able to delete already existing tab - <Tags> tab - Knowledge base section", function() {
		cy.clearLocalStorage();
		cy.log("Open browser and enter URL");
			login.navigate_admin();
		cy.log("The user is able to click on the 'Tags' button");
			dashboard.click_on_tags();
		cy.log("Add new Tag");
			tag.click_add_button();
			tag.enter_code(tags_data.delete_code + Cypress.config("UniqueNumber"));
			tag.enter_value(tags_data.value + Cypress.config("UniqueNumber"));
			tag.click_save();
			tag.search_for_tag(tags_data.delete_code + Cypress.config("UniqueNumber"));
		cy.log("The user is able to click on the 'Delete' icon");
			tag.click_on_action_menu();
			tag.click_on_delete();
			tag.alert_confirm();
		cy.log("Verify that Tag is deleted");
			tag.search_for_tag(tags_data.delete_code + Cypress.config("UniqueNumber"));
			tag.verify_tag_deleted();
	});

	it("The user is not able to add a tag without populating Value field - <Tags> tab - Knowledge base section", function() {
		cy.clearLocalStorage();
		cy.log("Open browser and enter URL");
			login.navigate_admin();
		cy.log("The user is able to click on the 'Tags' button");
			dashboard.click_on_tags();
		cy.log("Click on Add new Tag");
			tag.click_add_button();
		cy.log("Populate Code");
			tag.enter_code(tags_data.delete_code + Cypress.config("UniqueNumber"));
		cy.log("Click on SAVE");
			tag.click_save();
		cy.log("Verify that Error message is displayed under Value field");
			tag.verify_error();
	});

	it("The user is not able to add a tag without populating Code field - <Tags> tab - Knowledge base section", function() {
		cy.clearLocalStorage();
		cy.log("Open browser and enter URL");
			login.navigate_admin();
		cy.log("The user is able to click on the 'Tags' button");
			dashboard.click_on_tags();
		cy.log("Click on Add new Tag");
			tag.click_add_button();
		cy.log("Populate Code");
			tag.enter_value(tags_data.value + Cypress.config("UniqueNumber"));
		cy.log("Click on SAVE");
			tag.click_save();
		cy.log("Verify that Error message is displayed under Code field");
			tag.verify_error();
	});

	it("The user is able to search tag by code - <Tags> tab - Knowledge base section", function() {
		cy.clearLocalStorage();
		cy.log("Open browser and enter URL");
			login.navigate_admin();
		cy.log("The user is able to click on the 'Tags' button");
			dashboard.click_on_tags();
		cy.log("Click on Add new Tag");
			tag.click_add_button();
		cy.log("Populate Code and Value");
			tag.enter_code(tags_data.search_code + Cypress.config("UniqueNumber"));
			tag.enter_value(tags_data.value + Cypress.config("UniqueNumber"));
		cy.log("Click on SAVE");
			tag.click_save();
		cy.log("Search for Tag by the Code");
			tag.search_for_tag(tags_data.search_code + Cypress.config("UniqueNumber"));
			tag.verify_tag(tags_data.search_code + Cypress.config("UniqueNumber"));
	});
});
