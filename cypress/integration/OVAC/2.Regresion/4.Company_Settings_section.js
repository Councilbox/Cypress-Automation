import loginPage from "../pageObjects/loginPage"
import requestAppointment from "../pageObjects/requestAppointment"
import appointmentsPage from "../pageObjects/appointmentsPage"
import adminDashboard from "../pageObjects/adminDashboardPage"
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
    const name = "Company"+Cypress.config('UniqueNumber')
    const email = "alem+1@qaengineers.net"
    const passowrd = "Mostar1234!test12"
    cy.clearLocalStorage()
    cy.log("Open browser and enter URL")
        login.navigate_admin()
    cy.log("The user is able to Login")
        login.enter_email(email)
        login.enter_password(passowrd)
        login.login_submit()
    cy.log("The user is able to click on the Account icon")
        settings.click_on_my_account()
    cy.log("The user is able to click on the Configuration button")
        settings.click_on_company_settings()
    cy.log("The user is able to edit a 'Name' field")
        settings.enter_company_name(name)
    cy.log("Click on SAVE")
        settings.click_on_save_compay_button()
    cy.log("Verify that Company is successfully edited")
        cy.reload()
        settings.verify_company_name(name)
   })

   it("The user is able to change the VAT NO/CIF - Company settings section", function() {
    const email = "alem+1@qaengineers.net"
    const passowrd = "Mostar1234!test12"
    const tax = Cypress.config('UniqueNumber')
    cy.clearLocalStorage()
    cy.log("Open browser and enter URL")
        login.navigate_admin()
  
    cy.log("The user is able to click on the Account icon")
        settings.click_on_my_account()
    cy.log("The user is able to click on the Configuration button")
        settings.click_on_company_settings()
    cy.log("The user is able to edit a 'TAX' field")
        settings.enter_company_tax(tax)
    cy.log("Click on SAVE")
        settings.click_on_save_compay_button()
    cy.log("Verify that Company is successfully edited")
        cy.reload()
        settings.verify_company_tax(tax)
   })

   it("The user is able to change the contact e-mail - Company settings section", function() {
    const email = "alem+1@qaengineers.net"
    const passowrd = "Mostar1234!test12"
    const tax = Cypress.config('UniqueNumber')
    const contact_email = "contact"+Cypress.config('UniqueNumber')+"@test.test"
    cy.clearLocalStorage()
    cy.log("Open browser and enter URL")
        login.navigate_admin()
   
    cy.log("The user is able to click on the Account icon")
        settings.click_on_my_account()
    cy.log("The user is able to click on the Configuration button")
        settings.click_on_company_settings()
    cy.log("The user is able to edit a 'Contact Email' field")
        settings.enter_company_contact_email(contact_email)
    cy.log("Click on SAVE")
        settings.click_on_save_compay_button()
    cy.log("Verify that Company is successfully edited")
        cy.reload()
        settings.verify_company_contact_email(contact_email)
   })

   it("The user is able to change the language to English - Company settings section", function() {
    const email = "alem+1@qaengineers.net"
    const passowrd = "Mostar1234!test12"
    const language = "English"
    cy.clearLocalStorage()
    cy.log("Open browser and enter URL")
        login.navigate_admin()
 
    cy.log("The user is able to click on the Account icon")
        settings.click_on_my_account()
    cy.log("The user is able to click on the Configuration button")
        settings.click_on_company_settings()
    cy.log("The user is able to edit a 'Language' field")
        settings.click_on_company_language_menu()
        settings.select_company_english_language()
    cy.log("Click on SAVE")
        settings.click_on_save_compay_button()
    cy.log("Verify that Company is successfully edited")
        cy.reload()
        settings.verify_company_language(language) 
   })

   it("The user is able to Unlink the Company - Company settings section", function() {

   })




   






});