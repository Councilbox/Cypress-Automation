
export default () => {
    cy.url().should('contain', '/company/');

    cy.get('#edit-company-block').click();
    cy.url().should('contain', '/settings');

    cy.get('#business-name').type(Math.floor(Math.random() * 5));

    cy.get('#save-button').click();

    cy.get('#edit-statutes-block').click();
    cy.url().should('contain', '/statutes');
    cy.get('#back-button').click();

    cy.get('#edit-censuses-block').click();
    cy.url().should('contain', '/censuses');
    cy.get('#back-button').click();

    cy.get('#edit-drafts-block').click();
    cy.url().should('contain', '/drafts');
    cy.get('#back-button').click();

    cy.get('#create-council-block').click();
    cy.url().should('contain', '/council');
    cy.get('#change-place').click();
    cy.get('#close-button').click();

}