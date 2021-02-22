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

    describe("Change langauge settings", function() {
    
        it("Change language to Spanish", function() {
            cy.contains('English').click()
            cy.contains('Español').click()
            cy.contains('Save').click({force: true})
            cy.wait(2000);
            cy.get('body').invoke('text').should('contain', 'Idioma')
        });

        it("Change language to Portugese", function() {
            cy.contains('Español').click()
            cy.contains('Português').click()
            cy.contains('Guardar').click({force: true})
            cy.wait(2000);
            cy.get('body').invoke('text').should('contain', 'Alterar palavra-passe')
        });

        it("Change language to Catala", function() {
            cy.contains('Português').click()
            cy.contains('Català').click()
            cy.contains('Guardar').click({force: true})
            cy.wait(2000);
            cy.get('body').invoke('text').should('contain', 'Canviar contrasenya')
        });

        it("Change language to Galego", function() {
            cy.contains('Català').click()
            cy.contains('Galego').click()
            cy.contains('Guardar').click({force: true})
            cy.wait(2000);
            cy.get('body').invoke('text').should('contain', 'Mudar contrasinal')
        });

        it("Change language to English", function() {
            cy.contains('Galego').click()
            cy.contains('English').click()
            cy.contains('Gardar').click({force: true})
            cy.wait(2000);
            cy.get('body').invoke('text').should('contain', 'Change password')
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









describe("Council box login - no username or password added", function() {
    before(function() {
        cy.deleteLocalStorage();
        
    });

    it("Visits the councilbox web page", function() {
       
        cy.clearLocalStorage();
        cy.saveLocalStorage();
        cy.visit(login_url);
        cy.wait(2000)
        cy.contains("Sign in to Councilbox");
    });

    it("Clicks to enter button", function() {
        cy.contains("To enter").click();
    });

    it("Email and password required label shown", function() {
        cy.contains("This field is required");
    }); 

    it("User is not logged in", function() {
        cy.url().should("include", login_url);
    });
});

describe("Councilbox login - invalid username and valid password", function() {

    before(function() {
        cy.deleteLocalStorage();
    });

    it("Visits the Councilbox web page", function() {
        cy.clearLocalStorage();
        cy.saveLocalStorage();
        cy.visit(login_url);
        cy.wait(2000)
        cy.contains("Sign in to Councilbox");
    });

    it("Enters invalid email address", function() {
        cy.get('input').eq(0)
            .type("councilbox@mail.com")    
            .should("have.value", "councilbox@mail.com")
    });

    it("Enters password", function() {
        cy.get('input').eq(1)
            .type(valid_password)
            .should("have.value", valid_password)
    });

    it("Clicks login button", function() {
        cy.contains("To enter").click();
    });

    it("Email is not verified or does not exist label shown", function() {
        cy.contains("The email is not verified or does not exist.");
    });

    it("User is not logged in", function() {
        cy.url().should("include", login_url);
    });
});

describe("Councilbox login - valid username and invalid password", function() {
    it("Visits the Councilbox web page", function() {
        cy.visit(login_url);
    });

    it("Enters existing, valid email address", function() {
        cy.get('input').eq(0)
            .type(valid_email)    
            .should("have.value", valid_email)
    });

    it("Enters invalid password", function() {
        cy.get('input').eq(1)
            .type("WrongPassword")    
            .should("have.value", "WrongPassword")
    });

    it("Clicks login button", function() {
        cy.get('#login-button').click();
    });

    it("Password incorrect label shown", function() {
        cy.contains("Incorrect password");
    });

    it("User is not logged in", function() {
        cy.url().should("include", login_url);
    });
});






