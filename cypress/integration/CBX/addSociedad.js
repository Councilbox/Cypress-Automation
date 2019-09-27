const razonSocial = "Razon"
const cif = Math.floor((Math.random() * 1000) + 100).toString()
const dominio = "dominio"
const claveMaestra = "claveMaestra"
const direccion = "direccion"
const localidad = "localidad"
const CP = "15700"

export default () => {
    cy.url().should('contain', '/company/');

    cy.get('.material-icons').eq(0).click();
    cy.get('#anadirSociedadDash').eq(0).click();


    cy.get('#addSociedadBusinessName')
        .type(razonSocial).should('have.value', razonSocial)
        .type('{leftarrow}{rightarrow}{uparrow}{downarrow}')
        .type('{del}{selectall}{backspace}')
        .type('{alt}{option}')
        .type('{ctrl}{control}')
        .type('{meta}{command}{cmd}')
        .type('{shift}')
    cy.get('#addSociedadBusinessName')
        .type(razonSocial).should('have.value', razonSocial)

    cy.get('#addSociedadCIF')
        .type(cif).should('have.value', cif)
        .type('{leftarrow}{rightarrow}{uparrow}{downarrow}')
        .type('{del}{selectall}{backspace}')
        .type('{alt}{option}')
        .type('{ctrl}{control}')
        .type('{meta}{command}{cmd}')
        .type('{shift}')
    cy.get('#addSociedadCIF')
        .type(cif).should('have.value', cif)

    cy.get('#addSociedadDominio')
        .type(dominio).should('have.value', dominio)
        .type('{leftarrow}{rightarrow}{uparrow}{downarrow}')
        .type('{del}{selectall}{backspace}')
        .type('{alt}{option}')
        .type('{ctrl}{control}')
        .type('{meta}{command}{cmd}')
        .type('{shift}')
    cy.get('#addSociedadDominio')
        .type(dominio).should('have.value', dominio)

    cy.get('#addSociedadClaveMaestra')
        .type(claveMaestra).should('have.value', claveMaestra)
        .type('{leftarrow}{rightarrow}{uparrow}{downarrow}')
        .type('{del}{selectall}{backspace}')
        .type('{alt}{option}')
        .type('{ctrl}{control}')
        .type('{meta}{command}{cmd}')
        .type('{shift}')
    cy.get('#addSociedadClaveMaestra')
        .type(claveMaestra).should('have.value', claveMaestra)

    cy.get('#addSociedadDireccion')
        .type(direccion).should('have.value', direccion)
        .type('{leftarrow}{rightarrow}{uparrow}{downarrow}')
        .type('{del}{selectall}{backspace}')
        .type('{alt}{option}')
        .type('{ctrl}{control}')
        .type('{meta}{command}{cmd}')
        .type('{shift}')
    cy.get('#addSociedadDireccion')
        .type(direccion).should('have.value', direccion)

    cy.get('#addSociedadLocalidad')
        .type(localidad).should('have.value', localidad)
        .type('{leftarrow}{rightarrow}{uparrow}{downarrow}')
        .type('{del}{selectall}{backspace}')
        .type('{alt}{option}')
        .type('{ctrl}{control}')
        .type('{meta}{command}{cmd}')
        .type('{shift}')
    cy.get('#addSociedadLocalidad')
        .type(localidad).should('have.value', localidad)

    cy.get('#addSociedadProvincia').parent().find("div").first().click()
    cy.wait(500)
    cy.get('.addSociedadProvinciaOptions').first().click()

    cy.get('#addSociedadCP')
        .type(CP).should('have.value', CP)
        .type('{leftarrow}{rightarrow}{uparrow}{downarrow}')
        .type('{del}{selectall}{backspace}')
        .type('{alt}{option}')
        .type('{ctrl}{control}')
        .type('{meta}{command}{cmd}')
        .type('{shift}')
    cy.get('#addSociedadCP')
        .type(CP).should('have.value', CP)

    cy.wait(1000)
    cy.get('#addSociedadButtonAdd').click()
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