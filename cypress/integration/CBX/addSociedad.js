const razonSocial = "Razon"
const cif = Math.floor((Math.random() * 1000) + 100).toString()
const dominio = "dominio"
const claveMaestra = "claveMaestra"
const direccion = "direccion"
const localidad = "localidad"
const CP = "15700"

export default () => {
    cy.url().should('contain', '/company/');

    // click arriba izq en entidades y añadir sociedad
    cy.get('#entidadesSideBar').click();
    cy.get('#entidadesAddSociedad').eq(0).click();
    cy.wait(1000)
       
    cy.get('#business-name')
        .type(razonSocial, { force: true }).should('have.value', razonSocial)
        .type('{leftarrow}{rightarrow}{uparrow}{downarrow}', { force: true })
        .type('{del}{selectall}{backspace}', { force: true })
        .type('{alt}{option}', { force: true })
        .type('{ctrl}{control}', { force: true })
        .type('{meta}{command}{cmd}', { force: true })
        .type('{shift}', { force: true })
    cy.get('#business-name')
        .type(razonSocial, { force: true }).should('have.value', razonSocial)

    cy.get('#addSociedadCIF')
        .type(cif, { force: true }).should('have.value', cif)
        .type('{leftarrow}{rightarrow}{uparrow}{downarrow}', { force: true })
        .type('{del}{selectall}{backspace}', { force: true })
        .type('{alt}{option}', { force: true })
        .type('{ctrl}{control}', { force: true })
        .type('{meta}{command}{cmd}', { force: true })
        .type('{shift}', { force: true })
    cy.get('#addSociedadCIF')
        .type(cif, { force: true }).should('have.value', cif)

    cy.get('#addSociedadDominio', { force: true })
        .type(dominio, { force: true }).should('have.value', dominio)
        .type('{leftarrow}{rightarrow}{uparrow}{downarrow}', { force: true })
        .type('{del}{selectall}{backspace}', { force: true })
        .type('{alt}{option}', { force: true })
        .type('{ctrl}{control}', { force: true })
        .type('{meta}{command}{cmd}', { force: true })
        .type('{shift}', { force: true })
    cy.get('#addSociedadDominio')
        .type(dominio, { force: true }).should('have.value', dominio)

    cy.get('#addSociedadClaveMaestra')
        .type(claveMaestra, { force: true }).should('have.value', claveMaestra)
        .type('{leftarrow}{rightarrow}{uparrow}{downarrow}', { force: true })
        .type('{del}{selectall}{backspace}', { force: true })
        .type('{alt}{option}', { force: true })
        .type('{ctrl}{control}', { force: true })
        .type('{meta}{command}{cmd}', { force: true })
        .type('{shift}', { force: true })
    cy.get('#addSociedadClaveMaestra')
        .type(claveMaestra, { force: true }).should('have.value', claveMaestra)

    cy.get('#addSociedadDireccion')
        .type(direccion, { force: true }).should('have.value', direccion)
        .type('{leftarrow}{rightarrow}{uparrow}{downarrow}', { force: true })
        .type('{del}{selectall}{backspace}', { force: true })
        .type('{alt}{option}', { force: true })
        .type('{ctrl}{control}', { force: true })
        .type('{meta}{command}{cmd}', { force: true })
        .type('{shift}', { force: true })
    cy.get('#addSociedadDireccion')
        .type(direccion, { force: true }).should('have.value', direccion)

    cy.get('#addSociedadLocalidad')
        .type(localidad, { force: true }).should('have.value', localidad)
        .type('{leftarrow}{rightarrow}{uparrow}{downarrow}', { force: true })
        .type('{del}{selectall}{backspace}', { force: true })
        .type('{alt}{option}', { force: true })
        .type('{ctrl}{control}', { force: true })
        .type('{meta}{command}{cmd}', { force: true })
        .type('{shift}', { force: true })
    cy.get('#addSociedadLocalidad')
        .type(localidad, { force: true }).should('have.value', localidad)

    cy.get('#addSociedadProvincia').parent().find("div").first().click()
    cy.wait(500)
    cy.get('.addSociedadProvinciaOptions').first().click()

    cy.get('#addSociedadCP')
        .type(CP, { force: true }).should('have.value', CP)
        .type('{leftarrow}{rightarrow}{uparrow}{downarrow}', { force: true })
        .type('{del}{selectall}{backspace}', { force: true })
        .type('{alt}{option}', { force: true })
        .type('{ctrl}{control}', { force: true })
        .type('{meta}{command}{cmd}', { force: true })
        .type('{shift}', { force: true })
    cy.get('#addSociedadCP')
        .type(CP, { force: true }).should('have.value', CP)

    cy.wait(1000)
    cy.get('#save-button').click()
    cy.wait(3000)

    //Se guardo y ahora volvemos a entrar para comprobar si estan bien los datos
    cy.get('.iconSociedadSideBar').click();
    cy.wait(2000)
    
    
    
    cy.get('#business-name').should('have.value', razonSocial)
    cy.get('#addSociedadCIF').should('have.value', cif)
    cy.get('#addSociedadDominio').should('have.value', dominio)
    cy.get('#addSociedadClaveMaestra').should('have.value', claveMaestra)
    cy.get('#addSociedadDireccion').should('have.value', direccion)
    cy.get('#addSociedadLocalidad').should('have.value', localidad)
    cy.get('#addSociedadCP').should('have.value', CP)
    
    cy.wait(500)
    
    cy.get('#unlink-button').click()
    
    cy.wait(500)
    
    cy.get('#buttonAceptarDeModalAlert').click()





}