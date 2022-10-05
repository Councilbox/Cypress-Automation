import loginPage from "../pageObjects/loginPage"
import requestAppointment from "../pageObjects/requestAppointment"
import adminDashboard from "../pageObjects/adminDashboardPage"
import appointmentsPage from "../pageObjects/appointmentsPage"
import { func } from "prop-types";


let inboxId;
let login = new loginPage();
let appointment = new requestAppointment()
let dashboard = new adminDashboard()
let appointments = new appointmentsPage()

describe("User side section", function() {
     before(function() {    
    });

    

    it("The user is able to request prior appointment for the meeting", function() {
        const name = "Automation"
        const surname = "User"
        const tin = "12345678Z"
        const country_code = "387"
        const phone = "62123123"
        const email = "29942413-017f-4eb8-a3dc-6074ea12bdb8@mailslurp.com"
    

    cy.log("Open the browser and enter the URL")
        login.navigate_user()
    
    cy.log("'Click on the 'Request prior appointment' button")   
        appointment.request_prior_appointment_button()  

    cy.log("Select 'Service requested'")
        appointment.select_service_requested()     

    cy.log("Click on the 'CONTINUE' button") 
        appointment.click_continue()      

    cy.log("Navigate to the 'Calendar' and select the date and time")
        appointment.click_next_month()
        appointment.select_last_day()   
        appointment.select_time()

    cy.log("Click on the 'CONTINUE' button")
        appointment.click_continue()      

    cy.log("Populate the 'Name' field")
        appointment.enter_name(name)            

    cy.log("Populate the 'Name' field")
        appointment.enter_surname(surname) 
                 
    cy.log("Populate the 'TIN' field")
        appointment.enter_TIN(tin)       

    cy.log("Populate the 'Country code' and the 'Telephone' fields")
        appointment.enter_telephone_no(country_code, phone)      

    cy.log("Populate the 'Email' field")
        appointment.enter_email(email)       

    cy.log("Select the checkbox next to the 'The individual gives his/her consent for the results of the attendance at the appointment to be processed by this body' option")
        appointment.accept_everything()   

    cy.log("Click on the 'Request appointment' button")
        appointment.click_continue()   
    });



    it("The user is able to reschedule prior appointment", function() {
       
        const reschedule_message = 'Your appointment has been successfully rescheduled.'

    cy.log("Open email app and open the mail")
        cy.wait(45000)
        cy.waitForLatestEmail().then((inbox) => {
            cy.state('document').write(inbox.body);
            cy.wait(5000)
            cy.get('body > table:nth-child(5) > tbody > tr:nth-child(1) > td > div > div:nth-child(3) > table > tbody > tr > td > div > table > tbody > tr:nth-child(2) > td > div > p > span').then(($btn) => {
                const txt = $btn.text()
                cy.reload()
                cy.get('#sign-modal-code')
                    .type(txt)
                cy.get('#alert-confirm-button-accept').click()
              
              
            })
                cy.wait(5000)
        })
    

    cy.log("Click on the 'Reschedule Appointment' button")
        cy.get('[class="MuiInputBase-input MuiInput-input"]')
            .type('12345678Z')
        cy.get('#modal-confirm-participant-id-card-button-accept')
            .click()
        appointment.reschedule_appointment_button()
        appointment.click_ok()
    

    cy.log("Appointment should be rescheduled")
        appointment.reschedule_confirm(reschedule_message)
    })





    it("The user is able to cancel prior appointment", function() {
       

    const message = "Your appointment has been successfully cancelled."

    cy.log("Open email app and open the mail")

        cy.waitForLatestEmail().then((inbox) => {
            cy.state('document').write(inbox.body);
            cy.get('body > table:nth-child(5) > tbody > tr:nth-child(2) > td > div:nth-child(1) > div:nth-child(6) > a').invoke('attr', 'href').then(myLink => {
                cy.visit(myLink);
            })
                cy.wait(5000)
        })
    

    cy.log("Click on the 'Cancel Appointment' button")
        cy.get('[class="MuiInputBase-input MuiInput-input"]')
            .type('12345678Z')
        cy.get('#modal-confirm-participant-id-card-button-accept')
            .click()
        appointment.cancel_appointment_button()
   

    cy.log("Click on 'Accept' button")
        appointment.accept_privacy()
  
    cy.log("Appointment should be canceled")
        appointment.alert_message(message)
    })


    it("User is able to create new meeting", function() {
        before(function() { 
       cy.clearLocalStorage();
        });
   const name = "Participant"
   const surname = "Test"
   const dni = "12345678Z"
   const email_1 = "ca0b7eb9-d026-43ad-aada-72b36cf6dca1@mailslurp.com" 
   const phone_code = "387"
   const phone = "61123123"
   const email = "alem+1@qaengineers.net"
   const password = "Mostar1234!test12"
   const description1 = "Testing"
   cy.log("Open he browser and enter URL")
       login.navigate_admin()

   cy.log("The user is able to log in to the page")  
       login.enter_email(email)
       login.enter_password(password)
       login.login_submit()  
       login.confirm_login()        

   cy.log("The user is able to click on the 'Appointments' button")   
       dashboard.click_on_appointments()     

   cy.log("The user is able to click on Add button")
       appointments.click_on_add_button()
       appointments.select_procedure()
       appointments.click_consent_save_button()

   cy.log("The user is able to enter the data into 'Description' field")
       appointments.enter_description(description1)

   cy.log("The user is able to click on the 'Next' button")
       appointments.click_next_details()
       cy.wait(1000)

   cy.log("The user is able to click on the 'Add participant+'' button")
       appointments.click_add_participant_button()

   cy.log("The user is able to input required field for Add Participant")
       appointments.enter_participant_data(name, surname, dni, email_1, phone_code, phone)
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
