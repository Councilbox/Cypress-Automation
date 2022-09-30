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



beforeEach(function() {
    cy.restoreLocalStorage();
});

afterEach(function() {
    cy.saveLocalStorage();
});

before(function() {
    cy.clearLocalStorage();
    cy.saveLocalStorage();
});




describe("Company settings", function() {
	before(function() {});

	it("Login", function() {
		const email = "alem@qaengineers.net";
		const password = "Mostar123!test";

		cy.log("Navigate to login page");
		cy.visit(login_url);
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



});