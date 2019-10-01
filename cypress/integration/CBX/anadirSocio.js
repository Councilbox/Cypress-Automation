const nombre = "nombre"
const Apellidos = "Apellidos"
const DNINIF = Math.floor((Math.random() * 1000) + 100).toString()
const Nacionalidad = "Nacionalidad"
const Email = "Email@asd.com"
const Telefono = "Teléfono"
const Telefonofijo = "Teléfono fijo"
const Tipodesocio = "Tipo de socio"
const actadealta = "27 de Febrero de 2019"
const actadebaja = "27 de Febrero de 2019"
const fechaapertura = "27 de Febrero de 2019"
const fechaalta = "27 de Febrero de 2019"
const fechaactadealta = "27 de Febrero de 2019"
const fechabaja = "27 de Febrero de 2019"
const fechaactabaja = "27 de Febrero de 2019"
const direccion = "direccion"
const Provincia = "Provincia"
const Localidad = "Localidad"
const cp = "56456"
let Observaciones = "Observaciones Observaciones Observaciones"

// export default () => {
//     cy.get('#user-menu-trigger').click();
//     cy.get('#user-menu-logout').click();
// }
export default () => {

    cy.url().should('contain', '/company/');

    cy.get('#edit-company-block').click();

    cy.get('#anadirSocioLibroSocios').click();

    cy.wait(1000)

    cy.get("#anadirSocioNombre").type(nombre).should('have.value', nombre)
        .type('{leftarrow}{rightarrow}{uparrow}{downarrow}')
        .type('{del}{selectall}{backspace}')
        .type('{alt}{option}')
        .type('{ctrl}{control}')
        .type('{meta}{command}{cmd}')
        .type('{shift}')
    cy.get("#anadirSocioNombre").type(nombre).should('have.value', nombre)

    cy.get("#anadirSocioApellido").type(Apellidos).should('have.value', Apellidos)
        .type('{leftarrow}{rightarrow}{uparrow}{downarrow}')
        .type('{del}{selectall}{backspace}')
        .type('{alt}{option}')
        .type('{ctrl}{control}')
        .type('{meta}{command}{cmd}')
        .type('{shift}')
    cy.get("#anadirSocioApellido").type(Apellidos).should('have.value', Apellidos)

    cy.get("#anadirSocioDni").type(DNINIF).should('have.value', DNINIF)
        .type('{leftarrow}{rightarrow}{uparrow}{downarrow}')
        .type('{del}{selectall}{backspace}')
        .type('{alt}{option}')
        .type('{ctrl}{control}')
        .type('{meta}{command}{cmd}')
        .type('{shift}')
    cy.get("#anadirSocioDni").type(DNINIF).should('have.value', DNINIF)

    cy.get("#anadirSocioNAcionalidad").type(Nacionalidad).should('have.value', Nacionalidad)
        .type('{leftarrow}{rightarrow}{uparrow}{downarrow}')
        .type('{del}{selectall}{backspace}')
        .type('{alt}{option}')
        .type('{ctrl}{control}')
        .type('{meta}{command}{cmd}')
        .type('{shift}')
    cy.get("#anadirSocioNAcionalidad").type(Nacionalidad).should('have.value', Nacionalidad)

    cy.get("#anadirSocioMail").type(Email).should('have.value', Email)
        .type('{leftarrow}{rightarrow}{uparrow}{downarrow}')
        .type('{del}{selectall}{backspace}')
        .type('{alt}{option}')
        .type('{ctrl}{control}')
        .type('{meta}{command}{cmd}')
        .type('{shift}')
    cy.get("#anadirSocioMail").type(Email).should('have.value', Email)

    cy.get("#anadirSocioTelefono").type(Telefono).should('have.value', Telefono)
        .type('{leftarrow}{rightarrow}{uparrow}{downarrow}')
        .type('{del}{selectall}{backspace}')
        .type('{alt}{option}')
        .type('{ctrl}{control}')
        .type('{meta}{command}{cmd}')
        .type('{shift}')
    cy.get("#anadirSocioTelefono").type(Telefono).should('have.value', Telefono)

    cy.get("#anadirSocioFijo").type(Telefonofijo).should('have.value', Telefonofijo)
        .type('{leftarrow}{rightarrow}{uparrow}{downarrow}')
        .type('{del}{selectall}{backspace}')
        .type('{alt}{option}')
        .type('{ctrl}{control}')
        .type('{meta}{command}{cmd}')
        .type('{shift}')
    cy.get("#anadirSocioFijo").type(Telefonofijo).should('have.value', Telefonofijo)

    cy.get("#anadirSocioTipoSocio").type(Tipodesocio).should('have.value', Tipodesocio)
        .type('{leftarrow}{rightarrow}{uparrow}{downarrow}')
        .type('{del}{selectall}{backspace}')
        .type('{alt}{option}')
        .type('{ctrl}{control}')
        .type('{meta}{command}{cmd}')
        .type('{shift}')
    cy.get("#anadirSocioTipoSocio").type(Tipodesocio).should('have.value', Tipodesocio)

    cy.get("#anadirSocioActaAlta").type(actadealta).should('have.value', actadealta)
        .type('{leftarrow}{rightarrow}{uparrow}{downarrow}')
        .type('{del}{selectall}{backspace}')
        .type('{alt}{option}')
        .type('{ctrl}{control}')
        .type('{meta}{command}{cmd}')
        .type('{shift}')
    cy.get("#anadirSocioActaAlta").type(actadealta).should('have.value', actadealta)

    cy.get("#anadirSocioActaBaja").type(actadebaja).should('have.value', actadebaja)
        .type('{leftarrow}{rightarrow}{uparrow}{downarrow}')
        .type('{del}{selectall}{backspace}')
        .type('{alt}{option}')
        .type('{ctrl}{control}')
        .type('{meta}{command}{cmd}')
        .type('{shift}')
    cy.get("#anadirSocioActaBaja").type(actadebaja).should('have.value', actadebaja)

    cy.get("#anadirSocioAperturaFicha").click()
    cy.wait(1000)
    cy.get("button").last().click()
    cy.wait(500)
    
    cy.get("#anadirSocioFechaAlta").click()
    cy.wait(1000)
    cy.get("button").last().click()
    cy.wait(500)

    cy.get("#anadirSocioFechaActaAlta2").click()
    cy.wait(1000)
    cy.get("button").last().click()
    cy.wait(500)

    cy.get("#anadirSocioFechaActaBaja").click()
    cy.wait(1000)
    cy.get("button").last().click()
    cy.wait(500)

    cy.get("#anadirSocioFechaActaBaja2").click()
    cy.wait(1000)
    cy.get("button").last().click()
    cy.wait(500)

    cy.get("#anadirSocioDireccion").type(direccion).should('have.value', direccion)
        .type('{leftarrow}{rightarrow}{uparrow}{downarrow}')
        .type('{del}{selectall}{backspace}')
        .type('{alt}{option}')
        .type('{ctrl}{control}')
        .type('{meta}{command}{cmd}')
        .type('{shift}')
    cy.get("#anadirSocioDireccion").type(direccion).should('have.value', direccion)

    cy.get("#anadirSocioLocalidad").type(Localidad).should('have.value', Localidad)
        .type('{leftarrow}{rightarrow}{uparrow}{downarrow}')
        .type('{del}{selectall}{backspace}')
        .type('{alt}{option}')
        .type('{ctrl}{control}')
        .type('{meta}{command}{cmd}')
        .type('{shift}')
    cy.get("#anadirSocioLocalidad").type(Localidad).should('have.value', Localidad)

    cy.get("#anadirSocioProvincia").type(Provincia).should('have.value', Provincia)
        .type('{leftarrow}{rightarrow}{uparrow}{downarrow}')
        .type('{del}{selectall}{backspace}')
        .type('{alt}{option}')
        .type('{ctrl}{control}')
        .type('{meta}{command}{cmd}')
        .type('{shift}')
    cy.get("#anadirSocioProvincia").type(Provincia).should('have.value', Provincia)

    cy.get("#anadirSocioCP").type(cp).should('have.value', cp)
        .type('{leftarrow}{rightarrow}{uparrow}{downarrow}')
        .type('{del}{selectall}{backspace}')
        .type('{alt}{option}')
        .type('{ctrl}{control}')
        .type('{meta}{command}{cmd}')
        .type('{shift}')
    cy.get("#anadirSocioCP").type(cp).should('have.value', cp)
    


    //hay k guardar
    cy.get("#guardarAnadirSocio").click()

    cy.wait(5000)

    cy.get(".rowLibroSocios").each(function ($row, index) {
        if($row.find("td").eq(2).text() === DNINIF){
            cy.get(".rowLibroSocios").eq(index).click()
        }
    })

    cy.wait(3000)


    cy.get("#anadirSocioNombre").should('have.value', nombre)
    cy.get("#anadirSocioApellido").should('have.value', Apellidos)
    cy.get("#anadirSocioDni").should('have.value', DNINIF)
    // cy.get("#anadirSocioNAcionalidad").should('have.value', Nacionalidad)
    cy.get("#anadirSocioMail").should('have.value', Email)
    cy.get("#anadirSocioTelefono").should('have.value', Telefono)
    cy.get("#anadirSocioFijo").should('have.value', Telefonofijo)
    cy.get("#anadirSocioTipoSocio").should('have.value', Tipodesocio)
    cy.get("#anadirSocioActaBaja").should('have.value', actadebaja)

    cy.get("#anadirSocioActaBaja").should('have.value', actadebaja)
    // cy.get("#anadirSocioAperturaFicha").should('have.value', fechaapertura)
   
    // cy.get("#anadirSocioFechaAlta").should('have.value', fechaalta)
   
    // cy.get("#anadirSocioFechaActaAlta2").should('have.value', fechaactadealta)
   
    // cy.get("#anadirSocioFechaActaBaja2").should('have.value', fechaactabaja)

    cy.get("#anadirSocioDireccion").should('have.value', direccion)
    cy.get("#anadirSocioLocalidad").should('have.value', Localidad)
    cy.get("#anadirSocioProvincia").should('have.value', Provincia)
    cy.get("#anadirSocioCP").should('have.value', cp)



    cy.get(".ql-editor").clear().type(Observaciones)
    cy.get("#guardarAnadirSocio").click()
    // cy.get('.ql-editor').eq(0).find('p').then(($item) => {
    //     Observaciones = $item.text()
    //     cy.wait(2000)
    //     cy.reload()
    //     cy.wait(5000)
    //     //Comprobaciones de que todos los textos estan correctos
    //     cy.get('.ql-editor p').should('have.text', Observaciones)
    // })
    // cy.get(".ql-editor").find('p').should('have.value', Observaciones)



}
