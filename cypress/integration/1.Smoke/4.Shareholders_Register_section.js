import dashboardPage from "../pageObjects/dashbaordPage";
import loginPage from "../pageObjects/loginPage";
import shareholdersRegisterPage from "../pageObjects/shareholdersRegisterPage";

const login_url = Cypress.env("baseUrl");

let url = Cypress.config().baseUrl;

let login = new loginPage()
let shareholders = new shareholdersRegisterPage()
let dashboard = new dashboardPage()


describe("Sharehodlers Register - smoke tests", function () {


     before(function() {
        
    });


    it("Login", function() {
        const email = "alem@qaengineers.net"
        const password = "Mostar123!test"
        cy.clearLocalStorage()
        cy.log("Navigate to login page")
            cy.visit(url);
        cy.log("Change language to Spanish")
            login.click_on_language_dropmenu()
            login.select_spanish_language()
        cy.log("Enters email address")
            login.enter_email(email)
        cy.log("Enters password")
            login.enter_password(password)
        cy.log("Clicks login button")
            login.click_login()
    });

    it("The user is able to add a partner in the 'Libro de socios' section", function() {
        
        const name = "Name"+Cypress.config('UniqueNumber')
        const surname = "Surname"+Cypress.config('UniqueNumber')
        const tin = Cypress.config('UniqueNumber')
        const nacionality = "Automation"
        const email = "automationTest@test.com"
        const phone = Cypress.config('UniqueNumber')
        const landline_phone = Cypress.config('UniqueNumber')
        const type_of_member = "Test"
        const votes = "5"
        const shares = "5"
        const registration_record = Cypress.config('UniqueNumber')
        const cancelation_record = "1"+Cypress.config('UniqueNumber')
        const address = "AutomationTest"
        const town = "AutomationTest"
        const province = "Catalonia"
        const zipcode = Cypress.config('UniqueNumber')
    cy.log("Click on Shareholders page")
        dashboard.click_on_shareholders_register()
    cy.log("Click on the 'Anadir socio' form")
        shareholders.click_on_add_member()
    cy.log("Populate “Nombre” field")
        shareholders.enter_partner_name(name)
    cy.log("Populate “Apelidos” field")
        shareholders.enter_partner_surname(surname)
    cy.log("Populate “DNI/NIF” field")
        shareholders.enter_partner_tin(tin)
    cy.log("Populate “Nacionalidad” field")
        shareholders.enter_partner_nacionality(nacionality)
    cy.log("Populate “Email” field")
        shareholders.enter_partner_email(email)
    cy.log("Populate “Telefono” field")
        shareholders.enter_partner_phone(phone)
    cy.log("Populate “Telefono Fijo” field")
        shareholders.enter_partner_landline_phone(landline_phone)
    cy.log("Populate “TIpo de Socio” field")
        shareholders.enter_partner_type_of_member(type_of_member)
    cy.log("Select the “Estado”")
        shareholders.click_on_status_dropmenu()
        shareholders.select_status_option()
    cy.log("Select “Votos”")
        shareholders.enter_partner_votes(votes)
    cy.log("Select “Participaciones”")
        shareholders.enter_partner_shares(shares)
    cy.log("Navigate to the “Ficha” section and populate “Nº de acta de alta” field")
        shareholders.enter_registration_record(registration_record)
    cy.log("Populate “Nº de acta de baja” field")
        shareholders.enter_cancelation_record(cancelation_record)
    cy.log("Select “Fecha de apertura de ficha”")
        shareholders.click_on_date_file_opened_calendar()
        shareholders.click_on_calendar_accept()
    cy.log("Select “Fecha de alta”")
        shareholders.click_on_registration_date_calendar()
        shareholders.click_on_calendar_accept()
    cy.log("Select “Acta de alta”")
        shareholders.click_on_record_of_registration_date_calendar()
        shareholders.click_on_calendar_accept()
    cy.log("Select “Fecha de baja”")
        shareholders.click_on_cancelation_date_calendar()
        shareholders.click_on_calendar_accept()
    cy.log("Select “Acta de baja”")
        shareholders.click_on_record_of_cancelation_date_calendar()
        shareholders.click_on_calendar_accept()
    cy.log("Navigate to the “Datos adicionales” section and populate “Dirección” field")
        shareholders.enter_partner_address(address)
    cy.log("Populate “Localidad” field")
        shareholders.enter_partner_town(town)
    cy.log("Select “Provincia”")
        shareholders.enter_partner_province(province)
    cy.log("Populate “Codigo Postal” field")
        shareholders.enter_partner_zipcode(zipcode)
    cy.log("Select “Idioma”")
        shareholders.click_on_langauge_dropmenu()
        shareholders.select_english_language()
    cy.log("Click on the 'Guardar cambios' button")
        shareholders.click_on_save_button()
    cy.log("Verify that Member is created")
        shareholders.enter_search_data(name)
        shareholders.verify_member(name)
    });



});