import loginPage from "../pageObjects/loginPage"
import requestAppointment from "../pageObjects/requestAppointment"
import appointmentsPage from "../pageObjects/appointmentsPage"
import adminDashboard from "../pageObjects/adminDashboardPage"
import { Pass } from "codemirror"
import Password from "antd/lib/input/Password"
import userSettingsPage from "../pageObjects/userSettingsPage"

let login = new loginPage()
let appointment = new requestAppointment()
let appointments = new appointmentsPage()
let dashboard = new adminDashboard()
let settings = new userSettingsPage()


describe("Company settings - regression tests", function() {
    before(function() {    
   });

   it("The user is able to change the Name of the company - Company settings section", function() {
    const participant = "Automation"
    const name = "Automation"+Cypress.config('UniqueNumber')
    const email = "alem+1@qaengineers.net"
    const passowrd = "Mostar1234!test"
    cy.clearLocalStorage()
    cy.log("Open browser and enter URL")
        login.navigate_admin()
    cy.log("The user is able to Login")
        login.enter_email(email)
        login.enter_password(passowrd)
        login.login_submit()
    cy.log("The user is able to navigate on the already existing meeting and click on the 'tree dots' icon")
        appointments.search_for_participant(participant)
        appointments.click_on_action_menu()
    cy.log("The user is able to click on the 'Edit' button")
        appointments.click_on_participants_menu()
        appointments.click_on_menu_participant()
        appointments.click_on_edit_participanth()
    cy.log("The user is able to edit a 'Name' field")
        appointments.enter_participant_name(name)
    cy.log("Click on SAVE")
        appointments.click_on_save_participanth()
    cy.log("Verify that Company is successfully edited")
        appointments.verify_participant_is_saved(name)
   })





   






});