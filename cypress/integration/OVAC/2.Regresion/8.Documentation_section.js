import loginPage from "../pageObjects/loginPage"
import requestAppointment from "../pageObjects/requestAppointment"
import appointmentsPage from "../pageObjects/appointmentsPage"
import adminDashboard from "../pageObjects/adminDashboardPage"
import userSettingsPage from "../pageObjects/userSettingsPage"
import entitiesPage from "../pageObjects/entitiesPage"
import knowledgeBasePage from "../pageObjects/knowledgeBasePage"

let login = new loginPage()
let appointment = new requestAppointment()
let appointments = new appointmentsPage()
let dashboard = new adminDashboard()
let settings = new userSettingsPage()
let entity = new entitiesPage()
let documentation = new knowledgeBasePage()


describe("Documentation section - regression tests", function() {
    before(function() {    
   });

   it("The user is able to create a new folder - Documentation tab - Knowledge base section", function() {
    const email = "alem+1@qaengineers.net"
    const passowrd = "Mostar1234!test12"
    const title = "Folder"+Cypress.config('UniqueNumber')
    cy.clearLocalStorage()
    cy.log("Open browser and enter URL")
        login.navigate_admin()
    cy.log("The user is able to Login")
        login.enter_email(email)
        login.enter_password(passowrd)
        login.login_submit()
    cy.log("The user is able to click on the 'Knowledge base' button")
        dashboard.click_on_documentation()
    cy.log("The user is able to click on the 'My docs' drop menu")
    cy.log("Click on Add Button")
        documentation.click_add_button()
    cy.log("The user is able to click on the 'New folder' button")
        documentation.click_on_new_folder()
    cy.log("The user is able to populate title field and click on the 'Ok' button")
        documentation.enter_folder_title(title)
        documentation.click_alert_confirm()
    cy.log("Verify that Folder is created")
        documentation.search_for_folder(title)
        documentation.verify_folder(title)

   })

   it("The user is able to create a new folder in the existing folder - Documentation tab - Knowledge base section", function() {
    const email = "alem+1@qaengineers.net"
    const passowrd = "Mostar1234!test"
    const title = "Outside"+Cypress.config('UniqueNumber')
    const title_new = "Inside"+Cypress.config('UniqueNumber')
    cy.clearLocalStorage()
    cy.log("Open browser and enter URL")
        login.navigate_admin()
    cy.log("The user is able to click on the 'Knowledge base' button")
        dashboard.click_on_documentation()
    cy.log("The user is able to click on the 'My docs' drop menu")
    cy.log("Click on Add Button")
        documentation.click_add_button()
    cy.log("The user is able to click on the 'New folder' button")
        documentation.click_on_new_folder()
    cy.log("The user is able to populate title field and click on the 'Ok' button")
        documentation.enter_folder_title(title)
        documentation.click_alert_confirm()
    cy.log("Verify that Folder is created")
        documentation.search_for_folder(title)
        documentation.verify_folder(title)
    cy.log("Open created folder")
        documentation.click_on_first_folder()
    cy.log("Click on Add button")
        documentation.click_add_button()
    cy.log("Click  on New Folder")
        documentation.click_on_new_folder()
    cy.log("Enter Name and click OK")
        documentation.enter_folder_title(title_new)
        documentation.click_alert_confirm()
    cy.log("Verify that Folder is created")
        documentation.verify_folder(title_new)

   })

   it("The user is able to search for Folder", function() {
    const email = "alem+1@qaengineers.net"
    const passowrd = "Mostar1234!test"
    const title = "Outside"+Cypress.config('UniqueNumber')
    const title_new = "Inside"+Cypress.config('UniqueNumber')
    cy.clearLocalStorage()
    cy.log("Open browser and enter URL")
        login.navigate_admin()
    cy.log("The user is able to click on the 'Knowledge base' button")
        dashboard.click_on_documentation()
    cy.log("The user is able to click on the 'My docs' drop menu")
    cy.log("Click on Add Button")
        documentation.click_add_button()
    cy.log("The user is able to click on the 'New folder' button")
        documentation.click_on_new_folder()
    cy.log("The user is able to populate title field and click on the 'Ok' button")
        documentation.enter_folder_title(title)
        documentation.click_alert_confirm()
    cy.log("Search for that Folder")
        documentation.search_for_folder(title)
        documentation.verify_folder(title)
   })

   it("The user is able to Open Folder", function() {
    const email = "alem+1@qaengineers.net"
    const passowrd = "Mostar1234!test"
    const title = "Outside"+Cypress.config('UniqueNumber')
    const title_new = "Inside"+Cypress.config('UniqueNumber')
    cy.clearLocalStorage()
    cy.log("Open browser and enter URL")
        login.navigate_admin()
    cy.log("The user is able to click on the 'Knowledge base' button")
        dashboard.click_on_documentation()
    cy.log("The user is able to click on the 'My docs' drop menu")
    cy.log("Click on Add Button")
        documentation.click_add_button()
    cy.log("The user is able to click on the 'New folder' button")
        documentation.click_on_new_folder()
    cy.log("The user is able to populate title field and click on the 'Ok' button")
        documentation.enter_folder_title(title)
        documentation.click_alert_confirm()
    cy.log("Search for that Folder")
        documentation.search_for_folder(title)
        documentation.verify_folder(title)
    cy.log("Open that folder")
        documentation.click_on_first_folder()
   })

   it("The user is able to delete the folder by clicking on the Delete link", function() {
    const title = "Delete"+Cypress.config('UniqueNumber')
    cy.clearLocalStorage()
    cy.log("Open browser and enter URL")
        login.navigate_admin()
    cy.log("The user is able to click on the 'Knowledge base' button")
        dashboard.click_on_documentation()
    cy.log("The user is able to click on the 'My docs' drop menu")
    cy.log("Click on Add Button")
        documentation.click_add_button()
    cy.log("The user is able to click on the 'New folder' button")
        documentation.click_on_new_folder()
    cy.log("The user is able to populate title field and click on the 'Ok' button")
        documentation.enter_folder_title(title)
        documentation.click_alert_confirm()
    cy.log("Search for that Folder")
        documentation.search_for_folder(title)
        documentation.verify_folder(title)
    cy.log("Click on Action menu")
        documentation.click_on_action_menu()
    cy.log("Click on Delete")
        documentation.click_on_delete()
    cy.log("Click on OK")
        documentation.click_alert_confirm()
    cy.log("Verify that Folder is deleted")
        documentation.search_for_folder(title)
        documentation.verify_folder_deleted()
   })

   it("The user is able to edit a folder name by clicking on the Edit link - Documentation tab - Knowledge base section", function() {
    const title = "ToEdit"+Cypress.config('UniqueNumber')
    const title_new = "Edited"+Cypress.config('UniqueNumber')
    cy.clearLocalStorage()
    cy.log("Open browser and enter URL")
        login.navigate_admin()
    cy.log("The user is able to click on the 'Knowledge base' button")
        dashboard.click_on_documentation()
    cy.log("The user is able to click on the 'My docs' drop menu")
    cy.log("Click on Add Button")
        documentation.click_add_button()
    cy.log("The user is able to click on the 'New folder' button")
        documentation.click_on_new_folder()
    cy.log("The user is able to populate title field and click on the 'Ok' button")
        documentation.enter_folder_title(title)
        documentation.click_alert_confirm()
    cy.log("Search for that Folder")
        documentation.search_for_folder(title)
        documentation.verify_folder(title)
    cy.log("Click on Action menu")
        documentation.click_on_action_menu()
    cy.log("Click on Edit")
        documentation.click_on_edit()
    cy.log("Change that Title")
        documentation.enter_folder_title(title_new)

    cy.log("Click on OK")
        documentation.click_alert_confirm()
    cy.log("Verify that Folder is edited")
        documentation.search_for_folder(title_new)
        documentation.verify_folder(title_new)
   })

   it("The user is able to Delete the document by clicking on the Delete link - Documentation tab - Knowledge base section", function() {
    const title = "ToEdit"+Cypress.config('UniqueNumber')
    const title_new = "Edited"+Cypress.config('UniqueNumber')
    const file = "testDocument"
    cy.clearLocalStorage()
    cy.log("Open browser and enter URL")
        login.navigate_admin()
    cy.log("The user is able to click on the 'Knowledge base' button")
        dashboard.click_on_documentation()
    cy.log("The user is able to upload new file")
        documentation.upload_file()
    cy.log("Search for updated file")
        documentation.search_for_folder(file)
        documentation.verify_folder(file)
    cy.log("Click on Action button")
        documentation.click_on_action_menu()
    cy.log("Click on DELETE")
        documentation.click_on_delete_file()
        documentation.click_alert_confirm()
    cy.log("Verify that file is deleted")
        documentation.search_for_folder(file)
        documentation.verify_folder_deleted()
   })

   it("The user is able to Edit the document by clicking on the Edit link - Documentation tab - Knowledge base section", function() {
    const file = "testDocument"
    const file_new = "editedFile"+Cypress.config('UniqueNumber')
    cy.clearLocalStorage()
    cy.log("Open browser and enter URL")
        login.navigate_admin()
    cy.log("The user is able to click on the 'Knowledge base' button")
        dashboard.click_on_documentation()
    cy.log("The user is able to upload new file")
        documentation.upload_file()
    cy.log("Search for updated file")
        documentation.search_for_folder(file)
        documentation.verify_folder(file)
    cy.log("Click on Action button")
        documentation.click_on_action_menu()
    cy.log("Click on EDIT")
        documentation.click_on_edit_file()
    cy.log("Change the title and click OK")
        documentation.enter_folder_title(file_new)
        documentation.click_alert_confirm()
    cy.log("Verify that File is edited")
        documentation.search_for_folder(file_new)
        documentation.verify_folder(file_new)
   })

  







   






});