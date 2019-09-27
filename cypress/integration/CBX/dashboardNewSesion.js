const mail1 = "mailTest1@mailinator.com"
const mail2 = "mailTest2@mailinator.com"
const mail3 = "mailTest2@mailinator.com"

export default () => {
    cy.url().should('contain', '/company/');

    cy.get('#create-council-block').click();
    cy.url().should('contain', '/council/new');

    cy.get('#reunionConSesionModal').click();
    cy.url().should('contain', '/council/');

    //Rellenamos titulo
    cy.get('#TituloReunionEnConvocatoria')
        .type("Titulo Reunion Cypress").should('have.value', "Titulo Reunion Cypress")
        .type('{leftarrow}{rightarrow}{uparrow}{downarrow}')
        .type('{del}{selectall}{backspace}')
        .type('{alt}{option}')
        .type('{ctrl}{control}')
        .type('{meta}{command}{cmd}')
        .type('{shift}')
    cy.get('#TituloReunionEnConvocatoria')
        .type("Titulo Reunion Cypress").should('have.value', "Titulo Reunion Cypress")
    cy.url().should('contain', '/council/');

    //Rellenamos info y no comprobamos!
    cy.get('.ql-editor.ql-blank').
        type("Info Reunion Cypress")
    cy.url().should('contain', '/council/');

    //click en guardar
    cy.get('#botonGuardarNuevasReunionesAbajo').click();
    cy.url().should('contain', '/council/');
    //click en Siguiente
    cy.get('#botonSiguienteNuevasReunionesAbajo').click();
    cy.url().should('contain', '/council/');

    //click en añadir participante
    cy.get('#anadirParticipanteEnCensoNewReunion').click();
    cy.url().should('contain', '/council/');

    //Rellenamos titulo participante
    cy.get('#textAnadirParticipanteNombre')
        .type("Nombre").should('have.value', "Nombre")
        .type('{leftarrow}{rightarrow}{uparrow}{downarrow}')
        .type('{del}{selectall}{backspace}')
        .type('{alt}{option}')
        .type('{ctrl}{control}')
        .type('{meta}{command}{cmd}')
        .type('{shift}')
    cy.get('#textAnadirParticipanteApellido')
        .type("Apellido").should('have.value', "Apellido")
        .type('{leftarrow}{rightarrow}{uparrow}{downarrow}')
        .type('{del}{selectall}{backspace}')
        .type('{alt}{option}')
        .type('{ctrl}{control}')
        .type('{meta}{command}{cmd}')
        .type('{shift}')
    cy.get('#textAnadirParticipanteDni')
        .type("33333333k").should('have.value', "33333333k")
        .type('{leftarrow}{rightarrow}{uparrow}{downarrow}')
        .type('{del}{selectall}{backspace}')
        .type('{alt}{option}')
        .type('{ctrl}{control}')
        .type('{meta}{command}{cmd}')
        .type('{shift}')
    cy.get('#textAnadirParticipanteCargo')
        .type("Cargo").should('have.value', "Cargo")
        .type('{leftarrow}{rightarrow}{uparrow}{downarrow}')
        .type('{del}{selectall}{backspace}')
        .type('{alt}{option}')
        .type('{ctrl}{control}')
        .type('{meta}{command}{cmd}')
        .type('{shift}')
    cy.get('#textAnadirParticipanteEmail')
        .type(mail2).should('have.value', mail2)
        .type('{leftarrow}{rightarrow}{uparrow}{downarrow}')
        .type('{del}{selectall}{backspace}')
        .type('{alt}{option}')
        .type('{ctrl}{control}')
        .type('{meta}{command}{cmd}')
        .type('{shift}')
    cy.get('#textAnadirParticipanteTelefono')
        .type("666666666").should('have.value', "666666666")
        .type('{leftarrow}{rightarrow}{uparrow}{downarrow}')
        .type('{del}{selectall}{backspace}')
        .type('{alt}{option}')
        .type('{ctrl}{control}')
        .type('{meta}{command}{cmd}')
        .type('{shift}')

    cy.get('#textAnadirParticipanteNombre')
        .type("Nombre").should('have.value', "Nombre")
    cy.get('#textAnadirParticipanteApellido')
        .type("Apellido").should('have.value', "Apellido")
    cy.get('#textAnadirParticipanteDni')
        .type("33333333k").should('have.value', "33333333k")
    cy.get('#textAnadirParticipanteCargo')
        .type("Cargo").should('have.value', "Cargo")
    cy.get('#textAnadirParticipanteEmail')
        .type(mail2).should('have.value', mail2)
    cy.get('#textAnadirParticipanteTelefono')
        .type("666666666").should('have.value', "666666666")



    //click en aceptar
    cy.get('#buttonAceptarDeModalAlert').click();

    //click en siguiente
    cy.get('#censoSiguienteNew').click();
    cy.wait(2000)
    //click en añadir punto del dia
    cy.get('#newPuntoDelDiaOrdenDelDiaNew').click();

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //click en añadir punto del dia
    cy.get('#tituloPuntoDelDiaModal')
        .type("Nuevo Punto del dia").should('have.value', "Nuevo Punto del dia")
        .type('{leftarrow}{rightarrow}{uparrow}{downarrow}')
        .type('{del}{selectall}{backspace}')
        .type('{alt}{option}')
        .type('{ctrl}{control}')
        .type('{meta}{command}{cmd}')
        .type('{shift}')
    cy.get('#tituloPuntoDelDiaModal')
        .type("Nuevo Punto del dia").should('have.value', "Nuevo Punto del dia")


    //click en añadir punto del dia
    cy.get('#buttonAceptarDeModalAlert').click();
    cy.wait(2000)
    //click en añadir punto del dia
    cy.get('#ordenDelDiaNext').click();

    //click siguiente documentacion
    cy.get('#attachmentSiguienteNew').click();

    cy.wait(2000)
    // //click siguiente opciones
    cy.get('#optionsNewSiguiente').click();

    //click en desplegable
    cy.get('#desplegablePrevisualizacionNew').click();

    //click en desplegable
    cy.get('#convocarSinNotificarNew').click();

    //click en desplegable
    cy.get('#buttonAceptarDeModalAlert').click();

    //click en desplegable
    cy.get('#prepararSalaNew').click();

    //click en orden del dia abajo a la derecha
    cy.get('#ordenDelDiaParticipantesButton').click();


    //click en abrir sala 
    cy.get('#abrirSalaEnReunion').click();

    //click en descartar envio correos 
    // cy.get('#checkNoEnviosCorreos').click();
    cy.wait(500)
    //click en aceptar modal
    cy.get('#buttonAceptarDeModalAlert').click();

    //Iniciar Reunion!!
    //click en aceptar modal
    cy.get('#iniciarReunionDentroDeReunion').click();

    //seleccionamos presidente
    cy.get('#seleccionaAlPresidenteEnReunion').click();
    cy.get('.itemsSeleccionEnModalUsersEnReunion').first().click();
    cy.wait(1000)
    //seleccionamos secretartio
    cy.get('#seleccionaAlSecretarioEnReunion').click();
    cy.get('.itemsSeleccionEnModalUsersEnReunion').first().click();
    cy.wait(1000)

    //Aceptamos a los presidentes y secretarios
    cy.get('#buttonAceptarDeModalAlert').click();

    ///////////////////////////////////////////////////////////////////////////////////////////////////


    // //finalizamos reunion
    // cy.get('#finalizarReunionEnReunion').click();
    // cy.get('#buttonAceptarDeModalAlert').click();
    // cy.wait(1000)
    // //descargamos pdf ESTA QUITADO
    // // cy.get('#dropDownDescargaFilesFinished').last().click();
    // // cy.get('#descargarPdfEnFinished').click();


    // cy.wait(2000)
    // //descargamos html
    // cy.get('#dropDownDescargaFilesFinished').click();
    // cy.get('#descargarWordEnFinished').click()

    // //Finalizamos la reunion
    // // cy.get('#finalizarRedaccionDeActa').click();
    // // cy.get('#UsarActaGeneradaPorCouncilbox').click();
    // // cy.wait(500)
    // // cy.get('#buttonAceptarDeModalAlert').click();
    // // cy.wait(500)



}

// export default () => {
//     cy.url().should('contain', '/company/');

//     cy.get('#create-council-block').click();
//     cy.url().should('contain', '/council/new');

//     cy.get('#reunionConSesionModal').click();
//     cy.url().should('contain', '/council/');

//     //Rellenamos titulo
//     cy.get('#TituloReunionEnConvocatoria')
//         .type("Titulo Reunion Cypress").should('have.value', "Titulo Reunion Cypress")
//     cy.url().should('contain', '/council/');

//     //Rellenamos info y no comprobamos!
//     cy.get('.ql-editor.ql-blank').
//         type("Info Reunion Cypress")
//     cy.url().should('contain', '/council/');

//     //click en guardar
//     cy.get('#botonGuardarNuevasReunionesAbajo').click();
//     cy.url().should('contain', '/council/');
//     //click en Siguiente
//     cy.get('#botonSiguienteNuevasReunionesAbajo').click();
//     cy.url().should('contain', '/council/');

//     //click en añadir participante
//     cy.get('#anadirParticipanteEnCensoNewReunion').click();
//     cy.url().should('contain', '/council/');

//     //Rellenamos titulo participante
//     cy.get('#textAnadirParticipanteNombre')
//         .type("Nombre").should('have.value', "Nombre")
//     cy.get('#textAnadirParticipanteApellido')
//         .type("Apellido").should('have.value', "Apellido")
//     cy.get('#textAnadirParticipanteDni')
//         .type("33333333k").should('have.value', "33333333k")
//     cy.get('#textAnadirParticipanteCargo')
//         .type("Cargo").should('have.value', "Cargo")
//     cy.get('#textAnadirParticipanteEmail')
//         .type("qwery.asdSSS@gmail.com").should('have.value', "qwery.asdSSS@gmail.com")
//     cy.get('#textAnadirParticipanteTelefono')
//         .type("666666666").should('have.value', "666666666")

//     //click en acptar
//     cy.get('#buttonAceptarDeModalAlert').click();

//     //click en siguiente
//     cy.get('#censoSiguienteNew').click();

//     //click en añadir punto del dia
//     cy.get('#newPuntoDelDiaOrdenDelDiaNew').click();

//     //click en añadir punto del dia
//     cy.get('#tituloPuntoDelDiaModal')
//         .type("Nuevo Punto del dia").should('have.value', "Nuevo Punto del dia")

//     //click en añadir punto del dia
//     cy.get('#buttonAceptarDeModalAlert').click();
//     cy.wait(2000)
//     //click en añadir punto del dia
//     cy.get('#ordenDelDiaNext').click();

//     //click siguiente documentacion
//     cy.get('#attachmentSiguienteNew').click();

//     cy.wait(2000)
//     // //click siguiente opciones
//     cy.get('#optionsNewSiguiente').click();

//     //click en desplegable
//     cy.get('#desplegablePrevisualizacionNew').click();

//     //click en desplegable
//     cy.get('#convocarSinNotificarNew').click();

//     //click en desplegable
//     cy.get('#buttonAceptarDeModalAlert').click();

//     //click en desplegable
//     cy.get('#prepararSalaNew').click();

//     //click en orden del dia abajo a la derecha
//     cy.get('#ordenDelDiaParticipantesButton').click();


//     //click en abrir sala 
//     cy.get('#abrirSalaEnReunion').click();

//     //click en aceptar modal
//     cy.get('#buttonAceptarDeModalAlert').click();

//     //Iniciar Reunion!!
//     //click en aceptar modal
//     cy.get('#iniciarReunionDentroDeReunion').click();

//     //seleccionamos presidente
//     cy.get('#seleccionaAlPresidenteEnReunion').click();
//     cy.get('.itemsSeleccionEnModalUsersEnReunion').first().click();
//     cy.wait(1000)
//     //seleccionamos secretartio
//     cy.get('#seleccionaAlSecretarioEnReunion').click();
//     cy.get('.itemsSeleccionEnModalUsersEnReunion').first().click();
//     cy.wait(1000)

//     //Aceptamos a los presidentes y secretarios
//     cy.get('#buttonAceptarDeModalAlert').click();

//     //finalizamos reunion
//     cy.get('#finalizarReunionEnReunion').click();
//     cy.get('#buttonAceptarDeModalAlert').click();
//     cy.wait(1000)
//     cy.get('#finalizarRedaccionDeActa').click();
//     cy.get('#UsarActaGeneradaPorCouncilbox').click();
//     cy.wait(500)
//     cy.get('#finalizaryAprobarActa').click();
//     cy.get('#UsarActaGeneradaPorCouncilbox').click();
//     cy.wait(1000)
//     cy.get('#buttonAceptarDeModalAlert').click();
//     cy.wait(5000)

//     // cy.get('#business-name').type(Math.floor(Math.random() * 5));

//     // cy.get('#save-button').click();

//     // cy.get('#edit-statutes-block').click();
//     // cy.url().should('contain', '/statutes');
//     // cy.get('#back-button').click();

//     // cy.get('#edit-censuses-block').click();
//     // cy.url().should('contain', '/censuses');
//     // cy.get('#back-button').click();

//     // cy.get('#edit-drafts-block').click();
//     // cy.url().should('contain', '/drafts');
//     // cy.get('#back-button').click();

//     // cy.get('#create-council-block').click();
//     // cy.url().should('contain', '/council');
//     // cy.get('#change-place').click();
//     // cy.get('#close-button').click();

// }