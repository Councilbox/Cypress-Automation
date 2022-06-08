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

describe("The user is able to request prior appointment for the meeting", function() {
     before(function() {    
    });
    const name = "Automation"
    const surname = "User"
    const tin = "12345678Z"
    const country_code = "387"
    const phone = "62123123"
    const email = "29942413-017f-4eb8-a3dc-6074ea12bdb8@mailslurp.com"
    it("Open the browser and enter the URL", function() {
        login.navigate_user()
    })
    
    it("'Click on the 'Request prior appointment' button", function() {       
        appointment.request_prior_appointment_button()  
    });

    it("Navigate to the 'Appointment Date & Time' section", function() {     
        appointment.navigate_to_date_and_time()       
    });

    it("Navigate to the 'Calendar' and select the date and time", function() {    
        appointment.select_appointment_date()     
    });

    it("Populate the 'Name' field", function() {  
        appointment.enter_name(name)            
    });

    it("Populate the 'Name' field", function() {  
        appointment.enter_surname(surname)          
    });
    it("Populate the 'TIN' field", function() {  
        appointment.enter_TIN(tin)       
    });

    it("Populate the 'Country code' and the 'Telephone' fields", function() {  
        appointment.enter_country_code(country_code)
        appointment.enter_telephone_no(phone)      
    });

    it("Populate the 'Email' field", function() {  
        appointment.enter_email(email)       
    });

    it("Select the checkbox next to the 'The individual gives his/her consent for the results of the attendance at the appointment to be processed by this body' option", function() {  
        appointment.click_privacy_button()
        appointment.accept_privacy()      
    });

    it("Click on the 'Request appointment' button", function() {  
        appointment.request_appointment_submit()      
    });

    it("Verify that appointment is requested", function() {
        appointment.confirm_appointment_request()
    })
})


describe("The user is able to reschedule prior appointment", function() {
     before(function() {    
    });
    const reschedule_message = 'Your appointment has been successfully rescheduled.'

    it("Open email app and open the mail", function() {
        cy.wait(45000)
        cy.waitForLatestEmail().then((inbox) => {
            cy.state('document').write(inbox.body);
            cy.wait(5000)
            cy.get('body > table:nth-child(5) > tbody > tr:nth-child(2) > td > div:nth-child(1) > div:nth-child(6) > a').invoke('attr', 'href').then(myLink => {
                cy.visit(myLink);
            })
                cy.wait(5000)
        })
    })

    it("Click on the 'Reschedule Appointment' button", function() {
        appointment.reschedule_appointment_button()
    })

    it("Click on 'Accept' button", function() {
        appointment.accept_privacy()
    })

    it("Appointment should be rescheduled", function() {
        appointment.reschedule_confirm(reschedule_message)
    })


})

describe("The user is able to add document for the meeting in the 'My Documentation' section", function() {
     before(function() {    
    });

    it("Click on the 'My documentation' button from the card", function() {
        appointment.my_documentation_button()
    })

    it("Click on the 'Upload File' button and upload a file", function() {
        appointment.upload_document()
    })


})


describe("The user is able to cancel prior appointment", function() {
     before(function() {    
    });

    const message = "Your appointment has been successfully cancelled."

    it("Open email app and open the mail", function() {

        cy.waitForLatestEmail().then((inbox) => {
            cy.state('document').write(inbox.body);
            cy.get('body > table:nth-child(5) > tbody > tr:nth-child(2) > td > div:nth-child(1) > div:nth-child(6) > a').invoke('attr', 'href').then(myLink => {
                cy.visit(myLink);
            })
                cy.wait(5000)
        })
    })

    it("Click on the 'Cancel Appointment' button", function() {
        appointment.cancel_appointment_button()
    })

    it("Click on 'Accept' button", function() {
        appointment.accept_privacy()
    })

    it("Appointment should be canceled", function() {
        appointment.alert_message(message)
    })
})

describe("User is able to create new meeting", function() {
    before(function() { 
       cy.clearLocalStorage();
   });
   const name = "Participant"
   const surname = "Test"
   const dni = "12345678Z"
   const email_1 = "ca0b7eb9-d026-43ad-aada-72b36cf6dca1@mailslurp.com" 
   const phone_code = "387"
   const phone = "61123123"
   const email = "alem@qaengineers.net"
   const password = "Mostar123!"
   const description1 = "Testing"
   it("Open he browser and enter URL", function() {
       login.navigate_admin()
   })

   it("The user is able to log in to the page", function() {     
       login.enter_email(email)
       login.enter_password(password)
       login.login_submit()  
       login.confirm_login()        
   });

   it("The user is able to click on the 'Appointments' button", function() {    
       dashboard.click_on_appointments()     
   });

   it("The user is able to click on Add button", function() {
       appointments.click_on_add_button()
   })

   it("The user is able to enter the data into 'Description' field", function() {
       appointments.enter_description(description1)
   })

   it("The user is able to click on the 'Next' button", function() {
       appointments.click_next_details()
       cy.wait(1000)
   })

   it("The user is able to click on the 'Add participant+'' button", function() {
       appointments.click_add_participant_button()
   })

   it("The user is able to input required field for Add Participant", function() {
       appointments.enter_participant_data(name, surname, dni, email_1, phone_code, phone)
       appointments.click_consent_save_button()
   })
   
   it("The user is able to click on the 'Next' button", function() {
       appointments.click_next_participants()
   })

   it("The user is able to click on the 'Next' button", function() {
       appointments.click_next_consents()
   })

   it("The user is able to click on the 'Next' button", function() {
       appointments.click_next_documentation()
   })

   it("The user is able to click on the 'Next' button", function() {
       appointments.click_next_configuration()
   })

   it("The user is able to click on the 'Send' button", function() {
       appointments.click_send()
   })
})
