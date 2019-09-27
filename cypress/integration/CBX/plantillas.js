import { eq } from "semver";

const loginUser = 'anxo.rodriguez.cocodin@gmail.com';
const password = '502437casa';

// yarn cypress run
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
        .type("0titulo de plantilla").should('have.value', '0titulo de plantilla');
    // cy.get('#descripcionPlantilla')
    //     .type("descripcion de plantilla").should('have.value', 'descripcion de plantilla');
    cy.get('.ql-editor')
        .type("descripcion de plantilla")//.should('have.value', 'descripcion de plantilla');

    cy.get('#saveDraft').click();
    cy.wait(3500)

    cy.get('tr').eq(1).trigger('mouseover');
    // cy.get('tr').eq(1).hover(false, false);
    // cy.get('tr').eq(1).mouseover();
    cy.get('tr').eq(1).trigger("hover");
    cy.get('tr').eq(1).trigger("mouseover");
    cy.get('.fa-pencil-square-o').last().click({ force: true })

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
        .type("00titulo2 de2 plantilla2").should('have.value', '00titulo2 de2 plantilla2');
    // cy.get('#descripcionPlantilla')
    //     .type("descripcion2 de2 plantilla2").should('have.value', 'descripcion2 de2 plantilla2');

    cy.get('#buscadorEtiqueta')
        .type("Administradores solida");

    cy.get('#contenedorEtiquetasBuscadas div').last().click();

    // cy.get('#crearEtiquetasNuevas')
    //     .type("EtiquetaNueva").type('{enter}');

    cy.get('#saveDraft').click();
    cy.wait(3500)

    cy.get('tr').eq(1).trigger('mouseover');
    cy.get('tr').eq(1).trigger("hover");
    cy.get('tr').eq(1).trigger("mouseover");
    cy.get('.fa-pencil-square-o').last().click({ force: true })

    cy.wait(2500)

    cy.get('#saveDraftinEdit').last().click();

    cy.wait(2500)

    cy.get('#back-button').click();
    ///////////////////////////////////////////////////// busqueda en modal

    // cy.get('#modalCargarPlantillas').click();
    cy.get('#cargarPlantillasSelectorEtiquetas').click();

    // //////////////////////////////////////////// prueba con uno estando bien 
    cy.get('#buscarEtiquetasEnModal').type("Administradores solidarios");
    cy.get('#contenedorEtiquetasBuscadas div').last().click();
    cy.wait(1000)
    cy.get('#contenedorEtiquetasBuscadas div').should('have.length', 1)

    cy.reload()
    
    cy.get('#cargarPlantillasSelectorEtiquetas').click();
    
    cy.wait(1000)
    cy.get('#tipoDeReunion div').eq(1).click()
    cy.get('tr').should('have.length', 1)
    
    // //////////////////////////////////////////// prueba con uno estando mal
    cy.reload()
    cy.get('#buscarEtiquetasEnModal').type("AaAaA");
    cy.get('#contenedorEtiquetasBuscadas div').last().click();
    cy.wait(1000)
    cy.get('#contenedorEtiquetasBuscadas div').should('have.length', 1)

}