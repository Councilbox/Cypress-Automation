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
let entity = new entitiesPage()


describe("Company settings - regression tests", function() {
    before(function() {    
   });

   

   it("The user is able to add entity", function() { 
    const name = "CompanyTo"+Cypress.config('UniqueNumber')
    const tax_id = Cypress.config('UniqueNumber')
    const address = "Majkl Dzordana 23"
    const town = "Cikago"
    const zip = "88000"
    const email = "alem+1@qaengineers.net"
    const passowrd = "Mostar1234!test12"
    cy.clearLocalStorage()
    cy.log("Open browser and enter URL")
        login.navigate_admin()
    cy.log("The user is able to Login")
        login.enter_email(email)
        login.enter_password(passowrd)
        login.login_submit()
    cy.log("Select OVAC Demo entity")
        entity.click_on_entity()
        entity.if_entity()
    cy.log("The user is able to click on the 'Insitution' button")
        dashboard.click_on_istitutions()      
    cy.log("The user is able to click on the 'Add' button") 
        entity.click_add_button()     
    cy.log("The user is able to populate the 'Name' field") 
        entity.enter_name(name)        
    cy.log("The user is able to populate the 'TAX ID NO/CIF/NIE' field") 
        entity.enter_TAX_id(tax_id)      
    cy.log("The user is able to populate the 'Address' field")
        entity.enter_entity_address(address)      
    cy.log("The user is able to populate the 'Town/City' field")
        entity.enter_town_city(town)    
    cy.log("The user is able to populate the 'Province' label")
        entity.select_province_entity()        
    cy.log("The user is able to populate the 'ZIP Code' label")
        entity.enter_zip_code(zip)      
    cy.log("The user is able to click on the 'Add entity+' button")
        entity.click_submit_entity()
    cy.log("Navigate back to Home page")
        login.navigate_admin()   
        cy.wait(5000)
    })



    it("The user is able to change the Name of the company - Company settings section", function() { 
        const name = "EditedCompany"+Cypress.config('UniqueNumber')
        cy.log("The user is able to click on the Account icon") 
            settings.click_on_my_account()
        cy.log("The user is able to click on the Configuration button") 
            settings.click_on_company_settings()
        cy.log("The user is able to edit a 'Name' field") 
            entity.enter_name(name)
        cy.log("Click on SAVE") 
            settings.click_on_save_button()
        cy.log("Verify that Company is edited") 
            cy.contains('The changes have been saved successfully.').should('be.visible')
            cy.reload()
            settings.click_on_my_account()
            settings.click_on_company_settings()
            entity.verify_name(name)
        cy.log("Navigate back to Home page")
            login.navigate_admin()  
    })

    it("The user is able to change the VAT NO/CIF - Company settings section", function() { 
        const tax_id = Cypress.config('UniqueNumber')+"1"
        cy.log("The user is able to click on the Account icon") 
            settings.click_on_my_account()
        cy.log("The user is able to click on the Configuration button") 
            settings.click_on_company_settings()
        cy.log("The user is able to edit a 'TAX ID NO/CIF/NIE' field") 
            entity.enter_TAX_id(tax_id)     
        cy.log("Click on SAVE") 
            settings.click_on_save_button()
        cy.log("Verify that Company is edited") 
            cy.contains('The changes have been saved successfully.').should('be.visible')
            cy.reload()
            settings.click_on_my_account()
            settings.click_on_company_settings()
            entity.verify_tax(tax_id)
        cy.log("Navigate back to Home page")
            login.navigate_admin()  
    })

    it("The user is able to change the contact e-mail - Company settings section", function() { 
        const contact_email = "test"+Cypress.config('UniqueNumber')+"@test.test"
        cy.log("The user is able to click on the Account icon") 
            settings.click_on_my_account()
        cy.log("The user is able to click on the Configuration button") 
            settings.click_on_company_settings()
        cy.log("The user is able to edit a 'Contact Email' field") 
            entity.enter_contact_email(contact_email)   
        cy.log("Click on SAVE") 
            settings.click_on_save_button()
        cy.log("Verify that Company is edited") 
            cy.contains('The changes have been saved successfully.').should('be.visible')
            cy.reload()
            settings.click_on_my_account()
            settings.click_on_company_settings()
            entity.verify_contact_email(contact_email)
        cy.log("Navigate back to Home page")
            login.navigate_admin()  
    })

    it("The user is able to change the Organization logo - Company settings section", function() { 
        const contact_email = "test"+Cypress.config('UniqueNumber')+"@test.test"
        cy.log("The user is able to click on the Account icon") 
            settings.click_on_my_account()
        cy.log("The user is able to click on the Configuration button") 
            settings.click_on_company_settings()
        cy.log("The user is able to edit a 'Organization logo' field") 
            entity.upload_organisation_logo()
        cy.log("Click on SAVE") 
            settings.click_on_save_button()
        cy.log("Navigate back to Home page")
            login.navigate_admin()  
    })

    it("The user is able to change the language to English - Company settings section", function() { 
        const language = "English"
        cy.log("The user is able to click on the Account icon") 
            settings.click_on_my_account()
        cy.log("The user is able to click on the Configuration button") 
            settings.click_on_company_settings()
        cy.log("The user is able to edit a 'Main language' field") 
            entity.select_company_language(language)
        cy.log("Click on SAVE") 
            settings.click_on_save_button()
        cy.log("Verify that Company is edited") 
            cy.contains('The changes have been saved successfully.').should('be.visible')
            cy.reload()
            settings.click_on_my_account()
            settings.click_on_company_settings()
            entity.verify_language(language)
        cy.log("Navigate back to Home page")
            login.navigate_admin()  
    })


    it("The user is able to change entity", function() { 
        cy.log("Navigate back to Home page")
            login.navigate_admin()  
        cy.log("Select OVAC Demo entity")
            entity.click_on_entity()
            entity.if_entity()   
        cy.log("Navigate back to Home page")
            login.navigate_admin()  
    })




});