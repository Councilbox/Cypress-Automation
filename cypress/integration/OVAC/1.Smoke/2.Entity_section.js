import loginPage from "./pageObjects/loginPage"
import requestAppointment from "./pageObjects/requestAppointment"
import adminDashboard from "./pageObjects/adminDashboardPage"
import appointmentsPage from "./pageObjects/appointmentsPage"
import knowledgeBasePage from "./pageObjects/knowledgeBasePage"
import usersPage from "./pageObjects/usersPage"


let inboxId;
let login = new loginPage();
let appointment = new requestAppointment()
let dashboard = new adminDashboard()
let appoinments = new appointmentsPage()
let knowledgeBase = new knowledgeBasePage()
let users = new usersPage()


describe("The user is able to add entity - Entities section", function() {


     before(function() {
      
    });
    
    it("The user is able to open the browser and enter the URL: ", function() {       
        login.navigateAdmin()        
    });

    it("The user is able to enter the email address", function() {     
        login.enterEmailValid()        
    });

    it("The user is able to enter the password", function() {    
        login.enterPasswordValid()        
    });

    it("The user is able to click on the Log in button", function() {  
        login.loginSubmit()           
    });

    it("The user is successfully logged in", function() {  
        login.confirmLogin()        
    });

    it("The user is able to click on the 'Insitution' button", function() {  
        dashobard.institituionButton()        
    });

    it("The user is able to click on the 'Add' button", function() {  
        entity.addButton()       
    });

    it("The user is able to populate the 'Name' field", function() {  
        entity.enterName()        
    });

    it("The user is able to populate the 'TAX ID NO/CIF/NIE' field", function() {  
        entity.enterTAXid()       
    });

    it("The user is able to populate the 'Address' field", function() {  
        entity.enterEntityAddress()        
    });

    it("The user is able to populate the 'Town/City' field", function() {  
        entity.enterTownCity()       
    });

    it("The user is able to populate the 'Province' label", function() {  
        entity.selectProvinceEntity()        
    });

    it("The user is able to click on the 'Add entity+' button", function() {
        entity.submitEntityAdd()
    });




})


describe("The user is able to add a logo to the Entity", function() {


     before(function() {
      
    });
    
    it("The user is able to open the browser and enter the URL: ", function() {       
        login.navigateAdmin()        
    });

    it("The user is able to click on the 'Insitution' button", function() {  
        dashobard.institituionButton()  
    });



})


