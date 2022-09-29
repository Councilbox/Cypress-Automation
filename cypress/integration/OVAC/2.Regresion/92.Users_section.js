import loginPage from "../pageObjects/loginPage"
import requestAppointment from "../pageObjects/requestAppointment"
import appointmentsPage from "../pageObjects/appointmentsPage"
import adminDashboard from "../pageObjects/adminDashboardPage"
import userSettingsPage from "../pageObjects/userSettingsPage"
import entitiesPage from "../pageObjects/entitiesPage"
import knowledgeBasePage from "../pageObjects/knowledgeBasePage"
import tagsPage from "../pageObjects/tagsPage"
import templatesPage from "../pageObjects/templatesPage"
import usersPage from "../pageObjects/usersPage"

let login = new loginPage()
let tag = new tagsPage()
let appointment = new requestAppointment()
let appointments = new appointmentsPage()
let dashboard = new adminDashboard()
let settings = new userSettingsPage()
let entity = new entitiesPage()
let documentation = new knowledgeBasePage()
let template = new templatesPage()
let users = new usersPage()


describe("Users section - regression tests", function() {
    before(function() {    
   });

   it("Admin is able to use search engine to find users by user name", function() {
    const email = "alem+1@qaengineers.net"
    const passowrd = "Mostar1234!test12"
    const user = "Teeeeeeeeeeeeeeestttt Tesssssssssssssst"
    cy.clearLocalStorage()
    cy.log("Open browser and enter URL")
        login.navigate_admin()
    cy.log("The user is able to Login")
        login.enter_email(email)
        login.enter_password(passowrd)
        login.login_submit()
    cy.log("The user is able to click on the 'Users' tab")
        dashboard.click_on_users()
    cy.log("The user is able to click on the 'Search' field and enter the name")
        users.search_for_user(user)
    cy.log("The user with that name is displayed successfully")
        users.verify_user(user)
   })

   it("Admin is able to create new user with 'Catala' language in the Users form", function() {
    const email = "alem+1@qaengineers.net"
    const passowrd = "Mostar1234!test"
    const name = "Test"+Cypress.config('UniqueNumber')
    const surname = "Automation"
    const phone_code = "+387"
    const phone = "61123123"
    const tin = "12345678Z"
    const email_user = "test1"+Cypress.config('UniqueNumber')+"@test.com"
    cy.clearLocalStorage()
    cy.log("Open browser and enter URL")
        login.navigate_admin()
    cy.log("The user is able to click on the 'Users' tab")
        dashboard.click_on_users()
    cy.log("The user is able to click on the 'Add' button")
        users.click_add_user()
    cy.log("The user is able to populate all required fields and set language to 'Catala'")
        users.enter_name(name)
        users.enter_surname(surname)
        users.enter_phone_code(phone_code)
        users.enter_phone(phone)
        users.enter_tin(tin)
        users.enter_email(email_user)
        users.click_language_menu()
        users.select_calego_language()
    cy.log("Click Continue")
        users.click_continue()
        users.click_on_finalize()
        cy.wait(5000)
    cy.log("Verify user is created")
        users.search_for_user(name)
        users.verify_user(name)
   })

   it("Admin is able to create new user with 'Spanish' language in the Users form", function() {
    const email = "alem+1@qaengineers.net"
    const passowrd = "Mostar1234!test"
    const name = "Test"+Cypress.config('UniqueNumber')
    const surname = "Automation"
    const phone_code = "+387"
    const phone = "61123123"
    const tin = "12345678Z"
    const email_user = "test2"+Cypress.config('UniqueNumber')+"@test.com"
    cy.clearLocalStorage()
    cy.log("Open browser and enter URL")
        login.navigate_admin()
    cy.log("The user is able to click on the 'Users' tab")
        dashboard.click_on_users()
    cy.log("The user is able to click on the 'Add' button")
        users.click_add_user()
    cy.log("The user is able to populate all required fields and set language to 'Spanish'")
        users.enter_name(name)
        users.enter_surname(surname)
        users.enter_phone_code(phone_code)
        users.enter_phone(phone)
        users.enter_tin(tin)
        users.enter_email(email_user)
        users.click_language_menu()
        users.select_spanish_language()
    cy.log("Click Continue")
        users.click_continue()
        users.click_on_finalize()
    cy.log("Verify user is created")
        users.search_for_user(name)
        users.verify_user(name)
   })

   it("Admin is able to create new user with 'Italiano' language in the Users form", function() {
    const email = "alem+1@qaengineers.net"
    const passowrd = "Mostar1234!test"
    const name = "Test"+Cypress.config('UniqueNumber')
    const surname = "Automation"
    const phone_code = "+387"
    const phone = "61123123"
    const tin = "12345678Z"
    const email_user = "test3"+Cypress.config('UniqueNumber')+"@test.com"
    cy.clearLocalStorage()
    cy.log("Open browser and enter URL")
        login.navigate_admin()
    cy.log("The user is able to click on the 'Users' tab")
        dashboard.click_on_users()
    cy.log("The user is able to click on the 'Add' button")
        users.click_add_user()
    cy.log("The user is able to populate all required fields and set language to 'Italiano'")
        users.enter_name(name)
        users.enter_surname(surname)
        users.enter_phone_code(phone_code)
        users.enter_phone(phone)
        users.enter_tin(tin)
        users.enter_email(email_user)
        users.click_language_menu()
        users.select_italiano_language()
    cy.log("Click Continue")
        users.click_continue()
        users.click_on_finalize()
    cy.log("Verify user is created")
        users.search_for_user(name)
        users.verify_user(name)
   })

   it("Admin is able to create new user with 'Euskera' language in the Users form", function() {
    const email = "alem+1@qaengineers.net"
    const passowrd = "Mostar1234!test"
    const name = "Test"+Cypress.config('UniqueNumber')
    const surname = "Automation"
    const phone_code = "+387"
    const phone = "61123123"
    const tin = "12345678Z"
    const email_user = "test4"+Cypress.config('UniqueNumber')+"@test.com"
    cy.clearLocalStorage()
    cy.log("Open browser and enter URL")
        login.navigate_admin()
    cy.log("The user is able to click on the 'Users' tab")
        dashboard.click_on_users()
    cy.log("The user is able to click on the 'Add' button")
        users.click_add_user()
    cy.log("The user is able to populate all required fields and set language to 'Euskera'")
        users.enter_name(name)
        users.enter_surname(surname)
        users.enter_phone_code(phone_code)
        users.enter_phone(phone)
        users.enter_tin(tin)
        users.enter_email(email_user)
        users.click_language_menu()
        users.select_euskera_language()
    cy.log("Click Continue")
        users.click_continue()
        users.click_on_finalize()
    cy.log("Verify user is created")
        users.search_for_user(name)
        users.verify_user(name)
   })

   it("Admin is able to create new user with 'English' language in the Users form", function() {
    const email = "alem+1@qaengineers.net"
    const passowrd = "Mostar1234!test"
    const name = "Test"+Cypress.config('UniqueNumber')
    const surname = "Automation"
    const phone_code = "+387"
    const phone = "61123123"
    const tin = "12345678Z"
    const email_user = "test5"+Cypress.config('UniqueNumber')+"@test.com"
    cy.clearLocalStorage()
    cy.log("Open browser and enter URL")
        login.navigate_admin()
    cy.log("The user is able to click on the 'Users' tab")
        dashboard.click_on_users()
    cy.log("The user is able to click on the 'Add' button")
        users.click_add_user()
    cy.log("The user is able to populate all required fields and set language to 'English'")
        users.enter_name(name)
        users.enter_surname(surname)
        users.enter_phone_code(phone_code)
        users.enter_phone(phone)
        users.enter_tin(tin)
        users.enter_email(email_user)
        users.change_language_english()
    cy.log("Click Continue")
        users.click_continue()
        users.click_on_finalize()
    cy.log("Verify user is created")
        users.search_for_user(name)
        users.verify_user(name)
   })

   it("Admin is able to click the 'Return' button in the 'Add user' form", function() {
    const email = "alem+1@qaengineers.net"
    const passowrd = "Mostar1234!test"
    const name = "Test"+Cypress.config('UniqueNumber')
    const surname = "Automation"
    const phone_code = "+387"
    const phone = "61123123"
    const tin = "12345678Z"
    const email_user = "test"+Cypress.config('UniqueNumber')+"@test.com"
    cy.clearLocalStorage()
    cy.log("Open browser and enter URL")
        login.navigate_admin()
    cy.log("The user is able to click on the 'Users' tab")
        dashboard.click_on_users()
    cy.log("The user is able to click on the 'Add' button")
        users.click_add_user()
    cy.log("The user is able to click on the 'Back' icon")
        users.click_return()
   })

   it("The admin is not able to create a user without populating the Name field - Add user form", function() {
    const email = "alem+1@qaengineers.net"
    const passowrd = "Mostar1234!test"
    const name = "Test"+Cypress.config('UniqueNumber')
    const surname = "Automation"
    const phone_code = "+387"
    const phone = "61123123"
    const tin = "12345678Z"
    const email_user = "test6"+Cypress.config('UniqueNumber')+"@test.com"
    cy.clearLocalStorage()
    cy.log("Open browser and enter URL")
        login.navigate_admin()
    cy.log("The user is able to click on the 'Users' tab")
        dashboard.click_on_users()
    cy.log("The user is able to click on the 'Add' button")
        users.click_add_user()
    cy.log("The user is able to populate all required fields except the 'Name' field")
        users.enter_surname(surname)
        users.enter_phone_code(phone_code)
        users.enter_phone(phone)
        users.enter_tin(tin)
        users.enter_email(email_user)
    cy.log("Click Continue")
        users.click_continue()
    cy.log("The error message is displayed below the 'Name' field")
        users.verify_error()
   })

   it("The admin is not able to create a user without populating the Surname field - Add user form", function() {
    const email = "alem+1@qaengineers.net"
    const passowrd = "Mostar1234!test"
    const name = "Test"+Cypress.config('UniqueNumber')
    const surname = "Automation"
    const phone_code = "+387"
    const phone = "61123123"
    const tin = "12345678Z"
    const email_user = "test7"+Cypress.config('UniqueNumber')+"@test.com"
    cy.clearLocalStorage()
    cy.log("Open browser and enter URL")
        login.navigate_admin()
    cy.log("The user is able to click on the 'Users' tab")
        dashboard.click_on_users()
    cy.log("The user is able to click on the 'Add' button")
        users.click_add_user()
    cy.log("The user is able to populate all required fields except the 'Surname' field")
        users.enter_name(name)
        users.enter_phone_code(phone_code)
        users.enter_phone(phone)
        users.enter_tin(tin)
        users.enter_email(email_user)
    cy.log("Click Continue")
        users.click_continue()
    cy.log("The error message is displayed below the 'Surname' field")
        users.verify_error()
   })

   it("The admin is not able to create a user without populating the E-mail field - Add user form", function() {
    const email = "alem+1@qaengineers.net"
    const passowrd = "Mostar1234!test"
    const name = "Test"+Cypress.config('UniqueNumber')
    const surname = "Automation"
    const phone_code = "+387"
    const phone = "61123123"
    const tin = "12345678Z"
    const email_user = "test"+Cypress.config('UniqueNumber')+"@test.com"
    cy.clearLocalStorage()
    cy.log("Open browser and enter URL")
        login.navigate_admin()
    cy.log("The user is able to click on the 'Users' tab")
        dashboard.click_on_users()
    cy.log("The user is able to click on the 'Add' button")
        users.click_add_user()
    cy.log("The user is able to populate all required fields except the 'Email' field")
        users.enter_name(name)
        users.enter_surname(surname)
        users.enter_phone_code(phone_code)
        users.enter_phone(phone)
        users.enter_tin(tin)
    cy.log("Click Continue")
        users.click_continue()
    cy.log("The error message is displayed below the 'Email' field")
        users.verify_error()
   })

   it("The admin is not able to create a user with invalid Telephone number field - Add user form", function() {
    const email = "alem+1@qaengineers.net"
    const passowrd = "Mostar1234!test"
    const name = "Test"+Cypress.config('UniqueNumber')
    const surname = "Automation"
    const phone_code = "+387"
    const phone = "61123123"
    const tin = "12345678Z"
    const email_user = "test8"+Cypress.config('UniqueNumber')+"@test.com"
    cy.clearLocalStorage()
    cy.log("Open browser and enter URL")
        login.navigate_admin()
    cy.log("The user is able to click on the 'Users' tab")
        dashboard.click_on_users()
    cy.log("The user is able to click on the 'Add' button")
        users.click_add_user()
    cy.log("The user is able to populate all required fields except the 'Phone' field")
        users.enter_name(name)
        users.enter_surname(surname)
        users.enter_phone_code(phone_code)
        users.enter_tin(tin)
        users.enter_email(email_user)
    cy.log("Click Continue")
        users.click_continue()
    cy.log("The error message is displayed below the 'Phone' field")
        users.verify_error()
   })

   it("The admin is able to choose entities when adding the user - Add user form", function() {
    const email = "alem+1@qaengineers.net"
    const passowrd = "Mostar1234!test"
    const name = "Test"+Cypress.config('UniqueNumber')
    const surname = "Automation"
    const phone_code = "+387"
    const phone = "61123123"
    const tin = "12345678Z"
    const email_user = "test9"+Cypress.config('UniqueNumber')+"@test.com"
    cy.clearLocalStorage()
    cy.log("Open browser and enter URL")
        login.navigate_admin()
    cy.log("The user is able to click on the 'Users' tab")
        dashboard.click_on_users()
    cy.log("The user is able to click on the 'Add' button")
        users.click_add_user()
    cy.log("The user is able to populate all required fields and set language to 'Catala'")
        users.enter_name(name)
        users.enter_surname(surname)
        users.enter_phone_code(phone_code)
        users.enter_phone(phone)
        users.enter_tin(tin)
        users.enter_email(email_user)
        users.click_language_menu()
        users.select_calego_language()
    cy.log("Click Continue")
        users.click_continue()
        users.click_on_finalize()
    cy.log("Verify user is created")
        users.search_for_user(name)
        users.verify_user(name)
   })

  





   






});