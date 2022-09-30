import dashboardPage from "../pageObjects/dashbaordPage";
import newMeetingAgenda from "../pageObjects/newMeetingAgenda";
import newMeetingPage from "../pageObjects/newMeetingAnnoucement";
import newMeetingCensus from "../pageObjects/newMeetingCensus";
import newMeetingDocumentation from "../pageObjects/newMeetingDocumentation";
import newMeetingFinalize from "../pageObjects/newMeetingFinalize";
import newMeetingOptions from "../pageObjects/newMeetingOptions";
import newMeetingPreview from "../pageObjects/newMeetingPreview";
import loginPage from "../pageObjects/loginPage"
import knowledgeBasePage from "../pageObjects/knowledgeBasePage";
import censusPage from "../pageObjects/censusPage";

const invalid_emails = ["andrej@qa", "andrej.qa", "andrej@majl.234"];
const login_url = Cypress.env("baseUrl");
const valid_password = Cypress.env("login_password");
const valid_email = Cypress.env("login_email");
let url = Cypress.config().baseUrl;

let knowledge = new knowledgeBasePage()
let login = new loginPage()
let meetingAnnoucemenet = new newMeetingPage()
let dashboard = new dashboardPage()
let meetingCensus = new newMeetingCensus()
let meetingAgenda = new newMeetingAgenda()
let meetingDocumentation = new newMeetingDocumentation()
let meetingOptions = new newMeetingOptions()
let meetingPreview = new newMeetingPreview()
let meetingFinalize = new newMeetingFinalize()
let census = new censusPage()


describe("Councilbox login - valid username and password", function() {

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

it("Quorum numbers (current/initial) scenario (test case 1) - current quorum 55/initial quorum 35 (total votes 5) - 9 votes 100 shares", function() {
    const name_census = 'Qourum3'+Cypress.config('UniqueNumber')
    const meeting_title = "Meeting2"+Cypress.config('UniqueNumber')
    const contact_email = "test@test.test"
    const agenda_title = "Test"
    const total_votes = "9"
    const total_shares = "100"
    const votes_2 = "2"
    const shares_20 = "20"
    const votes_1 = "1"
    const shares_10 = "10"
    const votes_0 = "0"
    const shares_5 = "5"
    const quorum = "20"
    const quorum_2 = "40"
    const name = "Participant"
    const surname_a = "A"
    const email_a = "testA@test.test"
    const phone = "123456"
    const surname_b = "B"
    const email_b = "testB@test.test"
    const surname_c = "C"
    const email_c = "testC@test.test"
    const surname_d = "D"
    const email_d = "testD@test.test"
    const surname_e = "E"
    const email_e = "testE@test.test"
    const surname_f = "F"
    const email_f = "testF@test.test"
    
    const surname_g = "G"
    const email_g = "testg@test.test"
    const surname_h = "H"
    const email_h = "testH@test.test"
    const surname_i = "I"
    const email_i = "testI@test.test"

    const qourum_10 = "10"
    const qourum_30 = "30"
    const qourum_35 = "35"
    
    cy.log("Click on the “Censuses” button")
        dashboard.click_on_census()
    cy.log("Click on the “Add census” button and populate all required fields then click on the “OK” button")
        census.click_on_add_new_census()
        census.type_census_name(name_census)
        census.click_on_drop_census_type()
        census.select_shares_census_type()
        census.alert_confirm()
    cy.log("Navigate to the already added census and hover cy.log then click on the “Manage participants” icon")
        census.type_in_search_bar(name_census)
        census.click_manage_participants()
    cy.log("Add participant A with 2 votes and 20 shares")
        census.click_add_participant()
        census.input_participant_data(name, surname_a, email_a, phone, votes_2, shares_20)
        census.alert_confirm()
    cy.log("Add participant B with 1 votes and 10 shares")
        census.click_add_participant()
        census.input_participant_data(name, surname_b, email_b, phone, votes_1, shares_10)
        census.alert_confirm()        
    cy.log("Add participant C with 1 votes and 10 shares")
        census.click_add_participant()
        census.input_participant_data(name, surname_c, email_c, phone, votes_1, shares_10)
        census.alert_confirm()       
    cy.log("Add participant D with 2 votes and 20 shares")
        census.click_add_participant()
        census.input_participant_data(name, surname_d, email_d, phone, votes_2, shares_20)
        census.alert_confirm()                  
    cy.log("Add participant E with 1 votes and 10 shares")
        census.click_add_participant()
        census.input_participant_data(name, surname_e, email_e, phone, votes_1, shares_10)
        census.alert_confirm()            
    cy.log("Add participant F with 1 votes and 10 shares”") 
        census.click_add_participant()
        census.input_participant_data(name, surname_f, email_f, phone, votes_1, shares_10)
        census.alert_confirm()        
    cy.log("Add participant G with 0 votes and 5 shares")
        census.click_add_participant()
        census.input_participant_data(name, surname_g, email_g, phone, votes_0, shares_5)
        census.alert_confirm()
    cy.log("Add participant H with 0 votes and 5 shares")
        census.click_add_participant()
        census.input_participant_data(name, surname_h, email_h, phone, votes_0, shares_5)
        census.alert_confirm()
    cy.log("Add participant I with 1 votes and 10 shares")  
        census.click_add_participant()
        census.input_participant_data(name, surname_i, email_i, phone, votes_1, shares_10)
        census.alert_confirm()
    cy.log("Observe the total number of votes and shares")  
        census.verify_total_votes(total_votes)  
        census.verify_total_shares(total_shares)
    cy.log("Close the “Census” section and navigate to the landing page")
        cy.visit(url)
    cy.log("Click on the “New meeting” button the select the “With session” type of meeting")
        dashboard.click_on_new_meeting()
        meetingAnnoucemenet.click_on_with_session()
    cy.log("Populate all required fields and click on the “Next” button")
        meetingAnnoucemenet.enter_meeting_title(meeting_title)
        meetingAnnoucemenet.enter_information_on_the_announcement(meeting_title)     
        meetingAnnoucemenet.click_next_announcement()
    cy.log("Navigate to the “Current census” on the top left corner and click on the field to select the census")
        meetingCensus.click_on_current_census()
    cy.log("Select the census you added before (with 9 participants - 100 votes and 100 shares)")
        cy.contains('Qourum'+Cypress.config('UniqueNumber')).click()
    cy.log("Click on the “Yes, I want to change the census” button")
        meetingCensus.confirm_census_change() 
    cy.log("Click on the “Next” button")
        meetingCensus.click_on_next()
    cy.log("Add item to agenda")
        meetingAgenda.click_on_yes_no_item()
        meetingAgenda.enter_agenda_title(agenda_title)
        meetingAgenda.select_agenda_roll_call()
        meetingAgenda.alert_confirm()
    cy.log("Click on the “Next” button")
        cy.wait(4000)
        meetingAgenda.click_on_next()
    cy.log("Click on the “Next” button")
        meetingDocumentation.click_on_next()
    cy.log("Click on the “Next” button")
        meetingOptions.scroll_to_contact_email()
        meetingOptions.enter_contact_email(contact_email)
        meetingOptions.click_on_next()
    cy.log("Click on the “Invite and notify” button then click on the “Prepare room” button")
        meetingPreview.click_on_invite_and_notify()
        meetingPreview.click_on_prepare_room()
    cy.log("Click on the “Open room” button then click on the “Open room” button")
        meetingPreview.click_open_room()
        meetingPreview.alert_confirm()
    cy.log("Click on the “Participants” button")
        meetingPreview.click_on_participants_tab()
    cy.log("Click on the “Participant B” and select the “Attending in person” status")
        meetingPreview.search_for_participant(surname_b) 
        meetingPreview.click_on_second_participant()
        meetingPreview.click_on_attending_in_person()
    cy.log("Observe the current quorum number on the top right side of the page")
        cy.wait(5000)
        meetingPreview.verify_current_quorum(qourum_10)
        cy.wait(500)
    cy.log("Click on the “Participant D” and select the “Attending in person” status")
        meetingPreview.search_for_participant(surname_d) 
        meetingPreview.click_on_first_participant()
        meetingPreview.click_on_attending_in_person()
    cy.log("Observe the current quorum number on the top right side of the page")
        cy.wait(5000)
        meetingPreview.verify_current_quorum(qourum_30)
    cy.log("Click on the “Participant G” and select the “Attending in person” status")
        meetingPreview.search_for_participant(surname_g) 
        meetingPreview.click_on_first_participant()
        meetingPreview.click_on_attending_in_person()
    cy.log("Observe the current quorum number on the top right side of the page")
        cy.wait(5000)
        meetingPreview.verify_current_quorum(qourum_35)
    cy.log("Start the meeting")
        meetingPreview.click_on_start_meeting()
        meetingPreview.select_president()
        meetingPreview.select_secreatary()
        meetingPreview.select_quality()
        meetingPreview.alert_confirm() 
    cy.log("Observe the current quorum number on the top right side of the page")
        cy.wait(5000)
        meetingPreview.verify_current_quorum(qourum_35)
    });

});


