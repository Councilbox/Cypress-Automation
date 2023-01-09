import loginPage from "../pageObjects/loginPage";
import requestAppointment from "../pageObjects/requestAppointment";
import appointmentsPage from "../pageObjects/appointmentsPage";
import adminDashboard from "../pageObjects/adminDashboardPage";
import userSettingsPage from "../pageObjects/userSettingsPage";
import entitiesPage from "../pageObjects/entitiesPage";
import knowledgeBasePage from "../pageObjects/knowledgeBasePage";

import users from "../../../fixtures/OVAC/users.json";
import documentation_data from "../../../fixtures/OVAC/documentation_data.json";

let login = new loginPage();
let appointment = new requestAppointment();
let appointments = new appointmentsPage();
let dashboard = new adminDashboard();
let settings = new userSettingsPage();
let entit = new entitiesPage();
let documentation = new knowledgeBasePage();

describe("Documentation section - regression tests", function() {
	before(function() {});

	it("The user is able to create a new folder - Documentation tab - Knowledge base section", function() {
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
		cy.log("The user is able to click on the 'Knowledge base' button");
			dashboard.click_on_documentation();
		cy.log("The user is able to click on the 'My docs' drop menu");
		cy.log("Click on Add Button");
			documentation.click_add_button();
		cy.log("The user is able to click on the 'New folder' button");
			documentation.click_on_new_folder();
		cy.log("The user is able to populate title field and click on the 'Ok' button");
			documentation.enter_folder_title(documentation_data.folder_title + Cypress.config("UniqueNumber"));
			documentation.click_alert_confirm();
		cy.log("Verify that Folder is created");
			documentation.search_for_folder(documentation_data.folder_title + Cypress.config("UniqueNumber"));
			documentation.verify_folder(documentation_data.folder_title + Cypress.config("UniqueNumber"));
	});

	it("The user is able to create a new folder in the existing folder - Documentation tab - Knowledge base section", function() {
		cy.clearLocalStorage();
		cy.log("Open browser and enter URL");
			login.navigate_admin();
		cy.log("The user is able to click on the 'Knowledge base' button");
			dashboard.click_on_documentation();
		cy.log("The user is able to click on the 'My docs' drop menu");
		cy.log("Click on Add Button");
			documentation.click_add_button();
		cy.log("The user is able to click on the 'New folder' button");
			documentation.click_on_new_folder();
		cy.log("The user is able to populate title field and click on the 'Ok' button");
			documentation.enter_folder_title(documentation_data.title + Cypress.config("UniqueNumber"));
			documentation.click_alert_confirm();
		cy.log("Verify that Folder is created");
			documentation.search_for_folder(documentation_data.title + Cypress.config("UniqueNumber"));
			documentation.verify_folder(documentation_data.title + Cypress.config("UniqueNumber"));
		cy.log("Open created folder");
			documentation.click_on_first_folder();
		cy.log("Click on Add button");
			documentation.click_add_button();
		cy.log("Click  on New Folder");
			documentation.click_on_new_folder();
		cy.log("Enter Name and click OK");
			documentation.enter_folder_title(documentation_data.title_new + Cypress.config("UniqueNumber"));
			documentation.click_alert_confirm();
		cy.log("Verify that Folder is created");
			documentation.verify_folder(documentation_data.title_new + Cypress.config("UniqueNumber"));
	});

	it("The user is able to search for Folder", function() {
		cy.clearLocalStorage();
		cy.log("Open browser and enter URL");
			login.navigate_admin();
		cy.log("The user is able to click on the 'Knowledge base' button");
			dashboard.click_on_documentation();
		cy.log("The user is able to click on the 'My docs' drop menu");
		cy.log("Click on Add Button");
			documentation.click_add_button();
		cy.log("The user is able to click on the 'New folder' button");
			documentation.click_on_new_folder();
		cy.log("The user is able to populate title field and click on the 'Ok' button");
			documentation.enter_folder_title(documentation_data.title + Cypress.config("UniqueNumber"));
			documentation.click_alert_confirm();
		cy.log("Search for that Folder");
			documentation.search_for_folder(documentation_data.title + Cypress.config("UniqueNumber"));
			documentation.verify_folder(documentation_data.title + Cypress.config("UniqueNumber"));
	});

	it("The user is able to Open Folder", function() {
		cy.clearLocalStorage();
		cy.log("Open browser and enter URL");
			login.navigate_admin();
		cy.log("The user is able to click on the 'Knowledge base' button");
			dashboard.click_on_documentation();
		cy.log("The user is able to click on the 'My docs' drop menu");
		cy.log("Click on Add Button");
			documentation.click_add_button();
		cy.log("The user is able to click on the 'New folder' button");
			documentation.click_on_new_folder();
		cy.log("The user is able to populate title field and click on the 'Ok' button");
			documentation.enter_folder_title(documentation_data.title + Cypress.config("UniqueNumber"));
			documentation.click_alert_confirm();
		cy.log("Search for that Folder");
			documentation.search_for_folder(documentation_data.title + Cypress.config("UniqueNumber"));
			documentation.verify_folder(documentation_data.title + Cypress.config("UniqueNumber"));
		cy.log("Open that folder");
			documentation.click_on_first_folder();
	});

	it("The user is able to delete the folder by clicking on the Delete link", function() {
		cy.clearLocalStorage();
		cy.log("Open browser and enter URL");
			login.navigate_admin();
		cy.log("The user is able to click on the 'Knowledge base' button");
			dashboard.click_on_documentation();
		cy.log("The user is able to click on the 'My docs' drop menu");
		cy.log("Click on Add Button");
			documentation.click_add_button();
		cy.log("The user is able to click on the 'New folder' button");
			documentation.click_on_new_folder();
		cy.log("The user is able to populate title field and click on the 'Ok' button");
			documentation.enter_folder_title(documentation_data.title_delete + Cypress.config("UniqueNumber"));
			documentation.click_alert_confirm();
		cy.log("Search for that Folder");
			documentation.search_for_folder(documentation_data.title_delete + Cypress.config("UniqueNumber"));
			documentation.verify_folder(documentation_data.title_delete + Cypress.config("UniqueNumber"));
		cy.log("Click on Action menu");
			documentation.click_on_action_menu();
		cy.log("Click on Delete");
			documentation.click_on_delete();
		cy.log("Click on OK");
			documentation.click_alert_confirm();
		cy.log("Verify that Folder is deleted");
			documentation.search_for_folder(documentation_data.title_delete + Cypress.config("UniqueNumber"));
			documentation.verify_folder_deleted();
	});

	it("The user is able to edit a folder name by clicking on the Edit link - Documentation tab - Knowledge base section", function() {
		cy.clearLocalStorage();
		cy.log("Open browser and enter URL");
			login.navigate_admin();
		cy.log("The user is able to click on the 'Knowledge base' button");
			dashboard.click_on_documentation();
		cy.log("The user is able to click on the 'My docs' drop menu");
		cy.log("Click on Add Button");
			documentation.click_add_button();
		cy.log("The user is able to click on the 'New folder' button");
			documentation.click_on_new_folder();
		cy.log("The user is able to populate title field and click on the 'Ok' button");
			documentation.enter_folder_title(documentation_data.title_to_edit + Cypress.config("UniqueNumber"));
			documentation.click_alert_confirm();
		cy.log("Search for that Folder");
			documentation.search_for_folder(documentation_data.title_to_edit + Cypress.config("UniqueNumber"));
			documentation.verify_folder(documentation_data.title_to_edit + Cypress.config("UniqueNumber"));
		cy.log("Click on Action menu");
			documentation.click_on_action_menu();
		cy.log("Click on Edit");
			documentation.click_on_edit();
		cy.log("Change that Title");
			documentation.enter_folder_title(documentation_data.title_edited + Cypress.config("UniqueNumber"));
		cy.log("Click on OK");
			documentation.click_alert_confirm();
		cy.log("Verify that Folder is edited");
			documentation.search_for_folder(documentation_data.title_edited + Cypress.config("UniqueNumber"));
			documentation.verify_folder(documentation_data.title_edited + Cypress.config("UniqueNumber"));
	});

	it("The user is able to Delete the document by clicking on the Delete link - Documentation tab - Knowledge base section", function() {
		cy.clearLocalStorage();
		cy.log("Open browser and enter URL");
			login.navigate_admin();
		cy.log("The user is able to click on the 'Knowledge base' button");
			dashboard.click_on_documentation();
		cy.log("The user is able to upload new file");
			documentation.upload_file();
		cy.log("Search for updated file");
			documentation.search_for_folder(documentation_data.file);
			documentation.verify_folder(documentation_data.file);
		cy.log("Click on Action button");
			documentation.click_on_action_menu();
		cy.log("Click on DELETE");
			documentation.click_on_delete_file();
			documentation.click_alert_confirm();
		cy.log("Verify that file is deleted");
			documentation.search_for_folder(documentation_data.file);
			documentation.verify_folder_deleted();
	});

	it("The user is able to Edit the document by clicking on the Edit link - Documentation tab - Knowledge base section", function() {
		cy.clearLocalStorage();
		cy.log("Open browser and enter URL");
			login.navigate_admin();
		cy.log("The user is able to click on the 'Knowledge base' button");
			dashboard.click_on_documentation();
		cy.log("The user is able to upload new file");
			documentation.upload_file();
		cy.log("Search for updated file");
			documentation.search_for_folder(documentation_data.file);
			documentation.verify_folder(documentation_data.file);
		cy.log("Click on Action button");
			documentation.click_on_action_menu();
		cy.log("Click on EDIT");
			documentation.click_on_edit_file();
		cy.log("Change the title and click OK");
			documentation.enter_folder_title(documentation_data.file_new + Cypress.config("UniqueNumber"));
			documentation.click_alert_confirm();
		cy.log("Verify that File is edited");
			documentation.search_for_folder(documentation_data.file_new + Cypress.config("UniqueNumber"));
			documentation.verify_folder(documentation_data.file_new + Cypress.config("UniqueNumber"));
	});

	it("The user is able to upload a new document in the already existing folder - Documentation ", function() {
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
		cy.log("The user is able to click on the 'Knowledge base' button");
			dashboard.click_on_documentation();
		cy.log("The user is able to click on the 'My docs' drop menu");
		cy.log("Click on Add Button");
			documentation.click_add_button();
		cy.log("The user is able to click on the 'New folder' button");
			documentation.click_on_new_folder();
		cy.log("The user is able to populate title field and click on the 'Ok' button");
			documentation.enter_folder_title(documentation_data.folder_file + Cypress.config("UniqueNumber"));
			documentation.click_alert_confirm();
		cy.log("Verify that Folder is created");
			documentation.search_for_folder(documentation_data.folder_file + Cypress.config("UniqueNumber"));
			documentation.verify_folder(documentation_data.folder_file + Cypress.config("UniqueNumber"));
		cy.log("Open that Folder");
			documentation.open_folder();
		cy.log("Upload a file");
			documentation.upload_file();
	});

	it("Professionals can only download documents and 'three dots' settings are hidden for them - Documentation", function() {
		//settings.click_on_my_account()
		//settings.click_on_logout()
		cy.log("Open browser and enter URL");
			login.navigate_admin();
		cy.log("The user is able to Login");
			login.enter_email(users.mo_professional.email);
			login.enter_password(users.mo_professional.passowrd);
			login.login_submit();
		cy.log("The user is able to click on the 'Knowledge base' button");
			dashboard.click_on_documentation();
		cy.log("Action button should not exist");
			documentation.action_button_not_exist();
		cy.log("Only Download button should be visible");
			documentation.download_visible();
	});
});
