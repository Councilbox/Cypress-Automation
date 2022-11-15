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


it("Quorum numbers (current/initial) scenario (test case 4) - current quorum 60/initial quorum 50 - 100 votes 100 shares", function() {
    const name_census = 'Qourum2'+Cypress.config('UniqueNumber')
    const meeting_title = "Meeting1"+Cypress.config('UniqueNumber')
    const contact_email = "test@test.test"
    const agenda_title = "Test"
    const total_votes = "100"
    const total_shares = "100"
    const votes_20 = "20"
    const shares_20 = "20"
    const votes_10 = "10"
    const shares_10 = "10"
    const votes_5 = "5"
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

    const quoroum_30 = "30"

    const guest_name = "Guest"
    const guest_surname = "1"
    const id_1 = Cypress.config('UniqueNumber')
    const guest_email = "test@test.test"


    const guest_surname_2 = "2"
    const id_2 = "1"+Cypress.config('UniqueNumber')
    const guest_email_2 = "test1@test.test"

    const guest_name_full_1 = "Guest 1"

    const guest_name_full_2 = "Guest 2"
    const participant_b = "B, Participant"

    const quorum_0 = "0"

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
    cy.log("Add participant A with 20 votes and 20 shares")
        census.click_add_participant()
        census.input_participant_data(name, surname_a, email_a, phone, votes_20, shares_20)
        census.alert_confirm()
    cy.log("Add participant B with 10 votes and 10 shares")
        census.click_add_participant()
        census.input_participant_data(name, surname_b, email_b, phone, votes_10, shares_10)
        census.alert_confirm()        
    cy.log("Add participant C with 10 votes and 10 shares")
        census.click_add_participant()
        census.input_participant_data(name, surname_c, email_c, phone, votes_10, shares_10)
        census.alert_confirm()       
    cy.log("Add participant D with 20 votes and 20 shares")
        census.click_add_participant()
        census.input_participant_data(name, surname_d, email_d, phone, votes_20, shares_20)
        census.alert_confirm()                  
    cy.log("Add participant E with 10 votes and 10 shares")
        census.click_add_participant()
        census.input_participant_data(name, surname_e, email_e, phone, votes_10, shares_10)
        census.alert_confirm()            
    cy.log("Add participant F with 10 votes and 10 shares”") 
        census.click_add_participant()
        census.input_participant_data(name, surname_f, email_f, phone, votes_10, shares_10)
        census.alert_confirm()        
    cy.log("Add participant G with 5 votes and 5 shares")
        census.click_add_participant()
        census.input_participant_data(name, surname_g, email_g, phone, votes_5, shares_5)
        census.alert_confirm()
    cy.log("Add participant H with 5 votes and 5 shares")
        census.click_add_participant()
        census.input_participant_data(name, surname_h, email_h, phone, votes_5, shares_5)
        census.alert_confirm()
    cy.log("Add participant I with 10 votes and 10 shares")  
        census.click_add_participant()
        census.input_participant_data(name, surname_i, email_i, phone, votes_10, shares_10)
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
        cy.contains(name_census).click()
    cy.log("Click on the “Yes, I want to change the census” button")
        meetingCensus.confirm_census_change() 
    cy.log("Click on the “Next” button")
        meetingCensus.click_on_next()
    cy.log("Add item to agenda")
        meetingAgenda.click_on_add_agenda()
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
    cy.log("Click on the “Add guest+” button and populate all required fields and click on the “Send” button")
        meetingPreview.click_on_add_participant()
        meetingPreview.click_on_add_guest()
        meetingPreview.enter_guest_inputs(guest_name, guest_surname, id_1, guest_email, phone)
        meetingPreview.alert_confirm()
    cy.log("Click on the “Add guest+” button and populate all required fields and click on the “Send” button")
        meetingPreview.click_on_add_participant()
        meetingPreview.click_on_add_guest()
        meetingPreview.enter_guest_inputs(guest_name, guest_surname_2, id_2, guest_email_2, phone)
        meetingPreview.alert_confirm()
    cy.log("Navigate to the “Guest 1” and select the “Attending in person” status")
        meetingPreview.search_for_participant(guest_name_full_1) 
        meetingPreview.click_on_first_participant()
        meetingPreview.click_on_attending_in_person()
        meetingPreview.clear_search()
    cy.log("Navigate to the “Guest 2” and select the “Attending in person” status")
        meetingPreview.search_for_participant(guest_name_full_2) 
        meetingPreview.click_on_first_participant()
        meetingPreview.click_on_attending_in_person()
        meetingPreview.clear_search()
    cy.log("Observe the current quorum number")
        meetingPreview.verify_current_quorum(quorum_0)
    cy.log("Click to the “Participant D”")
        cy.contains(/^Participant D$/).click()
    cy.log("Click on the “Delegate vote” button then choose the “Participant B” and click on it")
        meetingPreview.click_on_delegate_vote()
        meetingPreview.delegate_vote_to_participant(participant_b) 
        meetingPreview.alert_close()
        meetingPreview.clear_search()
    cy.log("Click on the “Participant B” and observe the total votes")
        cy.contains(/^Participant B$/).click()
        meetingPreview.verify_owned_votes(votes_10)
        meetingPreview.verify_owned(shares_20)
        meetingPreview.alert_close()           
    cy.log("Click on the “Participant B” and select the “Attending in person” status")
        meetingPreview.search_for_participant(surname_b) 
        meetingPreview.click_on_second_participant()
        meetingPreview.click_on_attending_in_person()   
    cy.log("Observe the current quorum number on the top right side of the page")
        cy.wait(10000)
        meetingPreview.verify_current_quorum(quoroum_30)           
    });
});