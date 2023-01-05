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
import meeting_data from "../../../fixtures/OVAC/meeting_data.json";

let login = new loginPage();
let tag = new tagsPage();
let appointment = new requestAppointment();
let appointments = new appointmentsPage();
let dashboard = new adminDashboard();
let settings = new userSettingsPage();
let entit = new entitiesPage();
let documentation = new knowledgeBasePage();
let template = new templatesPage();

describe("Appointments section - regression tests", function() {
	before(function() {});

	it("The user is able to reorder Consents list - Consents tab", function() {
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
		cy.log("The user is able to click on the 'Appointments' tab");
		dashboard.click_on_appointments();
		cy.log("The user is able to click on the '+' button");
		appointments.click_on_add_button();

		cy.log("Select Procedure and click Save");
		appointments.select_procedure();
		appointments.click_consent_save_button();
		cy.log("Click on Continue");
		appointments.click_next_details();
		cy.log("Click on Add Participant");
		appointments.click_add_participant_button();
		cy.log("Enter all Required fields and click SAVE");
		appointments.enter_participant_data(
			meeting_data.name,
			meeting_data.surname,
			meeting_data.dni,
			meeting_data.email,
			"+" + meeting_data.phone_code,
			meeting_data.phone
		);
		appointments.click_consent_save_button();
		cy.log("Click Continue");
		appointments.click_next_participants();
		cy.log("Click on Add Consents");
		appointments.click_on_add_consents();
		cy.log("Enter Title and Click save");
		appointments.enter_consent_title(meeting_data.title);
		appointments.click_consent_save_button();
		cy.log("Add one more Consents");
		appointments.click_add_consents();
		appointments.enter_consent_title(meeting_data.title2);
		appointments.click_consent_save_button();
		cy.log("Click on Reorder");
		appointments.click_on_reorder();
		cy.log("Drag first Consents to second place");
		appointments.drag_first_consent();
	});
});
