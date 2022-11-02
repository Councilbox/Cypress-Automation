import loginPage from "../pageObjects/loginPage"
import requestAppointment from "../pageObjects/requestAppointment"
import adminDashboard from "../pageObjects/adminDashboardPage"
import appointmentsPage from "../pageObjects/appointmentsPage"
import knowledgeBasePage from "../pageObjects/knowledgeBasePage"
import usersPage from "../pageObjects/usersPage"
import entitiesPage from "../pageObjects/entitiesPage"


let inboxId;
let login = new loginPage();
let appointment = new requestAppointment()
let dashboard = new adminDashboard()
let appoinments = new appointmentsPage()
let knowledgeBase = new knowledgeBasePage()
let users = new usersPage()
let entity = new entitiesPage()
let url = Cypress.config().baseUrl;


describe("Entity section", function() {

    it("Admin is able to log in", function() {    
    const email = "alem+1@qaengineers.net"
    const password = "Mostar1234!test12"
    
    cy.log("The user is able to open the browser and enter the URL: ")  
        cy.clearLocalStorage()   
        cy.visit(url+'/admin')       
    cy.log("The user is able to enter the email address")  
        login.enter_email(email)        
    cy.log("The user is able to enter the password") 
        login.enter_password(password)        
    cy.log("The user is able to click on the Log in button")
        login.login_submit()           
    cy.log("The user is successfully logged in")
        login.confirm_login()        
    });

    it("The user is able to add a logo to the Entity", function() {       
   const name = "LogoTestingAuto"
   
   cy.log("The user is able to open the browser and enter the URL: ")      
       cy.visit(url+'/admin')    
    cy.log("Select OVAC Demo entity")
        entity.click_on_entity()
        entity.if_entity()   
   cy.log("The user is able to click on the 'Insitution' button") 
       dashboard.click_on_istitutions()
   cy.log("The user is able to navigate on already existing entity and click on the 'Edit' button")
       entity.search_for_institution(name) 
       entity.click_action_button()
       entity.click_edit_option()
   cy.log("The user is able to click on the 'Organization logo' button / The user is able to choose photo and click on the 'Open' button")  
       entity.upload_organisation_logo()
   cy.log("The user is able to click on the 'Insitution' button")
       dashboard.click_on_istitutions()
   cy.log("Navigate back to Home page")
   cy.visit(url+'/admin')    
})

    it("The user is able to add entity", function() { 
    const name = "Institutions"+Cypress.config('UniqueNumber')
    const tax_id = Cypress.config('UniqueNumber')
    const address = "Majkl Dzordana 23"
    const town = "Cikago"
    const zip = "88000"
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
    cy.visit(url+'/admin')    
    cy.wait(5000)
    })

    it("The user is able to change entity", function() { 
    cy.log("Select OVAC Demo entity")
        entity.click_on_entity()
        entity.if_entity()   
    cy.log("Navigate back to Home page")
    cy.visit(url+'/admin')    
})

})


