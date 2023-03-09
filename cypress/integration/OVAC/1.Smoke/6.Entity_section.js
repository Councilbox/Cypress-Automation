import loginPage from "../pageObjects/loginPage"
import adminDashboard from "../pageObjects/adminDashboardPage"
import entitiesPage from "../pageObjects/entitiesPage"

import users from "/cypress/fixtures/OVAC/users.json"
import entity_data from "/cypress/fixtures/OVAC/entity_data.json"

let login = new loginPage();
let dashboard = new adminDashboard()
let entity = new entitiesPage()
let url = Cypress.config().baseUrl;


describe("Entity section", function() {

    it("Admin is able to log in", function() {    
        cy.log("The user is able to open the browser and enter the URL: ")  
            cy.clearLocalStorage()   
            cy.visit(url+'/admin')       
        cy.log("The user is able to enter the email address")  
            login.enter_email(users.email)        
        cy.log("The user is able to enter the password") 
            login.enter_password(users.password)        
        cy.log("The user is able to click on the Log in button")
            login.login_submit()           
        cy.log("The user is successfully logged in")
            login.confirm_login()        
    });

    it("The user is able to add a logo to the Entity", function() {       
        cy.log("The user is able to open the browser and enter the URL: ")      
            cy.visit(url+'/admin')    
        cy.log("Select OVAC Demo entity")
            entity.click_on_entity()
            entity.if_entity()   
        cy.log("The user is able to click on the 'Insitution' button") 
            dashboard.click_on_istitutions()
        cy.log("The user is able to navigate on already existing entity and click on the 'Edit' button")
            entity.search_for_institution(entity_data.logo_name) 
            entity.click_action_button()
            entity.click_edit_option()
        cy.log("The user is able to click on the 'Organization logo' button / The user is able to choose photo and click on the 'Open' button")  
            cy.get('.MuiTab-wrapper').contains('Appearance').click()
            entity.upload_organisation_logo()
        cy.log("The user is able to click on the 'Insitution' button")
            dashboard.click_on_istitutions()
        cy.log("Navigate back to Home page")
            cy.visit(url+'/admin')    
    })

    it("The user is able to add entity", function() { 
        cy.log("Select OVAC Demo entity")
            entity.click_on_entity()
            entity.if_entity()
        cy.log("The user is able to click on the 'Insitution' button")
            dashboard.click_on_istitutions()      
        cy.log("The user is able to click on the 'Add' button") 
            entity.click_add_button()     
        cy.log("The user is able to populate the 'Name' field") 
            entity.enter_name(entity_data.new_name+Cypress.config('UniqueNumber'))        
        cy.log("The user is able to populate the 'TAX ID NO/CIF/NIE' field") 
            entity.enter_TAX_id(Cypress.config('UniqueNumber'))      
        cy.log("The user is able to populate the 'Address' field")
            entity.enter_entity_address(entity_data.address)      
        cy.log("The user is able to populate the 'Town/City' field")
            entity.enter_town_city(entity_data.town)    
        cy.log("The user is able to populate the 'Province' label")
            entity.select_province_entity()        
        cy.log("The user is able to populate the 'ZIP Code' label")
            entity.enter_zip_code(entity_data.zip)      
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


