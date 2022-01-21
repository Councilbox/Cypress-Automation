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




describe("VERSIONS", function () {

    it("REU CORE", function () {

        cy.writeFile('cypress/integration/TEST/versions.txt', '\n\n------------------------------------',{flag: 'a+'})

        cy.writeFile('cypress/integration/TEST/versions.txt', '\ndate: ',{flag: 'a+'})

        cy.request('GET', "https://www.timeapi.io/api/Time/current/coordinate")
        .its('body.date')
        .then(date => {
            cy.writeFile('cypress/integration/TEST/versions.txt', date ,{flag: 'a+'})
            
            
        })
        cy.writeFile('cypress/integration/TEST/versions.txt', " - " ,{flag: 'a+'})

        cy.request('GET', "https://www.timeapi.io/api/Time/current/coordinate")
        .its('body.dayOfWeek')
        .then(dayOfWeek => {
            cy.writeFile('cypress/integration/TEST/versions.txt', dayOfWeek ,{flag: 'a+'})
            
            
        })



        cy.writeFile('cypress/integration/TEST/versions.txt', '\n\nREU CORE:', {flag: 'a+'})


        cy.writeFile('cypress/integration/TEST/versions.txt', '\nversion: ', {flag: 'a+'})
        cy.request('GET', "https://api.pre.councilbox.com/health")
        .its('body.version')
        .then(version => {
            cy.writeFile('cypress/integration/TEST/versions.txt', version, {flag: 'a+'})
            
            
        })

        
  })  


    it("OVAC CORE", function () {

        


        cy.writeFile('cypress/integration/TEST/versions.txt', '\n\nOVAC CORE:', {flag: 'a+'})



        cy.writeFile('cypress/integration/TEST/versions.txt', '\nversion: ', {flag: 'a+'})
        cy.request('GET', "http://api.ovac.pre.councilbox.com/health")
        .its('body.version')
        .then(version => {
            cy.writeFile('cypress/integration/TEST/versions.txt', version, {flag: 'a+'})
            
            
        })

        
  }) 

    it("EVID CORE", function () {

        


        cy.writeFile('cypress/integration/TEST/versions.txt', '\n\nEVID CORE:', {flag: 'a+'})



        cy.writeFile('cypress/integration/TEST/versions.txt', '\nversion: ', {flag: 'a+'})
        cy.request('GET', "http://evid-api.pre.councilbox.com/health")
        .its('body.version')
        .then(version => {
            cy.writeFile('cypress/integration/TEST/versions.txt', version, {flag: 'a+'})
            
            
        })

        
  }) 
      
      

});
