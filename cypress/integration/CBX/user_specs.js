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

describe("Council box change user settings", function() {
    describe("Open user settings page", function() {
        before(function() {
            cy.deleteLocalStorage();
        });
    
        it("Visits the councilbox web page", function() {
            cy.loginUI();
            //cy.visit(login_url);
            cy.wait(1000);
        });
    
        it("Opens dropdown in upper right corner", function() {
            cy.get('#user-menu-trigger').click()
        });
        it("Clicks logout", function() {
            cy.contains(valid_email).click({force: true})
        });
    
        it("User successfully redirected to login page", function() {
            cy.url().should("include", 'user');
        });
    });

    describe("Change user settings", function() {
    
        it("Change name", function() {
            cy.get('input').eq(0).clear()
            .type("Test Automation Name")    
            .should("have.value", "Test Automation Name")
        });

        it("Change surname", function() {
            cy.get('input').eq(1).clear()
            .type("Test Automation Surname")    
            .should("have.value", "Test Automation Surname")
        });

        it("Change email", function() {
            cy.get('input').eq(2).clear()
            .type("Test@Automation.com")    
            .should("have.value", "Test@Automation.com")
        });

        it("Change phone", function() {
            cy.get('input').eq(3).clear()
            .type("003873333333")    
            .should("have.value", "003873333333")
        });
    });

    describe("Save user settings and logout", function() {
    
        it("Save user settings", function() {
            cy.contains('Save').click()
        });

        it("Logout", function() {
            cy.logoutUI();
        });
    });

    describe("Enter and check if the user settings were saved", function() {
    
        it("Login and open user settigns page", function() {
            cy.loginUI();
            cy.wait(1000);
        });

        it("Opens dropdown in upper right corner", function() {
            cy.get('#user-menu-trigger').click()
        });
        it("Clicks on user profile", function() {
            cy.contains("test@automation.com").click({force: true})
        });
    
        it("User successfully redirected to user setting page", function() {
            cy.url().should("include", 'user');
        });

        it("Check if settings were saved", function() {
            cy.get('input').eq(0)    
                .should("have.value", "Test Automation Name")
    
            cy.get('input').eq(1)    
                .should("have.value", "Test Automation Surname")
    
            cy.get('input').eq(2)   
                .should("have.value", "test@automation.com")
    
            cy.get('input').eq(3)   
                .should("have.value", "003873333333")
        });
    });

    describe("Change user settings to default", function() {
    
        it("Change name", function() {
            cy.get('input').eq(0).clear()
            .type("Andrej")    
            .should("have.value", "Andrej")
        });

        it("Change surname", function() {
            cy.get('input').eq(1).clear()
            .type("QA")    
            .should("have.value", "QA")
        });

        it("Change email", function() {
            cy.get('input').eq(2).clear()
            .type("andrej@qaengineers.net")    
            .should("have.value", "andrej@qaengineers.net")
        });

        it("Change phone", function() {
            cy.get('input').eq(3).clear()
            .type("0038766666666")    
            .should("have.value", "0038766666666")
        });

        it("Save user settings", function() {
            cy.contains('Save').click()
        });

        it("Logout", function() {
            cy.logoutUI();
        });
    });
})
