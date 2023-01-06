import loginPage from "../pageObjects/loginPage";
import requestAppointment from "../pageObjects/requestAppointment";

import request_data from "../../../fixtures/OVAC/request_data.json";

import users_data from "../../../fixtures/OVAC/users_data.json";

let login = new loginPage();
let appointment = new requestAppointment();

describe("User side regression tests", function() {
	before(function() {});

	it("The user is not able to request prior appointment for the meeting without populating required fields", function() {
		cy.log("Open the browser and enter the URL");
			login.navigate_user();
		cy.log("'Click on the 'Request prior appointment' button");
			appointment.request_prior_appointment_button();
		cy.log("Click on the 'CONTINUE' button");
			appointment.click_continue();
		cy.log("Verify 'Required fields' message is displayed beyoned the required fields");
			appointment.verify_existing_alert();
	});

	/*

describe("The user is not able to request prior appointment for the meeting without selecting Date and Time", function() {
    before(function() {    
   });

   cy.log("Open the browser and enter the URL", function() {
       cy.clearLocalStorage()
       login.navigate_user()
   })
   
   cy.log("'Click on the 'Request prior appointment' button")    
       appointment.request_prior_appointment_button()  
   });

   cy.log("Select 'Service requested'")  
       appointment.select_service_requested()     
   });

   cy.log("Click 'CONTINUE'")  
       appointment.click_continue()      
   });

   cy.log("Click 'CONTINUE' without selecting Date and Time", function() {
        appointment.click_continue() 
   });

   cy.log("Verify 'Required fields' message is displayed beyoned the required fields") 
       appointment.verify_existing_alert()     
   });

})

*/

	it("The user is able not able to request prior appointment for the meeting without populating 'Name' field", function() {
		cy.log("Open the browser and enter the URL");
		cy.clearLocalStorage();
			login.navigate_user();
		cy.log("'Click on the 'Request prior appointment' button");
			appointment.request_prior_appointment_button();
		cy.log("Select Company");
			appointment.select_company(request_data.company);
		cy.log("Select 'Service requested'");
			appointment.select_service_requested(request_data.procedure);
		cy.log("Click 'CONTINUE'");
			appointment.click_continue();
		cy.log("Select Date and Time");
			appointment.select_appointment_date();
		cy.log("Click 'CONTINUE'");
			appointment.click_continue();
		cy.log("Enter required fields except 'Name'");
			appointment.enter_surname(users_data.surname);
			appointment.enter_TIN(users_data.tin);
			appointment.enter_telephone_no(users_data.phone_code, users_data.phone);
			appointment.enter_email(users_data.email_test);
			appointment.accept_everything();
		cy.log("Click 'CONFIRM'");
			appointment.click_confirm();
		cy.log("The alert message 'Required field' is displayed beyond the 'Name' field");
			appointment.verify_required_field_message();
	});

	it("The user is able not able to request prior appointment for the meeting without populating 'Surname' field", function() {
		cy.log("Open the browser and enter the URL");
		cy.clearLocalStorage();
			login.navigate_user();
		cy.log("'Click on the 'Request prior appointment' button");
			appointment.request_prior_appointment_button();
		cy.log("Select Company");
			appointment.select_company(request_data.company);
		cy.log("Select 'Service requested'");
			appointment.select_service_requested(request_data.procedure);
		cy.log("Click 'CONTINUE'");
			appointment.click_continue();
		cy.log("Select Date and Time");
			appointment.select_appointment_date();
		cy.log("Click 'CONTINUE'");
			appointment.click_continue();
		cy.log("Enter required fields except 'Surname'");
			appointment.enter_name(users_data.name);
			appointment.enter_TIN(users_data.tin);
			appointment.enter_telephone_no(users_data.phone_code, users_data.phone);
			appointment.enter_email(users_data.email_test);
			appointment.accept_everything();
		cy.log("Click 'CONFIRM'");
			appointment.click_confirm();
		cy.log("The alert message 'Required field' is displayed beyond the 'Surname' field");
			appointment.verify_required_field_message();
	});

	it("The user is able not able to request prior appointment for the meeting without populating 'TIN' field", function() {
		cy.log("Open the browser and enter the URL");
		cy.clearLocalStorage();
			login.navigate_user();
		cy.log("'Click on the 'Request prior appointment' button");
			appointment.request_prior_appointment_button();
		cy.log("Select Company");
			appointment.select_company(request_data.company);
		cy.log("Select 'Service requested'");
			appointment.select_service_requested(request_data.procedure);
		cy.log("Click 'CONTINUE'");
			appointment.click_continue();
		cy.log("Select Date and Time");
			appointment.select_appointment_date();
		cy.log("Click 'CONTINUE'");
		appointment.click_continue();
		cy.log("Enter required fields except 'TIN'");
			appointment.enter_name(users_data.name);
			appointment.enter_surname(users_data.surname);
			appointment.enter_telephone_no(users_data.phone_code, users_data.phone);
			appointment.enter_email(users_data.email_test);
			appointment.accept_everything();
		cy.log("Click 'CONFIRM'");
			appointment.click_confirm();
		cy.log("The alert message 'Required field' is displayed beyond the 'TIN' field");
			appointment.verify_required_field_message();
	});

	it("The user is able not able to request prior appointment for the meeting without populating 'Email' field", function() {
		cy.log("Open the browser and enter the URL");
		cy.clearLocalStorage();
			login.navigate_user();
		cy.log("'Click on the 'Request prior appointment' button");
			appointment.request_prior_appointment_button();
		cy.log("Select Company");
			appointment.select_company(request_data.company);
		cy.log("Select 'Service requested'");
			appointment.select_service_requested(request_data.procedure);
		cy.log("Click 'CONTINUE'");
			appointment.click_continue();
		cy.log("Select Date and Time");
			appointment.select_appointment_date();
		cy.log("Click 'CONTINUE'");
			appointment.click_continue();
		cy.log("Enter required fields except 'Email'");
			appointment.enter_name(users_data.name);
			appointment.enter_surname(users_data.surname);
			appointment.enter_TIN(users_data.tin);
			appointment.enter_telephone_no(users_data.phone_code, users_data.phone);
			appointment.accept_everything();
		cy.log("Click 'CONFIRM'");
			appointment.click_confirm();
		cy.log("The alert message 'Required field' is displayed beyond the 'Email' field");
			appointment.verify_required_field_message();
	});

	it("The user is able not able to request prior appointment for the meeting without accepting the terms", function() {
		cy.log("Open the browser and enter the URL");
		cy.clearLocalStorage();
			login.navigate_user();
		cy.log("'Click on the 'Request prior appointment' button");
			appointment.request_prior_appointment_button();
		cy.log("Select Company");
			appointment.select_company(request_data.company);
		cy.log("Select 'Service requested'");
			appointment.select_service_requested(request_data.procedure);
		cy.log("Click 'CONTINUE'");
			appointment.click_continue();
		cy.log("Select Date and Time");
			appointment.select_appointment_date();
		cy.log("Click 'CONTINUE'");
			appointment.click_continue();
		cy.log("Enter required fields except but don't Accept Terms");
			appointment.enter_name(users_data.name);
			appointment.enter_surname(users_data.surname);
			appointment.enter_TIN(users_data.tin);
			appointment.enter_telephone_no(users_data.phone_code, users_data.phone);
			appointment.enter_email(users_data.email_test);
		cy.log("Click 'CONFIRM'");
			appointment.click_confirm();
		cy.log("The alert message 'Required field' is displayed beyond the 'Terms' field");
			appointment.verify_accept_terms_error_message();
	});

	it("The user is able to see administration documentation - Participant side", function() {
		cy.log("Open the browser and enter the URL");
		cy.clearLocalStorage();
			login.navigate_user();
		cy.log("'Click on the 'Request prior appointment' button");
			appointment.request_prior_appointment_button();
		cy.log("Select Company");
			appointment.select_company(request_data.company);
		cy.log("Select 'Service requested'");
			appointment.select_service_requested(request_data.procedure);
		cy.log("Click 'CONTINUE'");
			appointment.click_continue();
		cy.log("Select Date and Time");
			appointment.select_appointment_date();
		cy.log("Click 'CONTINUE'");
			appointment.click_continue();
		cy.log("Enter required fields except but don't Accept Terms");
			appointment.enter_name(users_data.name);
			appointment.enter_surname(users_data.surname);
			appointment.enter_TIN(users_data.tin);
			appointment.enter_telephone_no(users_data.phone_code, users_data.phone);
			appointment.enter_email(users_data.email_user);
	});
	/*
   cy.log("Click 'CONFIRM'") 
       appointment.click_confirm()  
   });

   cy.log("Open Admin portal and start the meeting", function () {
        login.login(email, password)
        dashboard.click_on_appointments()
        appointments.search_for_participant(name)
        appointments.open_first_appointment()
        appointments.click_send()
        appointments.accept_modal()
        appointments.click_start_appointment()
        appointments.accept_modal()
   })
*/
});
