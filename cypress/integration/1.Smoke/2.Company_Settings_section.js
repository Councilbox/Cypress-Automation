import loginPage from "../pageObjects/loginPage";
import userSettingsPage from "../pageObjects/userSettingsPage";
import dashboardPage from "../pageObjects/dashbaordPage";
import addCompanyPage from "../pageObjects/addCompanyPage";

const invalid_emails = ["andrej@qa", "andrej.qa", "andrej@majl.234"];
const login_url = Cypress.env("baseUrl");
const valid_password = Cypress.env("login_password");
const valid_email = Cypress.env("login_email");
let url = Cypress.config().baseUrl;

let login = new loginPage();
let userSettings = new userSettingsPage();
let dashbaord = new dashboardPage();
let addComapy = new addCompanyPage();

describe("Company settings", function() {
	before(function() {});

	it("Login", function() {
		const email = "alem@qaengineers.net";
		const password = "Mostar1234!test";

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

	it("The user is able to add company in the Councilbox", function() {
		const name = "Test";
		const tin = Cypress.config("UniqueNumber");
		const domain = "Test";
		const master = "Test";
		const address = "Test";
		const town = "Test";
		const zip = Cypress.config("UniqueNumber");
		const membership = "Test";
		cy.clearLocalStorage();
		cy.wait(5000)
		cy.log("From the dashboard click on the 'Anadir sociedad' button");
		dashbaord.click_on_institutions_button_on_top_page();
		dashbaord.click_on_add_company_button();
		cy.log("Populate “Razón social*” field");
		addComapy.type_business_name(name);
		cy.log("Populate “CIF de la entidad*” field");
		addComapy.type_tin_organization(tin);
		cy.log("Populate “Dominio” field");
		addComapy.type_company_domain(domain);
		cy.log("Populate “Clave maestra” field");
		addComapy.type_master_code(master);
		cy.log("Scroll down the page and populate “Dirección” field");
		addComapy.type_company_address(address);
		cy.log("Populate “Localidad” field");
		addComapy.type_company_town(town);
		cy.log("Select the “Pais”");
		addComapy.click_on_country_drop_menu();
		addComapy.select_portugal_language();
		cy.log("Populate “Código Postal” field");
		addComapy.type_company_zip_code(zip);
		cy.log("Populate “Código afiliación”");
		addComapy.type_membership_code(membership);
	});

	it("The user is able to Link company", function() {
		const tinCompany = "automationtest";
		const masterCode = "automation";
		cy.clearLocalStorage();
		cy.visit(url);
		cy.wait(5000)
		cy.log("From the dashboard click on the 'Vincular sociedad' button");
		dashbaord.click_on_institutions_button_on_top_page();
		dashbaord.click_on_link_company_button();
		cy.log("Populate “CIF de la entidad*” field");
		addComapy.type_tin_company_link();
		cy.log("Populate “Clave maestra*” field");
		addComapy.type_master_code_company_link(masterCode);
		cy.log("Click on the 'Vincular' button");
		addComapy.click_on_company_link_button();
		
	});

	it("The user is able to Unlink company", function() {
		const tinCompany = "automationtest";
		cy.visit(url);
		cy.wait(5000)
		cy.log("From the dashboard click on the 'Vincular sociedad' button");
		dashbaord.click_on_institutions_button_on_top_page();
		dashbaord.click_on_company_from_list_of_companies();
		cy.log("Click on User menu");
		dashbaord.click_on_the_user_menu();
		cy.log("Click to edit company");
		dashbaord.click_on_the_company_user_menu();
		cy.log("Click on the Unlink button");
		addComapy.click_on_unlink_button();
		cy.log("Click on 'Ok' button to confirm Unlink");
		addComapy.click_on_ok_button_unlink_window();
		cy.log("Confirm success toast message");
		cy.contains("Unlinked company");
	});
});

// it("Visits the Councilbox web page", function() {
// 	cy.visit(url);
// });

// it("Change language to Spanish", function() {
// 	cy.get("#language-selector").click();
// 	cy.get("#language-es").click();
// });

// it("Enters email address", function() {
// 	cy.get("#username")
// 		.clear()
// 		.type("alem@qaengineers.net")
// 		.should("have.value", "alem@qaengineers.net");
// });

// it("Enters password", function() {
// 	cy.get("#password")
// 		.clear()
// 		.type("Mostar123!test")
// 		.should("have.value", "Mostar123!test");
// });

// it("Clicks login button", function() {
// 	cy.get("#login-button").click();
// });
// });

// describe("The user is able to add company in the Councilbox", function() {
// 	it("From the dashboard click on the 'Anadir sociedad' button", function() {
// 		cy.wait(5000);
// 		cy.get("#entidadesSideBar").click();

// 		cy.get("#entidadesAddSociedad").click();
// 	});

// 	/*

//     it("Click on the 'Prueba Gratida' button", function() {
//         cy.contains('Prueba gratuita').click()
//     });

//     it("Click on the “Cerrar” button then click on the “Anadir sociedad” button", function() {
//         cy.contains('Cerrar').click()
//         cy.contains('Añadir sociedad').click()
//     });

//     */

// 	it("Populate “Razón social*” field", function() {
// 		cy.get("#company-name-input")
// 			.clear()
// 			.type("Test");
// 	});

// 	it("Populate “CIF de la entidad*” field", function() {
// 		cy.get("#company-id-input")
// 			.clear()
// 			.type(Cypress.config("UniqueNumber"));
// 	});

// 	it("Populate “Dominio” field", function() {
// 		cy.get("#company-domain-input")
// 			.clear()
// 			.type("Test");
// 	});

// 	it("Populate “Clave maestra” field", function() {
// 		cy.get("#company-key-input")
// 			.clear()
// 			.type("Test");
// 	});
// 	/*
//     it("Populate “Identificador externo” field", function() {
//         cy.get('#company-external-id-input').clear()
//             .type(Cypress.config('UniqueNumber'))
//     });
// */

// 	it("Scroll down the page and populate “Dirección” field", function() {
// 		cy.get("#company-address-input")
// 			.clear()
// 			.type("Test");
// 	});

// 	it("Populate “Localidad” field", function() {
// 		cy.get("#company-city-input")
// 			.clear()
// 			.type("Test");
// 	});

// 	it("Select the “Pais”", function() {
// 		cy.get("#company-country-select").click();
// 		cy.get("#company-country-Portugal").click();
// 	});

// 	it("Populate “Código Postal” field", function() {
// 		cy.get("#company-zipcode-input")
// 			.clear()
// 			.type(Cypress.config("UniqueNumber"));
// 	});

// 	it("Populate “Código afiliación”", function() {
// 		cy.get("#company-code-input")
// 			.clear()
// 			.type("Test");
// 	});
// });

// describe("The user is able to Link company", function() {
// 	it("From the dashboard click on the 'Vincular sociedad' button", function() {
// 		cy.get("#entidadesSideBar").click();
// 		cy.get("#company-link-nav-button").click();
// 	});

// 	it("Populate “CIF de la entidad*” field", function() {
// 		cy.get("#company-link-cif")
// 			.clear()
// 			.type("automationtest")
// 			.should("have.value", "automationtest");
// 	});

// 	it("Populate “Clave maestra*” field", function() {
// 		cy.get("#company-link-key")
// 			.clear()
// 			.type("automation")
// 			.should("have.value", "automation");
// 	});

// 	it("Click on the 'Vincular' button", function() {
// 		cy.get("#company-link-button").click();
// 		cy.wait(2000);
// 	});

// 	it("Back to Home page", function() {
// 		cy.visit(url);
// 		cy.wait(5000);
// 	});
// });

// describe("The user is able to Unlink company", function() {
// 	it("From the dashboard click on the 'Vincular sociedad' button", function() {
// 		cy.get("#entidadesSideBar").click();
// 		cy.get('[role="menuitem"]')
// 			.contains("automationtest")
// 			.should("be.visible")
// 			.click();
// 	});

// 	it("Click on User Menu", function() {
// 		cy.get("#user-menu-trigger").click();
// 		cy.wait(1000);
// 	});

// 	it("Click to Edit Company", function() {
// 		cy.get("#user-settings-edit-company").click({ force: true });
// 		cy.wait(1000);
// 	});

// 	it("Click on the Unlink button", function() {
// 		cy.get("#company-unlink-button").click();
// 		cy.wait(1000);
// 	});

// 	it("Click on 'OK' button to confirm Unlink", function() {
// 		cy.wait(1000);
// 		cy.get("#unlink-modal-button-accept").click();
// 	});

// 	it("Confirm success toast message", function() {
// 		cy.contains("Unlinked company");
// 	});

// 	it("Back to Home page", function() {
// 		cy.visit(url);
// 	});
// });
