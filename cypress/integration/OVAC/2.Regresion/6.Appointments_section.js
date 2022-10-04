import loginPage from "../pageObjects/loginPage"
import requestAppointment from "../pageObjects/requestAppointment"
import appointmentsPage from "../pageObjects/appointmentsPage"
import adminDashboard from "../pageObjects/adminDashboardPage"
import userSettingsPage from "../pageObjects/userSettingsPage"
import entitiesPage from "../pageObjects/entitiesPage"
import knowledgeBasePage from "../pageObjects/knowledgeBasePage"
import tagsPage from "../pageObjects/tagsPage"
import templatesPage from "../pageObjects/templatesPage"

let login = new loginPage()
let tag = new tagsPage()
let appointment = new requestAppointment()
let appointments = new appointmentsPage()
let dashboard = new adminDashboard()
let settings = new userSettingsPage()
let entit = new entitiesPage()
let documentation = new knowledgeBasePage()
let template = new templatesPage()



describe("Appointments section - regression tests", function() {
    before(function() {    
   });

   it("The user is able to reorder Consents list - Consents tab", function() {
    const email_log = "alem+1@qaengineers.net"
    const passowrd = "Mostar1234!test12"
    const name = "Test"
    const surname = "Test"
    const dni = "12345678Z"
    const phone_code = "387"
    const phone = "61123123"
    const email = "test"+Cypress.config('UniqueNumber')+"@test.com"
    const title= "Test123"
    const title2 = "aaa123"
    cy.clearLocalStorage()
    cy.log("Open browser and enter URL")
        login.navigate_admin()
    cy.log("The user is able to Login")
        login.enter_email(email_log)
        login.enter_password(passowrd)
        login.login_submit()
    cy.log("Select OVAC Demo entity")
        entit.click_on_entity()
        entit.if_entity()
    cy.log("The user is able to click on the 'Appointments' tab")
        dashboard.click_on_appointments()
    cy.log("The user is able to click on the '+' button")
        appointments.click_on_add_button()
    
    cy.log("Select Procedure and click Save")
        appointments.select_procedure()
        appointments.click_consent_save_button()
    cy.log("Click on Continue")
        appointments.click_next_details()
    cy.log("Click on Add Participant")
        appointments.click_add_participant_button()
    cy.log("Enter all Required fields and click SAVE")
        appointments.enter_participant_data(name, surname, dni, email, phone_code, phone)
        appointments.click_consent_save_button()
    cy.log("Click Continue")
        appointments.click_next_participants()
    cy.log("Click on Add Consents")
        appointments.click_on_add_consents()
    cy.log("Enter Title and Click save")
        appointments.enter_consent_title(title)
        appointments.click_consent_save_button()
    cy.log("Add one more Consents")
        appointments.click_add_consents()
        appointments.enter_consent_title(title2)
        appointments.click_consent_save_button()
    cy.log("Click on Reorder")
        appointments.click_on_reorder()
    cy.log("Drag first Consents to second place")
        appointments.drag_first_consent()
   })


  







   






});