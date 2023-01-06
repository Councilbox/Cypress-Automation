import loginPage from "../pageObjects/loginPage";
import dashboardPage from "../pageObjects/dashbaordPage";
import censusPage from "../pageObjects/censusPage";
import typeOfMeetingsPage from "../pageObjects/typesOfMeetingsPage";

const invalid_emails = ["andrej@qa", "andrej.qa", "andrej@majl.234"];
const login_url = Cypress.env("baseUrl");
const valid_password = Cypress.env("login_password");
const valid_email = Cypress.env("login_email");

let url = Cypress.config().baseUrl;
let login = new loginPage();
let dashbaord = new dashboardPage();
let census = new censusPage();
let types = new typeOfMeetingsPage();

describe("Census", function() {
	before(function() {});

	it("Login", function() {
		const email = "alem@qaengineers.net";
		const password = "Mostar123!test";

		cy.log("Navigate to login page");
		cy.visit(url);
		// cy.log("Change language to Spanish");
		// login.click_on_language_dropmenu();
		// login.select_spanish_language();
		cy.log("Enters email address");
		login.enter_email(email);
		cy.log("Enters password");
		login.enter_password(password);
		cy.log("Clicks login button");
		login.click_login();
	});
	// 	const email = "alem@qaengineers.net";
	// 	const password = "Mostar123!test";
	// 	cy.clearLocalStorage();
	// 	cy.log("Navigate to login page");
	// 	cy.visit(url);
	// 	cy.log("Change language to Spanish");
	// 	login.click_on_language_dropmenu();
	// 	login.select_spanish_language();
	// 	cy.log("Enters email address");
	// 	login.enter_email(email);
	// 	cy.log("Enters password");
	// 	login.enter_password(password);
	// 	cy.log("Clicks login button");
	// 	login.click_login();
	// });
	it("The user is able to add census in the 'Censos' section [tipo Assistentes]", function() {
		const name = "AutomationTest" + Cypress.config("UniqueNumber");
		const description = "AutomationTest";

		cy.log("From the menu choose and click on the 'Censos' button");
		dashbaord.click_on_census();
		cy.log("Click on 'Anadir censo+' button");
		census.click_on_add_new_census();
		cy.log("Populate “Nombre” field");
		census.type_census_name(name);
		cy.log("Select the “Assistentes” tipo de census");
		census.click_on_drop_census_type();
		census.select_shares_census_type();
		cy.log("Populate “Descripcion” field");
		census.type_census_description(description);
		cy.log("Click on the 'Aceptar' button");
		types.alert_confirm();
		cy.log("Verify that Census is added by searching for it");
		census.type_in_search_bar(name);
		census.verify_new_census(name);
	});
});

// describe("The user is able to add census in the 'Censos' section [tipo Assistentes]", function() {
// 	it("From the menu choose and click on the 'Censos' button", function() {
// 		cy.get("#edit-censuses-block").click();
// 	});

// it("Click on 'Anadir censo+' button", function() {
// 	cy.get("#add-census-button").click();
// });

// it("Populate “Nombre” field", function() {
// 	cy.get("#census-name")
// 		.clear()
// 		.type("AutomationTest" + Cypress.config("UniqueNumber"))
// 		.should(
// 			"have.value",
// 			"AutomationTest" + Cypress.config("UniqueNumber")
// 		);
// });

// it("“Select the “Assistentes” tipo de census", function() {
// 	cy.get("#census-type").click();
// 	cy.get("#census-type-social-capital").click();
// });

// it("Populate “Descripcion” field", function() {
// 	cy.get("#census-description")
// 		.clear()
// 		.type("TestAutomation")
// 		.should("have.value", "TestAutomation");
// });

// it("Click on the 'Aceptar' button", function() {
// 	cy.get("#alert-confirm-button-accept").click();
// });

// it("Verify that Census is added by searching for it", function() {
// 	cy.get("#undefined-search-input")
// 		.should("be.visible")
// 		.clear()
// 		.type("AutomationTest" + Cypress.config("UniqueNumber"))
// 		.should(
// 			"have.value",
// 			"AutomationTest" + Cypress.config("UniqueNumber")
// 		)
// 			.wait(2000);
// 		cy.get("#census_row_0")
// 			.contains("AutomationTest" + Cypress.config("UniqueNumber"))
// 			.should("be.visible");
// 	});

// 	it("Back to Home page", function() {
// 		cy.visit(url);
// 	});
// });
