import loginPage from "../pageObjects/loginPage"
import requestAppointment from "../pageObjects/requestAppointment"
import appointmentsPage from "../pageObjects/appointmentsPage"
import adminDashboard from "../pageObjects/adminDashboardPage"

let login = new loginPage()
let appointment = new requestAppointment()
let appointments = new appointmentsPage()
let dashboard = new adminDashboard()


describe("Request appointment - regression tests", function() {
    before(function() {    
   });

   it("Admin is able to Log in to the page", function() {
    const email = "alem+1@qaengineers.net"
    const password = "Mostar1234!test"
    cy.log("Open the browser and enter URL")
        login.navigate_admin()
    cy.log("Populate all required fields with valid data")
        login.enter_email(email)
        login.enter_password(password)
    cy.log("Click on login button")
        login.login_submit()
    cy.log("Admin shuold be logged in")
        login.confirm_login()
   })







});