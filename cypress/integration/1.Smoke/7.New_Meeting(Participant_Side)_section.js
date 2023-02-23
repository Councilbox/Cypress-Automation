import dashboardPage from "../pageObjects/dashbaordPage";
import newMeetingAgenda from "../pageObjects/newMeetingAgenda";
import newMeetingPage from "../pageObjects/newMeetingAnnoucement";
import newMeetingCensus from "../pageObjects/newMeetingCensus";
import newMeetingDocumentation from "../pageObjects/newMeetingDocumentation";
import newMeetingFinalize from "../pageObjects/newMeetingFinalize";
import newMeetingOptions from "../pageObjects/newMeetingOptions";
import newMeetingPreview from "../pageObjects/newMeetingPreview";
import loginPage from "../pageObjects/loginPage"


const invalid_emails = ["andrej@qa", "andrej.qa", "andrej@majl.234"];
const login_url = Cypress.env("baseUrl");
const valid_password = Cypress.env("login_password");
const valid_email = Cypress.env("login_email");

let url = Cypress.config().baseUrl;

let login = new loginPage()
let meetingAnnoucemenet = new newMeetingPage()
let dashboard = new dashboardPage()
let meetingCensus = new newMeetingCensus()
let meetingAgenda = new newMeetingAgenda()
let meetingDocumentation = new newMeetingDocumentation()
let meetingOptions = new newMeetingOptions()
let meetingPreview = new newMeetingPreview()
let meetingFinalize = new newMeetingFinalize()


describe("New Meeting (Participant side)", function() {

     before(function() {
        
    });


    it("Login", function() {
        const email = "alem@qaengineers.net"
        const password = "Mostar123!test"
        
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

});