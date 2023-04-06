import dashboardPage from "../pageObjects/dashbaordPage";
import loginPage from "../pageObjects/loginPage";
import typeOfMeetingsPage from "../pageObjects/typesOfMeetingsPage";

const login_url = Cypress.env("baseUrl");

let url = Cypress.config().baseUrl;


let types = new typeOfMeetingsPage
let dashbaord = new dashboardPage()
let login = new loginPage()

describe("Type of Meetings - smoke test", function() {

     before(function() {

    });
        
   
    it("Login", function() {
        const email = "alem@qaengineers.net"
        const password = "Mostar1234!test"
        
        cy.log("Navigate to login page")
            cy.visit(url);
        cy.log("Change language to Spanish")
            login.click_on_language_dropmenu()
            login.select_spanish_language()
        cy.log("Enters email address")
            login.enter_email(email)
        cy.log("Enters password")
            login.enter_password(password)
        cy.log("Clicks login button")
            login.click_login()
    })
        
   
    it("The user is able to add a new type of meeting in the 'Tipos de reunion' section", function() {
        const title = "MeetingType"+Cypress.config('UniqueNumber')
        const modal_title = "Add type of meeting"
        
        cy.log("From the menu choose and click on the 'Tipos de reunion' button")
            dashbaord.click_on_type_of_meetings()
        cy.log("On the upper left corner click on the 'Anadir tipo de reunion+'' button")
            types.click_on_add_button(modal_title)
        cy.log("Populate required field and click on the 'Aceptar' button and click on 'Save'")
            types.enter_title(title)
            types.alert_confirm()
            types.click_on_save()
        cy.log("Verify that Type of Meetings is created")
            types.verify_type_is_created(title)
        cy.log("Back to Home page")
            
    })



})








