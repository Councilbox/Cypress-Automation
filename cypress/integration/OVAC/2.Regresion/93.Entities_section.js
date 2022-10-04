import loginPage from "../pageObjects/loginPage"
import requestAppointment from "../pageObjects/requestAppointment"
import appointmentsPage from "../pageObjects/appointmentsPage"
import adminDashboard from "../pageObjects/adminDashboardPage"
import userSettingsPage from "../pageObjects/userSettingsPage"
import entitiesPage from "../pageObjects/entitiesPage"

let login = new loginPage()
let appointment = new requestAppointment()
let appointments = new appointmentsPage()
let dashboard = new adminDashboard()
let settings = new userSettingsPage()
let entit = new entitiesPage()


describe("Entities settings - regression tests", function() {
    before(function() {    
   });

   it("User is not able to Add entity without populating required fields - Entities section", function() {
    const email = "alem+1@qaengineers.net"
    const passowrd = "Mostar1234!test12"
    const entity = "OVAC Demo"
    cy.clearLocalStorage()
    cy.log("Open browser and enter URL")
        login.navigate_admin()
    cy.log("The user is able to Login")
        login.enter_email(email)
        login.enter_password(passowrd)
        login.login_submit()
    cy.log("Select OVAC Demo entity")
        entit.click_on_entity()
        entit.if_entity()
    cy.log("The user is able to click on the 'Institutions' button")
        dashboard.click_on_istitutions()
    cy.log("The user is able to click on the 'Add' button")
        entit.click_add_button()
    cy.log("Click on Add again without populating enything")
        entit.click_submit_entity()
    cy.log("The error message is displayed below required fields")
        entit.verify_name_error()
   })

   it("The user is able to Ban Entity - Entities section", function() {
    const email = "alem+1@qaengineers.net"
    const passowrd = "Mostar1234!test12"
    const entity = "OVAC Demo"
    const name = "Test"+Cypress.config('UniqueNumber')
    const tax_id = Cypress.config('UniqueNumber')
    const companyAddress = "Test"
    const town = "Test"
    const zip = "123000"
    cy.clearLocalStorage()
    cy.log("Open browser and enter URL")
        login.navigate_admin()
    cy.log("Select OVAC Demo entity")
        entit.click_on_entity()
        entit.if_entity()
    cy.log("The user is able to click on the 'Institutions' button")
        dashboard.click_on_istitutions()
    cy.log("The user is able to click on the 'Add' button")
        entit.click_add_button()
    cy.log("Populate all required fields and click SUBMIT")
        entit.populate_all_fields(name, tax_id, companyAddress, town, zip)
        entit.click_submit_entity()
    cy.log("Select OVAC Demo entity")
        entit.click_on_entity()
        entit.if_entity()
    cy.log("Go to Institutions")
        dashboard.click_on_istitutions()
        entit.search_for_inst(name)
    cy.log("The user is able to navigate on already existing entity and click on the 'Ban' button")
        entit.click_action_button()
        entit.click_on_ban()
        entit.click_alert_accept()
   })

   it("The user is able to Delete Entity - Entities section", function() {
    const email = "alem+1@qaengineers.net"
    const passowrd = "Mostar1234!test12"
    const entity = "OVAC Demo"
    const name = "Delete"+Cypress.config('UniqueNumber')
    const tax_id = "1"+Cypress.config('UniqueNumber')
    const companyAddress = "Test"
    const town = "Test"
    const zip = "123000"
    cy.clearLocalStorage()
    cy.log("Open browser and enter URL")
        login.navigate_admin()
    cy.log("Select OVAC Demo entity")
        entit.click_on_entity()
        entit.if_entity()
    cy.log("The user is able to click on the 'Institutions' button")
        dashboard.click_on_istitutions()
    cy.log("The user is able to click on the 'Add' button")
        entit.click_add_button()
    cy.log("Populate all required fields and click SUBMIT")
        entit.populate_all_fields(name, tax_id, companyAddress, town, zip)
        entit.click_submit_entity()
    cy.log("Select OVAC Demo entity")
        entit.click_on_entity()
        entit.if_entity()
    cy.log("Go to Institutions")
        dashboard.click_on_istitutions()
        entit.search_for_inst(name)
    cy.log("The user is able to navigate on already existing entity and click on the 'Ban' button")
        entit.click_action_button()
        entit.click_on_delete()
        entit.click_alert_accept()
   })

   it("The user is able to Edit Entity - Entities section", function() {
    const email = "alem+1@qaengineers.net"
    const passowrd = "Mostar1234!test12"
    const entity = "OVAC Demo"
    const name = "Institutions740352410913"
    const companyAddress = "Test"+Cypress.config('UniqueNumber')
    cy.clearLocalStorage()
    cy.log("Open browser and enter URL")
        login.navigate_admin()
    cy.log("Select OVAC Demo entity")
        entit.click_on_entity()
        entit.if_entity()
    cy.log("The user is able to click on the 'Institutions' button")
        dashboard.click_on_istitutions()
    cy.log("Search for Entity")
        entit.search_for_inst(name)
    cy.log("Click on Action button")
        entit.click_action_button()
    cy.log("Click on EDIT")
        entit.click_on_edit()
    cy.log("Edit the entity")
        entit.enter_entity_address(companyAddress)
    cy.log("Click on SAVE")
        entit.click_on_save()
   })

   it("The user is able to switch between the pages in the Institutions form - Entities section", function() {
    const email = "alem+1@qaengineers.net"
    const passowrd = "Mostar1234!test12"
    const entity = "OVAC Demo"
    cy.clearLocalStorage()
    cy.log("Open browser and enter URL")
        login.navigate_admin()
    cy.log("Select OVAC Demo entity")
        entit.click_on_entity()
        entit.if_entity()
    cy.log("Go to Entities page")
        dashboard.click_on_istitutions()
    cy.log("Go to Next Page")
        entit.go_to_next_page()
   })





   






});