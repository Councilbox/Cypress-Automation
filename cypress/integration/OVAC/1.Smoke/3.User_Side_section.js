import loginPage from "./pageObjects/loginPage"
import requestAppointment from "./pageObjects/requestAppointment"

let inboxId;
let login = new loginPage();
let appointment = new requestAppointment()


describe("The user is able to request prior appointment for the meeting", function() {
     before(function() {    
    });

    it("Open the browser and enter the URL", function() {
        login.navigateUser()
    })
    
    it("'Click on the 'Request prior appointment' button", function() {       
        appointment.requestPriorAppointmentButton()  
    });

    it("Navigate to the 'Appointment Date & Time' section", function() {     
        appointment.navigateToDateAndTime()       
    });

    it("Navigate to the 'Calendar' and select the date and time", function() {    
        appointment.selectAppointmentDate()      
    });

    it("Populate the 'Name' field", function() {  
        appointment.enterName()            
    });

    it("Populate the 'Name' field", function() {  
        appointment.enterSurname()          
    });
    it("Populate the 'TIN' field", function() {  
        appointment.enterTIN()       
    });

    it("Populate the 'Country code' and the 'Telephone' fields", function() {  
        appointment.enterCountryCode()
        appointment.enterTelephoneNo()      
    });

    it("Populate the 'Email' field", function() {  
        appointment.enterEmail()       
    });

    it("Select the checkbox next to the 'The individual gives his/her consent for the results of the attendance at the appointment to be processed by this body' option", function() {  
        appointment.privacyButton()
        appointment.alertConfirmButton()      
    });

    it("Click on the 'Request appointment' button", function() {  
        appointment.requestAppointmentSubmit()      
    });

    it("Verify that appointment is requested", function() {
        appointment.confirmAppointmentRequest()
    })



})


describe("The user is able to reschedule prior appointment", function() {
     before(function() {    
    });

    it("Click on the 'Reschedule Appointment' button", function() {
        appointment.rescheduleAppointmentButton()
    })

    it("Click on 'Accept' button", function() {
        appointment.alertConfirmButton()
    })

    it("Appointment should be rescheduled", function() {
        appointment.rescheduleConfirm()
    })


})

describe("The user is able to add document for the meeting in the "My Documentation" section", function() {
     before(function() {    
    });

    it("Click on the 'My documentation' button from the card", function() {
        appointment.myDocumentationButton()
    })

    it("Click on the 'Upload File' button and upload a file", function() {
        const docFile = 'testDocument.txt';
        cy.get('#upload-file-participant-button').attachFile(docFile)
    })


})


describe("The user is able to cancel prior appointment", function() {
     before(function() {    
    });

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

    it("Click on the 'Cancel Appointment' button", function() {
        appointment.cancelAppointmentButton()
    })

    it("Click on 'Accept' button", function() {
        appointment.alertConfirmButton()
    })

    it("Appointment should be canceled", function() {
        appointment.cancelConfirm()
    })


})