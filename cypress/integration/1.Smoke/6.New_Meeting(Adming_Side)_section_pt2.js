import dashboardPage from "../pageObjects/dashbaordPage";
import newMeetingAgenda from "../pageObjects/newMeetingAgenda";
import newMeetingPage from "../pageObjects/newMeetingAnnoucement";
import newMeetingCensus from "../pageObjects/newMeetingCensus";
import newMeetingDocumentation from "../pageObjects/newMeetingDocumentation";
import newMeetingOptions from "../pageObjects/newMeetingOptions";
import newMeetingPreview from "../pageObjects/newMeetingPreview";

const invalid_emails = ["andrej@qa", "andrej.qa", "andrej@majl.234"];
const login_url = Cypress.env("baseUrl");
const valid_password = Cypress.env("login_password");
const valid_email = Cypress.env("login_email");

let url = Cypress.config().baseUrl;

let meetingAnnoucemenet = new newMeetingPage()
let dashboard = new dashboardPage()
let meetingCensus = new newMeetingCensus()
let meetingAgenda = new newMeetingAgenda()
let meetingDocumentation = new newMeetingDocumentation()
let meetingOptions = new newMeetingOptions()
let meetingPreview = new newMeetingPreview()

describe("Councilbox login - valid username and password", function() {

     before(function() {
        
    });


    it("Visits the Councilbox web page", function() {
        cy.visit(login_url);
       
    });

    it("Change language to Spanish", function() {
        cy.get('#language-selector').click();
        cy.get('#language-es').click();
    });

    it("Enters email address", function() {
        cy.get('#username').clear()
            .type('alem@qaengineers.net')    
            .should("have.value", 'alem@qaengineers.net')
    });

    it("Enters password", function() {
        cy.get('#password').clear()
            .type('Mostar123!test')    
            .should("have.value", 'Mostar123!test')
    });

    it("Clicks login button", function() {
        cy.get("#login-button").click();
      
    });

});

describe("New Meeting (Admin side) part 2", function() {

    it("The user is able to activate ratings in the 'New call with session'", function() {
        const meeting_title = 'Test'
        const name = 'TestAutomation'+Cypress.config('UniqueNumber')
        const surname = 'alem'+Cypress.config('UniqueNumber')
        const TIN = 'alem'+Cypress.config('UniqueNumber')
        const phone = '123123123'
        const email = 'alem'+Cypress.config('UniqueNumber')+'@yopmail.com'
        const title = "Test"
        const contact_email = "test@test.test"
    cy.log("Click on the 'Nueva reunion' button") 
        dashboard.click_on_new_meeting()
    cy.log("Click on the 'Con sesion' button")
        meetingAnnoucemenet.click_on_with_session()
    cy.log("Populate all required fields and click on the 'Siguiente' button")        
        meetingAnnoucemenet.select_meeting_type()
        meetingAnnoucemenet.enter_meeting_title(meeting_title)
        meetingAnnoucemenet.enter_information_on_the_announcement(meeting_title)     
        meetingAnnoucemenet.click_next_announcement()
    cy.log("Click on the 'Anadir participante' button and populate all required fields then click on the 'Siguiente' button")
        meetingCensus.click_on_add_participant_census_dropmenu()
        meetingCensus.click_on_add_participant()           
        meetingCensus.enter_shareholder_name(name)            
        meetingCensus.enter_shareholder_surname(surname)             
        meetingCensus.enter_shareholder_TIN(TIN)           
        meetingCensus.enter_shareholder_phone(phone)              
        meetingCensus.enter_shareholder_email(email)
        meetingCensus.enter_shareholder_administrative_email(email)
    cy.log("Click on the 'Aceptar' button")
        meetingCensus.alert_confirm()
        meetingCensus.click_on_next()
    cy.log("Click on the 'Anadir punto al orden del dia+'' button")
        meetingAgenda.click_on_add_agenda()
    cy.log("Click on the “Punto Si/no abstencion” button and populate “Title” field then choose “Votacio nominal” tipo and click on the “Aceptar” button then click on the “Siguiente” button") 
        meetingAgenda.click_on_yes_no_item()
        meetingAgenda.enter_agenda_title(title)
        meetingAgenda.select_agenda_roll_call()
        meetingAgenda.alert_confirm()
        meetingAgenda.click_on_next()
        meetingDocumentation.click_on_next()
    cy.log("Populate all required fields and click on the “Siguiente” button")
        meetingOptions.scroll_to_contact_email()
        meetingOptions.enter_contact_email(contact_email)
        meetingOptions.click_on_next()
    cy.log("Click on the 'Convocar y notificar' button")
        meetingPreview.click_on_invite_and_notify()
    cy.log("Click on the “Preparar sala” button")  
        meetingPreview.click_on_prepare_room()
    cy.log("Navigate to the upper right corner and click on the “Abrir Sala” button")
        meetingPreview.click_open_room()
    cy.log("Populate all required fields and click on the “Aceptar” button")
        meetingPreview.alert_confirm()
    cy.log("Navigate to the “Camera and microphone” form and click on the “Accept” button")
    cy.log("Navigate to the upper right corner and click on the “Iniciar reunion” button")
        meetingPreview.click_on_start_meeting()
    cy.log("Populate all required fields and click on the “Aceptar” button")
        meetingPreview.select_president()
        meetingPreview.select_secreatary()
        meetingPreview.select_quality()
        meetingPreview.alert_confirm() 
    cy.log("Click on the “Abrir punto” button")
        meetingPreview.click_on_agenda()
        meetingPreview.click_open_item()
    cy.log("Click on the “Activar votaciones” button")
        meetingPreview.click_activate_voting()
    cy.log("User should be able to exit the meeting")
        cy.visit(login_url)
    });

    it("The user is able to close point votations in the 'New call with session' type of meeting'", function() {
        const meeting_title = 'Test'
        const name = 'TestAutomation'+Cypress.config('UniqueNumber')
        const surname = 'alem'+Cypress.config('UniqueNumber')
        const TIN = 'alem'+Cypress.config('UniqueNumber')
        const phone = '123123123'
        const email = 'alem'+Cypress.config('UniqueNumber')+'@yopmail.com'
        const title = "Test"
        const contact_email = "test@test.test"
    cy.log("Click on the 'Nueva reunion' button") 
        dashboard.click_on_new_meeting()
    cy.log("Click on the 'Con sesion' button")
        meetingAnnoucemenet.click_on_with_session()
    cy.log("Populate all required fields and click on the 'Siguiente' button")        
        meetingAnnoucemenet.select_meeting_type()
        meetingAnnoucemenet.enter_meeting_title(meeting_title)
        meetingAnnoucemenet.enter_information_on_the_announcement(meeting_title)     
        meetingAnnoucemenet.click_next_announcement()
    cy.log("Click on the 'Anadir participante' button and populate all required fields then click on the 'Siguiente' button")
        meetingCensus.click_on_add_participant_census_dropmenu()
        meetingCensus.click_on_add_participant()           
        meetingCensus.enter_shareholder_name(name)            
        meetingCensus.enter_shareholder_surname(surname)             
        meetingCensus.enter_shareholder_TIN(TIN)           
        meetingCensus.enter_shareholder_phone(phone)              
        meetingCensus.enter_shareholder_email(email)
        meetingCensus.enter_shareholder_administrative_email(email)
    cy.log("Click on the 'Aceptar' button")
        meetingCensus.alert_confirm()
        meetingCensus.click_on_next()
    cy.log("Click on the 'Anadir punto al orden del dia+'' button")
        meetingAgenda.click_on_add_agenda()
    cy.log("Click on the “Punto Si/no abstencion” button and populate “Title” field then choose “Votacio nominal” tipo and click on the “Aceptar” button then click on the “Siguiente” button") 
        meetingAgenda.click_on_yes_no_item()
        meetingAgenda.enter_agenda_title(title)
        meetingAgenda.select_agenda_roll_call()
        meetingAgenda.alert_confirm()
        meetingAgenda.click_on_next()
        meetingDocumentation.click_on_next()
    cy.log("Populate all required fields and click on the “Siguiente” button")
        meetingOptions.scroll_to_contact_email()
        meetingOptions.enter_contact_email(contact_email)
        meetingOptions.click_on_next()
    cy.log("Click on the 'Convocar y notificar' button")
        meetingPreview.click_on_invite_and_notify()
    cy.log("Click on the “Preparar sala” button")  
        meetingPreview.click_on_prepare_room()
    cy.log("Navigate to the upper right corner and click on the “Abrir Sala” button")
        meetingPreview.click_open_room()
    cy.log("Populate all required fields and click on the “Aceptar” button")
        meetingPreview.alert_confirm()
    cy.log("Navigate to the “Camera and microphone” form and click on the “Accept” button")
    cy.log("Navigate to the upper right corner and click on the “Iniciar reunion” button")
        meetingPreview.click_on_start_meeting()
    cy.log("Populate all required fields and click on the “Aceptar” button")
        meetingPreview.select_president()
        meetingPreview.select_secreatary()
        meetingPreview.select_quality()
        meetingPreview.alert_confirm() 
    cy.log("Click on the “Abrir punto” button")
        meetingPreview.click_on_agenda()
        meetingPreview.click_open_item()
    cy.log("Click on the “Activar votaciones” button")
        meetingPreview.click_activate_voting()
    cy.log("Click on the “Cerrar las votaciones del punto” button") 
        meetingPreview.click_on_close_voting()
    cy.log("User should be able to exit the meeting")
    });


});