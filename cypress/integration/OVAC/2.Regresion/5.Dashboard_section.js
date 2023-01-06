import loginPage from "../pageObjects/loginPage";
import requestAppointment from "../pageObjects/requestAppointment";
import appointmentsPage from "../pageObjects/appointmentsPage";
import adminDashboard from "../pageObjects/adminDashboardPage";
import userSettingsPage from "../pageObjects/userSettingsPage";
import entitiesPage from "../pageObjects/entitiesPage";

import users from "../../../fixtures/OVAC/users.json";

let login = new loginPage();
let appointment = new requestAppointment();
let appointments = new appointmentsPage();
let dashboard = new adminDashboard();
let settings = new userSettingsPage();
let entit = new entitiesPage();

describe("Dashboard - regression tests", function() {
	before(function() {});

	it("Verify that user is able to open “Dashboard”", function() {
		cy.clearLocalStorage();
		cy.log("Open browser and enter URL");
			login.navigate_admin();
		cy.log("The user is able to Login");
			login.enter_email(users.email);
			login.enter_password(users.passowrd);
			login.login_submit();
		cy.log("From the menu on the left, select 'Dashboard'");
			dashboard.click_on_dashboard();
	});

	it("The user can filter the 'Dashboard' using the drop-down list 'All entities'", function() {
		cy.log("Navigate back to Home page");
			login.navigate_admin();
		cy.log("From the menu on the left, select 'Dashboard'");
			dashboard.click_on_dashboard();
		cy.log("At top of the page, click on the 'All entities' drop-down list");
			dashboard.click_on_institituions_dropmenu();
	});

	it("The user can filter the 'Dashboard' using the drop-down list 'All procedures'", function() {
		cy.log("Navigate back to Home page");
			login.navigate_admin();
		cy.log("From the menu on the left, select 'Dashboard'");
			dashboard.click_on_dashboard();
		cy.log("At top of the page, click on the 'All procedures' drop-down list");
			dashboard.click_on_procedures_filter();
	});

	it("The user has the ability to change the month on the 'Dashboard'", function() {
		cy.log("Navigate back to Home page");
			login.navigate_admin();
		cy.log("From the menu on the left, select 'Dashboard'");
			dashboard.click_on_dashboard();
		cy.log("Click on Month Back");
			dashboard.click_on_month_back();
	});
});
