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


describe("The user is able to create a new certificate", function() {

     before(function() {
        
    });


    it("On the left side of the page click on the 'Meetings' button", function() {
        cy.get('#side-menu-trigger-1').click()
        cy.url('include', '/councils/drafts').wait(1000)
        
    });

    it("Click on the 'Minutes Book' button", function() {
        cy.get('#tab-4').click()
        cy.url('include', '/confirmed')
    });

    it("Navigate to the already added meeting hover it and click on the 'Certificate' button", function() {
        
        cy.get('#councils-table-row-0').trigger('mouseover')
       
        cy.get('#council-list-certificate-0').click({force:true})
        cy.url('include', '/certificates')
    });

    it("Click on the 'New certificate' button", function() {
        cy.get('#create-certificate').click()
    });

    it("Populate all required fields and click on the 'Generate certificate' button", function() {
        cy.get('#toggle-editor-cert_title')
            .click()
    
         
            .type('CertiTest')
            
        cy.get('#toggle-editor-cert_title')
            .click()
        cy.get('#generate-certificate').click()
       
        cy.get('#alert-confirm-button-accept').click()

    })

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });


});

describe("The user is not able to generate a certificate without populating 'Title' field in the 'New certificate' section", function() {

     before(function() {
        
    });


    it("On the left side of the page click on the 'Meetings' button", function() {
        cy.get('#side-menu-trigger-1').click()
        cy.url('include', '/councils/drafts').wait(1000)
    });

    it("Click on the 'Minutes Book' button", function() {
        cy.get('#tab-4').click()
        cy.url('include', '/confirmed')
    });

    it("Navigate to the already added meeting hover it and click on the 'Certificate' button", function() {
        cy.get('#councils-table-row-0').trigger('mouseover')
        cy.get('#council-list-certificate-0').click()
        cy.url('include', '/certificates')
    });

    it("Click on the 'New certificate' button", function() {
        cy.get('#create-certificate').click()
    });

    it("Click on the 'Generate certificate' button", function() {
        cy.get('#generate-certificate').click()
       
        cy.get('#alert-confirm-button-accept').click()
        cy.log("'You must fill in the title before creating certificate' alert message is displayed")
        cy.get('#generate-certificate-error').should('be.visible')

    })

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });


});

describe("The user is able to export certificate in the PDF form in the 'New certificate' section", function() {

     before(function() {
        
    });


    it("On the left side of the page click on the 'Meetings' button", function() {
        cy.get('#side-menu-trigger-1').click()
        cy.url('include', '/councils/drafts').wait(1000)
    });

    it("Click on the 'Minutes Book' button", function() {
        cy.get('#tab-4').click()
        cy.url('include', '/confirmed')
    });

    it("Navigate to the already added meeting hover it and click on the 'Certificate' button", function() {
        cy.get('#councils-table-row-0').trigger('mouseover')
        cy.get('#council-list-certificate-0').click()
        cy.url('include', '/certificates')
    });

    it("Click on the 'New certificate' button", function() {
        cy.get('#create-certificate').click()
    });

    it("Click on the 'Export document' button", function() {   
        cy.xpath('(//*[@id="user-menu-trigger"])[2]').click()
    })

    it("Click on the 'PDF' button", function() {   
        cy.get('#download-certificate-pdf').click()
    })

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });


});

describe("The user is able to export certificate in the WORD form in the 'New certificate' section", function() {

     before(function() {
        
    });


    it("On the left side of the page click on the 'Meetings' button", function() {
        cy.get('#side-menu-trigger-1').click()
        cy.url('include', '/councils/drafts').wait(1000)
    });

    it("Click on the 'Minutes Book' button", function() {
        cy.get('#tab-4').click()
        cy.url('include', '/confirmed')
    });

    it("Navigate to the already added meeting hover it and click on the 'Certificate' button", function() {
        cy.get('#councils-table-row-0').trigger('mouseover')
        cy.get('#council-list-certificate-0').click()
        cy.url('include', '/certificates')
    });

    it("Click on the 'New certificate' button", function() {
        cy.get('#create-certificate').click()
    });

    it("Click on the 'Export document' button", function() {   
        cy.xpath('(//*[@id="user-menu-trigger"])[2]').click()
    })

    it("Click on the 'WORD' button", function() {   
        cy.get('#download-certificate-ms-word').click()
    })

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });


});


describe("The user is able to select the '2 columns' layout in the 'New certificate' form", function() {

     before(function() {
        
    });


    it("On the left side of the page click on the 'Meetings' button", function() {
        cy.get('#side-menu-trigger-1').click()
        cy.url('include', '/councils/drafts').wait(1000)
    });

    it("Click on the 'Minutes Book' button", function() {
        cy.get('#tab-4').click()
        cy.url('include', '/confirmed')
    });

    it("Navigate to the already added meeting hover it and click on the 'Certificate' button", function() {
        cy.get('#councils-table-row-0').trigger('mouseover')
        cy.get('#council-list-certificate-0').click()
        cy.url('include', '/certificates')
    });

    it("Click on the 'New certificate' button", function() {
        cy.get('#create-certificate').click()
    });

    it("Select the checkbox next to the 'Create 2 columns' text", function() {   
        cy.get('#document-editor-double-column-checkbox').check()
        .should('be.checked')
    })

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });


});

describe("The user is able to see preview in the 'New certificate' section", function() {

     before(function() {
        
    });


    it("On the left side of the page click on the 'Meetings' button", function() {
        cy.get('#side-menu-trigger-1').click()
        cy.url('include', '/councils/drafts').wait(1000)
    });

    it("Click on the 'Minutes Book' button", function() {
        cy.get('#tab-4').click()
        cy.url('include', '/confirmed')
    });

    it("Navigate to the already added meeting hover it and click on the 'Certificate' button", function() {
        cy.get('#councils-table-row-0').trigger('mouseover')
        cy.get('#council-list-certificate-0').click()
        cy.url('include', '/certificates')
    });

    it("Click on the 'New certificate' button", function() {
        cy.get('#create-certificate').click()
    });

    it("Click on the 'See preview' button", function() {   
        cy.get('#document-editor-open-preview-button').click()
        cy.get('#act-preview-container').should('be.visible')
    })

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });


});

describe("The user is able to select/unselect the checkbox next to the 'Include certified stamp' text", function() {

     before(function() {
        
    });


    it("On the left side of the page click on the 'Meetings' button", function() {
        cy.get('#side-menu-trigger-1').click()
        cy.url('include', '/councils/drafts').wait(1000)
    });

    it("Click on the 'Minutes Book' button", function() {
        cy.get('#tab-4').click()
        cy.url('include', '/confirmed')
    });

    it("Navigate to the already added meeting hover it and click on the 'Certificate' button", function() {
        cy.get('#councils-table-row-0').trigger('mouseover')
        cy.get('#council-list-certificate-0').click()
        cy.url('include', '/certificates')
    });

    it("Click on the 'New certificate' button", function() {
        cy.get('#create-certificate').click()
    });

    it("Click on the checkbox next to the 'Include certified stamp' button", function() {   
        cy.get('#remove-block-certAgenda').click()
    })

    it("Click again", function() {   
        cy.get('#remove-block-certAgenda').click()
    })

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });



});

describe("The user is able to add text block in the 'New certificate' section", function() {

     before(function() {
        
    });


    it("On the left side of the page click on the 'Meetings' button", function() {
        cy.get('#side-menu-trigger-1').click()
        cy.url('include', '/councils/drafts').wait(2000)
    });

    it("Click on the 'Minutes Book' button", function() {
        cy.get('#tab-4').click()
        cy.url('include', '/confirmed')
    });

    it("Navigate to the already added meeting hover it and click on the 'Certificate' button", function() {
        cy.get('#councils-table-row-0').trigger('mouseover')
        cy.get('#council-list-certificate-0').click()
        cy.url('include', '/certificates')
    });

    it("Click on the 'New certificate' button", function() {
        cy.get('#create-certificate').click()
    });

    it("Click on the 'Text block' button", function() { 
        cy.log("Verify that we have 4 text blocks")
        cy.get('#root > div:nth-child(1) > div:nth-child(3) > div > div:nth-child(2) > div > div > div:nth-child(2) > div:nth-child(3) > div > div:nth-child(1) > div > div > div.actaLienzo > div > div').should('have.length', 4)  
        cy.get('#document-add-block-text').click()
        cy.get('#root > div:nth-child(1) > div:nth-child(3) > div > div:nth-child(2) > div > div > div:nth-child(2) > div:nth-child(3) > div > div:nth-child(1) > div > div > div.actaLienzo > div > div').should('have.length', 5)
    })

    it("User should be able to exit the meeting", function() {
        cy.visit(login_url)
    });



});