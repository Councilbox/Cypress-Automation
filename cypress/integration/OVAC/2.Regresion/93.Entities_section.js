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

describe("Entities settings - regression tests", function() {
	before(function() {});

	it("User is not able to Add entity without populating required fields - Entities section", function() {
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
		cy.log("The user is able to click on the 'Institutions' button");
		dashboard.click_on_istitutions();
		cy.log("The user is able to click on the 'Add' button");
		entity.click_add_button();
		cy.log("Click on Add again without populating enything");
		entity.click_submit_entity();
		cy.log("The error message is displayed below required fields");
		entity.verify_name_error();
	});

	it("The user is able to Ban Entity - Entities section", function() {
		cy.clearLocalStorage();
		cy.log("Open browser and enter URL");
		login.navigate_admin();
		cy.log("Select OVAC Demo entity");
		entity.click_on_entity();
		entity.if_entity();
		cy.log("The user is able to click on the 'Institutions' button");
		dashboard.click_on_istitutions();
		cy.log("The user is able to click on the 'Add' button");
		entity.click_add_button();
		cy.log("Populate all required fields and click SUBMIT");
		entity.populate_all_fields(
			entity_data.name_test + Cypress.config("UniqueNumber"),
			Cypress.config("UniqueNumber"),
			entity_data.name_test,
			entity_data.name_test,
			entity_data.zip
		);
		entity.click_submit_entity();
		cy.log("Select OVAC Demo entity");
		entity.click_on_entity();
		entity.if_entity();
		cy.log("Go to Institutions");
		dashboard.click_on_istitutions();
		entity.search_for_inst(
			entity_data.name_test + Cypress.config("UniqueNumber")
		);
		cy.log(
			"The user is able to navigate on already existing entity and click on the 'Ban' button"
		);
		entity.click_action_button();
		entity.click_on_ban();
		entity.click_alert_accept();
	});

	it("The user is able to Delete Entity - Entities section", function() {
		cy.clearLocalStorage();
		cy.log("Open browser and enter URL");
		login.navigate_admin();
		cy.log("Select OVAC Demo entity");
		entity.click_on_entity();
		entity.if_entity();
		cy.log("The user is able to click on the 'Institutions' button");
		dashboard.click_on_istitutions();
		cy.log("The user is able to click on the 'Add' button");
		entity.click_add_button();
		cy.log("Populate all required fields and click SUBMIT");
		entity.populate_all_fields(
			entity_data.name_delete + Cypress.config("UniqueNumber"),
			"1" + Cypress.config("UniqueNumber"),
			entity_data.name_test,
			entity_data.name_test,
			entity_data.zip_12300
		);
		entity.click_submit_entity();
		cy.log("Select OVAC Demo entity");
		entity.click_on_entity();
		entity.if_entity();
		cy.log("Go to Institutions");
		dashboard.click_on_istitutions();
		entity.search_for_inst(
			entity_data.name_delete + Cypress.config("UniqueNumber")
		);
		cy.log(
			"The user is able to navigate on already existing entity and click on the 'Ban' button"
		);
		entity.click_action_button();
		entity.click_on_delete();
		entity.click_alert_accept();
	});

	it("The user is able to Edit Entity - Entities section", function() {
		cy.clearLocalStorage();
		cy.log("Open browser and enter URL");
		login.navigate_admin();
		cy.log("Select OVAC Demo entity");
		entity.click_on_entity();
		entity.if_entity();
		cy.log("The user is able to click on the 'Institutions' button");
		dashboard.click_on_istitutions();
		cy.log("The user is able to click on the 'Add' button");
		entity.click_add_button();
		cy.log("Populate all required fields and click SUBMIT");
		entity.populate_all_fields(
			entity_data.name_edit + Cypress.config("UniqueNumber"),
			"2" + Cypress.config("UniqueNumber"),
			entity_data.name_test,
			entity_data.name_test,
			entity_data.zip_12300
		);
		entity.click_submit_entity();
		cy.log("Select OVAC Demo entity");
		entity.click_on_entity();
		entity.if_entity();
		cy.log("Go to Institutions");
		dashboard.click_on_istitutions();
		entity.search_for_inst(
			entity_data.name_edit + Cypress.config("UniqueNumber")
		);
		cy.log("Click on Action button");
		entity.click_action_button();
		cy.log("Click on EDIT");
		entity.click_on_edit();
		cy.log("Edit the entity");
		entity.enter_entity_address(entity_data.company_adress_alem);
		cy.log("Click on SAVE");
		entity.saving();
	});

	it("The user is able to add a logo to the Entity", function() {
		cy.log("The user is able to open the browser and enter the URL: ");
		login.navigate_admin();
		cy.log("Select OVAC Demo entity");
		entity.click_on_entity();
		entity.if_entity();
		cy.log("The user is able to click on the 'Insitution' button");
		dashboard.click_on_istitutions();
		cy.log(
			"The user is able to navigate on already existing entity and click on the 'Edit' button"
		);
		entity.search_for_institution(entity_data.logo_name);
		entity.click_action_button();
		entity.click_edit_option();
		cy.log(
			"The user is able to click on the 'Organization logo' button / The user is able to choose photo and click on the 'Open' button"
		);
		entity.upload_organisation_logo();
		cy.log("The user is able to click on the 'Insitution' button");
		dashboard.click_on_istitutions();
		cy.log("Navigate back to Home page");
		login.navigate_admin();
	});

	it("On the 'Institutions' form, there is a 'All type' filter that can be used to sort by entity type", function() {
		cy.log("The user is able to open the browser and enter the URL: ");
		login.navigate_admin();
		cy.log("Select OVAC Demo entity");
		entity.click_on_entity();
		entity.if_entity();
		cy.log("The user is able to click on the 'Insitution' button");
		dashboard.click_on_istitutions();
		cy.log("Navigate and click on the 'All type' drop-down list");
		entity.click_on_all_entites_filter();
		cy.log("The drop-down list of entity types is successfully presented");
		entity.verify_types();
	});

	it("The user is able to switch between the pages in the Institutions form - Entities section", function() {
		cy.clearLocalStorage();
		cy.log("Open browser and enter URL");
		login.navigate_admin();
		cy.log("Select OVAC Demo entity");
		entity.click_on_entity();
		entity.if_entity();
		cy.log("Go to Entities page");
		dashboard.click_on_istitutions();
		cy.log("Go to Next Page");
		entity.go_to_next_page();
	});
});
