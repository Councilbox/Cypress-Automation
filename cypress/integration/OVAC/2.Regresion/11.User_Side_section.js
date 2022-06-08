import { func } from "prop-types"
import loginPage from "../pageObjects/loginPage"
import requestAppointment from "../pageObjects/requestAppointment"
import appointmentsPage from "../pageObjects/appointmentsPage"
import adminDashboard from "../pageObjects/adminDashboardPage"

let login = new loginPage()
let appointment = new requestAppointment()
let appointments = new appointmentsPage()
let dashboard = new adminDashboard()


describe("The user is not able to request prior appointment for the meeting without populating required fields", function() {
     before(function() {    
    });

    it("Open the browser and enter the URL", function() {
        login.navigate_user()
    })
    
    it("'Click on the 'Request prior appointment' button", function() {       
        appointment.request_prior_appointment_button()  
    });

    it("Click on the 'CONTINUE' button", function() {     
        appointment.click_continue()      
    });

    it("Verify 'Required fields' message is displayed beyoned the required fields", function() {    
        appointment.verify_existing_alert()     
    });

})

describe("The user is not able to request prior appointment for the meeting without selecting Date and Time", function() {
    before(function() {    
   });

   it("Open the browser and enter the URL", function() {
       cy.clearLocalStorage()
       login.navigate_user()
   })
   
   it("'Click on the 'Request prior appointment' button", function() {       
       appointment.request_prior_appointment_button()  
   });

   it("Select 'Service requested'", function() {     
       appointment.select_service_requested()     
   });

   it("Click 'CONTINUE'", function() {     
       appointment.click_continue()      
   });

   it("Click 'CONTINUE' without selecting Date and Time", function() {
        appointment.click_continue() 
   });

   it("Verify 'Required fields' message is displayed beyoned the required fields", function() {    
       appointment.verify_existing_alert()     
   });

})

describe("The user is able not able to request prior appointment for the meeting without populating 'Name' field", function() {

    const surname = "Test"
    const tin = "12345678Z"
    const phone = "62123123"
    const phone_code = "387"
    const email = "test@test.test"
    before(function() {    
   });

   it("Open the browser and enter the URL", function() {
       cy.clearLocalStorage()
       login.navigate_user()
   })
   
   it("'Click on the 'Request prior appointment' button", function() {       
       appointment.request_prior_appointment_button()  
   });

   it("Select 'Service requested'", function() {     
       appointment.select_service_requested()     
   });

   it("Click 'CONTINUE'", function() {     
       appointment.click_continue()      
   });

   it("Select Date and Time", function() {
        appointment.enter_appointment_time()
   });

   it("Click 'CONTINUE'", function() {     
        appointment.click_continue()      
    });

    it("Enter required fields except 'Name'", function() {
        appointment.enter_surname(surname)
        appointment.enter_TIN(tin)
        appointment.enter_telephone_no(phone_code, phone) 
        appointment.enter_email(email)
        appointment.accept_everything()
    })

   it("Click 'CONFIRM'", function() {    
       appointment.click_confirm()  
   });

   it("The alert message 'Required field' is displayed beyond the 'Name' field", function() {
       appointment.verify_required_field_message()
   })

})

describe("The user is able not able to request prior appointment for the meeting without populating 'Surname' field", function() {

    const name = "Test"
    const tin = "12345678Z"
    const phone = "62123123"
    const phone_code = "387"
    const email = "test@test.test"
    before(function() {    
   });

   it("Open the browser and enter the URL", function() {
       cy.clearLocalStorage()
       login.navigate_user()
   })
   
   it("'Click on the 'Request prior appointment' button", function() {       
       appointment.request_prior_appointment_button()  
   });

   it("Select 'Service requested'", function() {     
       appointment.select_service_requested()     
   });

   it("Click 'CONTINUE'", function() {     
       appointment.click_continue()      
   });

   it("Select Date and Time", function() {
        appointment.enter_appointment_time()
   });

   it("Click 'CONTINUE'", function() {     
        appointment.click_continue()      
    });

    it("Enter required fields except 'Surname'", function() {
        appointment.enter_name(name)
        appointment.enter_TIN(tin)
        appointment.enter_telephone_no(phone_code, phone) 
        appointment.enter_email(email)
        appointment.accept_everything()
    })

   it("Click 'CONFIRM'", function() {    
       appointment.click_confirm()  
   });

   it("The alert message 'Required field' is displayed beyond the 'Surname' field", function() {
       appointment.verify_required_field_message()
   })

})

describe("The user is able not able to request prior appointment for the meeting without populating 'TIN' field", function() {

    const surname = "Test"
    const name = "Testing"
    const tin = "12345678Z"
    const phone = "62123123"
    const phone_code = "387"
    const email = "test@test.test"
    before(function() {    
   });

   it("Open the browser and enter the URL", function() {
       cy.clearLocalStorage()
       login.navigate_user()
   })
   
   it("'Click on the 'Request prior appointment' button", function() {       
       appointment.request_prior_appointment_button()  
   });

   it("Select 'Service requested'", function() {     
       appointment.select_service_requested()     
   });

   it("Click 'CONTINUE'", function() {     
       appointment.click_continue()      
   });

   it("Select Date and Time", function() {
        appointment.enter_appointment_time()
   });

   it("Click 'CONTINUE'", function() {     
        appointment.click_continue()      
    });

    it("Enter required fields except 'TIN'", function() {
        appointment.enter_name(name)
        appointment.enter_surname(surname)
        appointment.enter_telephone_no(phone_code, phone) 
        appointment.enter_email(email)
        appointment.accept_everything()
    })

   it("Click 'CONFIRM'", function() {    
       appointment.click_confirm()  
   });

   it("The alert message 'Required field' is displayed beyond the 'TIN' field", function() {
       appointment.verify_required_field_message()
   })

})

describe("The user is able not able to request prior appointment for the meeting without populating 'Email' field", function() {
    const name = "Testing"
    const surname = "Test"
    const tin = "12345678Z"
    const phone = "62123123"
    const phone_code = "387"
    const email = "test@test.test"
    before(function() {    
   });

   it("Open the browser and enter the URL", function() {
       cy.clearLocalStorage()
       login.navigate_user()
   })
   
   it("'Click on the 'Request prior appointment' button", function() {       
       appointment.request_prior_appointment_button()  
   });

   it("Select 'Service requested'", function() {     
       appointment.select_service_requested()     
   });

   it("Click 'CONTINUE'", function() {     
       appointment.click_continue()      
   });

   it("Select Date and Time", function() {
        appointment.enter_appointment_time()
   });

   it("Click 'CONTINUE'", function() {     
        appointment.click_continue()      
    });

    it("Enter required fields except 'Email'", function() {
        appointment.enter_name(name)
        appointment.enter_surname(surname)
        appointment.enter_TIN(tin)
        appointment.enter_telephone_no(phone_code, phone) 
        appointment.accept_everything()
    })

   it("Click 'CONFIRM'", function() {    
       appointment.click_confirm()  
   });

   it("The alert message 'Required field' is displayed beyond the 'Email' field", function() {
       appointment.verify_required_field_message()
   })

})

describe("The user is able not able to request prior appointment for the meeting without accepting the terms", function() {
    const name = "Testing"
    const surname = "Test"
    const tin = "12345678Z"
    const phone = "62123123"
    const phone_code = "387"
    const email = "test@test.test"
    before(function() {    
   });

   it("Open the browser and enter the URL", function() {
       cy.clearLocalStorage()
       login.navigate_user()
   })
   
   it("'Click on the 'Request prior appointment' button", function() {       
       appointment.request_prior_appointment_button()  
   });

   it("Select 'Service requested'", function() {     
       appointment.select_service_requested()     
   });

   it("Click 'CONTINUE'", function() {     
       appointment.click_continue()      
   });

   it("Select Date and Time", function() {
        appointment.enter_appointment_time()
   });

   it("Click 'CONTINUE'", function() {     
        appointment.click_continue()      
    });

    it("Enter required fields except but don't Accept Terms", function() {
        appointment.enter_name(name)
        appointment.enter_surname(surname)
        appointment.enter_TIN(tin)
        appointment.enter_telephone_no(phone_code, phone) 
        appointment.enter_email(email)
    })

   it("Click 'CONFIRM'", function() {    
       appointment.click_confirm()  
   });

   it("The alert message 'Required field' is displayed beyond the 'Terms' field", function() {
       appointment.verify_accept_terms_error_message()
   })

})




describe("The user is able to see administration documentation - Participant side", function() {
    const name = "Testing"
    const surname = "Test"
    const tin = "12345678Z"
    const phone = "62123123"
    const phone_code = "387"
    const email_user = "29942413-017f-4eb8-a3dc-6074ea12bdb8@mailslurp.com"

    const email = "alem@qaengineers.net"
    const password = "Mostar123!"
    before(function() {    
   });

   it("Open the browser and enter the URL", function() {
       cy.clearLocalStorage()
       login.navigate_user()
   })
   
   it("'Click on the 'Request prior appointment' button", function() {       
       appointment.request_prior_appointment_button()  
   });

   it("Select 'Service requested'", function() {     
       appointment.select_service_requested()     
   });

   it("Click 'CONTINUE'", function() {     
       appointment.click_continue()      
   });

   it("Select Date and Time", function() {
        appointment.enter_appointment_time()
   });

   it("Click 'CONTINUE'", function() {     
        appointment.click_continue()      
    });

    it("Enter required fields except but don't Accept Terms", function() {
        appointment.enter_name(name)
        appointment.enter_surname(surname)
        appointment.enter_TIN(tin)
        appointment.enter_telephone_no(phone_code, phone) 
        appointment.enter_email(email_user)
    })

   it("Click 'CONFIRM'", function() {    
       appointment.click_confirm()  
   });

   it("Open Admin portal and start the meeting", function () {
        login.login(email, password)
        dashboard.click_on_appointments()
        appointments.search_for_participant(name)
        appointments.open_first_appointment()
        appointments.click_send()
        appointments.accept_modal()
        appointments.click_start_appointment()
        appointments.accept_modal()
   })

})








