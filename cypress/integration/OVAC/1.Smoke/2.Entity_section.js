import loginPage from "./pageObjects/loginPage"
import requestAppointment from "./pageObjects/requestAppointment"
import adminDashboard from "./pageObjects/adminDashboardPage"
import appointmentsPage from "./pageObjects/appointmentsPage"
import knowledgeBasePage from "./pageObjects/knowledgeBasePage"
import usersPage from "./pageObjects/usersPage"
import entitiesPage from "./pageObjects/entitiesPage"


let inboxId;
let login = new loginPage();
let appointment = new requestAppointment()
let dashboard = new adminDashboard()
let appoinments = new appointmentsPage()
let knowledgeBase = new knowledgeBasePage()
let users = new usersPage()
let entity = new entitiesPage()


describe("Admin is able to log in", function() {
    const email = "alem@qaengineers.net"
    const password = "Mostar123!"
    it("The user is able to open the browser and enter the URL: ", function() {       
        login.navigate_admin()        
    });

    it("The user is able to enter the email address", function() {     
        login.enter_email(email)        
    });

    it("The user is able to enter the password", function() {    
        login.enter_password(password)        
    });

    it("The user is able to click on the Log in button", function() {  
        login.login_submit()           
    });

    it("The user is successfully logged in", function() {  
        login.confirm_login()        
    });
})

describe("The user is able to add a logo to the Entity", function() {
    before(function() {    
   });
   const name = "LogoTestingAuto"
   
   it("The user is able to open the browser and enter the URL: ", function() {       
       login.navigate_admin()        
   });

   it("The user is able to click on the 'Insitution' button", function() {  
       dashboard.click_on_government()
       dashboard.select_institution()
       dashboard.click_on_istitutions()
   });
   
   it("The user is able to navigate on already existing entity and click on the 'Edit' button", function() {  
       entity.search_for_institution(name) 
       entity.click_action_button()
       entity.click_edit_option()
   });

   it("The user is able to click on the 'Organization logo' button / The user is able to choose photo and click on the 'Open' button", function() {  
       entity.upload_organisation_logo()
   });

   it("The user is able to click on the 'Insitution' button", function() {  
       dashboard.click_on_istitutions()
   });

   it("Navigate back to Home page", function() {
       login.navigate_admin()
   })

describe("The user is able to add entity - Entities section", function() {
    const name = "Institutions"+Cypress.config('UniqueNumber')
    const tax_id = Cypress.config('UniqueNumber')
    const address = "Majkl Dzordana 23"
    const town = "Cikago"
    const zip = "88000"
     before(function() {    
    });  
    it("The user is able to click on the 'Insitution' button", function() { 
        dashboard.click_on_istitutions()      
    });

    it("The user is able to click on the 'Add' button", function() {  
        entity.click_add_button()     
    });

    it("The user is able to populate the 'Name' field", function() {  
        entity.enter_name(name)        
    });

    it("The user is able to populate the 'TAX ID NO/CIF/NIE' field", function() {  
        entity.enter_TAX_id(tax_id)      
    });

    it("The user is able to populate the 'Address' field", function() {  
        entity.enter_entity_address(address)      
    });

    it("The user is able to populate the 'Town/City' field", function() {  
        entity.enter_town_city(town)    
    });

    it("The user is able to populate the 'Province' label", function() {  
        entity.select_province_entity()        
    });

    it("The user is able to populate the 'ZIP Code' label", function() {  
        entity.enter_zip_code(zip)      
    });

    it("The user is able to click on the 'Add entity+' button", function() {
        entity.click_submit_entity()
    });
})


})


