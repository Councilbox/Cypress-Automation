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
            .type('Mostar123!')    
            .should("have.value", 'Mostar123!')
    });

    it("Clicks login button", function() {
        cy.get("#login-button").click();
        
    });

});





describe("Add draft meeting, convened meeting, in progress meeting", function() {

     before(function() {
        
    });

});

describe("The user is able to select all meetings in the 'Drafts' section", function() {

     before(function() {
        
    });


    it("Navigate to the left side of the page and click on the 'Meetings' button", function() {
        cy.get('#side-menu-trigger-1').click()
        cy.url('include', '/councils/drafts')

    });

    it("Click on the checkbox left to the 'Start Date' field", function() {
        cy.get('#meeting-list-header-checkbox').click()
    });

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });



});

describe("The user is able to open the 'Convened' form in the 'Meetings' section", function() {

     before(function() {
        
    });


    it("Navigate to the left side of the page and click on the 'Meetings' button", function() {
        cy.get('#side-menu-trigger-1').click()
        cy.url('include', '/councils/drafts')

    });

    it("Click on the 'Convened' button", function() {
        cy.get('#tab-1').click()
        cy.url('include', '/councils/calendar')
    });

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });



});

describe("The user is able to open the 'In progress' form in the 'Meetings' section", function() {

     before(function() {
        
    });


    it("Navigate to the left side of the page and click on the 'Meetings' button", function() {
        cy.get('#side-menu-trigger-1').click()
        cy.url('include', '/councils/drafts')

    });

    it("Click on the 'In Progress' button", function() {
        cy.get('#tab-2').click()
        cy.url('include', '/councils/live')
    });

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });



});

describe("The user is able to open the 'Drafting the minutes' form in the 'Minutes' section", function() {

     before(function() {
        
    });


    it("Navigate to the left side of the page and click on the 'Meetings' button", function() {
        cy.get('#side-menu-trigger-1').click()
        cy.url('include', '/councils/drafts')

    });

    it("Click on the 'Drafting the minutes' button", function() {
        cy.get('#tab-3').click()
        cy.url('include', '/councils/act')
    });

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });



});

describe("The user is able to open the 'Minute book' form in the 'Meetings' section", function() {

     before(function() {
        
    });


    it("Navigate to the left side of the page and click on the 'Meetings' button", function() {
        cy.get('#side-menu-trigger-1').click()
        cy.url('include', '/councils/drafts')

    });

    it("Click on the 'Minute book' button", function() {
        cy.get('#tab-4').click()
        cy.url('include', '/councils/confirmed')
    });

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });



});

describe("The user is able to open the 'Log' form in the 'Meetings' section", function() {

     before(function() {
        
    });


    it("Navigate to the left side of the page and click on the 'Meetings' button", function() {
        cy.get('#side-menu-trigger-1').click()
        cy.url('include', '/councils/drafts')

    });

    it("Click on the 'Log' button", function() {
        cy.get('#tab-5').click()
        cy.url('include', '/councils/history')
    });

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });



});

describe("The user is able to open the 'All' form in the 'Meetings' section", function() {

     before(function() {
        
    });


    it("Navigate to the left side of the page and click on the 'Meetings' button", function() {
        cy.get('#side-menu-trigger-1').click()
        cy.url('include', '/councils/drafts')

    });

    it("Click on the 'All' button", function() {
        cy.get('#tab-6').click()
        cy.url('include', '/councils/history')
    });

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });



});

describe("The user is able to open the 'All' form in the 'Meetings' section", function() {

     before(function() {
        
    });


    it("Navigate to the left side of the page and click on the 'Meetings' button", function() {
        cy.get('#side-menu-trigger-1').click()
        cy.url('include', '/councils/drafts')

    });

    it("Click on the 'All' button", function() {
        cy.get('#tab-5').click()
        cy.url('include', '/councils/history')
    });

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });



});

describe("The user is able to search the meetings in the 'Drafts' form in the 'Meetings' section", function() {

     before(function() {
        
    });


    it("Navigate to the left side of the page and click on the 'Meetings' button", function() {
        cy.get('#side-menu-trigger-1').click()
        cy.url('include', '/councils/drafts')

    });

    it("Click on the 'Drafts' button", function() {
        cy.get('#tab-0').click()
        cy.url('include', '/councils/drafts')
    });

    it("Navigate to the search field and populate it with inputs you want", function() {
        cy.get('#council-search').type('Ordinary General Meeting - 03/03/2022')
        cy.get('#council-list-0').should('contain' ,'Ordinary General Meeting - 03/03/2022')
    });

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });



});

describe("The user is able to search the meetings in the 'Convened' form in the 'Meetings' section", function() {

     before(function() {
        
    });


    it("Navigate to the left side of the page and click on the 'Meetings' button", function() {
        cy.get('#side-menu-trigger-1').click()
        cy.url('include', '/councils/drafts')

    });

    it("Click on the 'Convened' button", function() {
        cy.get('#tab-1').click()
        cy.url('include', '/councils/calendar')
    });

    it("Navigate to the 'Search' form and populate it with the inputs you want", function() {
        cy.get('#council-search').type('Ordinary General Meeting - 16/07/2021')
        cy.get('#council-list-0').should('contain', 'Ordinary General Meeting - 16/07/2021')
    });

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });



});

describe("The user is able to search the meetings in the 'In Progress' form in the 'Meetings' section", function() {

     before(function() {
        
    });


    it("Navigate to the left side of the page and click on the 'Meetings' button", function() {
        cy.get('#side-menu-trigger-1').click()
        cy.url('include', '/councils/drafts')

    });

    it("Click on the 'In Progress' button", function() {
        cy.get('#tab-2').click()
        cy.url('include', '/councils/live')
    });

    it("Navigate to the 'Search' form and populate it with the inputs you want", function() {
        cy.get('#council-search').type('Ordinary General Meeting - 26/05/2021')
        cy.get('#council-list-0').should('contain', 'Ordinary General Meeting - 26/05/2021')
    });

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });


});

describe("The user is able to search the meetings in the 'Drafting the minutes' form in the 'Meetings' section", function() {

     before(function() {
        
    });


    it("Navigate to the left side of the page and click on the 'Meetings' button", function() {
        cy.get('#side-menu-trigger-1').click()
        cy.url('include', '/councils/drafts')

    });

    it("Click on the 'Drafting the minutes' button", function() {
        cy.get('#tab-3').click()
        cy.url('include', '/councils/act')
    });

    it("Navigate to the 'Search' form and populate it with the inputs you want", function() {
        cy.get('#council-search').type('Junta General Ordinaria - 27/05/2021')
        cy.get('#councils-table-row-0').should('contain', 'Junta General Ordinaria - 27/05/2021')
    });

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });


});

describe("The user is able to search the meetings in the 'Minute book' form in the 'Meetings' section", function() {

     before(function() {
        
    });


    it("Navigate to the left side of the page and click on the 'Meetings' button", function() {
        cy.get('#side-menu-trigger-1').click()
        cy.url('include', '/councils/drafts')

    });

    it("Click on the 'Minute book' button", function() {
        cy.get('#tab-4').click()
        cy.url('include', '/councils/confirmed')
    });

    it("Navigate to the 'Search' form and populate it with the inputs you want", function() {
        cy.get('#council-search').type('Junta General Ordinaria - 31/05/2021')
        cy.get('#councils-table-row-0').should('contain', 'Junta General Ordinaria - 31/05/2021')
    });

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });


});

describe("The user is able to search the meetings in the 'Log' form in the 'Meetings' section", function() {

     before(function() {
        
    });


    it("Navigate to the left side of the page and click on the 'Meetings' button", function() {
        cy.get('#side-menu-trigger-1').click()
        cy.url('include', '/councils/drafts')

    });

    it("Click on the 'Log' button", function() {
        cy.get('#tab-5').click()
        cy.url('include', '/councils/history')
    });

    it("Navigate to the 'Search' form and populate it with the inputs you want", function() {
        cy.get('#council-search').type('Junta General Ordinaria - 28/05/2021')
        cy.get('#councils-table-row-0').should('contain', 'Junta General Ordinaria - 28/05/2021')
    });

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });


});


describe("The user is able to search the meetings in the 'All' form in the 'Meetings' section", function() {

     before(function() {
        
    });


    it("Navigate to the left side of the page and click on the 'Meetings' button", function() {
        cy.get('#side-menu-trigger-1').click()
        cy.url('include', '/councils/drafts')

    });

    it("Click on the 'All' button", function() {
        cy.get('#tab-6').click()
        cy.url('include', '/councils/all')
    });

    it("Navigate to the 'Search' form and populate it with the inputs you want", function() {
        cy.get('#council-search').type('Junta General Ordinaria - 28/05/2021')
        cy.get('#councils-table-row-0').should('contain', 'Junta General Ordinaria - 28/05/2021')
    });

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });


});


describe("The user is able to open the 'Drafts' form in the 'Meetings' section", function() {

     before(function() {
        
    });


    it("Navigate to the left side of the page and click on the 'Meetings' button", function() {
        cy.get('#side-menu-trigger-1').click()
        cy.url('include', '/councils/drafts')

    });

    it("Click on the 'Drafts' button", function() {
        cy.get('#tab-0').click()
        cy.url('include', '/councils/drafts')
    });

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });


});

describe("The user is able to select all meetings in the 'Drafts' form in the 'Meetings' section", function() {

     before(function() {
        
    });


    it("Navigate to the left side of the page and click on the 'Meetings' button", function() {
        cy.get('#side-menu-trigger-1').click()
        cy.url('include', '/councils/drafts')

    });

    it("Click on the 'Drafts' button", function() {
        cy.get('#tab-0').click()
        cy.url('include', '/councils/drafts')
    });

    it("Click on the checkbox left to the 'Start Date' field", function() {
        cy.get('#meeting-list-header-checkbox').click()
    });

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });



});

describe("The user is able to select all meetings in the 'Convened' form in the 'Meetings' section", function() {

     before(function() {
        
    });


    it("Navigate to the left side of the page and click on the 'Meetings' button", function() {
        cy.get('#side-menu-trigger-1').click()
        cy.url('include', '/councils/drafts')

    });

    it("Click on the 'Convened' button", function() {
        cy.get('#tab-1').click()
        cy.url('include', '/councils/calendar')
    });

    it("Click on the checkbox left to the 'Start Date' field", function() {
        cy.get('#meeting-list-header-checkbox').click()
    });

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });



});

describe("The user is able to select all meetings in the 'In progress' form in the 'Meetings' section", function() {

     before(function() {
        
    });


    it("Navigate to the left side of the page and click on the 'Meetings' button", function() {
        cy.get('#side-menu-trigger-1').click()
        cy.url('include', '/councils/drafts')

    });

    it("Click on the 'In Progress' button", function() {
        cy.get('#tab-2').click()
        cy.url('include', '/councils/live')
    });

    it("Click on the checkbox left to the 'Start Date' field", function() {
        cy.get('#meeting-list-header-checkbox').click()
    });

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });



});

describe("The user is able to delete the meeting in the 'Convened' form in the 'Meetings' section", function() {

    before(function() {
       
   });


   it("Navigate to the left side of the page and click on the 'Meetings' button", function() {
       cy.get('#side-menu-trigger-1').click()
       cy.url('include', '/councils/drafts')

   });

   it("Click on the 'Convened' button", function() {
       cy.get('#tab-1').click().wait(1000)
       cy.url('include', '/councils/calendar')
   });

   it("Navigate to the already added meeting and click on the 'X' button", function() {
       cy.get('#council-list-0').trigger('mouseover')
     
       cy.get('#meetings-list-close-0').click()
       
       cy.get('#alert-confirm-button-accept')
   });

   it("User should be able to exit the meeting", function() {
       cy.visit(login_url)
   });



});

describe("The user is able to delete the meeting in the 'Drafts' form in the 'Meetings' section", function() {

    before(function() {
       
   });


   it("Navigate to the left side of the page and click on the 'Meetings' button", function() {
       cy.get('#side-menu-trigger-1').click()
       cy.url('include', '/councils/drafts')

   });

   it("Click on the 'Drafts' button", function() {
       cy.get('#tab-0').click().wait(1000)
       cy.url('include', '/councils/drafts')
   });

   it("Navigate to the already added meeting and click on the 'X' button", function() {
       cy.get('#council-list-0').trigger('mouseover')
       cy.get('#meetings-list-close-0').click()
       
       cy.get('#alert-confirm-button-accept')
   });

   it("User should be able to exit the meeting", function() {
       cy.visit(login_url)
   });



});

describe("The user is able to delete the meeting in the 'In Progress' form in the 'Meetings' section", function() {

    before(function() {
       
   });


   it("Navigate to the left side of the page and click on the 'Meetings' button", function() {
       cy.get('#side-menu-trigger-1').click()
       cy.url('include', '/councils/drafts')

   });

   it("Click on the 'In Progress' button", function() {
       cy.get('#tab-2').click().wait(1000)
       cy.url('include', '/councils/live')
   });

   it("Navigate to the already added meeting and click on the 'X' button", function() {
       cy.get('#council-list-0').trigger('mouseover')
       
       cy.get('#meetings-list-close-0').click()
       
       cy.get('#alert-confirm-button-accept')
   });

   it("User should be able to exit the meeting", function() {
       cy.visit(login_url)
   });



});