

export default () => {
    
    cy.url().should('contain', '/company/');

    cy.get('#edit-statutes-block').click();

    cy.get('#anadirTipoDeReunion').click();
    cy.wait(500)
    cy.get('#anadirTipoDeReunionInputEnModal').
        type("Nuevo tipo de reunion").should('have.value', "Nuevo tipo de reunion")
        .type('{leftarrow}{rightarrow}{uparrow}{downarrow}')
        .type('{del}{selectall}{backspace}')
        .type('{alt}{option}')
        .type('{ctrl}{control}')
        .type('{meta}{command}{cmd}')
        .type('{shift}')
    cy.get('#anadirTipoDeReunionInputEnModal')
        .type("Nuevo tipo de reunion").should('have.value', "Nuevo tipo de reunion")
    cy.get('#buttonAceptarDeModalAlert').click();

    cy.wait(500)

    cy.get('.ant-tabs-tab').last().click();

    cy.wait(1000)

    cy.get('.buttonGuardarEnStatusPage').last().click();
    

}
