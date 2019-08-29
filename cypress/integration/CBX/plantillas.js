const loginUser = 'anxo.rodriguez.cocodin@gmail.com';
const password = '502437casa';


export default () => {
    cy.get('#username')
        .type(loginUser).should('have.value', loginUser)
    cy.get('#password')
        .type(password).should('have.value', password)
    cy.get('#login-button').click();

    cy.url().should('contain', '/company/');


    cy.get('#edit-drafts-block').click();
    cy.url().should('contain', '/drafts');

    cy.get('#newDraft').click();

    cy.get('#titleDraft')
        .type("titulo de plantilla").should('have.value', 'titulo de plantilla');
    cy.get('#descripcionPlantilla')
        .type("descripcion de plantilla").should('have.value', 'descripcion de plantilla');

    cy.get('#saveDraft').click();
    cy.wait(3500)

    cy.get('tr').last().click();

    cy.wait(2500)

    cy.get('#buscadorEtiqueta')
        .type("Junta General");

    cy.get('#contenedorEtiquetasBuscadas div').last().click();

    cy.get('#saveDraftinEdit').last().click();

    cy.wait(2500)

    cy.get('#back-button').click();

    /////////////////////////////////////////////////////otro draft

    cy.get('#newDraft').click();

    cy.get('#titleDraft')
        .type("titulo2 de2 plantilla2").should('have.value', 'titulo2 de2 plantilla2');
    cy.get('#descripcionPlantilla')
        .type("descripcion2 de2 plantilla2").should('have.value', 'descripcion2 de2 plantilla2');

    cy.get('#buscadorEtiqueta')
        .type("Administradores solida");

    cy.get('#contenedorEtiquetasBuscadas div').last().click();

    cy.get('#crearEtiquetasNuevas')
        .type("EtiquetaNueva").type('{enter}');

    cy.get('#saveDraft').click();
    cy.wait(3500)

    cy.get('tr').last().click();
    cy.wait(2500)
    ///////////////////////////////////////////////////// busqueda en modal

    cy.get('#modalCargarPlantillas').click();
    cy.get('#cargarPlantillasSelectorEtiquetas').click();

    //////////////////////////////////////////// prueba con uno estando bien 
    cy.get('#buscarEtiquetasEnModal').type("Administradores solidarios");
    cy.get('#contenedorEtiquetasBuscadas div').last().click();
    cy.wait(1000)
    cy.get('#contenedorPlantillasEnModal>div').should('have.length', 1)
    ////////borrar la etiqueta

    // cy.get('.fa-times').last().click();

    //////////////////////////////////////////// prueba con uno estando mal
    cy.get('#buscarEtiquetasEnModal').type("Ninguno");
    cy.get('#contenedorEtiquetasBuscadas div').last().click();
    cy.wait(1000)
    cy.get('#contenedorPlantillasEnModal>div').should('have.length', 0)

}