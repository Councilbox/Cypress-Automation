import loginPage from "../pageObjects/loginPage"
import requestAppointment from "../pageObjects/requestAppointment"
import adminDashboard from "../pageObjects/adminDashboardPage"
import appointmentsPage from "../pageObjects/appointmentsPage"

let url = Cypress.config().baseUrl;

import users from "/cypress/fixtures/OVAC/users.json"
import request_data from "/cypress/fixtures/OVAC/request_data.json"
import meeting_data from "/cypress/fixtures/OVAC/meeting_data.json"

let login = new loginPage();
let appointment = new requestAppointment()
let dashboard = new adminDashboard()
let appointments = new appointmentsPage()

let code;

describe("User side section", function() {
     before(function() {    
    });

    it("The user is able to request prior appointment for the meeting", function() {
        cy.log("Open the browser and enter the URL")
            login.navigate_user()
        cy.log("Click on the START")
            cy.get('.MuiButton-containedPrimary').scrollIntoView().click()
        cy.log("Select institution")
            cy.get('.MuiPaper-elevation1').eq(1).click()
        cy.log("Selecy Company")
            cy.get('.cbx-button').eq(1).click()     
        cy.log("Navigate to the 'Calendar' and select the date and time")
            cy.wait(5000)
            appointment.click_next_month()
            appointment.select_last_day()   
        cy.log("Click on the 'CONTINUE' button")
            appointment.click_continue()      
        cy.log("Populate the 'Name' field")
            appointment.enter_name(request_data.name)            
        cy.log("Populate the 'Name' field")
            appointment.enter_surname(request_data.surname)          
        cy.log("Populate the 'TIN' field")
            appointment.enter_TIN(request_data.tin)       
        cy.log("Populate the 'Country code' and the 'Telephone' fields")
            appointment.enter_telephone_no(request_data.country_code, request_data.phone)      
        cy.log("Populate the 'Email' field")
            appointment.enter_email(request_data.email)       
        cy.log("Select the checkbox next to the 'The individual gives his/her consent for the results of the attendance at the appointment to be processed by this body' option")
            appointment.accept_everything()   
        cy.log("Click on the 'Request appointment' button")
            appointment.click_continue()   
    });

    /*

    it("The user is able to reschedule prior appointment", function() {
        cy.log("Open email app and open the mail")
            cy.wait(45000)
            cy.waitForLatestEmail().then(email => {
                let test = email.body
                cy.log(test)
                assert.isDefined(email);        
                code = /\s+(\d{6})\s+/.exec(email.body)[0];
                code = code.replace(/\s/g, '');
                        assert.isDefined(code);
            cy.log(code)
                cy.get('#sign-modal-code')
                    .type(code)
                cy.get('#alert-confirm-button-accept').click()
                cy.wait(5000)    
            });
        cy.log("Access portal")
            appointment.click_access_portal()   
        cy.log("Enter tin")
            appointment.enter_secure_TIN(request_data.tin)
            appointment.click_continue_id()
        cy.log("Click on the 'Reschedule Appointment' button")
            appointment.reschedule_appointment_button()
            appointment.click_ok()
        cy.log("Appointment should be rescheduled")
            appointment.reschedule_confirm(request_data.reschedule_message)
    })

    it("The user is able to cancel prior appointment", function() {
            cy.wait(20000)
        cy.log("Open email app and open the mail")
            cy.waitForLatestEmail().then((inbox) => {
                cy.state('document').write(inbox.body);
                cy.get('[lang="x-btn-access-room"]').invoke('attr', 'href').then(myLink => {
                cy.visit(myLink);
            })
                cy.wait(5000)
        })
        cy.log("Click on the 'Cancel Appointment' button")
            appointment.enter_secure_TIN(request_data.tin)
            appointment.click_continue_id()
            appointment.cancel_appointment_button()
        cy.log("Click on 'Accept' button")
            appointment.accept_privacy()
        cy.log("Appointment should be canceled")
            appointment.alert_message(request_data.cancel_message)
    })

    */


    it("User is able to create new meeting", function() {  
            cy.clearLocalStorage();
        cy.log("Open he browser and enter URL")
            cy.visit(url+'/admin')
        cy.log("The user is able to log in to the page")  
            login.enter_email(users.email)
            login.enter_password(users.password)
            login.login_submit()  
            login.confirm_login()        
        cy.log("The user is able to click on the 'Appointments' button")   
            dashboard.click_on_appointments()     
        cy.log("The user is able to click on Add button")
            appointments.click_on_add_button()
            appointments.select_procedure()
            appointments.click_consent_save_button()
        cy.log("The user is able to enter the data into 'Description' field")
            appointments.enter_description(meeting_data.description)
        cy.log("The user is able to click on the 'Next' button")
            appointments.click_next_details()
       cy.wait(1000)
        cy.log("The user is able to click on the 'Add participant+'' button")
            appointments.click_add_participant_button()
        cy.log("The user is able to input required field for Add Participant")
            appointments.enter_participant_data(meeting_data.name, meeting_data.surname, meeting_data.dni, meeting_data.email, meeting_data.phone_code, meeting_data.phone)
            appointments.click_consent_save_button()
        cy.log("The user is able to click on the 'Next' button")
            appointments.click_next_participants()
        cy.log("The user is able to click on the 'Next' button")
            appointments.click_next_consents()
        cy.log("The user is able to click on the 'Next' button")
            appointments.click_next_documentation()
        cy.log("The user is able to click on the 'Next' button")
            appointments.click_next_configuration()
        cy.log("The user is able to click on the 'Send' button")
            appointments.click_send()
   })

})
