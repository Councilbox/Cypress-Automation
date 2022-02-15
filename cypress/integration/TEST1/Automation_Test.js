const url = "app.dev.councilbox.com"
const email = "alem@qaengineers.net"
const password = "Mostar123!"


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



describe("Councilbox login - valid username and password", function() {

     before(function() {
        
    });


    it("Visits the Councilbox web page", function() {
        cy.visit(url);
        cy.url().should('eq', "https://app.dev.councilbox.com/")

    });

    it("Enters email address", function() {
        cy.get('#username')
            .type(email)    
            .should("have.value", email)
    });

    it("Enters password", function() {
        cy.get('#password')
            .type(password)    
            .should("have.value", password)
    });

    it("Clicks login button", function() {
        cy.get("#login-button").click();
        cy.wait(1000)
    });

    it("User should be successfully logged in", function() {
        cy.url().should('include', '/company/')
    })

});


describe("The user is able to change the 'Name' in the  'User settings'", function() {
    
        it("Open the browser and enter the URL of the staging environment", function() {
            cy.visit(url);
            cy.url().should('eq', "https://app.dev.councilbox.com/")
        });

        it("On the upper right corner click on 'User' icon", function() {
            cy.get('#user-menu-trigger').should('be.visible').click()
        });

        it("From the drop down menu click on the 'Edit user' button", function() {
            cy.get('#user-menu-settings').click({force : true})
            cy.url().should('include', 'user')
        });

        it("Modify the 'Name' field", function() {
            cy.get('#user-settings-name').should('be.visible')
                .clear()
                .type('Balla')
                .should("have.value", "Balla")
        });

        it("User should be able to save changes", function() {
            cy.get('#user-settings-save-button').should('be.visible').click()
        });

        it("Setting should be successfully saved", function() {
            cy.get('#user-settings-name').should("have.value", "Balla")
        })



    });

describe("The user is able to change the 'Surname' in the  'User settings'", function() {
    
        it("Open the browser and enter the URL of the staging environment", function() {
            cy.visit(url);
            cy.wait(1000);
        });

        it("On the upper right corner click on 'User' icon", function() {
            cy.get('#user-menu-trigger').should('be.visible').click()
        });

        it("From the drop down menu click on the 'Edit user' button", function() {
            cy.get('#user-menu-settings').click({force : true})
            cy.url().should('include', 'user')
        });

        it("Modify the 'Surname' field", function() {
            cy.get('#user-settings-surname').should('be.visible')
                .clear()
                .type('Balic')
                .should("have.value", "Balic")
        });

        it("User should be able to save changes", function() {
            cy.get('#user-settings-save-button').should('be.visible').click()
        });

        it("Setting should be successfully saved", function() {
            cy.get('#user-settings-surname').should("have.value", "Balic")
        })

    });



describe("Log Out", function() {

    it("Opens dropdown in upper right corner", function() {
        cy.get('#user-menu-trigger').should('be.visible').click()
    });
    it("Clicks logout", function() {
        cy.get('#user-menu-logout').should('be.visible').click()
    });

    it("User successfully redirected to login page", function() {
        cy.url().should('include', url);
    });
});