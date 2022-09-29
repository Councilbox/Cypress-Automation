import loginPage from "../pageObjects/loginPage"
import requestAppointment from "../pageObjects/requestAppointment"
import appointmentsPage from "../pageObjects/appointmentsPage"
import adminDashboard from "../pageObjects/adminDashboardPage"
import userSettingsPage from "../pageObjects/userSettingsPage"
import entitiesPage from "../pageObjects/entitiesPage"
import knowledgeBasePage from "../pageObjects/knowledgeBasePage"
import tagsPage from "../pageObjects/tagsPage"

let login = new loginPage()
let tag = new tagsPage()
let appointment = new requestAppointment()
let appointments = new appointmentsPage()
let dashboard = new adminDashboard()
let settings = new userSettingsPage()
let entity = new entitiesPage()
let documentation = new knowledgeBasePage()


describe("Tags section - regression tests", function() {
    before(function() {    
   });

   it("The user is able to edit already existing tag - <Tags> tab - Knowledge base sectionn", function() {
    const email = "alem+1@qaengineers.net"
    const passowrd = "Mostar1234!test12"
    const title = "Folder"+Cypress.config('UniqueNumber')
    const code = "Code"+Cypress.config('UniqueNumber')
    const value = "V"+Cypress.config('UniqueNumber')
    const code_new = "NewCode"+Cypress.config('UniqueNumber')
    cy.clearLocalStorage()
    cy.log("Open browser and enter URL")
        login.navigate_admin()
    cy.log("The user is able to Login")
        login.enter_email(email)
        login.enter_password(passowrd)
        login.login_submit()
    cy.log("The user is able to click on the 'Tags' button")
        dashboard.click_on_tags()
    cy.log("Add new Tag")
        tag.click_add_button()
        tag.enter_code(code)
        tag.enter_value(value)
        tag.click_save()
        tag.search_for_tag(code)
    cy.log("The user is able to click on the 'Edit' icon")
        tag.click_on_action_menu()
        tag.click_on_edit()
    cy.log("Change the Code")
        tag.enter_code(code_new)
    cy.log("Click on SAVE")
        tag.click_save()
    cy.log("Verify that Tag is edited")
        tag.search_for_tag(code_new)
        tag.verify_tag(code_new)
   })

   it("The user is able to delete already existing tab - <Tags> tab - Knowledge base section", function() {
    const email = "alem+1@qaengineers.net"
    const passowrd = "Mostar1234!test"
    const code = "Delete"+Cypress.config('UniqueNumber')
    const value = "V"+Cypress.config('UniqueNumber')
    cy.clearLocalStorage()
    cy.log("Open browser and enter URL")
        login.navigate_admin()
    cy.log("The user is able to click on the 'Tags' button")
        dashboard.click_on_tags()
    cy.log("Add new Tag")
        tag.click_add_button()
        tag.enter_code(code)
        tag.enter_value(value)
        tag.click_save()
        tag.search_for_tag(code)
    cy.log("The user is able to click on the 'Delete' icon")
        tag.click_on_action_menu()
        tag.click_on_delete()
        tag.alert_confirm()
    cy.log('Verify that Tag is deleted')
        tag.search_for_tag(code)
        tag.verify_tag_deleted()
   })

   it("The user is not able to add a tag without populating Value field - <Tags> tab - Knowledge base section", function() {
    const email = "alem+1@qaengineers.net"
    const passowrd = "Mostar1234!test"
    const code = "Delete"+Cypress.config('UniqueNumber')
    const value = "V"+Cypress.config('UniqueNumber')
    cy.clearLocalStorage()
    cy.log("Open browser and enter URL")
        login.navigate_admin()
    cy.log("The user is able to click on the 'Tags' button")
        dashboard.click_on_tags()
    cy.log("Click on Add new Tag")
        tag.click_add_button()
    cy.log("Populate Code")
        tag.enter_code(code)
    cy.log("Click on SAVE")
        tag.click_save()
    cy.log("Verify that Error message is displayed under Value field")
        tag.verify_error()
   })

   it("The user is not able to add a tag without populating Code field - <Tags> tab - Knowledge base section", function() {
    const email = "alem+1@qaengineers.net"
    const passowrd = "Mostar1234!test"
    const code = "Delete"+Cypress.config('UniqueNumber')
    const value = "V"+Cypress.config('UniqueNumber')
    cy.clearLocalStorage()
    cy.log("Open browser and enter URL")
        login.navigate_admin()
    cy.log("The user is able to click on the 'Tags' button")
        dashboard.click_on_tags()
    cy.log("Click on Add new Tag")
        tag.click_add_button()
    cy.log("Populate Code")
        tag.enter_value(value)
    cy.log("Click on SAVE")
        tag.click_save()
    cy.log("Verify that Error message is displayed under Code field")
        tag.verify_error()
   })

   it("The user is able to search tag by code - <Tags> tab - Knowledge base section", function() {
    const email = "alem+1@qaengineers.net"
    const passowrd = "Mostar1234!test"
    const code = "Search"+Cypress.config('UniqueNumber')
    const value = "V"+Cypress.config('UniqueNumber')
    cy.clearLocalStorage()
    cy.log("Open browser and enter URL")
        login.navigate_admin()
    cy.log("The user is able to click on the 'Tags' button")
        dashboard.click_on_tags()
    cy.log("Click on Add new Tag")
        tag.click_add_button()
    cy.log("Populate Code and Value")
        tag.enter_code(code)
        tag.enter_value(value)
    cy.log("Click on SAVE")
        tag.click_save()
    cy.log("Search for Tag by the Code")
        tag.search_for_tag(code)
        tag.verify_tag(code)
   })


  







   






});