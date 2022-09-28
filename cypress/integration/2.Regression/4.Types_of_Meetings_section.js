const invalid_emails = ["andrej@qa", "andrej.qa", "andrej@majl.234"];
const login_url = Cypress.env("baseUrl");
const valid_password = Cypress.env("login_password");
const valid_email = Cypress.env("login_email");

beforeEach(function() {
    cy.restoreLocalStorage();
});

afterEach(function() {
    cy.saveLocalStorage();
});

before(function() {
    cy.clearLocalStorage();
    cy.saveLocalStorage();
});


function userID_Alpha() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    for (var i = 0; i < 10; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

describe("Councilbox login - valid username and password", function() {

     before(function() {
        
    });


    it("Visits the Councilbox web page", function() {
        cy.visit(login_url);
    });

    it("Enters email address", function() {
        cy.get('input').eq(0)
            .type('alem@qaengineers.net')    
            .should("have.value", 'alem@qaengineers.net')
    });

    it("Enters password", function() {
        cy.get('input').eq(1)
            .type('Mostar123!test')    
            .should("have.value", 'Mostar123!test')
    });

    it("Clicks login button", function() {
        cy.get("#login-button").click();
      
    });

});










/*


describe("The alert message is displayed when the user tries to switch to other type without saving changes", function() {

        it("Click on the 'Council types' button", function() {
            cy.get('#edit-statutes-block').click()
            cy.wait(1000)
            cy.get('#company-statute-edit-3').click()
            cy.wait(1000)
        });

        it("Scroll down the page and populate some fields", function() {
            cy.contains('Email notification of the start of voting').click()
        });

        it("Navigate to the other type of meeting and click on it", function() {
            cy.contains('Extraordinary General Meeting').click()
            cy.wait(1000)
        });

        it("The alert message is successfully displayed", function() {
            cy.contains('Has unsaved changes')
        });

        it("Click on the “Save” button", function() {
            cy.get('#unsaved-changes-modal-button-accept').click()
            cy.wait(1000)
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });


describe("The user is able to undo all changes in the 'Council Types' section", function() {

        it("Click on the 'Council types' button", function() {
            cy.get('#edit-statutes-block').click()
            cy.wait(1000)
            cy.get('#company-statute-edit-3').click()
            cy.wait(1000)
        });

        it("Click on the “checkbox” in front of some fields", function() {
            cy.contains('Email notification of the start of voting').click()
        });

        it("Click on the “Undo Changes” button", function() {
            cy.get('#discard-changes-button').click()
            cy.wait(1000)
        });

        it("Click on the 'OK' button", function() {
            cy.get('#alert-confirm-button-accept').click()
            cy.wait(1000)
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

    */


    

describe("The user is able to edit a type of meeting in the 'Council types' section", function() {

        it("Click on the 'Council types' button", function() {
            cy.get('#edit-statutes-block').click()
           
            cy.get('#company-statute-edit-5').click()
            
        });

        it("From the list of meetings find and click the one you want to edit", function() {
            cy.get('#council-type-advance-notice-days').click()
         
        });

        it("Populate fields with new data and click on the 'Save' button", function() {
            cy.get('#council-statute-save-button').click()
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });




describe("The user is able to Add a type of meeting in the 'Council types' section", function() {

        it("Click on the 'Council types' button", function() {
            cy.get('#edit-statutes-block').click()
            
        });

        it("Click on 'Add type of meeting +' button", function() {
            cy.get('#company-statute-create-button').click()
          
        });


        it("Populate all required fields in Add type of meeting", function() {
            cy.get('#new-council-type-input').type('TypeAuto'+Cypress.config('UniqueNumber'))
            

        });

        it("Click on 'OK' button", function() {
            cy.get('#alert-confirm-button-accept').click()
            cy.get('#council-statute-save-button').click()
     
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });


/*



describe("The user is able to rename a type of meeting in the 'Types of meetings' section", function() {

        it("Click on the 'Council types' button", function() {
            cy.get('#edit-statutes-block').click()
            cy.wait(1000)
        });

        it("From the list of meetings choose the meeting you want to rename and hover it then click on the 'Rename meeting type' button", function() {
            cy.contains('AlemTestAutomation').click()
            cy.wait(1000)
            cy.get('#MISSING_ID').click()

        });


        it("Populate the “Meeting type*” field with a new name and click on the 'OK' button", function() {
            cy.get('#anadirTipoDeReunionInputEnModal').clear().type('AlemTestAutomation')
            cy.get('#alert-confirm-button-accept').click()
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

*/

/*
describe("The user is able to delete a type of meeting from the list of meetings in the 'Types of meetings' section", function() {

        it("Click on the 'Council types' button", function() {
            cy.get('#edit-statutes-block').click()
            cy.wait(1000)
        });

        it("Navigate to the already added meeting type and hover it then click on the “X” button", function() {
            cy.contains('TypeAuto'+Cypress.config('UniqueNumber')).scrollIntoView().wait(1000)
            .should('be.visible')

            cy.xpath('//*[@class="jss711 jss917 closeIcon"]').last().click()
            cy.wait(1000)
        });


        it("Click on the 'Delete' button when the alert message appears", function() {
            cy.get('#alert-confirm-button-accept').click()
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

 */   

describe("The user is not able to add type of meeting without populating 'Meeting type*'' field in the 'Types of meetings' section", function() {

        it("Click on the 'Council types' button", function() {
            cy.get('#edit-statutes-block').click()
            
        });

        it("Click on 'Add type of meeting +' button", function() {
            cy.get('#company-statute-create-button').click()
          
        });


        it("Click on the 'OK' button without populating the “Meeting type*”", function() {
            cy.get('#alert-confirm-button-accept').click()
        });

        it("The user is not able to add the meeting and the alert message 'Required field' is successfully displayed", function() {
            cy.contains('Required field')
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });





describe("The user is able to choose and select 'There is minimum notice to call notice' option for the call in the 'Convene' section in the 'Council types' section", function() {

        it("Click on the 'Council types' button", function() {
            cy.get('#edit-statutes-block').click()
          
            cy.get('#company-statute-edit-3').click()
        
        });

        it("Navigate to the 'Announcement' section", function() {
            cy.get('#council-type-advance-notice-days').scrollIntoView().wait(1000)
         
        });

        it("Click on the 'There is a minimum notice to call notice' checkbox and click on the 'Save' button", function() {
            cy.get('#council-type-advance-notice-days').click()
            
            cy.get('#council-statute-save-button').click()

        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to choose and select 'Second call' option for the call in the 'Announcement' section in the 'Council types' section", function() {

        it("Click on the 'Council types' button", function() {
           
            cy.get('#edit-statutes-block').click()
         
            cy.get('#company-statute-edit-3').click()
         
        });

        it("Navigate to the 'Announcement' section", function() {
            cy.get('#council-type-has-second-call').scrollIntoView().wait(1000)
            
        });

        it("Click on the 'There is second call' checkbox and click on the 'Save' button", function() {
            cy.get('#council-type-has-second-call').click()
           
            cy.get('#council-statute-save-button').click()

        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });


describe("The user is able to choose and select 'Attendees' type of quorum for the call in the 'Attendance' section in the 'Council types' form", function() {

        it("Click on the 'Council types' button", function() {
            cy.get('#edit-statutes-block').click()
        
            cy.get('#company-statute-edit-3').click()
            
        });

        it("Navigate to the 'Attendance' section", function() {
            cy.contains('Attendance')
        });

        it("Navigate to the 'Type of Quorum' and click on the 'Attendees' button and click on the 'Save' button", function() {
            cy.get('#council-type-quorum-type').click()
            
            cy.get('#quorum-type-attendants').click()
            
            cy.get('#council-statute-save-button').click()

        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });


describe("The user is able to choose and select 'Shares' type of quorum for the call in the 'Attendance' section in the 'Council types' form", function() {

        it("Click on the 'Council types' button", function() {
            
            cy.get('#edit-statutes-block').click()
           
            cy.get('#company-statute-edit-3').click()
            
        });

        it("Navigate to the 'Attendance' section", function() {
            cy.contains('Attendance')
        });

        it("Navigate to the 'Type of quorum' and click on it and from the dropdown menu choose and click on the 'Shares' button and click on the 'Save' button", function() {
            cy.get('#council-type-quorum-type').click()
            
            cy.get('#quorum-type-social-capital').click()
            
            cy.get('#council-statute-save-button').click()

        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to choose and select 'Percentage' in the 'Quorum attendance 1st call' field in the 'Council types' form", function() {

        it("Click on the 'Council types' button", function() {
            
            cy.get('#edit-statutes-block').click()
            
            cy.get('#company-statute-edit-3').click()
            
        });

        it("Navigate to the 'Attendance' section", function() {
            cy.contains('Attendance')
        });

        it("Navigate to the 'Quorum attendance 1st call' and click on the 'Percentage' button and enter the number then click on the 'Save' button", function() {
            cy.get('#council-type-quorum-first-call').click()
          
            cy.get('#quorum-first-call-0').click()
           
            cy.get('#quorum-first-call-percentage').clear()
                .type('20')
            cy.get('#council-statute-save-button').click()

        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to choose and select 'Half plus one' in the 'Quorum attendance 1st call' field in the 'Council types' form", function() {

        it("Click on the 'Council types' button", function() {
          
            cy.get('#edit-statutes-block').click()
            
            cy.get('#company-statute-edit-3').click()
            
        });

        it("Navigate to the 'Attendance' section", function() {
            cy.contains('Attendance')
        });

        it("Navigate to the 'Quorum attendance 1st call' and click on the 'Half plus one' button and enter the number then click on the 'Save' button", function() {
            cy.get('#council-type-quorum-first-call').click()
            
            cy.get('#quorum-first-call-1').click()
            
            cy.get('#council-statute-save-button').click()

        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to choose and select 'Fraction' in the 'Quorum attendance 1st call' field in the 'Council types' form", function() {

        it("Click on the 'Council types' button", function() {
           
            cy.get('#edit-statutes-block').click()
            
            cy.get('#company-statute-edit-3').click()
            
        });

        it("Navigate to the 'Attendance' section", function() {
            cy.contains('Attendance')
        });

        it("Navigate to the 'Quorum attendance 1st call' and click on the 'Fraction' button and enter the number then click on the 'Save' button", function() {
            cy.get('#council-type-quorum-first-call').click()
           
            cy.get('#quorum-first-call-2').click()
          
            cy.get('#council-statute-save-button').click()

        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to choose and select 'Number' in the 'Quorum attendance 1st call' field in the 'Council types' form", function() {

        it("Click on the 'Council types' button", function() {
          
            cy.get('#edit-statutes-block').click()
           
            cy.get('#company-statute-edit-3').click()
           
        });

        it("Navigate to the 'Attendance' section", function() {
            cy.contains('Attendance')
        });

        it("Navigate to the 'Quorum attendance 1st call' and click on the 'Number' button and enter the number then click on the 'Save' button", function() {
            cy.get('#council-type-quorum-first-call').click()
           
            cy.get('#quorum-first-call-3').click()
           
            cy.get('#council-statute-save-button').click()

        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to choose and select 'None' in the 'Quorum attendance 1st call' field in the 'Council types' form", function() {

        it("Click on the 'Council types' button", function() {
            
            cy.get('#edit-statutes-block').click()
            
            cy.get('#company-statute-edit-3').click()
           
        });

        it("Navigate to the 'Attendance' section", function() {
            cy.contains('Attendance')
        });

        it("Navigate to the 'Quorum attendance 1st call' and click on the 'None' button and enter the number then click on the 'Save' button", function() {
            cy.get('#council-type-quorum-first-call').click()
           
            cy.get('#quorum-first-call--1').click()
           
            cy.get('#council-statute-save-button').click()

        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });


describe("The user is able to choose and select 'Percentage' in the 'Quorum attendance 2nd call' field in the 'Council types' form", function() {

        it("Click on the 'Council types' button", function() {
          
            cy.get('#edit-statutes-block').click()
            
            cy.get('#company-statute-edit-3').click()
           
        });

        it("Navigate to the 'Attendance' section", function() {
            cy.contains('Attendance')
        });

        it("Navigate to the 'Quorum attendance 2nd call' and click on the 'Percentage' button and enter the number then click on the 'Save' button", function() {
            cy.get('#council-type-quorum-second-call').click()
            
            cy.get('#quorum-second-call-0').click()
           
            cy.get('#council-statute-save-button').click()

        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to choose and select 'Fraction' in the 'Quorum attendance 2nd call' field in the 'Council types' form", function() {

        it("Click on the 'Council types' button", function() {
           
            cy.get('#edit-statutes-block').click()
            
            cy.get('#company-statute-edit-3').click()
           
        });

        it("Navigate to the 'Attendance' section", function() {
            cy.contains('Attendance')
        });

        it("Navigate to the 'Quorum attendance 2nd call' and click on the 'Fraction' button and enter the number then click on the 'Save' button", function() {
            cy.get('#council-type-quorum-second-call').click()
         
            cy.get('#quorum-second-call-2').click()
           
            cy.get('#council-statute-save-button').click()

        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to choose and select 'Number' in the 'Quorum attendance 2nd call' field in the 'Council types' form", function() {

        it("Click on the 'Council types' button", function() {
           
            cy.get('#edit-statutes-block').click()
            
            cy.get('#company-statute-edit-3').click()
           
        });

        it("Navigate to the 'Attendance' section", function() {
            cy.contains('Attendance')
        });

        it("Navigate to the 'Quorum attendance 2nd call' and click on the 'Number' button and enter the number then click on the 'Save' button", function() {
            cy.get('#council-type-quorum-second-call').click()
           
            cy.get('#quorum-second-call-3').click()
            
            cy.get('#council-statute-save-button').click()

        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to choose and select 'Half plus one' in the 'Quorum attendance 2nd call' field in the 'Council types' form", function() {

        it("Click on the 'Council types' button", function() {
           
            cy.get('#edit-statutes-block').click()
           
            cy.get('#company-statute-edit-3').click()
          
        });

        it("Navigate to the 'Attendance' section", function() {
            cy.contains('Attendance')
        });

        it("Navigate to the 'Quorum attendance 2nd call' and click on the 'Half plus one' button and enter the number then click on the 'Save' button", function() {
            cy.get('#council-type-quorum-second-call').click()
           
            cy.get('#quorum-second-call-1').click()
           
            cy.get('#council-statute-save-button').click()

        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to choose and select 'None' in the 'Quorum attendance 2nd call' field in the 'Council types' form", function() {

        it("Click on the 'Council types' button", function() {
           
            cy.get('#edit-statutes-block').click()
           
            cy.get('#company-statute-edit-3').click()
           
        });

        it("Navigate to the 'Attendance' section", function() {
            cy.contains('Attendance')
        });

        it("Navigate to the 'Quorum attendance 2nd call' and click on the 'None' button and enter the number then click on the 'Save' button", function() {
            cy.get('#council-type-quorum-second-call').click()
          
            cy.get('#quorum-second-call--1').click()
         
            cy.get('#council-statute-save-button').click()

        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to choose and select 'Delegated vote' option for the call in the 'Attendance' section in the 'Council types' section", function() {

        it("Click on the 'Council types' button", function() {
           
            cy.get('#edit-statutes-block').click()
           
            cy.get('#company-statute-edit-3').click()
          
        });

        it("Navigate to the 'Attendance' section", function() {
            cy.contains('Attendance')
        });

        it("Click on the 'There is a delegated vote' checkbox and click on the 'Save' button", function() {
            cy.get('#council-type-delegated-vote').click()
           
            cy.get('#council-statute-save-button').click()
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to choose and select 'The sense of vote can be indicated in the delegations' option for the call in the 'Attendance' section in the 'Council types' section", function() {

        it("Click on the 'Council types' button", function() {
          
            cy.get('#edit-statutes-block').click()
          
            cy.get('#company-statute-edit-3').click()
        
        });

        it("Navigate to the 'Attendance' section", function() {
            cy.contains('Attendance')
        });

        it("Click on the 'The sense of vote can be indicated in the delegations' checkbox and click on the 'Save' button", function() {
            cy.get('#council-type-vote-sense').click()
           
            cy.get('#council-statute-save-button').click()
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to choose and select 'Early voting' option for the call in the 'Assistance' section in the 'Council types' section", function() {

        it("Click on the 'Council types' button", function() {
          
            cy.get('#edit-statutes-block').click()
            
            cy.get('#company-statute-edit-3').click()
           
        });

        it("Navigate to the 'Attendance' section", function() {
            cy.contains('Attendance')
        });

        it("Click on the 'There is early voting' checkbox and click on the 'Save' button", function() {
            cy.get('#council-type-early-vote').click()
           
            cy.get('#council-statute-save-button').click()
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to choose and select 'There is maximum number of delegated votes option for the call' in the 'Assistance' section in the 'Council types' section", function() {

        it("Click on the 'Council types' button", function() {
           
            cy.get('#edit-statutes-block').click()
            
            cy.get('#company-statute-edit-3').click()
         
        });

        it("Navigate to the 'Attendance' section", function() {
            cy.contains('Attendance')
        });

        it("Click on the 'There is a maximum number of delegated votes' checkbox and navigate to the 'Vote' field and populate it then click on the 'Save' button", function() {
            cy.get('#council-type-max-delegated').click()
          
            cy.get('#council-type-max-delegated-number').clear()
                .type('3')
            cy.get('#council-statute-save-button').click()
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to choose and select 'Access to the room is limited after the start' option for the call in the 'Assistance' section in the 'Council types' section", function() {

        it("Click on the 'Council types' button", function() {
          
            cy.get('#edit-statutes-block').click()
            
            cy.get('#company-statute-edit-3').click()
           
        });

        it("Navigate to the 'Attendance' section", function() {
            cy.contains('Attendance')
        });

        it("Click on the 'Access to the room is limited after the start' checkbox and navigate to the 'Minutes' field and populate it then click on the 'Save' button", function() {
            cy.get('#council-type-limited-access').click()
           
            cy.get('#council-type-limited-access-minutes').clear()
                .type('3')
            cy.get('#council-statute-save-button').click()
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });



describe("The user is able to choose and select 'Against' option for the call in the 'Default vote sense' field in the  'Completion of social agreements' section in the 'Council types' section", function() {

        it("Click on the 'Council types' button", function() {
         
            cy.get('#edit-statutes-block').click()
          
            cy.get('#company-statute-edit-3').click()
          
        });

        it("Scroll down the page and navigate to the 'Making resolutions' section", function() {
            cy.contains('Making resolutions')
        });

        it("Navigate to the 'Default vote sense' field", function() {
            cy.get('#council-type-default-vote').scrollIntoView().wait(1000)
           
            //cy.get('.sidebar').scrollTo('bottom')
            cy.get('#council-type-default-vote').click()
           
        });

        it("Click on the 'Against' button and click on the 'Save' button", function() {
            cy.get('#default-vote-0').click()
         
            cy.get('#council-statute-save-button').click()
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to choose and select 'No vote' option for the call in the 'Default vote sense' field in the  'Completion of social agreements' section in the 'Council types' section", function() {

        it("Click on the 'Council types' button", function() {
         
            cy.get('#edit-statutes-block').click()
         
            cy.get('#company-statute-edit-3').click()
           
        });

        it("Scroll down the page and navigate to the 'Making resolutions' section", function() {
            cy.contains('Making resolutions')
        });

        it("Navigate to the 'Default vote sense' field", function() {
            cy.get('#council-type-default-vote').scrollIntoView().wait(1000)
            
            //cy.get('.sidebar').scrollTo('bottom')
            cy.get('#council-type-default-vote').click()
         
        });

        it("Click on the 'No vote' button and click on the 'Save' button", function() {
            cy.get('#default-vote-no-vote').click()
           
            cy.get('#council-statute-save-button').click()
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });


describe("The user is able to choose and select 'In favor' option for the call in the 'Default vote sense' field in the  'Completion of social agreements' section in the 'Council types' section", function() {

        it("Click on the 'Council types' button", function() {
           
            cy.get('#edit-statutes-block').click()
            
            cy.get('#company-statute-edit-3').click()
            
        });

        it("Scroll down the page and navigate to the 'Making resolutions' section", function() {
            cy.contains('Making resolutions')
        });

        it("Navigate to the 'Default vote sense' field", function() {
            cy.get('#council-type-default-vote').scrollIntoView().wait(1000)
            
            //cy.get('.sidebar').scrollTo('bottom')
            cy.get('#council-type-default-vote').click()
           
        });

        it("Click on the 'In favor' button and click on the 'Save' button", function() {
            cy.get('#default-vote-1').click()
         
            cy.get('#council-statute-save-button').click()
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to choose and select 'Abstention' option for the call in the 'Default vote sense' field in the  'Completion of social agreements' section in the 'Council types' section", function() {

        it("Click on the 'Council types' button", function() {
           
            cy.get('#edit-statutes-block').click()
            
            cy.get('#company-statute-edit-3').click()
            
        });

        it("Scroll down the page and navigate to the 'Making resolutions' section", function() {
            cy.contains('Making resolutions')
        });

        it("Navigate to the 'Default vote sense' field", function() {
            cy.get('#council-type-default-vote').scrollIntoView().wait(1000)
            
            //cy.get('.sidebar').scrollTo('bottom')
            cy.get('#council-type-default-vote').click()
            
        });

        it("Click on the 'Abstention' button and click on the 'Save' button", function() {
            cy.get('#default-vote-2').click()
          
            cy.get('#council-statute-save-button').click()
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });


describe("The user is able to choose and select 'There are comments on the agenda items' option for the call in the 'Making resolutions' section in the 'Council types' section", function() {

        it("Click on the 'Council types' button", function() {
           
            cy.get('#edit-statutes-block').click()
           
            cy.get('#company-statute-edit-3').click()
          
        });

        it("Scroll down the page and navigate to the 'Making resolutions' section", function() {
            cy.get('#council-type-has-comments').scrollIntoView().wait(1000)
        });

        it("Click on the 'There are comments on the agenda items' checkbox and click on the 'Save' button", function() {
            cy.get('#council-type-has-comments').click()
            
            cy.get('#council-statute-save-button').click()
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to choose and select 'Email notification of voting start' option for the call in the 'Making resolutions' section in the 'Council types' section", function() {

        it("Click on the 'Council types' button", function() {
           
            cy.get('#edit-statutes-block').click()
           
            cy.get('#company-statute-edit-3').click()
          
        });

        it("Scroll down the page and navigate to the 'Making resolutions' section", function() {
            cy.get('#council-type-notify-points').scrollIntoView().wait(1000)
          
        });

        it("Click on the 'Email notification of voting start' checkbox and click on the 'Save' button", function() {
            cy.get('#council-type-notify-points').click()
         
            cy.get('#council-statute-save-button').click()
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to choose and select 'Exists quality vote' option for the call in the 'Making resolutions' section in the 'Council types' section", function() {

        it("Click on the 'Council types' button", function() {
            
            cy.get('#edit-statutes-block').click()
           
            cy.get('#company-statute-edit-3').click()
          
        });

        it("Scroll down the page and navigate to the 'Making resolutions' section", function() {
            cy.get('#council-type-quality-vote').scrollIntoView().wait(1000)
        });

        it("Click on the 'Exists quality vote' checkbox and click on the 'Save' button", function() {
            cy.get('#council-type-quality-vote').click()
          
            cy.get('#council-statute-save-button').click()
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to choose and select 'Chairperson' option for the call in the 'Making resolutions' section in the 'Council types' section", function() {

        it("Click on the 'Council types' button", function() {
           
            cy.get('#edit-statutes-block').click()
        
            cy.get('#company-statute-edit-3').click()
          
        });

        it("Scroll down the page and navigate to the 'Making resolutions' section", function() {
            cy.get('#council-type-president').scrollIntoView().wait(1000)
        });

        it("Click on the 'President' checkbox and click on the 'Save' button", function() {
            cy.get('#council-type-president').click()
            
            cy.get('#council-statute-save-button').click()
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });


describe("The user is able to choose and select 'Secretary' option for the call in the 'Making resolutions' section in the 'Council types' section", function() {

        it("Click on the 'Council types' button", function() {
            
            cy.get('#edit-statutes-block').click()
            
            cy.get('#company-statute-edit-3').click()
          
        });

        it("Scroll down the page and navigate to the 'Making resolutions' section", function() {
            cy.get('#council-type-secretary').scrollIntoView().wait(1000)
        });

        it("Click on the 'Secretary' checkbox and click on the 'Save' button", function() {
            cy.get('#council-type-secretary').click()
           
            cy.get('#council-statute-save-button').click()
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to choose and select 'Hide recounts until voting is closed' option for the call in the 'Making resolutions' section in the 'Council types' section", function() {

        it("Click on the 'Council types' button", function() {
          
            cy.get('#edit-statutes-block').click()
          
            cy.get('#company-statute-edit-3').click()
           
        });

        it("Scroll down the page and navigate to the 'Making resolutions' section", function() {
            cy.get('#council-type-hide-recount').scrollIntoView().wait(1000)
        });

        it("Click on the 'Hide recounts until voting is closed' checkbox and click on the 'Save' button", function() {
            cy.get('#council-type-hide-recount').click()
           
            cy.get('#council-statute-save-button').click()
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to choose and select 'There are present participants with electronic vote' option for the call in the 'Making resolutions' section in the 'Council types' section", function() {

        it("Click on the 'Council types' button", function() {
            
            cy.get('#edit-statutes-block').click()
          
            cy.get('#company-statute-edit-3').click()
           
        });

        it("Scroll down the page and navigate to the 'Making resolutions' section", function() {
            cy.get('#council-type-remote-vote').scrollIntoView().wait(1000)
         
        });

        it("Click on the 'There are present participants with electronic vote' checkbox and click on the 'Save' button", function() {
            cy.get('#council-type-remote-vote').click()
           
            cy.get('#council-statute-save-button').click()
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to choose and select 'It is permitted to alter the agenda after the call' option for the call in the 'Making resolutions' section in the 'Council types' section", function() {

        it("Click on the 'Council types' button", function() {
       
            cy.get('#edit-statutes-block').click()
         
            cy.get('#company-statute-edit-3').click()
         
        });

        it("Scroll down the page and navigate to the 'Making resolutions' section", function() {
            cy.get('#council-type-agenda-modify').scrollIntoView().wait(1000)
          
        });

        it("Click on the 'It is permitted to alter the agenda after the call' checkbox and click on the 'Save' button", function() {
            cy.get('#council-type-agenda-modify').click()
          
            cy.get('#council-statute-save-button').click()
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to choose and select 'It is permitted to reorder items on the agenda during the meeting' option for the call in the 'Making resolutions' section in the 'Council types' section", function() {

        it("Click on the 'Council types' button", function() {
            
            cy.get('#edit-statutes-block').click()
           
            cy.get('#company-statute-edit-3').click()
          
        });

        it("Scroll down the page and navigate to the 'Making resolutions' section", function() {
            cy.get('#council-type-agenda-reorder').scrollIntoView().wait(1000)
           
        });

        it("Click on the 'It is permitted to reorder items on the agenda during the meeting' checkbox and click on the 'Save' button", function() {
            cy.get('#council-type-agenda-reorder').click()
          
            cy.get('#council-statute-save-button').click()
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to choose and select 'Those banned may be readmitted' option for the call in the 'Making resolutions' section in the 'Council types' section", function() {

        it("Click on the 'Council types' button", function() {
      
            cy.get('#edit-statutes-block').click()
          
            cy.get('#company-statute-edit-3').click()
    
        });

        it("Scroll down the page and navigate to the 'Making resolutions' section", function() {
            cy.get('#council-type-can-unblock').scrollIntoView().wait(1000)
      
        });

        it("Click on the 'Those banned may be readmitted' checkbox and click on the 'Save' button", function() {
            cy.get('#council-type-can-unblock').click()
          
            cy.get('#council-statute-save-button').click()
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });



describe("The user is able to choose and select 'Associated census' for the call in the 'Census' section in the 'Types of meetings' form", function() {

        it("Click on the 'Council types' button", function() {
           
            cy.get('#edit-statutes-block').click()
          
            cy.get('#company-statute-edit-3').click()
           
        });

        it("Scroll down the page and navigate to the 'Census' section", function() {
            cy.get('#council-type-default-census').scrollIntoView().wait(1000)
            
        });

        it("Navigate to the 'Associated census' and from the dropdown menu choose and click on the Census you want to select then click on the 'Save' button", function() {
            cy.get('#council-type-default-census').click()
         
            cy.get('#census-0').click()
          
            cy.get('#council-statute-save-button').click()
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });



describe("The user is able to choose and select 'Minutes exist' option for the call in the 'Minutes and documents' section in the 'Types of meetings' section", function() {

        it("Click on the 'Council types' button", function() {
          
            cy.get('#edit-statutes-block').click()
            
            cy.get('#company-statute-edit-3').click()
           
        });

        it("Scroll down the page and navigate to the 'Minutes and documents' section", function() {
            cy.get('#council-type-has-act').scrollIntoView().wait(1000)
            
        });

        it("Click on the 'Minutes exist' checkbox and click on the 'Save' button", function() {
            cy.get('#council-type-has-act').click()
          
            cy.get('#council-statute-save-button').click()
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to choose and select 'Automatic approval of the minutes at the end' option for the call in the 'Minutes and documents' section in the 'Types of meetings' section", function() {

        it("Click on the 'Council types' button", function() {
            
            cy.get('#edit-statutes-block').click()
           
            cy.get('#company-statute-edit-3').click()
           
        });

        it("Scroll down the page and navigate to the 'Minutes and documents' section", function() {
            cy.get('#council-type-auto-approve-act').scrollIntoView().wait(1000)
           
        });

        it("Click on the “Automatic approval of the minutes at the end” checkbox and click on the 'Save' button", function() {
            cy.get('#council-type-auto-approve-act').click()
            
            cy.get('#council-statute-save-button').click()
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to choose and select 'Send minutes automatically on completion option for the call in the 'Minutes and documents' section in the 'Types of meetings' section", function() {

        it("Click on the 'Council types' button", function() {
           
            cy.get('#edit-statutes-block').click()
           
            cy.get('#company-statute-edit-3').click()
          
        });

        it("Scroll down the page and navigate to the 'Minutes and documents' section", function() {
            cy.get('#council-type-auto-send-act').scrollIntoView().wait(1000)
          
        });

        it("Click on the “Send minutes automatically on completion” checkbox and click on the “Save” button", function() {
            cy.get('#council-type-auto-send-act').click()
          
            cy.get('#council-statute-save-button').click()
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });


/*
describe("The user is able to choose and select 'A list of participants is included in the minutes' option for the call in the 'Minutes and documents' section in the 'Types of meetings' section", function() {

        it("Click on the 'Council types' button", function() {
            cy.get('#edit-statutes-block').click()
            cy.wait(1000)
            cy.get('#company-statute-edit-3').click()
            cy.wait(1000)
        });

        it("Scroll down the page and navigate to the 'Minutes and documents' section", function() {
            cy.get('#council-type-include-attendants-list').scrollIntoView().wait(1000)
            cy.wait(1000)
        });

        it("Click on the 'A list of participants is included in the minutes' checkbox and click on the 'Save' button", function() {
            cy.get('#council-type-include-attendants-list').click()
            cy.wait(1000)
            cy.get('#council-statute-save-button').click()
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });



describe("The user is able to choose and select 'It is included in the minute book' option for the call in the 'Minutes and documents' section in the 'Types of meetings' section", function() {

        it("Click on the 'Council types' button", function() {
            cy.get('#edit-statutes-block').click()
            cy.wait(1000)
            cy.get('#company-statute-edit-3').click()
            cy.wait(1000)
        });

        it("Scroll down the page and navigate to the 'Minutes and documents' section", function() {
            cy.get('#council-type-include-act-book').scrollIntoView().wait(1000)
            cy.wait(1000)
        });

        it("Click on the 'It is included in the minute book' checkbox and click on the 'Save' button", function() {
            cy.get('#council-type-include-act-book').click()
            cy.wait(1000)
            cy.get('#council-statute-save-button').click()
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

*/

describe("The user is able to choose and select 'Double column' option for the call in the 'Documents' section in the 'Types of meetings' section", function() {

        it("Click on the 'Council types' button", function() {
        
            cy.get('#edit-statutes-block').click()
         
            cy.get('#company-statute-edit-3').click()
          
        });

        it("Scroll down the page and navigate to the 'Documents' section", function() {
            cy.get('#council-type-double-column').scrollIntoView().wait(1000)
         
        });

        it("Click on the 'Double column' checkbox and click on the 'Save' button", function() {
            cy.get('#council-type-double-column').click()
            
            cy.get('#council-statute-save-button').click()
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });


describe("The user is able to choose and select 'Require (proxy) document' option for the call in the 'Documents' section in the 'Types of meetings' section", function() {

        it("Click on the 'Council types' button", function() {
          
            cy.get('#edit-statutes-block').click()
            
            cy.get('#company-statute-edit-3').click()
          
        });

        it("Scroll down the page and navigate to the 'Documents' section", function() {
            cy.get('#council-type-require-proxy').scrollIntoView().wait(1000)
          
        });

        it("Click on the 'Require (proxy) document' checkbox and click on the 'Save' button", function() {
            cy.get('#council-type-require-proxy').click()
         
            cy.get('#council-statute-save-button').click()
        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });




describe("The user is able to choose and select the tag in the 'tags' section in the 'Announcement header' form in the 'Announcement template' section in the 'Types of meetings' section", function() {

        it("Click on the 'Council types' button", function() {
          
            cy.get('#edit-statutes-block').click()
           
            cy.get('#company-statute-edit-3').click()
            
        });

        it("Scroll down the page and navigate to the 'Documents' section", function() {
            cy.get('#council-type-convene-header').scrollIntoView().wait(1000)
         
        });

        it("Navigate to the 'Voting letter with voting directions' section and click on the 'tags' button and click on it then choose and select the tag you want and click on the 'Save' button", function() {
            cy.get('.ql-editor').eq(0).clear()
                .type('{{')
                    .type('business_name')
                        .type('}}')
         
            cy.get('#council-statute-save-button').click()

        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });


describe("The user is able to choose and select the tag in the 'tags' section in the 'Annoucement footer' form in the 'Annoucement template' section in the 'Types of meetings' section", function() {

        it("Click on the 'Council types' button", function() {
       
            cy.get('#edit-statutes-block').click()
         
            cy.get('#company-statute-edit-3').click()
         
        });

        it("Scroll down the page and navigate to the 'Announcement templates' section", function() {
            cy.get('#council-type-convene-footer').scrollIntoView().wait(1000)
          
        });

        it("Navigate to the 'Announcement footer' section and click on the 'tags' button and click on it then choose and select the tag you want and click on the 'Save' button", function() {
            cy.get('.ql-editor').eq(1).clear()
                .type('{{')
                    .type('business_name')
                        .type('}}')
           
            cy.get('#council-statute-save-button').click()

        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to choose and select the tag in the 'tags' section in the 'Introduction' form in the 'Minutes templates' section in the 'Types of meetings' section", function() {

        it("Click on the 'Council types' button", function() {
          
            cy.get('#edit-statutes-block').click()
          
            cy.get('#company-statute-edit-3').click()
        
        });

        it("Scroll down the page and navigate to the 'Minutes templates' section", function() {
            cy.get('#council-type-intro').scrollIntoView().wait(1000)
           
        });

        it("Navigate to the 'Introduction' section and click on the 'tags' button and click on it then choose and select the tag you want and click on the 'Save' button", function() {
            cy.get('.ql-editor').eq(2).clear()
                .type('{{')
                    .type('business_name')
                        .type('}}')
          
            cy.get('#council-statute-save-button').click()

        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to choose and select the tag in the 'tags' section in the 'Right column introduction' form in the 'Minutes templates' section in the 'Types of meetings' section", function() {

        it("Click on the 'Council types' button", function() {
            
            cy.get('#edit-statutes-block').click()
          
            cy.get('#company-statute-edit-3').click()
        
        });

        it("Scroll down the page and navigate to the 'Minutes templates' section", function() {
            cy.get('#council-type-intro-secondary').scrollIntoView().wait(1000)
        
        });

        it("Navigate to the 'Right column introduction' section and click on the 'tags' button and click on it then choose and select the tag you want and click on the 'Save' button", function() {
            cy.get('.ql-editor').eq(3).clear()
                .type('{{')
                    .type('business_name')
                        .type('}}')
          
            cy.get('#council-statute-save-button').click()

        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to choose and select the tag in the 'tags' section in the 'Constitution' form in the 'Minutes templates' section in the 'Types of meetings' section", function() {

        it("Click on the 'Council types' button", function() {
          
            cy.get('#edit-statutes-block').click()
            
            cy.get('#company-statute-edit-3').click()
         
        });

        it("Scroll down the page and navigate to the 'Minutes templates' section", function() {
            cy.get('#council-type-constitution').scrollIntoView().wait(1000)
            
        });

        it("Navigate to the 'Constitution' section and click on the 'tags' button and click on it then choose and select the tag you want and click on the 'Save' button", function() {
            cy.get('.ql-editor').eq(4).clear()
                .type('{{')
                    .type('business_name')
                        .type('}}')
            
            cy.get('#council-statute-save-button').click()

        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to choose and select the tag in the 'tags' section in the 'Constitution right column' form in the 'Minutes templates' section in the 'Types of meetings' section", function() {

        it("Click on the 'Council types' button", function() {
          
            cy.get('#edit-statutes-block').click()
           
            cy.get('#company-statute-edit-3').click()
           
        });

        it("Scroll down the page and navigate to the 'Minutes templates' section", function() {
            cy.get('#council-type-constitution-secondary').scrollIntoView().wait(1000)
           
        });

        it("Navigate to the 'Constitution right column' section and click on the 'tags' button and click on it then choose and select the tag you want and click on the 'Save' button", function() {
            cy.get('.ql-editor').eq(5).clear()
                .type('{{')
                    .type('business_name')
                        .type('}}')
          
            cy.get('#council-statute-save-button').click()

        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to choose and select the tag in the 'tags' section in the 'Conclusion' form in the 'Minutes templates' section in the 'Types of meetings' section", function() {

        it("Click on the 'Council types' button", function() {
          
            cy.get('#edit-statutes-block').click()
         
            cy.get('#company-statute-edit-3').click()
          
        });

        it("Scroll down the page and navigate to the 'Minutes templates' section", function() {
            cy.get('#council-type-conclusion').scrollIntoView().wait(1000)
           
        });

        it("Navigate to the 'Conclusion' section and click on the 'tags' button and click on it then choose and select the tag you want and click on the 'Save' button", function() {
            cy.get('.ql-editor').eq(6).clear()
                .type('{{')
                    .type('business_name')
                        .type('}}')
           
            cy.get('#council-statute-save-button').click()

        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to choose and select the tag in the 'tags' section in the 'Right column conclusion' form in the 'Minutes templates' section in the 'Types of meetings' section", function() {

        it("Click on the 'Council types' button", function() {
           
            cy.get('#edit-statutes-block').click()
            
            cy.get('#company-statute-edit-3').click()
         
        });

        it("Scroll down the page and navigate to the 'Minutes templates' section", function() {
            cy.get('#council-type-conclusion-secondary').scrollIntoView().wait(1000)
           
        });

        it("Navigate to the 'Right column conclusion' section and click on the 'tags' button and click on it then choose and select the tag you want and click on the 'Save' button", function() {
            cy.get('.ql-editor').eq(7).clear()
                .type('{{')
                    .type('business_name')
                        .type('}}')
          
            cy.get('#council-statute-save-button').click()

        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

/*

describe("The user is able to choose and select the tag in the 'tags' section in the 'Custom proxy' form in the 'Documents' section in the 'Types of meetings' section", function() {

        it("Click on the 'Council types' button", function() {
            cy.get('#edit-statutes-block').click()
            cy.wait(1000)
            cy.get('#company-statute-edit-3').click()
            cy.wait(1000)
        });

        it("Scroll down the page and navigate to the 'Announcement templates' section", function() {
            cy.get('#council-type-proxy').scrollIntoView().wait(1000)
            cy.wait(1000)
        });

        it("Navigate to the 'Custom proxy' section and click on the 'tags' button and click on it then choose and select the tag you want and click on the 'Save' button", function() {
            cy.get('.ql-editor').eq(2).clear()
                .type('{{')
                    .type('business_name')
                        .type('}}')
            cy.wait(1000)
            cy.get('#council-statute-save-button').click()

        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to choose and select the tag in the 'tags' section in the 'Proxy right column' form in the 'Documents' section in the 'Types of meetings' section", function() {

        it("Click on the 'Council types' button", function() {
            cy.get('#edit-statutes-block').click()
            cy.wait(1000)
            cy.get('#company-statute-edit-3').click()
            cy.wait(1000)
        });

        it("Scroll down the page and navigate to the 'Announcement templates' section", function() {
            cy.get('#council-type-proxy-secondary').scrollIntoView().wait(1000)
            cy.wait(1000)
        });

        it("Navigate to the 'Proxy right column' section and click on the 'tags' button and click on it then choose and select the tag you want and click on the 'Save' button", function() {
            cy.get('.ql-editor').eq(3).clear()
                .type('{{')
                    .type('business_name')
                        .type('}}')
            cy.wait(1000)
            cy.get('#council-statute-save-button').click()

        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to choose and select the tag in the 'tags' section in the 'Voting letter' form in the 'Document' section in the 'Types of meetings' section", function() {

        it("Click on the 'Council types' button", function() {
            cy.get('#edit-statutes-block').click()
            cy.wait(1000)
            cy.get('#company-statute-edit-3').click()
            cy.wait(1000)
        });

        it("Scroll down the page and navigate to the 'Documents' section", function() {
            cy.get('#council-type-vote-letter').scrollIntoView().wait(1000)
            cy.wait(1000)
        });

        it("Navigate to the 'Voting letter' section and click on the 'tags' button and click on it then choose and select the tag you want and click on the 'Save' button", function() {
            cy.get('.ql-editor').eq(4).clear()
                .type('{{')
                    .type('business_name')
                        .type('}}')
            cy.wait(1000)
            cy.get('#council-statute-save-button').click()

        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });


describe("The user is able to choose and select the tag in the 'tags' section in the 'Vote letter right column' form in the 'Documents' section in the 'Types of meetings' section", function() {

        it("Click on the 'Council types' button", function() {
            cy.get('#edit-statutes-block').click()
            cy.wait(1000)
            cy.get('#company-statute-edit-3').click()
            cy.wait(1000)
        });

        it("Scroll down the page and navigate to the 'Documents' section", function() {
            cy.get('#council-type-vote-letter-secondary').scrollIntoView().wait(1000)
            cy.wait(1000)
        });

        it("Navigate to the 'Vote letter right column' section and click on the 'tags' button and click on it then choose and select the tag you want and click on the 'Save' button", function() {
            cy.get('.ql-editor').eq(5).clear()
                .type('{{')
                    .type('business_name')
                        .type('}}')
            cy.wait(1000)
            cy.get('#council-statute-save-button').click()

        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to choose and select the tag in the 'tags' section in the 'Voting letter with voting directions' form in the 'Documents' section in the 'Types of meetings' section", function() {

        it("Click on the 'Council types' button", function() {
            cy.get('#edit-statutes-block').click()
            cy.wait(1000)
            cy.get('#company-statute-edit-3').click()
            cy.wait(1000)
        });

        it("Scroll down the page and navigate to the 'Documents' section", function() {
            cy.get('#council-type-vote-letter-with-sense').scrollIntoView().wait(1000)
            cy.wait(1000)
        });

        it("Navigate to the 'Voting letter with voting directions' section and click on the 'tags' button and click on it then choose and select the tag you want and click on the 'Save' button", function() {
            cy.get('.ql-editor').eq(6).clear()
                .type('{{')
                    .type('business_name')
                        .type('}}')
            cy.wait(1000)
            cy.get('#council-statute-save-button').click()

        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to choose and select the tag in the 'tags' section in the 'Right column vote letter with voting directions' form in the 'Documents' section in the 'Types of meetings' section", function() {

        it("Click on the 'Council types' button", function() {
            cy.get('#edit-statutes-block').click()
            cy.wait(1000)
            cy.get('#company-statute-edit-3').click()
            cy.wait(1000)
        });

        it("Scroll down the page and navigate to the 'Documents' section", function() {
            cy.get('#council-type-vote-letter-with-sense-secondary').scrollIntoView().wait(1000)
            cy.wait(1000)
        });

        it("Navigate to the 'Right column vote letter with voting directions' section and click on the 'tags' button and click on it then choose and select the tag you want and click on the 'Save' button", function() {
            cy.get('.ql-editor').eq(7).clear()
                .type('{{')
                    .type('business_name')
                        .type('}}')
            cy.wait(1000)
            cy.get('#council-statute-save-button').click()

        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to choose and select the tag in the 'tags' section in the 'Introduction' form in the 'Minutes templates' section in the 'Types of meetings' section", function() {

        it("Click on the 'Council types' button", function() {
            cy.get('#edit-statutes-block').click()
            cy.wait(1000)
            cy.get('#company-statute-edit-3').click()
            cy.wait(1000)
        });

        it("Scroll down the page and navigate to the 'Minutes templates' section", function() {
            cy.get('#council-type-intro').scrollIntoView().wait(1000)
            cy.wait(1000)
        });

        it("Navigate to the 'Introduction' section and click on the 'tags' button and click on it then choose and select the tag you want and click on the 'Save' button", function() {
            cy.get('.ql-editor').eq(8).clear()
                .type('{{')
                    .type('business_name')
                        .type('}}')
            cy.wait(1000)
            cy.get('#council-statute-save-button').click()

        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to choose and select the tag in the 'tags' section in the 'Right column introduction' form in the 'Minutes templates' section in the 'Types of meetings' section", function() {

        it("Click on the 'Council types' button", function() {
            cy.get('#edit-statutes-block').click()
            cy.wait(1000)
            cy.get('#company-statute-edit-3').click()
            cy.wait(1000)
        });

        it("Scroll down the page and navigate to the 'Minutes templates' section", function() {
            cy.get('#council-type-intro-secondary').scrollIntoView().wait(1000)
            cy.wait(1000)
        });

        it("Navigate to the 'Right column introduction' section and click on the 'tags' button and click on it then choose and select the tag you want and click on the 'Save' button", function() {
            cy.get('.ql-editor').eq(9).clear()
                .type('{{')
                    .type('business_name')
                        .type('}}')
            cy.wait(1000)
            cy.get('#council-statute-save-button').click()

        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to choose and select the tag in the 'tags' section in the 'Constitution' form in the 'Minutes templates' section in the 'Types of meetings' section", function() {

        it("Click on the 'Council types' button", function() {
            cy.get('#edit-statutes-block').click()
            cy.wait(1000)
            cy.get('#company-statute-edit-3').click()
            cy.wait(1000)
        });

        it("Scroll down the page and navigate to the 'Minutes templates' section", function() {
            cy.get('#council-type-constitution').scrollIntoView().wait(1000)
            cy.wait(1000)
        });

        it("Navigate to the 'Constitution' section and click on the 'tags' button and click on it then choose and select the tag you want and click on the 'Save' button", function() {
            cy.get('.ql-editor').eq(10).clear()
                .type('{{')
                    .type('business_name')
                        .type('}}')
            cy.wait(1000)
            cy.get('#council-statute-save-button').click()

        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to choose and select the tag in the 'tags' section in the 'Constitution right column' form in the 'Minutes templates' section in the 'Types of meetings' section", function() {

        it("Click on the 'Council types' button", function() {
            cy.get('#edit-statutes-block').click()
            cy.wait(1000)
            cy.get('#company-statute-edit-3').click()
            cy.wait(1000)
        });

        it("Scroll down the page and navigate to the 'Minutes templates' section", function() {
            cy.get('#council-type-constitution-secondary').scrollIntoView().wait(1000)
            cy.wait(1000)
        });

        it("Navigate to the 'Constitution right column' section and click on the 'tags' button and click on it then choose and select the tag you want and click on the 'Save' button", function() {
            cy.get('.ql-editor').eq(11).clear()
                .type('{{')
                    .type('business_name')
                        .type('}}')
            cy.wait(1000)
            cy.get('#council-statute-save-button').click()

        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to choose and select the tag in the 'tags' section in the 'Conclusion' form in the 'Minutes templates' section in the 'Types of meetings' section", function() {

        it("Click on the 'Council types' button", function() {
            cy.get('#edit-statutes-block').click()
            cy.wait(1000)
            cy.get('#company-statute-edit-3').click()
            cy.wait(1000)
        });

        it("Scroll down the page and navigate to the 'Minutes templates' section", function() {
            cy.get('#council-type-conclusion').scrollIntoView().wait(1000)
            cy.wait(1000)
        });

        it("Navigate to the 'Conclusion' section and click on the 'tags' button and click on it then choose and select the tag you want and click on the 'Save' button", function() {
            cy.get('.ql-editor').eq(12).clear()
                .type('{{')
                    .type('business_name')
                        .type('}}')
            cy.wait(1000)
            cy.get('#council-statute-save-button').click()

        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

describe("The user is able to choose and select the tag in the 'tags' section in the 'Conclusion right column' form in the 'Minutes templates' section in the 'Types of meetings' section", function() {

        it("Click on the 'Council types' button", function() {
            cy.get('#edit-statutes-block').click()
            cy.wait(1000)
            cy.get('#company-statute-edit-3').click()
            cy.wait(1000)
        });

        it("Scroll down the page and navigate to the 'Minutes templates' section", function() {
            cy.get('#council-type-conclusion-secondary').scrollIntoView().wait(1000)
            cy.wait(1000)
        });

        it("Navigate to the 'Conclusion right column' section and click on the 'tags' button and click on it then choose and select the tag you want and click on the 'Save' button", function() {
            cy.get('.ql-editor').eq(13).clear()
                .type('{{')
                    .type('business_name')
                        .type('}}')
            cy.wait(1000)
            cy.get('#council-statute-save-button').click()

        });

        it("Back to Home page", function() {
            cy.visit(login_url);
        });


    });

*/