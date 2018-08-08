export default () => {
    cy.get('#user-menu-trigger').click();
    cy.get('#user-menu-logout').click();
}