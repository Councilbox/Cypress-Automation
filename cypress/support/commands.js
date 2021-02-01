// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

let LOCAL_STORAGE_MEMORY = {};
const login_url = Cypress.env("baseUrl");
const valid_password = Cypress.env("login_password");
const valid_email = Cypress.env("login_email");

Cypress.Commands.add("saveLocalStorage", () => {
    Object.keys(localStorage).forEach(key => {
        LOCAL_STORAGE_MEMORY[key] = localStorage[key];
    });
});

Cypress.Commands.add("deleteLocalStorage", () => {
    LOCAL_STORAGE_MEMORY = {};
});

Cypress.Commands.add("restoreLocalStorage", () => {
    Object.keys(LOCAL_STORAGE_MEMORY).forEach(key => {
        localStorage.setItem(key, LOCAL_STORAGE_MEMORY[key]);
    });
});

Cypress.Commands.add("loginUI", () => {
    cy.visit(login_url);
    cy.wait(10000)
    cy.contains("Sign in to Councilbox");
    cy.get('input').eq(0)
        .type(valid_email)    
        .should("have.value", valid_email)
    cy.get('input').eq(1)
        .type(valid_password)    
        .should("have.value", valid_password)
    cy.contains("To enter").click();
    cy.get('body').invoke('text').should('contain', 'Automation QA')
});

Cypress.Commands.add("logoutUI", () => {
    cy.get('#user-menu-trigger').click();
    cy.contains('Logout').click();
    cy.url().should("include", login_url);
});