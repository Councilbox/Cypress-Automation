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


describe("User settings - regression tests", function() {
    before(function() {    
   });

   

   it("The user is able to change the Name - Users settings section", function() {
    const name = "Alem"+Cypress.config('UniqueNumber')
    const email = "alem+1@qaengineers.net"
    const passowrd = "Mostar1234!test"
    cy.clearLocalStorage()
    cy.log("Open browser and enter URL")
        login.navigate_admin()
    cy.log("The user is able to Login")
        login.enter_email(email)
        login.enter_password(passowrd)
        login.login_submit()
    cy.log("The user is able to click on the Account icon")
        settings.click_on_my_account()
    cy.log("The user is able to click on the Edit button")
        settings.click_on_user_settings()
    cy.log("The user is able to edit a 'Name' field")
        settings.enter_user_name(name)
    cy.log("Click on SAVE")
        settings.click_on_save()
    cy.log("Verify that User is successfully edited")
        cy.reload()
        settings.verify_user_name(name)
   })

   it("The user is able to change the Surname - Users settings section", function() {
    const surname = "Balla"+Cypress.config('UniqueNumber')
    const email = "alem+1@qaengineers.net"
    const passowrd = "Mostar1234!test"
    cy.clearLocalStorage()
    cy.log("Open browser and enter URL")
        login.navigate_admin()
    cy.log("The user is able to click on the Account icon")
        settings.click_on_my_account()
    cy.log("The user is able to click on the Edit button")
        settings.click_on_user_settings()
    cy.log("The user is able to edit a 'Surname' field")
        settings.enter_user_surname(surname)
    cy.log("Click on SAVE")
        settings.click_on_save()
    cy.log("Verify that User is successfully edited")
        cy.reload()
        settings.verify_user_surname(surname)
   })

   it("The user is able to change the Email - Users settings section", function() {
    const email = "alem+1@qaengineers.net"
    const passowrd = "Mostar1234!test"
    cy.clearLocalStorage()
    cy.log("Open browser and enter URL")
        login.navigate_admin()
    cy.log("The user is able to click on the Account icon")
        settings.click_on_my_account()
    cy.log("The user is able to click on the Edit button")
        settings.click_on_user_settings()
    cy.log("The user is able to edit a 'Email' field")
        settings.enter_user_email(email)
    cy.log("Click on SAVE")
        settings.click_on_save()
    cy.log("Verify that User is successfully edited")
        cy.reload()
        settings.verify_user_email(email)
   })

   it("The user is able to change the Telephone No - Users settings section", function() {
    const email = "alem+1@qaengineers.net"
    const passowrd = "Mostar1234!test"
    const phone = Cypress.config('UniqueNumber')
    cy.clearLocalStorage()
    cy.log("Open browser and enter URL")
        login.navigate_admin()
    cy.log("The user is able to click on the Account icon")
        settings.click_on_my_account()
    cy.log("The user is able to click on the Edit button")
        settings.click_on_user_settings()
    cy.log("The user is able to edit a 'Email' field")
        settings.enter_user_phone(phone)
    cy.log("Click on SAVE")
        settings.click_on_save()
    cy.log("Verify that User is successfully edited")
        cy.reload()
        settings.verify_user_phone(phone)
   })

   it("The user is able to change the Language to English - Users settings section", function() {
    const email = "alem+1@qaengineers.net"
    const passowrd = "Mostar1234!test"
    const phone = Cypress.config('UniqueNumber')
    cy.clearLocalStorage()
    cy.log("Open browser and enter URL")
        login.navigate_admin()
    cy.log("The user is able to click on the Account icon")
        settings.click_on_my_account()
    cy.log("The user is able to click on the Edit button")
        settings.click_on_user_settings()
    cy.log("The user is able to edit a 'Language' field")
        settings.click_on_language_menu()
        settings.select_english_language()
    cy.log("Click on SAVE")
        settings.click_on_save()
    cy.log("Verify that User is successfully edited")
        cy.reload()
        settings.verify_english_language()
        
   })

   

   it("The user is able to change password - User settings section", function() {
    const email = "alem+1@qaengineers.net"
    const password = "Mostar1234!test"
    const new_password = "T2est1234!blabla"
    cy.clearLocalStorage()
    cy.log("Open browser and enter URL")
        login.navigate_admin()
    cy.log("The user is able to click on the Account icon")
        settings.click_on_my_account()
    cy.log("The user is able to click on the Edit button")
        settings.click_on_user_settings()
    cy.log("The user is able to click on the 'Change password' button")
        settings.click_on_change_password()
    cy.log("The user is able to enter valid data in the Current label")
        settings.enter_current_password(password)
    cy.log("The user is able to enter new password")
        settings.enter_new_password(new_password)
        settings.enter_new_password_confirm(new_password)
    cy.log("Click on SAVE")
        settings.click_on_save_password()
    cy.log("Verify that Password is successfully changed by logging out and logging in")
        settings.click_on_my_account()
        settings.click_on_logout()
        login.enter_email(email)
        login.enter_password(new_password)
        login.login_submit()
        login.confirm_login()
    cy.log("Change password back to original")
        settings.click_on_my_account()
        settings.click_on_user_settings()
        settings.click_on_change_password()
        settings.enter_current_password(new_password)
        settings.enter_new_password(password)
        settings.enter_new_password_confirm(password)
        settings.click_on_save_password()
   })

   it("The user is not able to change password with invalid input in the Current password field - User settings section ", function() {
    const email = "alem+1@qaengineers.net"
    const password = "Mostar1234!test"
    const new_password = "T2est1234!blabla"
    const invalid_password = "blabladsfa123!!A"
    cy.clearLocalStorage()
    cy.log("Open browser and enter URL")
        login.navigate_admin()
    cy.log("The user is able to click on the Account icon")
        settings.click_on_my_account()
    cy.log("The user is able to click on the Edit button")
        settings.click_on_user_settings()
    cy.log("The user is able to click on the 'Change password' button")
        settings.click_on_change_password()
    cy.log("The user is able to enter invalid data in the Current label")
        settings.enter_current_password(invalid_password)
    cy.log("The user is able to enter new password")
        settings.enter_new_password(new_password)
        settings.enter_new_password_confirm(new_password)
    cy.log("Click on SAVE")
        settings.click_on_save_password()
    cy.log("The error message is displayed below Current password label")
        settings.verify_existing_current_password_error()
   })

   it("The user is not able to change password with invalid input in the Confirm password field - User settings section ", function() {
    const email = "alem+1@qaengineers.net"
    const password = "Mostar1234!test"
    const new_password = "T2est1234!blabla"
    const invalid_password = "blabladsfa123!!A"
    cy.clearLocalStorage()
    cy.log("Open browser and enter URL")
        login.navigate_admin()
    cy.log("The user is able to click on the Account icon")
        settings.click_on_my_account()
    cy.log("The user is able to click on the Edit button")
        settings.click_on_user_settings()
    cy.log("The user is able to click on the 'Change password' button")
        settings.click_on_change_password()
    cy.log("The user is able to enter valid data in the Current label")
        settings.enter_current_password(invalid_password)
    cy.log("The user is able to enter new password")
        settings.enter_new_password(new_password)
    cy.log("The user is able to enter invalid password in the Confirm label")
        settings.enter_new_password_confirm(invalid_password)
    cy.log("Click on SAVE")
        settings.click_on_save_password()
    cy.log("The error message is displayed below Confirm password label")
        settings.verify_existing_confirm_password_error()
   })




   






});